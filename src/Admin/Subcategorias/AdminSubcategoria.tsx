import { useEffect, useState } from "react";
import { host, Categoria, Subcategoria } from "../../../ts/Clases.ts";
import axios from "axios";
import AdminFormCategoria from "./AdminFormSubcategoria.tsx";

export default function AdminSubcategoria() {
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [subcategoriasMostradas, setSubcategoriasMostradas] = useState<
    Subcategoria[]
  >([]);
  const [buscador, setBuscador] = useState("");
  const [filtroPorCategoria, setFiltroPorCategoria] = useState(0);
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [formSubcategoria, setFormSubcategoria] = useState<Subcategoria | null>(
    null
  );

  const cantidadPorPagina = 10;

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
    cargarSubcategorias();
    cargarListaCategorias();
  }, []);

  const borradoLogico = async (subcategoria: Subcategoria) => {
    const URL = `${host}/api/subcategoria/full/drop/${subcategoria.id}`;

    try {
      if (
        confirm(
          "Borrar una subcategoria es una accion irreversible. Desea continuar?"
        )
      ) {
        const response = await axios.delete(URL, axiosConfig);

        console.log("Se borro la subcategoria: " + response.status);
        cargarSubcategorias();
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("La subcategoria esta en uso, no se puede eliminar");
      }
    }
  };

  const cerrarForm = () => {
    setFormSubcategoria(null);
  };

  const cargarSubcategorias = async () => {
    const URL = `${host}/api/subcategoria/full`;

    try {
      const response = await axios.get(URL, axiosConfig);
      setSubcategorias(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert(
          "Error al cargar las subcategorías. Por favor, intenta de nuevo."
        );
      }
    }
  };

  const cargarListaCategorias = async () => {
    const URL = `${host}/api/categoria/full`;

    try {
      const response = await axios.get(URL, axiosConfig);
      setListaCategorias(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al cargar las categorías. Por favor, intenta de nuevo.");
      }
    }
  };

  useEffect(() => {
    let filtrado: Subcategoria[] = subcategorias;

    if (filtroPorCategoria) {
      filtrado = filtrado.filter(
        (subcat) => subcat.categoria?.id == filtroPorCategoria
      );
    }

    if (buscador) {
      filtrado = filtrado.filter((subcategoria) =>
        subcategoria.denominacion.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setSubcategoriasMostradas(filtrado);
  }, [subcategorias, buscador, filtroPorCategoria]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-10">
        {/**Tabla */}
        <div
          className={`bg-white w-11/12 m-auto rounded-2xl ${
            formSubcategoria && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex justify-between p-5 h-2/12">
            <h1 className="pl-5 text-4xl">Subcategorias</h1>

            <div className="flex gap-5 pr-[2%] text-2xl">
              <select
                onChange={(e) => setFiltroPorCategoria(Number(e.target.value))}
                value={filtroPorCategoria}
                className="bg-gray-300 rounded-4xl px-2"
              >
                <option value={0}>Todos</option>

                {listaCategorias.length > 0 &&
                  listaCategorias.map((categoria) => (
                    <option key={categoria.id} value={Number(categoria.id)}>
                      {categoria.denominacion}
                    </option>
                  ))}
              </select>

              <input
                onChange={(e) => setBuscador(e.target.value)}
                className="bg-[#878787] text-white pl-5 rounded-4xl"
                placeholder="Buscar..."
                type="text"
              />

              <button
                onClick={() => setFormSubcategoria(new Subcategoria())}
                className="bg-[#D93F21] text-white px-10 rounded-4xl flex items-center gap-2"
              >
                <h2>Agregar</h2>
                <img className="h-5" src="/svg/Agregar.svg" alt="" />
              </button>
            </div>
          </div>

          {/**Tabla CRUD catalogo */}
          <div className="w-full pb-10">
            {/**Cabecera */}
            <div className="text-4xl w-full grid grid-cols-3 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center">
              <h1>Categoria</h1>
              <h1>Nombre</h1>
              <h1>Acciones</h1>
            </div>

            {/**Articulos */}
            {subcategoriasMostradas.length > 0 &&
              subcategoriasMostradas.map((subcategoria, index) => {
                if (
                  index < paginaSeleccionada * cantidadPorPagina &&
                  index >= cantidadPorPagina * (paginaSeleccionada - 1)
                ) {
                  return (
                    <div
                      key={subcategoria.id}
                      className="text-4xl w-full grid grid-cols-3 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center"
                    >
                      <div>
                        <h3>{subcategoria.categoria?.denominacion}</h3>
                      </div>
                      <div>
                        <h3>{subcategoria.denominacion}</h3>
                      </div>
                      <div className="flex justify-around">
                        <button
                          onClick={() => setFormSubcategoria(subcategoria)}
                        >
                          <img
                            className="h-15"
                            src="/svg/LogoEditar.svg"
                            alt=""
                          />
                        </button>
                        <button
                          onClick={() => {
                            borradoLogico(subcategoria);
                          }}
                        >
                          <img
                            className="h-15"
                            src={`/svg/LogoBorrar.svg`}
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  );
                }
              })}

            {/**Paginacion */}
            <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10">
              {/**Informacion articulos mostrados y totales */}
              <div className="h-10 flex items-center">
                <h4>
                  {paginaSeleccionada * cantidadPorPagina -
                    cantidadPorPagina +
                    1}
                  -
                  {paginaSeleccionada * cantidadPorPagina <
                  subcategoriasMostradas.length
                    ? paginaSeleccionada * cantidadPorPagina
                    : subcategoriasMostradas.length}{" "}
                  de {subcategoriasMostradas.length}
                </h4>
              </div>

              {/**Control de paginado a traves de botones */}
              <button onClick={() => setPaginaSeleccionada(1)}>
                <img className="h-10" src="/svg/PrimeraPagina.svg" alt="" />
              </button>
              <button
                onClick={() =>
                  setPaginaSeleccionada((prev) => {
                    if (paginaSeleccionada > 1) {
                      return prev - 1;
                    }
                    return prev;
                  })
                }
              >
                <img className="h-10" src="/svg/AnteriorPagina.svg" alt="" />
              </button>

              <button
                onClick={() =>
                  setPaginaSeleccionada((prev) => {
                    if (
                      paginaSeleccionada <
                      Math.ceil(
                        subcategoriasMostradas.length / cantidadPorPagina
                      )
                    ) {
                      return prev + 1;
                    }
                    return prev;
                  })
                }
              >
                <img className="h-10" src="/svg/SiguientePagina.svg" alt="" />
              </button>

              <button
                onClick={() =>
                  setPaginaSeleccionada(
                    Math.ceil(subcategoriasMostradas.length / cantidadPorPagina)
                  )
                }
              >
                <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
              </button>
            </div>
          </div>
        </div>

        {/**Editar, crear manufacturado */}
        <div className={`${!formSubcategoria && "hidden"}`}>
          <AdminFormCategoria
            subcategoria={formSubcategoria}
            cargarAdminSubcategoria={cargarSubcategorias}
            cerrarEditar={cerrarForm}
          />
        </div>
      </div>
    </>
  );
}
