import React, { useState, useEffect } from "react";
import axios from "axios";
import { Direccion, Ciudad, Provincia, host } from "../../ts/Clases";
import { z } from "zod";

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
  direccion: Direccion;
};

const EditDireccion: React.FC<Props> = ({ isOpen, onClose, direccion }) => {
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

  useEffect(() => {
    if (isOpen && direccion) {
      cargarProvincias();
      inicializarFormulario();
    }
  }, [isOpen, direccion]);

  useEffect(() => {
    if (provincia.id) {
      cargarCiudades();
    } else {
      setCiudades([]);
    }
  }, [provincia]);

  const inicializarFormulario = () => {
    setCalle(direccion.nombreCalle || "");
    setNumero(direccion.numeracion || "");
    setAlias(direccion.alias || "");
    setLatitud(direccion.latitud?.toString() || "");
    setLongitud(direccion.longitud?.toString() || "");

    if (direccion.ciudad) {
      setCiudad(direccion.ciudad);
      if (direccion.ciudad.provincia) {
        setProvincia(direccion.ciudad.provincia);
      }
    }

    // Extraer piso y depto de descripcionEntrega
    if (direccion.descripcionEntrega) {
      const partes = direccion.descripcionEntrega.split(",");
      const pisoVal = partes.find((p) => p.includes("Piso"))?.split(":")[1]?.trim() || "";
      const deptoVal = partes.find((p) => p.includes("Depto"))?.split(":")[1]?.trim() || "";
      setPiso(pisoVal);
      setDepto(deptoVal);
    }
  };

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
      const response = await axios.get(`${host}/api/Ciudad/provincia/${provincia.id}`);
      setCiudades(response.data);
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
      setErrors({ general: "Error al cargar las ciudades" });
    }
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

  const handleEditarDireccion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const direccionActualizada = new Direccion();
      direccionActualizada.id = direccion.id;
      direccionActualizada.nombreCalle = calle;
      direccionActualizada.numeracion = numero;
      direccionActualizada.alias = alias;
      direccionActualizada.latitud = parseFloat(latitud || "0");
      direccionActualizada.longitud = parseFloat(longitud || "0");
      direccionActualizada.descripcionEntrega = `Piso: ${piso}, Depto: ${depto}`;
      direccionActualizada.ciudad = ciudad;

      await axios.put(
        `${host}/api/Direccion/full/update/${direccion.id}`,
        direccionActualizada,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onClose();
      // El padre se encargará de recargar con el useEffect
    } catch (error) {
      console.error("Error al editar la dirección:", error);
      setErrors({
        general: "Error al actualizar la dirección. Por favor, intente nuevamente.",
      });
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl text-center mb-4 text-black font-lato">Editar Dirección</h2>

        {errors.general && (
          <div className="text-red-600 font-lato mb-4 text-center bg-red-50 p-3 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleEditarDireccion}>
          <div className="mb-4">
            <label className="text-black block mb-2">Coordenadas</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={latitud}
                onChange={(e) => setLatitud(e.target.value)}
                placeholder="Latitud"
                className="text-black w-1/2 p-2 border rounded border-gray-300 placeholder:text-[#878787] font-lato"
              />
              <input
                type="text"
                value={longitud}
                onChange={(e) => setLongitud(e.target.value)}
                placeholder="Longitud"
                className="text-black w-1/2 p-2 border rounded border-gray-300 placeholder:text-[#878787] font-lato"
              />
            </div>
          </div>

          <div className="mb-4">
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

          <div className="mb-4 flex gap-2">
            <div className="w-1/3">
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

            <div className="w-1/3">
              <label className="text-black block mb-2">Piso</label>
              <input
                type="text"
                value={piso}
                onChange={(e) => setPiso(e.target.value)}
                className="text-black w-full p-2 border rounded border-gray-300"
              />
            </div>

            <div className="w-1/3">
              <label className="text-black block mb-2">Depto</label>
              <input
                type="text"
                value={depto}
                onChange={(e) => setDepto(e.target.value)}
                className="text-black w-full p-2 border rounded border-gray-300"
              />
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            <div className="w-1/2">
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
                  setCiudad(new Ciudad()); // Reset ciudad cuando cambia provincia
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

            <div className="w-1/2">
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
          </div>

          <div className="mb-4">
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

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={cargando}
              className="bg-white text-[#0A76E1] py-3 px-3 rounded-full hover:bg-gray-200 border border-[#0A76E1] w-40 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className="bg-[#0A76E1] text-white py-3 px-3 rounded-full hover:bg-[#0A5BBE] w-40 disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDireccion;