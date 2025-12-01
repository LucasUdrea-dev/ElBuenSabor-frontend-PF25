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

    try {
      await axios.put(URL, "nada", axiosConfig);
      
    } catch (error) {
      console.error("Error al anular pedido:", error);
      alert("Error al anular el pedido");
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
      <div className="bg-[#333333] w-full h-full py-10 font-['Lato']">
        {/**Tabla */}
        <div className="bg-white w-11/12 m-auto rounded-2xl">
          {/**Título, filtros y buscador */}
          <div className="flex justify-between p-6 h-2/12">
            <div className="flex items-center gap-4">
              <h1 className="pl-5 pt-2 text-4xl font-lato">Facturas</h1>
            </div>

            <div className="flex gap-5 pr-[2%] text-2xl items-center">
              {/**Filtros por estado como botones */}
              <div className="flex gap-2 items-center font-lato pr-10">
                <span className="text-black font-medium font-lato pr-5">
                  Filtrar por:
                </span>
                <button
                  onClick={() => setFiltroEstado("TODAS")}
                  className={`px-4 py-2 rounded-4xl transition-colors ${
                    filtroEstado === "TODAS"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFiltroEstado("ACTIVA")}
                  className={`px-4 py-2 rounded-4xl transition-colors ${
                    filtroEstado === "ACTIVA"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white"
                  }`}
                >
                  Activas
                </button>
                <button
                  onClick={() => setFiltroEstado("ANULADA")}
                  className={`px-4 py-2 rounded-4xl transition-colors ${
                    filtroEstado === "ANULADA"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white"
                  }`}
                >
                  Anuladas
                </button>
              </div>

              {/**Buscador con icono */}
              <div className="relative">
                <input
                  onChange={(e) => setBuscador(e.target.value)}
                  className="bg-[#878787] text-white pl-12 pr-5 py-2 rounded-4xl font-lato"
                  placeholder="Buscar..."
                  type="text"
                />
                <img
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  src="/svg/LupaBuscador.svg"
                  alt="Buscar"
                />
              </div>
            </div>
          </div>

          {/**Tabla CRUD pedidos/facturas */}
          <div className="w-full pb-10">
            {/**Cabecera */}
            <div className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center font-lato">
              <h1>Nro. Orden</h1>
              <h1>Fecha</h1>
              <h1>Monto</h1>
              <h1>Cliente</h1>
              <h1>Acciones</h1>
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
                      className="text-3xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center font-lato"
                    >
                      <div>
                        <h3>#{pedido.id}</h3>
                      </div>
                      <div>
                        <h3>{formatearFecha(pedido.fecha)}</h3>
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-600">
                          {formatearMonto(calcularTotal(pedido))}
                        </h3>
                      </div>
                      <div>
                        <h3>{pedido.usuario.nombre} {pedido.usuario.apellido}</h3>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <div
                          className={`text-white px-3 py-3 rounded-4xl text-2xl ${
                            pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERED
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: "120px", height: "50px" }}
                        >
                          {pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERED ? "Activa" : "Anulada"}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirDetalleFactura(pedido)}
                            className="hover:opacity-80 transition-opacity"
                            title="Ver detalles"
                          >
                            <img
                              className="h-10 w-10"
                              src="/svg/DetallePreparacion.svg"
                              alt="Ver detalles"
                            />
                          </button>
                          <button
                            onClick={() => anularPedido(pedido)}
                            disabled={pedido.estadoPedido.nombreEstado !== EstadosPedidosEnum.DELIVERED}
                            className="disabled:opacity-50 hover:opacity-80 transition-opacity"
                            title="Anular factura"
                          >
                            <img
                              className="h-10 w-10"
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
              <div className="text-3xl text-center py-10 text-gray-500 font-lato">
                No se encontraron facturas con los filtros aplicados
              </div>
            )}

            {/**Paginación */}
            {pedidosMostrados.length > 0 && (
              <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10 font-lato">
                {/**Información pedidos mostrados y totales */}
                <div className="h-10 flex items-center">
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
                        Math.ceil(pedidosMostrados.length / cantidadPorPagina)
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
                      Math.ceil(pedidosMostrados.length / cantidadPorPagina)
                    )
                  }
                >
                  <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
                </button>
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
