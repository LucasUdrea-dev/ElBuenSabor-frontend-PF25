import { useEffect, useState } from "react";
import { host, Categoria } from "../../../ts/Clases.ts";
import axios from "axios";
import AdminFormCategoria from "./AdminFormCategoria.tsx";

export default function AdminCategoria() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasMostradas, setCategoriasMostradas] = useState<Categoria[]>(
    []
  );
  const [buscador, setBuscador] = useState("");
  const [filtroEsParaElaborar, setFiltroEsParaElaborar] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [formCategoria, setFormCategoria] = useState<Categoria | null>(null);

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
    cargarCategorias();
  }, []);

  const hardDeleteCategoria = async (categoria: Categoria) => {
    const URL = `${host}/api/categoria/full/drop/${categoria.id}`;

    try {
      if (
        confirm(
          "Borrar una categoria es una accion irreversible. Desea continuar?"
        )
      ) {
        const response = await axios.delete(URL, axiosConfig);

        console.log("Se borro la categoria: " + response.status);
        cargarCategorias();
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("La categoria esta en uso, no se puede eliminar");
      }
    }
  };

  const cerrarForm = () => {
    setFormCategoria(null);
  };

  const cargarCategorias = async () => {
    const URL = `${host}/api/categoria/full`;

    try {
      const response = await axios.get(URL, axiosConfig);
      setCategorias(response.data);
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
    let filtrado: Categoria[] = categorias;

    if (filtroEsParaElaborar) {
      if (filtroEsParaElaborar == "elaborar") {
        filtrado = filtrado.filter((categoria) => categoria.esParaElaborar);
      } else if (filtroEsParaElaborar == "vender") {
        filtrado = filtrado.filter((categoria) => !categoria.esParaElaborar);
      }
    }

    if (buscador) {
      filtrado = filtrado.filter((categoria) =>
        categoria.denominacion.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setCategoriasMostradas(filtrado);
  }, [categorias, buscador, filtroEsParaElaborar]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-8 px-4">
        {/**Tabla */}
        <div
          className={`bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl ${
            formCategoria && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">Categorias</h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
              <select
                onChange={(e) => setFiltroEsParaElaborar(e.target.value)}
                value={filtroEsParaElaborar}
                className="bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
              >
                <option value={""}>Todos</option>
                <option value={"elaborar"}>Para Elaborar</option>
                <option value={"vender"}>Para Vender</option>
              </select>

              <div className="relative">
                <input
                  onChange={(e) => setBuscador(e.target.value)}
                  className="bg-[#878787] text-white pl-10 pr-4 py-2 rounded-lg font-lato text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all w-full"
                  placeholder="Buscar..."
                  type="text"
                />
                <img
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-80"
                  src="/svg/LupaBuscador.svg"
                  alt="Buscar"
                />
              </div>

              <button
                onClick={() => setFormCategoria(new Categoria())}
                className="bg-[#D93F21] hover:bg-[#B8341B] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <h2>Agregar</h2>
                <img className="h-4 w-4" src="/svg/Agregar.svg" alt="Agregar" />
              </button>
            </div>
          </div>

          {/**Tabla CRUD catalogo */}
          <div className="w-full pb-6">
            {/**Cabecera */}
            <div className="text-sm md:text-base w-full grid grid-cols-3 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
              <h1 className="p-4 text-center">Nombre</h1>
              <h1 className="p-4 text-center">Es para elaborar</h1>
              <h1 className="p-4 text-center">Acciones</h1>
            </div>

            {/**Articulos */}
            {categoriasMostradas.length > 0 &&
              categoriasMostradas.map((categoria, index) => {
                if (
                  index < paginaSeleccionada * cantidadPorPagina &&
                  index >= cantidadPorPagina * (paginaSeleccionada - 1)
                ) {
                  return (
                    <div
                      key={categoria.id}
                      className="text-sm md:text-base w-full grid grid-cols-3 border-b border-gray-100 hover:bg-gray-50 transition-colors font-lato"
                    >
                      <div className="p-4 flex items-center justify-center">
                        <h3 className="text-gray-700 truncate">{categoria.denominacion}</h3>
                      </div>
                      <div className="p-4 flex items-center justify-center">
                        <div
                          className={`${
                            categoria.esParaElaborar
                              ? "bg-green-600"
                              : "bg-gray-500"
                          } h-4 w-4 rounded-full shadow-sm`}
                        ></div>
                      </div>
                      <div className="p-4 flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => setFormCategoria(categoria)}
                          className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                          title="Editar"
                        >
                          <img
                            className="h-7 w-7"
                            src="/svg/LogoEditar.svg"
                            alt="Editar"
                          />
                        </button>
                        <button
                          onClick={() => {
                            hardDeleteCategoria(categoria);
                          }}
                          className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                          title="Eliminar"
                        >
                          <img
                            className="h-7 w-7"
                            src={`/svg/LogoBorrar.svg`}
                            alt="Eliminar"
                          />
                        </button>
                      </div>
                    </div>
                  );
                }
              })}

            {/**Paginacion */}
            <div className="text-gray-600 flex items-center justify-between px-6 pt-6 gap-4 text-sm font-lato flex-wrap">
              {/**Informacion articulos mostrados y totales */}
              <div className="flex items-center">
                <h4>
                  {paginaSeleccionada * cantidadPorPagina -
                    cantidadPorPagina +
                    1}
                  -
                  {paginaSeleccionada * cantidadPorPagina <
                  categoriasMostradas.length
                    ? paginaSeleccionada * cantidadPorPagina
                    : categoriasMostradas.length}{" "}
                  de {categoriasMostradas.length}
                </h4>
              </div>

              {/**Control de paginado a traves de botones */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setPaginaSeleccionada(1)}
                  className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                >
                  <img className="h-8 w-8" src="/svg/PrimeraPagina.svg" alt="Primera" />
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
                  className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                >
                  <img className="h-8 w-8" src="/svg/AnteriorPagina.svg" alt="Anterior" />
                </button>

                <button
                  onClick={() =>
                    setPaginaSeleccionada((prev) => {
                      if (
                        paginaSeleccionada <
                        Math.ceil(categoriasMostradas.length / cantidadPorPagina)
                      ) {
                        return prev + 1;
                      }
                      return prev;
                    })
                  }
                  className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                >
                  <img className="h-8 w-8" src="/svg/SiguientePagina.svg" alt="Siguiente" />
                </button>

                <button
                  onClick={() =>
                    setPaginaSeleccionada(
                      Math.ceil(categoriasMostradas.length / cantidadPorPagina)
                    )
                  }
                  className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                >
                  <img className="h-8 w-8" src="/svg/UltimaPagina.svg" alt="Última" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/**Editar, crear manufacturado */}
        <div className={`${!formCategoria && "hidden"}`}>
          <AdminFormCategoria
            categoria={formCategoria}
            cargarAdminCatalogo={cargarCategorias}
            cerrarEditar={cerrarForm}
          />
        </div>
      </div>
    </>
  );
}
