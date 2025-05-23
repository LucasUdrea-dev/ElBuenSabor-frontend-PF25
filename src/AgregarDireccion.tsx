import React, { useState, useEffect } from "react";
import axios from "axios";

type Errors = {
  calle?: string;
  numero?: string;
  ciudad?: string;
  localidad?: string;
  alias?: string;
  general?: string;
};

const API_URL_CIUDADES = "http://localhost:8080/api/ciudades"; // Cambia esta URL a la de tu backend
const API_URL_LOCALIDADES = "http://localhost:8080/api/localidades"; // Cambia esta URL a la de tu backend
const API_URL_AGREGAR_DIRECCION = "http://localhost:8080/api/direcciones"; // Cambia esta URL a la de tu backend

const AgregarDireccion = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [piso, setPiso] = useState("");
  const [depto, setDepto] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [alias, setAlias] = useState("");
  const [aclaraciones, setAclaraciones] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [localidades, setLocalidades] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  
  useEffect(() => {
    if (isOpen) {
      // Cargar ciudades y localidades al abrir el modal
      const fetchCiudades = async () => {
        const response = await axios.get(API_URL_CIUDADES);
        setCiudades(response.data);
      };

      const fetchLocalidades = async () => {
        const response = await axios.get(API_URL_LOCALIDADES);
        setLocalidades(response.data);
      };

      fetchCiudades();
      fetchLocalidades();
    }
  }, [isOpen]);

  const validarCampos = (): boolean => {
    const nuevosErrores: Errors = {};

    if (!calle.trim()) {
      nuevosErrores.calle = "La calle es obligatoria.";
    }

    if (!numero.trim()) {
      nuevosErrores.numero = "El número es obligatorio.";
    }

    if (!ciudad.trim()) {
      nuevosErrores.ciudad = "La ciudad es obligatoria.";
    }

    if (!localidad.trim()) {
      nuevosErrores.localidad = "La localidad es obligatoria.";
    }

    if (!alias.trim()) {
      nuevosErrores.alias = "El alias es obligatorio.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleAgregarDireccion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const response = await axios.post(API_URL_AGREGAR_DIRECCION, {
        calle,
        numero,
        piso,
        depto,
        ciudad,
        localidad,
        alias,
        aclaraciones,
        latitud,
        longitud,
      });

      console.log("Dirección agregada:", response.data);
      onClose();
    } catch (err) {
      console.error("Error al agregar dirección:", err);
      setErrors({ general: "Hubo un problema al agregar la dirección. Verifica los datos ingresados." });
    }
  };

  //limpiar campos
  useEffect(() => {
    if (!isOpen) {
      setCalle("");
      setNumero("");
      setPiso("");
      setDepto("");
      setCiudad("");
      setLocalidad("");
      setAlias("");
      setAclaraciones("");
      setLatitud("");
      setLongitud("");
      setErrors({});
    }
  }, [isOpen]);


  if (!isOpen) return null;




  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h2 className="text-black text-2xl font-lato mb-6 text-center">Agregar una dirección de envío</h2>

        {errors.general && (
          <div className="text-red-600 font-lato mb-2 text-center font-lato">{errors.general}</div>
        )}

        <form onSubmit={handleAgregarDireccion}>

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
            <label className="text-black block mb-2">Localidad*</label>
            <select
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              className={`w-full p-2 border rounded ${
                errors.localidad ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar Localidad</option>
              {localidades.map((localidad) => (
                <option key={localidad} value={localidad}>
                  {localidad}
                </option>
              ))}
            </select>
            {errors.localidad && <p className="text-red-500 text-sm mt-1">{errors.localidad}</p>}
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

export default AgregarDireccion;
