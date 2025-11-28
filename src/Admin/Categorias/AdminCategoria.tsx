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
    const URL = `${host}/api/Categoria/full/drop/${categoria.id}`;

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
    const URL = `${host}/api/Categoria/full`;

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
      <div className="bg-[#333333] w-full min-h-screen py-10">
        {/**Tabla */}
        <div
          className={`bg-white w-11/12 m-auto rounded-2xl ${
            formCategoria && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex justify-between p-5 h-2/12">
            <h1 className="pl-5 text-4xl">Categorias</h1>

            <div className="flex gap-5 pr-[2%] text-2xl">
              <select
                onChange={(e) => setFiltroEsParaElaborar(e.target.value)}
                value={filtroEsParaElaborar}
                className="bg-gray-300 rounded-4xl px-2"
              >
                <option value={""}>Todos</option>
                <option value={"elaborar"}>Para Elaborar</option>
                <option value={"vender"}>Para Vender</option>
              </select>

              <input
                onChange={(e) => setBuscador(e.target.value)}
                className="bg-[#878787] text-white pl-5 rounded-4xl"
                placeholder="Buscar..."
                type="text"
              />

              <button
                onClick={() => setFormCategoria(new Categoria())}
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
              <h1>Nombre</h1>
              <h1>Es para elaborar</h1>
              <h1>Acciones</h1>
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
                      className="text-4xl w-full grid grid-cols-3 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center"
                    >
                      <div>
                        <h3>{categoria.denominacion}</h3>
                      </div>
                      <div className="flex">
                        <div
                          className={`${
                            categoria.esParaElaborar
                              ? "bg-green-600"
                              : "bg-gray-500"
                          } h-10 w-10 m-auto rounded-4xl`}
                        ></div>
                      </div>
                      <div className="flex justify-around">
                        <button onClick={() => setFormCategoria(categoria)}>
                          <img
                            className="h-15"
                            src="/svg/LogoEditar.svg"
                            alt=""
                          />
                        </button>
                        <button
                          onClick={() => {
                            hardDeleteCategoria(categoria);
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
                  categoriasMostradas.length
                    ? paginaSeleccionada * cantidadPorPagina
                    : categoriasMostradas.length}{" "}
                  de {categoriasMostradas.length}
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
                      Math.ceil(categoriasMostradas.length / cantidadPorPagina)
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
                    Math.ceil(categoriasMostradas.length / cantidadPorPagina)
                  )
                }
              >
                <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
              </button>
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
