import { useEffect, useState } from "react";
import DetalleFactura from "./DetalleFactura";
import {
  axiosConfig,
  EstadosPedidosEnum,
  host,
  Pedido,
} from "../../../ts/Clases";
import axios from "axios";
import { usePedidosSocket } from "../../services/websocket/usePedidosSocket";

const ESTADOS_FACTURAS = [
  EstadosPedidosEnum.DELIVERED,
  EstadosPedidosEnum.CANCELLED,
  EstadosPedidosEnum.REJECTED,
];

export default function Facturas() {
  const { pedidos, setPedidos } = usePedidosSocket(
    "/topic/dashboard/cajero",
    ESTADOS_FACTURAS
  );

  const [pedidosMostrados, setPedidosMostrados] = useState<Pedido[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<
    "TODAS" | "ACTIVA" | "ANULADA"
  >("TODAS");

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const cantidadPorPagina = 10;

  const cargarPedidos = async () => {
    const URL = `${host}/api/pedidos/all`;

    try {
      const response = await axios.get(URL, axiosConfig);
      setPedidos(
        response.data.filter((pedido: Pedido) =>
          ESTADOS_FACTURAS.includes(pedido.estadoPedido.nombreEstado)
        )
      );
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Función para anular pedido (cambiar estado a CANCELLED)
  const anularPedido = async (pedido: Pedido) => {
    const URL = `${host}/api/pedidos/${pedido.id}/estado?estado=${EstadosPedidosEnum.CANCELLED}`;
    setLoadingAction(true);

    try {
      await axios.put(URL, "nada", axiosConfig);
      
    } catch (error) {
      console.error("Error al anular pedido:", error);
      alert("Error al anular el pedido");
    } finally {
      setLoadingAction(false);
    }
  };

  // Función para abrir el modal con el detalle
  const abrirDetalleFactura = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
  };

  // Función auxiliar para calcular total (similar a DetalleFactura)
  const calcularTotal = (pedido: Pedido) => {
    let total = 0;
    
    if (pedido.detallePedidoList) {
        total += pedido.detallePedidoList.reduce((acc, detalle) => {
            return acc + (detalle.articulo?.precio || 0) * detalle.cantidad;
        }, 0);
    }

    if (pedido.detallePromocionList) {
        total += pedido.detallePromocionList.reduce((acc, detalle) => {
            return acc + (detalle.promocion.precioRebajado || 0) * detalle.cantidad;
        }, 0);
    }

    if (pedido.tipoEnvio.tipoDelivery === 'DELIVERY') {
        total = total * 1.10; // Aumentar un 10%
    }

    return total;
  };

  useEffect(() => {
    let filtrado: Pedido[] = pedidos;

    // Filtrar por estado (Mapeo de filtros visuales a estados reales)
    if (filtroEstado === "ACTIVA") {
      filtrado = filtrado.filter((pedido) => pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERED);
    } else if (filtroEstado === "ANULADA") {
      filtrado = filtrado.filter((pedido) => 
        pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.CANCELLED || 
        pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.REJECTED
      );
    }

    // Filtrar por búsqueda (número de orden o nombre de cliente)
    if (buscador) {
      filtrado = filtrado.filter(
        (pedido) =>
          pedido.id?.toString().includes(buscador) ||
          pedido.usuario.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
          pedido.usuario.apellido.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setPedidosMostrados(filtrado);
  }, [pedidos, buscador, filtroEstado]);

  // Función para formatear fecha
  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Función para formatear monto
  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(monto);
  };

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-8 px-4 font-['Lato']">
        {/**Tabla */}
        <div className="bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl">
          {/**Título, filtros y buscador */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">Facturas</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-stretch sm:items-center">
              {/**Filtros por estado como botones */}
              <div className="flex flex-wrap gap-2 items-center font-lato">
                <span className="text-gray-700 font-medium text-sm">
                  Filtrar por:
                </span>
                <button
                  onClick={() => setFiltroEstado("TODAS")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "TODAS"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFiltroEstado("ACTIVA")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "ACTIVA"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  Activas
                </button>
                <button
                  onClick={() => setFiltroEstado("ANULADA")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === "ANULADA"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white hover:bg-[#6a6a6a]"
                  }`}
                >
                  Anuladas
                </button>
              </div>

              {/**Buscador con icono */}
              <div className="relative">
                <input
                  onChange={(e) => setBuscador(e.target.value)}
                  className="bg-[#878787] text-white pl-10 pr-4 py-2 rounded-lg font-lato text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all w-full sm:w-auto"
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

          {/**Tabla CRUD pedidos/facturas */}
          <div className="w-full pb-6">
            {/**Cabecera */}
            <div className="text-sm md:text-base w-full grid grid-cols-5 bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
              <h1 className="p-4 text-center">Nro. Orden</h1>
              <h1 className="p-4 text-center">Fecha</h1>
              <h1 className="p-4 text-center">Monto</h1>
              <h1 className="p-4 text-center">Cliente</h1>
              <h1 className="p-4 text-center">Acciones</h1>
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
                        <h3 className="font-semibold text-gray-800">#{pedido.id}</h3>
                      </div>
                      <div className="p-4 flex items-center justify-center">
                        <h3 className="text-gray-700">{formatearFecha(pedido.fecha)}</h3>
                      </div>
                      <div className="p-4 flex items-center justify-center">
                        <h3 className="font-semibold text-emerald-600">
                          {formatearMonto(calcularTotal(pedido))}
                        </h3>
                      </div>
                      <div className="p-4 flex items-center justify-center">
                        <h3 className="text-gray-700">{pedido.usuario.nombre} {pedido.usuario.apellido}</h3>
                      </div>
                      <div className="p-4 flex items-center justify-center gap-2">
                        <div
                          className={`text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium shadow-md ${
                            pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERED
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                          style={{ minWidth: "90px" }}
                        >
                          {pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERED ? "Activa" : "Anulada"}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => abrirDetalleFactura(pedido)}
                            className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                            title="Ver detalles"
                          >
                            <img
                              className="h-7 w-7"
                              src="/svg/DetallePreparacion.svg"
                              alt="Ver detalles"
                            />
                          </button>
                          <button
                            onClick={() => anularPedido(pedido)}
                            disabled={pedido.estadoPedido.nombreEstado !== EstadosPedidosEnum.DELIVERED || loadingAction}
                            className={`disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${loadingAction ? "opacity-50 cursor-not-allowed" : ""}`}
                            title="Anular factura"
                          >
                            <img
                              className="h-7 w-7"
                              src="/svg/EstadoNegativo.svg"
                              alt="Anular"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

            {/**Mensaje cuando no hay pedidos */}
            {pedidosMostrados.length === 0 && (
              <div className="text-base text-center py-12 text-gray-500 font-lato">
                No se encontraron facturas con los filtros aplicados
              </div>
            )}

            {/**Paginación */}
            {pedidosMostrados.length > 0 && (
              <div className="text-gray-600 flex items-center justify-between px-6 pt-6 gap-4 text-sm font-lato flex-wrap">
                {/**Información pedidos mostrados y totales */}
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

                {/**Control de paginado a través de botones */}
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
                          Math.ceil(pedidosMostrados.length / cantidadPorPagina)
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
                        Math.ceil(pedidosMostrados.length / cantidadPorPagina)
                      )
                    }
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img className="h-8 w-8" src="/svg/UltimaPagina.svg" alt="Última" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalle de la Factura */}
      {pedidoSeleccionado && (
        <DetalleFactura
          pedido={pedidoSeleccionado}
          isOpen={modalAbierto}
          onClose={cerrarModal}
        />
      )}
    </>
  );
}
