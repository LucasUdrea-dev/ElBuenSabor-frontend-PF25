import { useEffect, useState } from "react";
import { axiosConfig, host, Promocion } from "../../../ts/Clases.ts"; // Adjust the path as needed

import axios from "axios";
import AdminMostrarPromocion from "./AdminMostrarPromocion.tsx";
import AdminFormPromocion from "./AdminFormPromocion.tsx";
import { LoadingTable } from "../../components/LoadingTable.tsx";

export default function AdminPromocion() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [promocionesMostradas, setPromocionesMostradas] = useState<Promocion[]>(
    []
  );
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [mostrarPromocion, setMostrarPromocion] = useState<Promocion | null>(
    null
  );
  const [formPromocion, setFormPromocion] = useState<Promocion | null>(null);
  const [loadingCambio, setLoadingCambio] = useState(false);
  const [loading, setLoading] = useState(false);

  const cantidadPorPagina = 10;

  useEffect(() => {
    cargarPromociones();
  }, []);

  const borradoLogico = async (promocion: Promocion) => {
    const URL = host + `/api/promociones/${promocion.id}`;

    promocion.existe = !promocion.existe;
    setLoadingCambio(true);

    try {
      const response = await axios.put(URL, promocion, axiosConfig);

      console.log("Se borro logicamente el articulo: " + response.status);
      cargarPromociones();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCambio(false);
    }
  };

  const cerrarDetalle = () => {
    setMostrarPromocion(null);
  };

  const cerrarForm = () => {
    setFormPromocion(null);
  };

  const cargarPromociones = async () => {
    const URL = host + "/api/promociones";
    setLoading(true);
    try {
      const response = await axios.get(URL);
      setPromociones(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtrado: Promocion[] = promociones;

    if (buscador) {
      filtrado = filtrado.filter((promocion) =>
        promocion.denominacion.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setPromocionesMostradas(filtrado);
  }, [promociones, buscador]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-8 px-4">
        {/**Tabla */}
        <div
          className={`bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl ${
            (mostrarPromocion || formPromocion) && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">
              Promociones
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
              <button
                onClick={() => setFormPromocion(new Promocion())}
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
            <LoadingTable nombre="promociones" />
          ) : (
            <div className="w-full pb-6">
              {/**Cabecera */}
              <div className="text-sm md:text-base w-full grid grid-cols-5 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
                <h1 className="p-4 text-center">Imagen</h1>
                <h1 className="p-4 text-center">Nombre</h1>
                <h1 className="p-4 text-center">Precio</h1>
                <h1 className="p-4 text-center">Publicado</h1>
                <h1 className="p-4 text-center">Acciones</h1>
              </div>

              {/**Articulos */}
              {promocionesMostradas.length > 0 &&
                promocionesMostradas.map((promocion, index) => {
                  if (
                    index < paginaSeleccionada * cantidadPorPagina &&
                    index >= cantidadPorPagina * (paginaSeleccionada - 1)
                  ) {
                    return (
                      <div
                        key={promocion.id}
                        className="text-sm md:text-base w-full grid grid-cols-5 border-b border-gray-100 hover:bg-gray-50 transition-colors font-lato"
                      >
                        <div className="p-4 flex items-center justify-center">
                          <div
                            className="w-16 h-16 bg-cover bg-no-repeat bg-center rounded-lg shadow-sm"
                            style={{
                              backgroundImage: `url('${promocion.imagen}')`,
                            }}
                          ></div>
                        </div>

                        <div className="p-4 flex items-center justify-center">
                          <h3 className="text-gray-700 truncate">
                            {promocion.denominacion}
                          </h3>
                        </div>

                        <div className="p-4 flex items-center justify-center">
                          <h3 className="font-semibold text-emerald-600">
                            ${promocion.precioRebajado}
                          </h3>
                        </div>

                        <div className="p-4 flex items-center justify-center">
                          <div
                            className={`${
                              promocion.existe ? "bg-green-600" : "bg-gray-500"
                            } h-4 w-4 rounded-full shadow-sm`}
                          ></div>
                        </div>

                        <div className="p-4 flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setMostrarPromocion(promocion)}
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
                            onClick={() => setFormPromocion(promocion)}
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
                              borradoLogico(promocion);
                            }}
                            className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                              loadingCambio
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title={promocion.existe ? "Desactivar" : "Activar"}
                            disabled={loadingCambio}
                          >
                            <img
                              className="h-7 w-7"
                              src={`/svg/${
                                promocion.existe
                                  ? "LogoBorrar.svg"
                                  : "LogoActivar.svg"
                              }`}
                              alt={promocion.existe ? "Desactivar" : "Activar"}
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
                    promocionesMostradas.length
                      ? paginaSeleccionada * cantidadPorPagina
                      : promocionesMostradas.length}{" "}
                    de {promocionesMostradas.length}
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
                            promocionesMostradas.length / cantidadPorPagina
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
                          promocionesMostradas.length / cantidadPorPagina
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
        <div className={`${!mostrarPromocion && "hidden"}`}>
          <AdminMostrarPromocion
            promocion={mostrarPromocion}
            abrirEditar={setFormPromocion}
            cerrarMostrar={cerrarDetalle}
          />
        </div>

        {/**Editar, crear manufacturado */}
        <div className={`${!formPromocion && "hidden"}`}>
          <AdminFormPromocion
            promocion={formPromocion}
            cargarAdminCatalogo={cargarPromociones}
            cerrarEditar={cerrarForm}
          />
        </div>
      </div>
    </>
  );
}
