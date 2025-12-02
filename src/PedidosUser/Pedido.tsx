import React, { useState } from "react";
import axios from "axios";
import { Pedido, host, EstadosPedidosEnum } from "../../ts/Clases";
import DetallePedido from "./DetallePedido";

interface PedidoProps {
  pedido: Pedido;
  tipo: "pendientes" | "pasadas";
  formatearFecha: (fecha: Date | undefined) => string;
  formatearHora: (fecha: Date | undefined) => string;
  onPedidoActualizado?: () => void;
}

const PedidoComponent: React.FC<PedidoProps> = ({
  pedido,
  tipo,
  onPedidoActualizado,
}) => {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [cargandoRepetir, setCargandoRepetir] = useState(false);

  const API_BASE_URL = `${host}/api`;

  const obtenerEstadoTexto = (estado: string): string => {
    switch (estado) {
      case EstadosPedidosEnum.READY: // Antes tiposEstadoPedido[6]
      case EstadosPedidosEnum.DELIVERING: // Antes tiposEstadoPedido[8]
        if (pedido.tipoEnvio.tipoDelivery === "DELIVERY") {
          return "En camino";
        }
        return "Para retirar";
      case EstadosPedidosEnum.DELIVERED: // Antes tiposEstadoPedido[5]
        return "Entregado";
      case EstadosPedidosEnum.CANCELLED: // Antes tiposEstadoPedido[2]
        return "Cancelado";
      case EstadosPedidosEnum.REJECTED: // Antes tiposEstadoPedido[3]
        return "Rechazado";
      case EstadosPedidosEnum.INCOMING: // Antes tiposEstadoPedido[4]
        return "Entrante";
      case EstadosPedidosEnum.STANDBY: // Antes tiposEstadoPedido[1]
        return "En espera";
      case EstadosPedidosEnum.PREPARING: // Antes tiposEstadoPedido[0]
        return "En preparacion";
      default:
        return "Desconocido";
    }
  };

  const obtenerColorEstado = (estado: string): string => {
    switch (estado) {
      case EstadosPedidosEnum.PREPARING:
      case EstadosPedidosEnum.READY:
      case EstadosPedidosEnum.DELIVERING:
        return "text-blue-600 bg-blue-100";

      case EstadosPedidosEnum.DELIVERED:
        return "text-green-600 bg-green-100";

      case EstadosPedidosEnum.CANCELLED:
      case EstadosPedidosEnum.REJECTED:
        return "text-red-600 bg-red-100";

      case EstadosPedidosEnum.STANDBY:
      case EstadosPedidosEnum.INCOMING:
        return "text-gray-600 bg-gray-100";

      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const obtenerTipoEnvio = (): string => {
    if (pedido.direccionPedido) {
      return "Envío a domicilio";
    }
    return "Retiro en local";
  };

  const handleRepetirOrden = async () => {
    setCargandoRepetir(true);
    try {
      const nuevoPedidoDTO = {
        detallePedidoList: pedido.detallePedidoList.map((detalle) => ({
          cantidad: detalle.cantidad,
          articulo: { id: detalle.articulo?.id },
        })),
        detallePromocionList: pedido.detallePromocionList.map((detalle) => ({
          cantidad: detalle.cantidad,
          promocion: { id: detalle.promocion.id },
        })),
        usuario: { id: pedido.usuario.id },
        sucursal: { id: pedido.sucursal.id },
        direccionPedido: pedido.direccionPedido
          ? {
              direccion: { id: pedido.direccionPedido.direccion.id },
            }
          : null,
        tipoEnvio: { id: pedido.tipoEnvio.id },
        tipoPago: { id: pedido.tipoPago.id },
      };

      const response = await axios.post(
        `${API_BASE_URL}/pedidos`,
        nuevoPedidoDTO
      );

      if (response.status === 201) {
        alert(`¡Orden repetida exitosamente! Nueva orden #${response.data.id}`);
        // Notificar al componente padre para que recargue los pedidos
        if (onPedidoActualizado) {
          onPedidoActualizado();
        }
      }
    } catch (error) {
      console.error("Error al repetir orden:", error);
      alert("Error al repetir la orden. Por favor, intenta de nuevo.");
    } finally {
      setCargandoRepetir(false);
    }
  };

  const obtenerHoraPedido = (fecha: Date | string | undefined): string => {
    if (!fecha) return "";

    try {
      const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);

      // Verificar si la fecha es válida
      if (isNaN(fechaObj.getTime())) {
        return "";
      }

      return fechaObj.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error al obtener hora:", error);
      return "";
    }
  };

  const obtenerTiempoInfo = (): string => {
    if (
      tipo === "pendientes" &&
      pedido.tiempoEstimado &&
      pedido.tiempoEstimado !== "0 minutos"
    ) {
      return `${new Date(
        new Date(pedido.fecha).getTime() +
          Number(pedido.tiempoEstimado) * 60 * 1000
      )
        .toLocaleTimeString()
        .slice(0, 5)} - ${obtenerTipoEnvio()}`;
    }
    return `${obtenerHoraPedido(pedido.fecha)} - ${obtenerTipoEnvio()}`;
  };

  return (
    <>
      <div className="bg-[#FAF8F5] text-[#262626] rounded-xl p-4 relative font-lato flex flex-col min-h-[280px]">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-5 bg-gray-200 px-4 py-2 rounded">
            <span className="text-base font-bold">ORDEN #{pedido.id}</span>
            <span
              className={`px-2 py-1 rounded text-sm font-semibold ${obtenerColorEstado(
                pedido.estadoPedido?.nombreEstado
              )}`}
            >
              {obtenerEstadoTexto(pedido.estadoPedido?.nombreEstado)}
            </span>
          </div>

          <div className="mb-3">
            <p className="text-sm text-[#555555]">{obtenerTiempoInfo()}</p>
            <p className="text-xs text-[#777777]">
              {`${new Date(pedido.fecha).toLocaleDateString()}`}
            </p>
          </div>

          {/* Lista de productos */}
          <div className="mb-4">
            {(pedido.detallePedidoList || []).map((detalle, index) => (
              <div
                key={`articulo-${index}`}
                className="text-sm text-[#333333] mb-1"
              >
                {detalle.cantidad} ×{" "}
                {detalle.articulo?.nombre || "Artículo desconocido"}
              </div>
            ))}

            {(pedido.detallePromocionList || []).map((detallePromo, index) => (
              <div
                key={`promo-${index}`}
                className="text-sm text-[#333333] mb-1 font-medium"
              >
                {detallePromo.cantidad} ×{" "}
                {detallePromo.promocion?.denominacion || "Promoción"}
                <span className="text-xs text-[#D93F21] ml-1">(Oferta)</span>
              </div>
            ))}

            {!pedido.detallePedidoList?.length &&
              !pedido.detallePromocionList?.length && (
                <div className="text-sm text-[#777777] italic">
                  No hay productos disponibles
                </div>
              )}
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          {tipo === "pasadas" && (
            <button
              onClick={() => setMostrarDetalle(true)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#262626] py-2 px-3 rounded text-sm transition-colors font-lato"
            >
              Ver Factura
            </button>
          )}
          <button
            onClick={handleRepetirOrden}
            disabled={cargandoRepetir}
            className={`flex-1 py-2 px-3 rounded text-sm transition-colors font-lato ${
              cargandoRepetir
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#D93F21] hover:bg-[#b9331a] text-white"
            }`}
          >
            {cargandoRepetir ? "Procesando..." : "Repetir Orden"}
          </button>
        </div>
      </div>

      {mostrarDetalle && (
        <DetallePedido
          pedido={pedido}
          onClose={() => setMostrarDetalle(false)}
        />
      )}
    </>
  );
};

export default PedidoComponent;
