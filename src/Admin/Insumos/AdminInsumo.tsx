import { useEffect, useState } from "react";
import { ArticuloInsumo, host } from "../../../ts/Clases.ts"; // Adjust the path as needed
import axios from "axios";
import AdminFormInsumo from "./AdminFormInsumo.tsx";
// import { obtenerImagen } from "../../../ts/Imagen.ts";
import ModificarStock from "./ModificarStock.tsx";
import AdminMostrarInsumo from "./AdminMostrarInsumo.tsx";
import { LoadingTable } from "../../components/LoadingTable.tsx";

interface ModificarStock {
  articulo: ArticuloInsumo;
  operacion: string;
}

export default function AdminInsumo() {
  const [articulosInsumos, setArticulosInsumos] = useState<ArticuloInsumo[]>(
    []
  );
  const [articulosInsumosMostrados, setArticulosInsumosMostrados] = useState<
    ArticuloInsumo[]
  >([]);
  const [mostrarStocks, setMostrarStocks] = useState(false);
  const [modificarStock, setModificarStock] = useState<ModificarStock>({
    articulo: new ArticuloInsumo(),
    operacion: "",
  });
  const [buscador, setBuscador] = useState("");
  const [filtroElaboracion, setFiltroElaboracion] = useState<"todos" | "elaborar" | "no_elaborar">("todos");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [mostrarArticulo, setMostrarArticulo] = useState<ArticuloInsumo | null>(
    null
  );
  const [formInsumo, setFormInsumo] = useState<ArticuloInsumo | null>(null);
  const [loadingCambio, setLoadingCambio] = useState(false);
  const [loading, setLoading] = useState(false);

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
    cargarInsumos();
  }, []);

  const borradoLogico = async (articulo: ArticuloInsumo) => {
    const URL = `${host}/api/insumos/actualizar/${articulo.id}`;

    articulo.existe = !articulo.existe;
    setLoadingCambio(true);

    try {
      const response = await axios.put(URL, articulo, axiosConfig);

      console.log("Se borro logicamente el articulo: " + response.status);
      cargarInsumos();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al eliminar el insumo. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoadingCambio(false);
    }
  };

  const cerrarDetalle = () => {
    setMostrarArticulo(null);
  };

  const cerrarForm = () => {
    setFormInsumo(null);
  };

  const cargarInsumos = async () => {
    const URL = `${host}/api/insumos/full`;
    setLoading(true);
    try {
      const response = await axios.get(URL, axiosConfig);
      setArticulosInsumos(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al cargar los insumos. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cerrarModificarStock = () => {
    setModificarStock({ articulo: new ArticuloInsumo(), operacion: "" });
    cargarInsumos();
  };

  useEffect(() => {
    let filtrado: ArticuloInsumo[] = articulosInsumos;

    if (buscador) {
      filtrado = filtrado.filter((articulo) =>
        articulo.nombre.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    if (filtroElaboracion !== "todos") {
      filtrado = filtrado.filter((articulo) =>
        filtroElaboracion === "elaborar"
          ? articulo.esParaElaborar
          : !articulo.esParaElaborar
      );
    }

    setPaginaSeleccionada(1);
    setArticulosInsumosMostrados(filtrado);
  }, [articulosInsumos, buscador, filtroElaboracion]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-8 px-4">
        {/**Tabla */}
        <div
          className={`bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl ${
            (mostrarArticulo || formInsumo) && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">
              Insumos
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
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

              <div className="relative">
                <select
                  value={filtroElaboracion}
                  onChange={(e) =>
                    setFiltroElaboracion(
                      e.target.value as "todos" | "elaborar" | "no_elaborar"
                    )
                  }
                  className="bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg font-lato text-sm focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all shadow-sm cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="elaborar">Para Elaborar</option>
                  <option value="no_elaborar">No Elaborar</option>
                </select>
              </div>

              <button
                onClick={() => setMostrarStocks((prev) => !prev)}
                className="bg-[#D93F21] hover:bg-[#B8341B] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <h2>{mostrarStocks ? "Completo" : "Stocks"}</h2>
              </button>

              <button
                onClick={() => setFormInsumo(new ArticuloInsumo())}
                className="bg-[#D93F21] hover:bg-[#B8341B] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <h2>Agregar</h2>
                <img className="h-4 w-4" src="/svg/Agregar.svg" alt="Agregar" />
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingTable nombre="insumos" />
          ) : (
            <div className="w-full pb-6">
              {!mostrarStocks ? (
                <div>
                  {/**Cabecera */}
                  <div className="text-sm md:text-base w-full grid grid-cols-8 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
                    <h1 className="p-4 text-center">Imagen</h1>
                    <h1 className="p-4 text-center">Categoría</h1>
                    <h1 className="p-4 text-center">Nombre</h1>
                    <h1 className="p-4 text-center">Precio Venta p/U</h1>
                    <h1 className="p-4 text-center">Costo p/U</h1>
                    <h1 className="p-4 text-center">Para elaborar</h1>
                    <h1 className="p-4 text-center">Publicado</h1>
                    <h1 className="p-4 text-center">Acciones</h1>
                  </div>

                  {/**Articulos */}
                  {articulosInsumosMostrados.length > 0 &&
                    articulosInsumosMostrados.map((articulo, index) => {
                      if (
                        index < paginaSeleccionada * cantidadPorPagina &&
                        index >= cantidadPorPagina * (paginaSeleccionada - 1)
                      ) {
                        return (
                          <div
                            key={articulo.id}
                            className="text-sm md:text-base w-full grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50 transition-colors font-lato"
                          >
                            <div className="p-4 flex items-center justify-center">
                              <img
                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                src={String(articulo.imagenArticulo) || ""}
                                alt={articulo.nombre}
                              />
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <h3 className="text-gray-700 truncate">
                                {articulo.subcategoria.categoria?.denominacion}
                              </h3>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <h3
                                className="text-gray-700 truncate"
                                title={articulo.nombre}
                              >
                                {articulo.nombre.slice(0, 13)}
                                {articulo.nombre.length > 13 && "..."}
                              </h3>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <h3 className="font-semibold text-emerald-600">
                                ${articulo.precio}/
                                {articulo.unidadMedida.unidad.slice(0, 2)}
                              </h3>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <h3 className="font-semibold text-emerald-600">
                                ${articulo.precioCompra}/
                                {articulo.unidadMedida.unidad.slice(0, 2)}
                              </h3>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <div
                                className={`${
                                  articulo.esParaElaborar
                                    ? "bg-green-600"
                                    : "bg-gray-500"
                                } h-4 w-4 rounded-full shadow-sm`}
                              ></div>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <div
                                className={`${
                                  articulo.existe
                                    ? "bg-green-600"
                                    : "bg-gray-500"
                                } h-4 w-4 rounded-full shadow-sm`}
                              ></div>
                            </div>
                            <div className="p-4 flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setMostrarArticulo(articulo)}
                                className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                                title="Ver detalles"
                              >
                                <img
                                  className="h-7 w-7"
                                  src="/svg/LogoVer.svg"
                                  alt="Ver"
                                />
                              </button>
                              <button
                                onClick={() => setFormInsumo(articulo)}
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
                                  borradoLogico(articulo);
                                }}
                                className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                                  loadingCambio
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title={
                                  articulo.existe ? "Desactivar" : "Activar"
                                }
                                disabled={loadingCambio}
                              >
                                <img
                                  className="h-7 w-7"
                                  src={`/svg/${
                                    articulo.existe
                                      ? "LogoBorrar.svg"
                                      : "LogoActivar.svg"
                                  }`}
                                  alt={
                                    articulo.existe ? "Desactivar" : "Activar"
                                  }
                                />
                              </button>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              ) : (
                <div>
                  {/**Cabecera */}
                  <div className="text-sm md:text-base w-full grid grid-cols-5 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
                    <h1 className="p-4 text-center">Imagen</h1>
                    <h1 className="p-4 text-center">Nombre</h1>
                    <h1 className="p-4 text-center">Cantidad</h1>
                    <h1 className="p-4 text-center">Stock Suficiente</h1>
                    <h1 className="p-4 text-center">Modificar Stock</h1>
                  </div>

                  {/**Articulos */}
                  {articulosInsumosMostrados.length > 0 &&
                    articulosInsumosMostrados.map((articulo, index) => {
                      if (
                        index < paginaSeleccionada * cantidadPorPagina &&
                        index >= cantidadPorPagina * (paginaSeleccionada - 1)
                      ) {
                        return (
                          <div
                            key={articulo.id}
                            className="text-sm md:text-base w-full grid grid-cols-5 border-b border-gray-100 hover:bg-gray-50 transition-colors font-lato"
                          >
                            <div className="p-4 flex items-center justify-center">
                              <img
                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                src={String(articulo.imagenArticulo) || ""}
                                alt={articulo.nombre}
                              />
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <h3
                                className="text-gray-700 truncate"
                                title={articulo.nombre}
                              >
                                {articulo.nombre.slice(0, 13)}
                                {articulo.nombre.length > 13 && "..."}
                              </h3>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <h3 className="font-semibold text-gray-700">
                                {articulo.stockArticuloInsumo?.cantidad}{" "}
                                {articulo.unidadMedida?.unidad}
                                {articulo.unidadMedida?.unidad == "unidad" &&
                                  articulo.stockArticuloInsumo?.cantidad != 1 &&
                                  "es"}
                              </h3>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                              <div
                                className={`${
                                  articulo.stockArticuloInsumo?.cantidad >
                                  articulo.stockArticuloInsumo?.minStock
                                    ? "bg-green-600"
                                    : "bg-red-500"
                                } h-4 w-4 rounded-full shadow-sm`}
                              ></div>
                            </div>
                            <div className="p-4 flex items-center justify-center gap-1.5">
                              <button
                                title="Quitar stock"
                                onClick={() =>
                                  setModificarStock({
                                    articulo: articulo,
                                    operacion: "quitar",
                                  })
                                }
                                className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                              >
                                <img
                                  className="h-7 w-7"
                                  src="/img/simboloMenos.png"
                                  alt="Quitar"
                                />
                              </button>
                              <button
                                title="Modificar cantidad minima"
                                onClick={() =>
                                  setModificarStock({
                                    articulo: articulo,
                                    operacion: "minimo",
                                  })
                                }
                                className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                              >
                                <img
                                  className="h-7 w-7"
                                  src="/img/stockMin.png"
                                  alt="Stock mínimo"
                                />
                              </button>
                              <button
                                title="Agregar stock"
                                onClick={() =>
                                  setModificarStock({
                                    articulo: articulo,
                                    operacion: "agregar",
                                  })
                                }
                                className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                              >
                                <img
                                  className="h-7 w-7"
                                  src="/img/simboloMas.png"
                                  alt="Agregar"
                                />
                              </button>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              )}

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
                    articulosInsumosMostrados.length
                      ? paginaSeleccionada * cantidadPorPagina
                      : articulosInsumosMostrados.length}{" "}
                    de {articulosInsumosMostrados.length}
                  </h4>
                </div>

                {/**Control de paginado a traves de botones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaginaSeleccionada(1)}
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img
                      className="h-8 w-8"
                      src="/svg/PrimeraPagina.svg"
                      alt="Primera"
                    />
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
                    <img
                      className="h-8 w-8"
                      src="/svg/AnteriorPagina.svg"
                      alt="Anterior"
                    />
                  </button>

                  <button
                    onClick={() =>
                      setPaginaSeleccionada((prev) => {
                        if (
                          paginaSeleccionada <
                          Math.ceil(
                            articulosInsumosMostrados.length / cantidadPorPagina
                          )
                        ) {
                          return prev + 1;
                        }
                        return prev;
                      })
                    }
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img
                      className="h-8 w-8"
                      src="/svg/SiguientePagina.svg"
                      alt="Siguiente"
                    />
                  </button>

                  <button
                    onClick={() =>
                      setPaginaSeleccionada(
                        Math.ceil(
                          articulosInsumosMostrados.length / cantidadPorPagina
                        )
                      )
                    }
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img
                      className="h-8 w-8"
                      src="/svg/UltimaPagina.svg"
                      alt="Última"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/**Mostrar Insumo*/}
        <div className={`${!mostrarArticulo && "hidden"}`}>
          <AdminMostrarInsumo
            articulo={mostrarArticulo}
            abrirEditar={setFormInsumo}
            cerrarMostrar={cerrarDetalle}
          />
        </div>

        {/**Editar, crear manufacturado*/}

        <div className={`${!formInsumo && "hidden"}`}>
          <AdminFormInsumo
            articulo={formInsumo}
            cargarAdminInsumo={cargarInsumos}
            cerrarEditar={cerrarForm}
          />
        </div>
        <div className={`${!modificarStock.operacion && "hidden"}`}>
          <ModificarStock
            modificar={modificarStock}
            cerrarModal={cerrarModificarStock}
          />
        </div>
      </div>
    </>
  );
}
