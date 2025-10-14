import { useEffect, useState } from "react";
import { host, Subcategoria } from "../../../ts/Clases";
import axios from "axios";
import SelectorCategoria from "./SelectorCategoria";

interface Props {
  subcategoria: Subcategoria | null;
  cerrarEditar: () => void;
  cargarAdminSubcategoria: () => void;
}

export default function AdminFormSubcategoria({
  subcategoria,
  cerrarEditar,
  cargarAdminSubcategoria,
}: Props) {
  const [form, setForm] = useState<Subcategoria>(new Subcategoria());
  const [selectorCategoria, setSelectorCategoria] = useState(false);

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  // Configurar axios con el token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    if (subcategoria) {
      setForm(subcategoria);
    }
  }, [subcategoria]);

  const cerrarSelectorCategoria = () => {
    setSelectorCategoria(false);
  };

  const cerrarFormulario = () => {
    cargarAdminSubcategoria();
    cerrarEditar();
  };

  const handleSubmit = async () => {
    try {
      const guardadoExitoso = await guardarSubcategoria(form);

      if (guardadoExitoso) {
        console.log("Se guardo la subcategoria");
        cerrarFormulario();
      } else {
        console.error("Error al guardar la subcategoria");
        alert("Error al guardar la subcategoria. Operacion cancelada");
      }
    } catch (error) {
      console.error("Ocurrio un error en handleSubmit:", error);
      alert("Ocurrio un error inesperado. Intente de nuevo.");
    }
  };

  const guardarSubcategoria = async (form: Subcategoria) => {
    const URL = form.id
      ? `${host}/api/subcategoria/actualizar/${form.id}`
      : `${host}/api/subcategoria/crear`;

    try {
      if (form.id) {
        const response = await axios.put(URL, form, axiosConfig);

        console.log("Se actualizo la subcategoria: ", response.status);
      } else {
        const response = await axios.post(URL, form, axiosConfig);

        console.log("Se guardo la subcategoria: ", response.status);
      }

      cerrarFormulario();
    } catch (error) {
      console.error("ERROR", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al guardar la subcategoria. Por favor, intenta de nuevo.");
      }
      cerrarFormulario();
    }

    return true;
  };

  if (!form) return null;

  return (
    <>
      <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">
        {/**Cabecera formulario */}
        <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
          <h1 className="text-white">Detalle de subcategoria</h1>
          <button onClick={cerrarFormulario} className="p-2 rounded-xl">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z"
                fill="black"
              />
            </svg>
          </button>
        </div>

        {/**Formulario */}
        <div
          className="p-10 grid grid-cols-1 text-white 
                    [&_input]:focus:outline-none [&_input]:border-b [&_input]:py-2 [&_input]:w-full 
                    [&_h4]:text-red-400 [&_h4]:text-xl 
                    [&_select]:focus:outline-none [&_select]:border-b [&_select]:py-5 [&_select]:w-full 
                    [&_option]:text-black"
        >
          {/**Agrega una imagen */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">1</h1>
              </div>
              <div className=" text-3xl">
                <h2>
                  {form.id ? "Modificar subcategoria" : "Crear subcategoria"}
                </h2>
              </div>
            </div>

            {/**Contenido */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="h-full min-h-5 w-7"></div>
              {/**Cargar imagen y vista previa */}
              <div className={`text-2xl *:py-5`}>
                <div>
                  <h3>Nombre:</h3>
                  <input
                    value={form.denominacion}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        denominacion: e.target.value,
                      }))
                    }
                    type="text"
                  />
                </div>
                {!form.denominacion && <h4>Debe agregar un nombre</h4>}

                <div className="flex gap-5">
                  <h3>Categoria: {form.categoria?.denominacion}</h3>
                  <button
                    onClick={() => setSelectorCategoria(true)}
                    className="bg-[#D93F21] px-5 rounded-2xl"
                  >
                    Asignar
                  </button>
                </div>
                {!form.categoria?.id && <h4>Debe asignarle una categoria</h4>}

                <div className="flex justify-between gap-5 *:p-2 *:rounded-4xl">
                  <div className="grid grid-cols-[1fr_10fr] justify-center items-center"></div>
                  <button
                    onClick={() =>
                      form.denominacion && form.categoria?.id
                        ? handleSubmit()
                        : () => {}
                    }
                    className="bg-[#D93F21]"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between"></div>
        </div>
      </div>

      <SelectorCategoria
        abierto={selectorCategoria}
        cerrar={cerrarSelectorCategoria}
        setForm={setForm}
      />
    </>
  );
}
