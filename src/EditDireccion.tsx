import React, { useState, useEffect } from "react";
import axios from "axios";
import { Direccion, Ciudad, Provincia, Pais } from "../ts/Clases";
import { z } from "zod";

type Errors = {
  calle?: string;
  numero?: string;
  ciudad?: string;
  provincia?: string;
  alias?: string;
  general?: string;
};

const API_URL_DIRECCION = "http://localhost:8080/api/Direccion";
const API_URL_CIUDADES = "http://localhost:8080/api/Ciudad";
const API_URL_PROVINCIAS = "http://localhost:8080/api/Provincia";

const direccionSchema = z.object({
  calle: z.string().nonempty("La calle es obligatoria.").regex(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ]+$/, "La calle solo puede contener letras y números."),
  numero: z.string().nonempty("El número es obligatorio.").regex(/^\d+$/, "El número debe ser solo dígitos."),
  ciudad: z.string().nonempty("La ciudad es obligatoria."),
  provincia: z.string().nonempty("La provincia es obligatoria."),
  alias: z.string().nonempty("El alias es obligatorio."),
  piso: z.string().optional(),
  depto: z.string().optional(),
  latitud: z.string().optional(),
  longitud: z.string().optional(),
  aclaraciones: z.string().optional(),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  direccion: Direccion;
  onDireccionActualizada: () => void;  

};

const EditDirecciones = ({ isOpen, onClose, direccion,onDireccionActualizada  }: Props) => {
  const [calle, setCalle] = useState(direccion.nombre_calle);
  const [numero, setNumero] = useState(direccion.numeracion);
  const [ciudad, setCiudad] = useState(direccion.ciudad?.nombre || "");
  const [provincia, setProvincia] = useState(direccion.ciudad?.provincia?.nombre || "");
  const [alias, setAlias] = useState(direccion.alias);
  const [latitud, setLatitud] = useState(direccion.latitud?.toString() || "");
  const [longitud, setLongitud] = useState(direccion.longitud?.toString() || "");
  const [piso, setPiso] = useState("");
  const [depto, setDepto] = useState("");
  const [aclaraciones, setAclaraciones] = useState("");
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isOpen) {
      const fetchDatos = async () => {
        const [resCiudades, resProvincias] = await Promise.all([
          axios.get(API_URL_CIUDADES),
          axios.get(API_URL_PROVINCIAS),
        ]);
        setCiudades(resCiudades.data);
        setProvincias(resProvincias.data);

        if (direccion.text_area) {
          const partes = direccion.text_area.split(",");
          const pisoVal = partes.find(p => p.includes("Piso"))?.split(":")[1]?.trim() || "";
          const deptoVal = partes.find(p => p.includes("Depto"))?.split(":")[1]?.trim() || "";
          setPiso(pisoVal);
          setDepto(deptoVal);
        }
      };
      fetchDatos();
    }
  }, [isOpen, direccion]);

  const validarCampos = (): boolean => {
    const result = direccionSchema.safeParse({
      calle,
      numero,
      ciudad,
      provincia,
      alias,
      piso,
      depto,
      latitud,
      longitud,
      aclaraciones: `Piso: ${piso}, Depto: ${depto}`,
    });

    if (!result.success) {
      const erroresZod: Errors = {};
      result.error.errors.forEach((err) => {
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

    const pais = new Pais();
    pais.nombre = "Argentina";

    const prov = new Provincia();
    prov.nombre = provincia;
    prov.pais = pais;

    const ciu = new Ciudad();
    ciu.nombre = ciudad;
    ciu.provincia = prov;

    const dirActualizada = new Direccion();
    dirActualizada.id = direccion.id;
    dirActualizada.nombre_calle = calle;
    dirActualizada.numeracion = numero;
    dirActualizada.alias = alias;
    dirActualizada.latitud = parseFloat(latitud || "0");
    dirActualizada.longitud = parseFloat(longitud || "0");
    dirActualizada.text_area = `Piso: ${piso}, Depto: ${depto}`;
    dirActualizada.ciudad = ciu;

    try {
    await axios.put(`${API_URL_DIRECCION}/${direccion.id}`, dirActualizada);
    onClose();
    onDireccionActualizada();  // <-- Aquí notificas que se actualizó
  } catch (error) {
    console.error("Error al editar la dirección:", error);
    setErrors({ general: "Error al actualizar la dirección." });
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-center mb-4 text-black">Editar Dirección</h2>

        {errors.general && <p className="text-red-600 text-center mb-4">{errors.general}</p>}

        <form onSubmit={handleEditarDireccion}>


          <div className="mb-4">
          <label className="text-black block mb-2">Coordenadas</label>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <input
                type="text"
                value={latitud}
                onChange={(e) => setLatitud(e.target.value)}
                placeholder="Latitud"  
                className="text-black w-full p-2 border rounded border-gray-300 placeholder:text-[#878787] font-lato"
              />
            </div>

            <div className="w-1/2 pl-2">
              <input
                type="text "
                value={longitud}
                onChange={(e) => setLongitud(e.target.value)}
                placeholder="Longitud"  
                className="text-black w-full p-2 border rounded border-gray-300 placeholder:text-[#878787] font-lato"
              />
            </div>
          </div>
        </div>


          <div className="mb-4">
            <label className="text-black block mb-2 font-lato">Calle*</label>
            <input
              type="text"
              value={calle}
              onChange={(e) => setCalle(e.target.value)}
              className={`text-black w-full p-2 border rounded font-lato  ${
                errors.calle ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.calle && <p className="text-red-500 text-sm mt-1">{errors.calle}</p>}
          </div>

          <div className="mb-4 flex justify-between">
          <div className="w-1/3 pr-2">
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

          <div className="w-1/3 px-2">
            <label className="text-black block mb-2">Piso</label>
            <input
              type="text"
              value={piso}
              onChange={(e) => setPiso(e.target.value)}
              className=" text-black w-full p-2 border rounded border-gray-300"
            />
          </div>

          <div className="w-1/3 pl-2">
            <label className="text-black block mb-2">Depto</label>
            <input
              type="text"
              value={depto}
              onChange={(e) => setDepto(e.target.value)}
              className="text-black w-full p-2 border rounded border-gray-300"
            />
          </div>




        </div>

          <div className="mb-4 flex justify-between">
          <div className="w-1/2 pr-2">
            <label className="text-black block mb-2">Ciudad*</label>
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className={`w-full p-2 border rounded ${
                errors.ciudad ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar Ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
            {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
          </div>
          
          
          <div className="w-1/2 pr-2">
            <label className="text-black block mb-2">Provincia*</label>
            <select
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              className={`w-full p-2 border rounded ${
                errors.provincia ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar provincia</option>
              {provincias.map((provincia) => (
                <option key={provincia} value={provincia}>
                  {provincia}
                </option>
              ))}
            </select>
            {errors.provincia && <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>}
          </div>
          </div>
          

          <div className="mb-4">
            <label className="text-black block mb-2">Alias*</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Casa trabajo Oficina"  // Texto dentro de la textbox

              className={`text-black w-full p-2 border rounded placeholder:text-[#878787] ${
                errors.alias ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.alias && <p className="text-red-500 text-sm mt-1">{errors.alias}</p>}
          </div>

          <div className="mb-4">
            <label className="text-black block mb-2">Aclaraciones</label>
            <textarea
              value={aclaraciones}
              onChange={(e) => setAclaraciones(e.target.value)}
              className="text-black w-full p-2 border rounded border-gray-300"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-[#0A76E1] py-3 px-3 rounded-full hover:bg-gray-200 border border-[#0A76E1] w-40"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-[#0A76E1] text-white py-3 px-3 rounded-full hover:bg-[#0A5BBE] w-40"
            >
              Guardar cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default EditDirecciones;