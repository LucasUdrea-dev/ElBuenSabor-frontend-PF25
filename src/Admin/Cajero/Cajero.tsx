import { useEffect, useState } from "react";
import {
  axiosConfig,
  EstadosPedidosEnum,
  host,
  Pedido,
} from "../../../ts/Clases";
import axios from "axios";
import { usePedidosSocket } from "../../services/websocket/usePedidosSocket";
import { LoadingTable } from "../../components/LoadingTable.tsx";

const ESTADOS_CAJERO = [
  EstadosPedidosEnum.INCOMING,
  EstadosPedidosEnum.STANDBY,
  EstadosPedidosEnum.READY,
  EstadosPedidosEnum.REJECTED,
  EstadosPedidosEnum.CANCELLED,
];

export default function Cajero() {
  const { pedidos, setPedidos } = usePedidosSocket(
    "/topic/dashboard/cajero",
    ESTADOS_CAJERO
  );

  const [pedidosMostrados, setPedidosMostrados] = useState<Pedido[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [loadingCambio, setLoadingCambio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<
    "TODOS" | "INCOMING" | "READY" | "STANDBY" | "REJECTED" | "CANCELLED"
  >("TODOS");

  const cantidadPorPagina = 10;

  const cargarPedidos = async () => {
    const URL = `${host}/api/pedidos/all`;
    setLoading(true);
    try {
      const response = await axios.get(URL, axiosConfig);
      setPedidos(
        response.data.filter((pedido: Pedido) =>
          ESTADOS_CAJERO.includes(pedido.estadoPedido.nombreEstado)
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    cargarPedidos();
  }, []);

  const cambiarEstadoPedido = async (
    pedido: Pedido,
    nuevoEstado: EstadosPedidosEnum
  ) => {
    const URL = `${host}/api/pedidos/${pedido.id}/estado?estado=${nuevoEstado}`;
    setLoadingCambio(true);

    try {
      await axios.put(URL, "nada", axiosConfig);

      if (!ESTADOS_CAJERO.includes(nuevoEstado)) {
        setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
      }
    } catch (error) {
      alert("Error al cambiar el estado del pedido");
    } finally {
      setLoadingCambio(false);
    }
  };

  const avanzar = (pedido: Pedido) => {
    switch (pedido.estadoPedido.nombreEstado) {
      case EstadosPedidosEnum.INCOMING:
        return cambiarEstadoPedido(pedido, EstadosPedidosEnum.PREPARING);
      case EstadosPedidosEnum.STANDBY:
        return cambiarEstadoPedido(pedido, EstadosPedidosEnum.INCOMING);
      case EstadosPedidosEnum.READY:
        if (pedido.tipoEnvio.tipoDelivery === "TAKEAWAY") {
          return cambiarEstadoPedido(pedido, EstadosPedidosEnum.DELIVERED);
        }else{
          return cambiarEstadoPedido(pedido, EstadosPedidosEnum.DELIVERING);
        }
    }
  };

  const rechazar = (pedido: Pedido) => {
    return cambiarEstadoPedido(pedido, EstadosPedidosEnum.REJECTED);
  };

  const enEspera = (pedido: Pedido) => {
    return cambiarEstadoPedido(pedido, EstadosPedidosEnum.STANDBY);
  };

  useEffect(() => {
    let filtrado: Pedido[] = pedidos;

    // Filtrar por estado
    if (filtroEstado === "CANCELLED") {
      filtrado = filtrado.filter(
        (pedido) =>
          pedido.estadoPedido.nombreEstado === "REJECTED" ||
          pedido.estadoPedido.nombreEstado === "CANCELLED"
      );
    } else if (filtroEstado !== "TODOS") {
      filtrado = filtrado.filter(
        (pedido) => pedido.estadoPedido.nombreEstado === filtroEstado
      );
    }

    // Filtrar por búsqueda de número de orden
    if (buscador) {
      filtrado = filtrado.filter(
        (pedido) =>
          pedido.id?.toString().includes(buscador) ||
          pedido.usuario.nombre
            .toLowerCase()
            .includes(buscador.toLowerCase()) ||
          pedido.usuario.apellido.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setPedidosMostrados(filtrado);
  }, [pedidos, buscador, filtroEstado]);

  // Funcion para pasar de ingles a español
  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "INCOMING":
        return "Entrante";
      case "READY":
        return "Listo";
      case "STANDBY":
        return "En Espera";
      case "REJECTED":
        return "Rechazado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "INCOMING":
        return "#D93F21";
      case "READY":
        return "#10B981";
      case "STANDBY":
        return "#065F46";
      case "REJECTED":
        return "#EF4444";
      case "CANCELLED":
        return "#EF4444";
      default:
        return "#878787";
    }
  };

  // Funcion para pasar de ingles a español
  const getTipoEnvioTexto = (tipoEnvio: string) => {
    return tipoEnvio === "DELIVERY" ? "Delivery" : "Retiro";
  };

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-8 px-4 font-['Lato']">
        {/**Tabla */}
        <div className="bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl">
          {/**Titulo, filtros y buscador */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">Cajero</h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-stretch sm:items-center">
              {/**Filtros por estado como botones */}
              <div className="flex flex-wrap gap-2 font-lato">
                <button
                  onClick={() => setFiltroEstado("TODOS")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "TODOS"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroEstado("INCOMING")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "INCOMING"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  Entrantes
                </button>
                <button
                  onClick={() => setFiltroEstado("READY")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "READY"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  Listos
                </button>
                <button
                  onClick={() => setFiltroEstado("STANDBY")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "STANDBY"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  En Espera
                </button>
                <button
                  onClick={() => setFiltroEstado("CANCELLED")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "CANCELLED"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  Cancelados
                </button>
              </div>

              {/**Buscador con icono */}
              <div className="relative">
                <input
                  onChange={(e) => setBuscador(e.target.value)}
                  className="bg-[#878787] text-white pl-10 pr-4 py-2 rounded-lg font-lato text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all w-full sm:w-auto"
                  placeholder="Cliente..."
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
            <LoadingTable nombre="pedidos" />
          ) : (
            <div className="w-full pb-6">
              {/**Cabecera */}
              <div className="text-sm md:text-base w-full grid grid-cols-5 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
                <h1 className="p-4 text-center">Orden N°</h1>
                <h1 className="p-4 text-center">Cliente</h1>
                <h1 className="p-4 text-center">Envío</h1>
                <h1 className="p-4 text-center">Tiempo Est.</h1>
                <h1 className="p-4 text-center">Estado y Acciones</h1>
              </div>

              {/**Pedidos */}
              {pedidosMostrados.length > 0 &&
                pedidosMostrados.map((pedido, index) => {
                  if (
                    index < paginaSeleccionada * cantidadPorPagina &&
                    index >= cantidadPorPagina * (paginaSeleccionada - 1)
                  ) {
                    return (
                      <div
                        key={pedido.id}
                        className="text-sm md:text-base w-full grid grid-cols-5 border-b border-gray-100 hover:bg-gray-50 transition-colors font-lato"
                      >
                        <div className="p-4 flex items-center justify-center">
                          <h3 className="font-semibold text-gray-800">
                            #{pedido.id}
                          </h3>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <h3 className="text-gray-700">
                            {pedido.usuario.nombre} {pedido.usuario.apellido}
                          </h3>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <h3 className="text-gray-700">
                            {getTipoEnvioTexto(pedido.tipoEnvio.tipoDelivery)}
                          </h3>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <h3 className="text-gray-700">
                            {pedido.tiempoEstimado} min
                          </h3>
                        </div>
                        <div className="p-4 flex items-center justify-center gap-2">
                          <div
                            className="text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center shadow-md"
                            style={{
                              minWidth: "100px",
                              backgroundColor: getColorEstado(
                                pedido.estadoPedido.nombreEstado
                              ),
                            }}
                          >
                            {getEstadoTexto(pedido.estadoPedido.nombreEstado)}
                          </div>
                          {pedido.estadoPedido.nombreEstado !== "REJECTED" &&
                            pedido.estadoPedido.nombreEstado !== "CANCELLED" && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => rechazar(pedido)}
                                  className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                                    loadingCambio
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  title="Rechazar"
                                  disabled={loadingCambio}
                                >
                                  <img
                                    className="h-7 w-7"
                                    src="/svg/EstadoNegativo.svg"
                                    alt="Rechazar"
                                  />
                                </button>
                                {pedido.estadoPedido.nombreEstado !==
                                  EstadosPedidosEnum.STANDBY && (
                                  <button
                                    onClick={() => enEspera(pedido)}
                                    className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                                      loadingCambio
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    title="En Espera"
                                    disabled={loadingCambio}
                                  >
                                    <img
                                      className="h-7 w-7"
                                      src="/img/EstadoEspera.png"
                                      alt="En Espera"
                                    />
                                  </button>
                                )}
                                <button
                                  onClick={() => avanzar(pedido)}
                                  className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                                    loadingCambio
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  title="Avanzar"
                                  disabled={loadingCambio}
                                >
                                  <img
                                    className="h-7 w-7"
                                    src="/svg/EstadoPositivo.svg"
                                    alt="Preparar"
                                  />
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  }
                })}

              {/**Mensaje cuando no hay pedidos */}
              {pedidosMostrados.length === 0 && (
                <div className="text-base text-center py-12 text-gray-500 font-lato">
                  No se encontraron pedidos con los filtros aplicados
                </div>
              )}

              {/**Paginacion */}
              {pedidosMostrados.length > 0 && (
                <div className="text-gray-600 flex items-center justify-between px-6 pt-6 gap-4 text-sm font-lato flex-wrap">
                  {/**Informacion pedidos mostrados y totales */}
                  <div className="flex items-center">
                    <h4>
                      {paginaSeleccionada * cantidadPorPagina -
                        cantidadPorPagina +
                        1}
                      -
                      {paginaSeleccionada * cantidadPorPagina <
                      pedidosMostrados.length
                        ? paginaSeleccionada * cantidadPorPagina
                        : pedidosMostrados.length}{" "}
                      de {pedidosMostrados.length}
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
                              pedidosMostrados.length / cantidadPorPagina
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
                            pedidosMostrados.length / cantidadPorPagina
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
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
