import { useEffect, useState } from "react";
import {
  axiosConfig,
  EstadosPedidosEnum,
  host,
  Pedido,
} from "../../../ts/Clases";
import axios from "axios";
import { usePedidosSocket } from "../../services/websocket/usePedidosSocket";
import DetalleRepartidor from "./DetalleRepartidor";
import { LoadingTable } from "../../components/LoadingTable.tsx";

const ESTADOS_REPARTIDOR = [EstadosPedidosEnum.DELIVERING];

export default function Repartidor() {
  const { pedidos, setPedidos } = usePedidosSocket(
    "/topic/dashboard/delivery",
    ESTADOS_REPARTIDOR
  );

  const [pedidosMostrados, setPedidosMostrados] = useState<Pedido[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [loadingCambio, setLoadingCambio] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(
    null
  );

  const cantidadPorPagina = 10;

  const cargarPedidos = async () => {
    const URL = `${host}/api/pedidos/all`;
    setLoading(true);
    try {
      const response = await axios.get(URL, axiosConfig);
      setPedidos(
        response.data.filter((pedido: Pedido) =>
          ESTADOS_REPARTIDOR.includes(pedido.estadoPedido.nombreEstado)
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

      // Si el nuevo estado no está en la lista de observados, lo removemos localmente
      if (!ESTADOS_REPARTIDOR.includes(nuevoEstado)) {
        setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
      }
    } catch (error) {
      alert("Error al cambiar el estado del pedido");
    } finally {
      setLoadingCambio(false);
    }
  };

  const avanzar = (pedido: Pedido) => {
    if (pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERING) {
      return cambiarEstadoPedido(pedido, EstadosPedidosEnum.DELIVERED);
    }
  };

  const enEspera = (pedido: Pedido) => {
    if (pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERING) {
      return cambiarEstadoPedido(pedido, EstadosPedidosEnum.STANDBY);
    }
  };

  // Función para abrir el modal con el detalle del pedido
  const abrirDetallePedido = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
  };

  useEffect(() => {
    let filtrado: Pedido[] = pedidos;

    // Filtrar por búsqueda de número de orden o nombre de cliente
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
  }, [pedidos, buscador]);

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "DELIVERING":
        return "En Camino";
      case "DELIVERED":
        return "Entregado";
      default:
        return estado;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "DELIVERING":
        return "#D93F21";
      default:
        return "#878787";
    }
  };

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-8 px-4 font-['Lato']">
        {/**Contenedor Principal */}
        <div className="bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl overflow-hidden">
          {/**Titulo y buscador */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-lato font-bold text-gray-800">
              Repartidor
            </h1>

            <div className="w-full lg:w-auto flex justify-start lg:justify-end">
              {/**Buscador con icono */}
              <div className="relative w-full sm:w-auto max-w-xs">
                <input
                  onChange={(e) => setBuscador(e.target.value)}
                  className="bg-[#878787] text-white pl-10 pr-4 py-2 rounded-lg font-lato w-full text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
                  placeholder="Buscar cliente..."
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

          {/**Lista de Pedidos */}
          {loading ? (
            <LoadingTable nombre="pedidos" />
          ) : (
            <div className="w-full pb-6">
              {/**Cabecera (Solo visible en Desktop) */}
              <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-sm text-gray-700">
                <div className="text-center">Orden N°</div>
                <div className="text-center">Cliente</div>
                <div className="text-center">Dirección</div>
                <div className="text-center">Teléfono</div>
                <div className="text-center">Acciones</div>
              </div>

              {/**Pedidos */}
              <div className="flex flex-col gap-3 p-4 md:p-0 md:gap-0">
                {pedidosMostrados.length > 0 ? (
                  pedidosMostrados.map((pedido, index) => {
                    if (
                      index < paginaSeleccionada * cantidadPorPagina &&
                      index >= cantidadPorPagina * (paginaSeleccionada - 1)
                    ) {
                      return (
                        <div
                          key={pedido.id}
                          className="
                            flex flex-col md:grid md:grid-cols-5 md:gap-4 
                            bg-white p-4 
                            rounded-xl md:rounded-none shadow-md md:shadow-none
                            border border-gray-200 md:border-b md:border-x-0 md:border-t-0
                            hover:bg-gray-50 transition-colors
                          "
                        >
                          {/* Móvil: Encabezado de tarjeta */}
                          <div className="md:hidden w-full flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                            <span className="font-bold text-gray-800 text-sm">
                              Orden #{pedido.id}
                            </span>
                            <span
                              className="text-xs px-3 py-1 rounded-lg text-white font-medium shadow-md"
                              style={{
                                backgroundColor: getColorEstado(
                                  pedido.estadoPedido.nombreEstado
                                ),
                              }}
                            >
                              {getEstadoTexto(pedido.estadoPedido.nombreEstado)}
                            </span>
                          </div>

                          {/* Desktop: ID */}
                          <div className="hidden md:flex items-center justify-center p-4">
                            <h3 className="font-semibold text-gray-800 text-sm">
                              #{pedido.id}
                            </h3>
                          </div>

                          {/* Cliente */}
                          <div className="w-full md:w-auto flex md:items-center md:justify-center md:p-4 mb-2 md:mb-0">
                            <div className="md:hidden font-semibold text-gray-600 text-xs mr-2 min-w-[80px]">
                              Cliente:
                            </div>
                            <h3 className="text-sm text-gray-700 truncate">
                              {pedido.usuario.nombre} {pedido.usuario.apellido}
                            </h3>
                          </div>

                          {/* Dirección */}
                          <div className="w-full md:w-auto flex md:items-center md:justify-center md:p-4 mb-2 md:mb-0">
                            <div className="md:hidden font-semibold text-gray-600 text-xs mr-2 min-w-[80px]">
                              Dirección:
                            </div>
                            {pedido.direccionPedido?.direccion.nombreCalle ? (
                              <h3 className="text-sm text-gray-700 truncate">
                                {pedido.direccionPedido?.direccion.nombreCalle +
                                  " " +
                                  pedido.direccionPedido.direccion.numeracion +
                                  ", " +
                                  pedido.direccionPedido.direccion.ciudad.nombre}
                              </h3>
                            ) : (
                              <h3 className="text-sm text-gray-700 truncate">
                                Retiro
                              </h3>
                            )}
                          </div>

                          {/* Teléfono */}
                          <div className="w-full md:w-auto flex md:items-center md:justify-center md:p-4 mb-4 md:mb-0">
                            <div className="md:hidden font-semibold text-gray-600 text-xs mr-2 min-w-[80px]">
                              Teléfono:
                            </div>
                            <h3 className="text-sm text-gray-700">
                              {pedido.usuario.telefonoList?.[0]?.numero || "-"}
                            </h3>
                          </div>

                          {/* Estado y Acciones */}
                          <div className="w-full md:w-auto flex flex-col items-center justify-center md:p-4 gap-3">
                            {/* Estado */}
                            <div
                              className="hidden md:flex text-white px-3 py-1.5 rounded-lg text-xs font-medium items-center justify-center shadow-md"
                              style={{
                                minWidth: "100px",
                                backgroundColor: getColorEstado(
                                  pedido.estadoPedido.nombreEstado
                                ),
                              }}
                            >
                              {getEstadoTexto(pedido.estadoPedido.nombreEstado)}
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex gap-2 w-full md:w-auto justify-center items-center">
                              <button
                                onClick={() => abrirDetallePedido(pedido)}
                                className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                                title="Ver detalles y mapa"
                              >
                                <img
                                  className="h-7 w-7"
                                  src="/svg/DetallePreparacion.svg"
                                  alt="Ver detalles"
                                />
                              </button>

                              <button
                                onClick={() => enEspera(pedido)}
                                className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                                  loadingCambio
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title="Poner en espera"
                                disabled={loadingCambio}
                              >
                                <img
                                  className="h-7 w-7"
                                  src="/img/EstadoEspera.png"
                                  alt="En Espera"
                                />
                              </button>

                              <button
                                onClick={() => avanzar(pedido)}
                                className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                                  loadingCambio
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title="Marcar como Entregado"
                                disabled={loadingCambio}
                              >
                                <img
                                  className="h-7 w-7"
                                  src="/svg/EstadoPositivo.svg"
                                  alt="Entregado"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  <div className="text-base text-center py-12 text-gray-500 font-lato">
                    No hay pedidos en camino
                  </div>
                )}
              </div>

              {/**Paginacion */}
              {pedidosMostrados.length > 0 && (
                <div className="text-gray-600 flex items-center justify-between px-6 pt-6 gap-4 text-sm font-lato flex-wrap">
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

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaginaSeleccionada(1)}
                      className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                    >
                      <img
                        className="h-8 w-8"
                        src="/svg/PrimeraPagina.svg"
                        alt="Inicio"
                      />
                    </button>
                    <button
                      onClick={() =>
                        setPaginaSeleccionada((prev) =>
                          prev > 1 ? prev - 1 : prev
                        )
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
                        setPaginaSeleccionada((prev) =>
                          prev <
                          Math.ceil(pedidosMostrados.length / cantidadPorPagina)
                            ? prev + 1
                            : prev
                        )
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
                        alt="Fin"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle del Pedido */}
      {pedidoSeleccionado && (
        <DetalleRepartidor
          pedido={pedidoSeleccionado}
          isOpen={modalAbierto}
          onClose={cerrarModal}
        />
      )}
    </>
  );
}
