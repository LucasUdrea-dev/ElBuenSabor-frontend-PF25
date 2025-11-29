import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Ciudad, Provincia, host } from "../../ts/Clases";
import { useUser } from "../UserAuth/UserContext";
import { z } from "zod";

// Fix iconos de Leaflet en React
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// icono personalizado 
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

//definir icono predeterminado
L.Marker.prototype.options.icon = DefaultIcon;

type Errors = {
  calle?: string;
  numero?: string;
  ciudad?: string;
  provincia?: string;
  alias?: string;
  general?: string;
};

const direccionSchema = z.object({
  calle: z.string().nonempty("La calle es obligatoria.").regex(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ]+$/, "La calle solo puede contener letras y números."),
  numero: z.string().nonempty("El número es obligatorio.").regex(/^\d+$/, "El número debe ser solo dígitos."),
  ciudad: z.number().positive("La ciudad es obligatoria."),
  provincia: z.number().positive("La provincia es obligatoria."),
  alias: z.string().nonempty("El alias es obligatorio."),
  piso: z.string().optional(),
  depto: z.string().optional(),
  latitud: z.string().optional(),
  longitud: z.string().optional(),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Componente para manejar los clics en el mapa
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {

  //hook que escuchar eventos del mapa
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const AgregarDireccion: React.FC<Props> = ({ isOpen, onClose }) => {
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [ciudad, setCiudad] = useState<Ciudad>(new Ciudad());
  const [provincia, setProvincia] = useState<Provincia>(new Provincia());
  const [alias, setAlias] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [piso, setPiso] = useState("");
  const [depto, setDepto] = useState("");
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [cargando, setCargando] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false); //visibilidad del mapa
  
  // Coordenadas por defecto Mendoza
  const defaultCenter: LatLngExpression = [-32.8895, -68.8458];
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null); //posicion inicial del marcador
  
  const { userSession } = useUser();

  useEffect(() => {
    if (isOpen) {
      cargarProvincias();
    }
  }, [isOpen]);

  useEffect(() => {
    if (provincia.id) {
      cargarCiudades();
    } else {
      setCiudades([]);
      setCiudad(new Ciudad());
    }
  }, [provincia]);

  // Actualizar marcador cuando cambian las coordenadas manualmente
  useEffect(() => {
    const lat = parseFloat(latitud);      // Convertir strings a números
    const lng = parseFloat(longitud);
    if (!isNaN(lat) && !isNaN(lng)) {   // Si ambas coordenadas son números válidos
      setMarkerPosition([lat, lng]);   // Actualizar la posición del marcador
    }
  }, [latitud, longitud]);

  const cargarProvincias = async () => {
    try {
      const response = await axios.get(`${host}/api/Provincia/full`);
      setProvincias(response.data);
    } catch (error) {
      console.error("Error al cargar provincias:", error);
      setErrors({ general: "Error al cargar las provincias" });
    }
  };

  const cargarCiudades = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${host}/api/Ciudad/full`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ciudadesFiltradas = response.data.filter(
        (c: Ciudad) => c.provincia?.id === provincia.id
      );
      setCiudades(ciudadesFiltradas);
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
      setErrors({ general: "Error al cargar las ciudades" });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLatitud(lat.toFixed(6));     // SE GUARDAN las coordenadas en los estados y redondea a 6 decimales
    setLongitud(lng.toFixed(6));

    setMarkerPosition([lat, lng]);  // Actualizar la posición del marcador en el mapa
  };

  const validarCampos = (): boolean => {
    const resultado = direccionSchema.safeParse({
      calle,
      numero,
      ciudad: ciudad.id,
      provincia: provincia.id,
      alias,
      piso,
      depto,
      latitud,
      longitud,
    });

    if (!resultado.success) {
      const erroresZod: Errors = {};
      resultado.error.errors.forEach((err) => {
        const campo = err.path[0] as keyof Errors;
        erroresZod[campo] = err.message;
      });
      setErrors(erroresZod);
      return false;
    }

    setErrors({});
    return true;
  };



  const handleAgregarDireccion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    if (!userSession) {
      setErrors({ general: "No se pudo obtener la sesión del usuario" });
      return;
    }

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const direccionDTO = {
        nombreCalle: calle,
        numeracion: numero,
        latitud: parseFloat(latitud || "0"), // se convierte de string a number
        longitud: parseFloat(longitud || "0"),
        alias: alias,
        descripcionEntrega: `Piso: ${piso}, Depto: ${depto}`,
        ciudad: {
          id: ciudad.id
        }
      };

      console.log("Enviando dirección:", direccionDTO);

      await axios.post(
        `${host}/api/Direccion/usuario/${userSession.id_user}`, 
        direccionDTO,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      limpiarFormulario();
      onClose();
    } catch (error: any) {
      console.error("Error al agregar dirección:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      
      const mensajeError = error.response?.data?.error || 
                          error.response?.data?.message || 
                          "Error al agregar la dirección. Por favor, intente nuevamente.";
      
      setErrors({ general: mensajeError });
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setCalle("");
    setNumero("");
    setCiudad(new Ciudad());
    setProvincia(new Provincia());
    setAlias("");
    setLatitud("");
    setLongitud("");
    setPiso("");
    setDepto("");
    setErrors({});
    setMarkerPosition(null);
    setMostrarMapa(false);
  };

  useEffect(() => {
    if (!isOpen) {
      limpiarFormulario();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-black text-3xl font-lato mb-12 text-center ">
          Agregar una dirección de envío
        </h2>

        {errors.general && (
          <div className="text-red-600 font-lato mb-4 text-center bg-red-50 p-3 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleAgregarDireccion}>

           <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-black block mb-2 font-lato">Latitud</label>
                <input
                  type="text"
                  value={latitud}
                  onChange={(e) => setLatitud(e.target.value)}
                  placeholder="-34.603722"
                  className="text-black w-full p-2 border rounded border-gray-300 placeholder:text-[#878787] font-lato"
                />
              </div>
              <div className="flex-1">
                <label className="text-black block mb-2 font-lato">Longitud</label>
                <input
                  type="text"
                  value={longitud}
                  onChange={(e) => setLongitud(e.target.value)}
                  placeholder="-58.381592"
                  className="text-black w-full p-2 border rounded border-gray-300 placeholder:text-[#878787] font-lato "
                />
              </div>
            </div>


          {/* Sección del Mapa */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 mt-4">
              <button
                type="button"
                onClick={() => setMostrarMapa(!mostrarMapa)}
                className="text-[#0A76E1] hover:text-[#0A5BBE] text-sm font-lato border-1 px-3 py-1 rounded-4xl"
              >
                {mostrarMapa ? "Ocultar mapa" : "Mostrar mapa"}
              </button>
            </div>

            {mostrarMapa && (
              <div className="border rounded-lg overflow-hidden mb-4">
                <MapContainer
                  center={markerPosition || defaultCenter}
                  zoom={13}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onLocationSelect={handleMapClick} />
                  {markerPosition && <Marker position={markerPosition} />}
                </MapContainer>
                <div className="bg-gray-50 p-3 text-sm text-gray-600 font-lato">
                  Haz clic en el mapa para seleccionar la ubicación exacta de tu dirección
                </div>
              </div>
            )}

           
          </div>

          {/* Grid de 2 columnas para el resto de campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calle */}
            <div className="md:col-span-2">
              <label className="text-black block mb-2 font-lato">Calle*</label>
              <input
                type="text"
                value={calle}
                onChange={(e) => setCalle(e.target.value)}
                className={`text-black w-full p-2 border rounded font-lato ${
                  errors.calle ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.calle && <p className="text-red-500 text-sm mt-1">{errors.calle}</p>}
            </div>

            {/* Número, Piso, Depto */}
            <div>
              <label className="text-black block mb-2">Número*</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className={`text-black w-full p-2 border rounded ${
                  errors.numero ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-black block mb-2">Piso</label>
                <input
                  type="text"
                  value={piso}
                  onChange={(e) => setPiso(e.target.value)}
                  className="text-black w-full p-2 border rounded border-gray-300"
                />
              </div>
              <div className="flex-1">
                <label className="text-black block mb-2">Depto</label>
                <input
                  type="text"
                  value={depto}
                  onChange={(e) => setDepto(e.target.value)}
                  className="text-black w-full p-2 border rounded border-gray-300"
                />
              </div>
            </div>

            {/* Provincia */}
            <div>
              <label className="text-black block mb-2">Provincia*</label>
              <select
                value={provincia.id || ""}
                onChange={(e) => {
                  const provinciaSeleccionada = provincias.find(
                    (prov) => prov.id == Number(e.target.value)
                  );
                  if (provinciaSeleccionada) {
                    setProvincia(provinciaSeleccionada);
                  } else {
                    setProvincia(new Provincia());
                  }
                }}
                className={`text-black w-full p-2 border rounded ${
                  errors.provincia ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar provincia</option>
                {provincias.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
              {errors.provincia && <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>}
            </div>

            {/* Ciudad */}
            <div>
              <label className="text-black block mb-2">Ciudad*</label>
              <select
                value={ciudad.id || ""}
                onChange={(e) => {
                  const ciudadSeleccionada = ciudades.find(
                    (c) => c.id == Number(e.target.value)
                  );
                  if (ciudadSeleccionada) {
                    setCiudad(ciudadSeleccionada);
                  }
                }}
                className={`text-black w-full p-2 border rounded ${
                  errors.ciudad ? "border-red-500" : "border-gray-300"
                }`}
                disabled={!provincia.id}
              >
                <option value="">Seleccionar Ciudad</option>
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
            </div>

            {/* Alias */}
            <div className="md:col-span-2">
              <label className="text-black block mb-2">Alias*</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Casa, Trabajo, Oficina"
                className={`text-black w-full p-2 border rounded placeholder:text-[#878787] ${
                  errors.alias ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.alias && <p className="text-red-500 text-sm mt-1">{errors.alias}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={() => {
                limpiarFormulario();
                onClose();
              }}
              disabled={cargando}
              className="bg-white text-[#0A76E1] py-3 px-6 rounded-full hover:bg-gray-200 border border-[#0A76E1] disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className="bg-[#0A76E1] text-white py-3 px-6 rounded-full hover:bg-[#0A5BBE] disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Guardar dirección"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarDireccion;