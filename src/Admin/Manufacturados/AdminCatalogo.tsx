import { useEffect, useState } from "react";
import { ArticuloManufacturado, host } from "../../../ts/Clases.ts"; // Adjust the path as needed

import AdminFormManufacturado from "./AdminFormManufacturado.tsx";
import AdminMostrarManufacturado from "./AdminMostrarManufacturado.tsx";
import axios from "axios";
import { LoadingTable } from "../../components/LoadingTable.tsx";

export default function AdminCatalogo() {
  const [articulosManufacturados, setArticulosManufacturados] = useState<
    ArticuloManufacturado[]
  >([]);
  const [
    articulosManufacturadosMostrados,
    setArticulosManufacturadosMostrados,
  ] = useState<ArticuloManufacturado[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [mostrarArticulo, setMostrarArticulo] =
    useState<ArticuloManufacturado | null>(null);
  const [formManufacturado, setFormManufacturado] =
    useState<ArticuloManufacturado | null>(null);
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
    cargarManufacturados();
  }, []);

  const borradoLogico = async (articulo: ArticuloManufacturado) => {
    const URL = `${host}/api/articuloManufacturado/actualizar/${articulo.id}`;

    articulo.existe = !articulo.existe;
    setLoadingCambio(true);

    const dataToSend = {
      id: articulo.id || null,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      precio: articulo.precio,
      existe: articulo.existe,
      esParaElaborar: articulo.esParaElaborar,
      imagenArticulo: articulo.imagenArticulo,
      subcategoria: {
        id: articulo.subcategoria.id,
        categoria: articulo.subcategoria.categoria?.id
          ? { id: Number(articulo.subcategoria.categoria.id) }
          : undefined,
      },
      unidadMedida: {
        id: articulo.unidadMedida.id,
      },
      tiempoEstimado: articulo.tiempoEstimado,
      preparacion: articulo.preparacion,
      sucursalId: 1,
      insumos: articulo.detalleInsumos.map((detalle) => ({
        articuloInsumo: { id: Number(detalle.articuloInsumo.id) },
        cantidad: detalle.cantidad,
      })),
    };

    try {
      const response = await axios.put(URL, dataToSend, axiosConfig);

      console.log("Se borro logicamente el articulo: " + response.status);
      cargarManufacturados();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert(
          "Error al eliminar el manufacturado. Por favor, intenta de nuevo."
        );
      }
    } finally {
      setLoadingCambio(false);
    }
  };

  const cerrarDetalle = () => {
    setMostrarArticulo(null);
  };

  const cerrarForm = () => {
    setFormManufacturado(null);
  };

  const cargarManufacturados = async () => {
    const URL = `${host}/api/articuloManufacturado/full`;
    setLoading(true);
    try {
      const response = await axios.get(URL, axiosConfig);
      setArticulosManufacturados(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert(
          "Error al cargar los manufacturados. Por favor, intenta de nuevo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtrado: ArticuloManufacturado[] = articulosManufacturados;

    if (buscador) {
      filtrado = filtrado.filter((articulo) =>
        articulo.nombre.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setArticulosManufacturadosMostrados(filtrado);
  }, [articulosManufacturados, buscador]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-8 px-4">
        {/**Tabla */}
        <div
          className={`bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl ${
            (mostrarArticulo || formManufacturado) && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">
              Catálogo
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
              <button
                onClick={() =>
                  setFormManufacturado(new ArticuloManufacturado())
                }
                className="bg-[#D93F21] hover:bg-[#B8341B] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <h2>Agregar</h2>
                <img className="h-4 w-4" src="/svg/Agregar.svg" alt="Agregar" />
              </button>

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
            </div>
          </div>

          {loading ? (
            <LoadingTable nombre="artículos manufacturados" />
          ) : (
            <div className="w-full pb-6">
              {/**Cabecera */}
              <div className="text-sm md:text-base w-full grid grid-cols-5 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
                <h1 className="p-4 text-center">Categoría</h1>
                <h1 className="p-4 text-center">Nombre</h1>
                <h1 className="p-4 text-center">Precio</h1>
                <h1 className="p-4 text-center">Publicado</h1>
                <h1 className="p-4 text-center">Acciones</h1>
              </div>

              {/**Articulos */}
              {articulosManufacturadosMostrados.length > 0 &&
                articulosManufacturadosMostrados.map((articulo, index) => {
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
                          <h3 className="text-gray-700 truncate">
                            {articulo.subcategoria.categoria?.denominacion}
                          </h3>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <h3 className="text-gray-700 truncate">
                            {articulo.nombre}
                          </h3>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <h3 className="font-semibold text-emerald-600">
                            ${articulo.precio}
                          </h3>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <div
                            className={`${
                              articulo.existe ? "bg-green-600" : "bg-gray-500"
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
                            onClick={() => setFormManufacturado(articulo)}
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
                            title={articulo.existe ? "Desactivar" : "Activar"}
                            disabled={loadingCambio}
                          >
                            <img
                              className="h-7 w-7"
                              src={`/svg/${
                                articulo.existe
                                  ? "LogoBorrar.svg"
                                  : "LogoActivar.svg"
                              }`}
                              alt={articulo.existe ? "Desactivar" : "Activar"}
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
                    articulosManufacturadosMostrados.length
                      ? paginaSeleccionada * cantidadPorPagina
                      : articulosManufacturadosMostrados.length}{" "}
                    de {articulosManufacturadosMostrados.length}
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
                            articulosManufacturadosMostrados.length /
                              cantidadPorPagina
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
                          articulosManufacturadosMostrados.length /
                            cantidadPorPagina
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

        {/**MostrarManufacturado */}
        <div className={`${!mostrarArticulo && "hidden"}`}>
          <AdminMostrarManufacturado
            articulo={mostrarArticulo}
            abrirEditar={setFormManufacturado}
            cerrarMostrar={cerrarDetalle}
          />
        </div>

        {/**Editar, crear manufacturado */}
        <div className={`${!formManufacturado && "hidden"}`}>
          <AdminFormManufacturado
            articulo={formManufacturado}
            cargarAdminCatalogo={cargarManufacturados}
            cerrarEditar={cerrarForm}
          />
        </div>
      </div>
    </>
  );
}
