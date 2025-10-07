import React, { useState, useEffect } from "react";
import axios from "axios";
import {  Direccion, Ciudad, Provincia, host } from "../../ts/Clases";
import { z } from "zod";



type Errors = {
  calle?: string;
  numero?: string;
  ciudad?: string;
  provincia?: string;
  alias?: string;
  general?: string;
};


const API_URL_PROVINCIA = host+"/api/Provincia"; 
const API_URL_AGREGAR_DIRECCION = host+"/api/Direccion"; 


const AgregarDireccion = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [ciudad, setCiudad] = useState<Ciudad>(new Ciudad);
  const [provincia, setProvincia] = useState<Provincia>(new Provincia());
  const [alias, setAlias] = useState("");
  const [aclaraciones, setAclaraciones] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [piso, setPiso] = useState(""); 
  const [depto, setDepto] = useState(""); 
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [errors, setErrors] = useState<Errors>({});



  const direccionSchema = z.object({
  calle: z.string().nonempty("La calle es obligatoria.").regex(/^[a-zA-Z0-9\s]+$/, "La calle solo puede contener letras y números."),
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



  useEffect(() => {
    if (isOpen) {
      // Cargar ciudades y localidades al abrir el modal
      const fetchProvincias = async () => {
        const response = await axios.get(API_URL_PROVINCIA);
        setProvincias(response.data);
      };
      fetchProvincias();
    }
  }, [isOpen]);

  useEffect(()=>{
    fetchCiudades()
  }, [provincia])
  
  
  const fetchCiudades = async () => {

    if (provincia.id) {
      const API_URL_CIUDADES = host+`/api/Ciudad/provincia/${provincia.id}`; 
  
      const response = await axios.get(API_URL_CIUDADES);
      setCiudades(response.data);
      
    }else{
      setCiudades([])
    }
  };

    const validarCamposConZod = (): boolean => {
      const resultado = direccionSchema.safeParse({
        calle,
        numero,
        ciudad,
        provincia,
        alias,
        latitud,
        longitud,
        aclaraciones,
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



    const verificarDireccionExistente = async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_URL_AGREGAR_DIRECCION}/existe`, {
        params: {
          calle,
          numero,
          ciudad,
          provincia,
        },
      });

      return response.data.existe === true; // asumimos que responde { existe: true }
    } catch (error) {
      console.error("Error al verificar dirección:", error);
      setErrors({
        general: "No se pudo verificar si la dirección ya existe. Intente nuevamente.",
      });
      return true; // para prevenir el guardado en caso de error
    }
  };




  const handleAgregarDireccion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCamposConZod()) return;

    const aclaracionesConcatenadas = `Piso: ${piso}, Depto: ${depto}`;
    setAclaraciones(aclaracionesConcatenadas);

    const yaExiste = await verificarDireccionExistente();
    if (yaExiste) {
      setErrors({
        general: "La dirección ya está registrada.",
      });
      return;
    }

    try {

      const nuevaDireccion = new Direccion();
      nuevaDireccion.nombreCalle = calle;
      nuevaDireccion.numeracion = numero;
      nuevaDireccion.latitud = parseFloat(latitud || "0");
      nuevaDireccion.longitud = parseFloat(longitud || "0");
      nuevaDireccion.alias = alias;
      nuevaDireccion.descripcionEntrega = aclaracionesConcatenadas;
      nuevaDireccion.ciudad = ciudad


    // Enviar la dirección al backend
      const responseDireccion = await axios.post(API_URL_AGREGAR_DIRECCION, nuevaDireccion);
      console.log("Dirección agregada:", responseDireccion.data);
      onClose();
    } catch (err) {
      console.error("Error al agregar dirección:", err);
      setErrors({
        general: "Hubo un problema al agregar la dirección. Verifica los datos ingresados.",
      });
    }
  };


  //limpiar campos
  useEffect(() => {
    if (!isOpen) {
      setCalle("");
      setNumero("");
      setCiudad(new Ciudad());
      setProvincia(new Provincia());
      setAlias("");
      setAclaraciones("");
      setLatitud("");
      setLongitud("");
      setPiso(""); 
      setDepto(""); 
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
              value={ciudad.id}
              onChange={(e) => {

                const ciudadSeleccionada = ciudades.find((ciudad)=>ciudad.id == Number(e.target.value))
                
                if (ciudadSeleccionada) {
                  setCiudad(ciudadSeleccionada)
                }
              }}

              className={`w-full p-2 border rounded ${
                errors.ciudad ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar Ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
            {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
          </div>
          
          
          <div className="w-1/2 pr-2">
            <label className="text-black block mb-2">Provincia*</label>
            <select
              value={provincia.id}
              onChange={(e) => {

                const provinciaSeleccionada = provincias.find((prov)=>prov.id == Number(e.target.value))

                if (provinciaSeleccionada) {
                  setProvincia(provinciaSeleccionada);
                }else{
                  setProvincia(new Provincia())
                }

              }}
              className={`w-full p-2 border rounded ${
                errors.provincia ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar provincia</option>
              {provincias.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
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

export default AgregarDireccion;
