import React, { useState } from 'react';
import { Pedido, TypeState } from "../../ts/Clases";
import DetallePedido from "./DetallePedido";

interface PedidoProps {
  pedido: Pedido;
  tipo: 'pendientes' | 'pasadas';
  formatearFecha: (fecha: Date | undefined) => string;
  formatearHora: (fecha: Date | undefined) => string;
}

const PedidoComponent: React.FC<PedidoProps> = ({ 
  pedido, 
  tipo, 
  }) => {



  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const obtenerEstadoTexto = (estado: TypeState | undefined): string => {
    switch (estado) {
      case TypeState.EN_CAMINO:
        return 'En camino';
      case TypeState.LISTO:
        return 'Listo';
      case TypeState.ENTREGADO:
        return 'Entregado';
      case TypeState.CANCELADO:
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const obtenerColorEstado = (estado: TypeState | undefined): string => {
    switch (estado) {
      case TypeState.EN_CAMINO:
        return 'text-black-600';
      case TypeState.LISTO:
        return 'text-green-600';
      case TypeState.ENTREGADO:
        return 'text-black-600';
      case TypeState.CANCELADO:
        return 'text-red-600';
      default:
        return 'text-black-600';
    }
  };

  const calcularTotal = (): number => {
    // Calcular total de artículos
    const totalArticulos = pedido.detallePedidoList.reduce((total, detalle) => {
      const precio = detalle.articulo?.precio || 0;
      return total + (precio * detalle.cantidad);
    }, 0);

    // Calcular total de promociones
    const totalPromociones = pedido.detallePromocionList.reduce((total, detallePromo) => {
      const precio = detallePromo.promocion?.precioRebajado || 0;
      return total + (precio * detallePromo.cantidad);
    }, 0);

    return totalArticulos + totalPromociones;
  };

  const obtenerTipoEnvio = (): string => {
    // Determinar tipo de envío basado en la dirección de la sucursal
    if (pedido.sucursal?.direccion) {
      return 'Envío a domicilio';
    }
    return 'Retiro en local';
  };

  const handleRepetirOrden = () => {
    // Funcionalidad pendiente - se implementará cuando el carrito esté listo
    console.log('Repetir orden:', pedido.id);
    alert(`Funcionalidad en desarrollo. Orden #${pedido.id} agregada al carrito.`);
  };


    // Función para formatear fecha string
    const formatearFechaString = (fechaString: string): string => {
      try {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch (error) {
        return fechaString; // Si hay error, devolver el string original
      }
    };

    // Función para obtener hora de la fecha string
    const obtenerHoraPedido = (fechaString: string): string => {
      try {
        const fecha = new Date(fechaString);
        return fecha.toLocaleTimeString('es-AR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch (error) {
        return ''; // Si hay error, devolver string vacío
      }
    };

   return (
    <>
      <div className="bg-[#FAF8F5] text-[#262626] rounded-xl p-4 relative font-lato flex flex-col min-h-[280px]">
        {/* Contenido principal que ocupará el espacio disponible */}
        <div className="flex-1">
          {/* Header con número de orden y estado */}
            <div className="flex justify-between items-center mb-5 bg-gray-200 px-4 py-2 rounded">
            <span className="text-base font-bold ">ORDEN #{pedido.id}</span>
            <span className={`px-2 py-1 rounded text-sm text-black font-semibold ${obtenerColorEstado(pedido.estadoPedido?.nombre_estado)}`}>
              {obtenerEstadoTexto(pedido.estadoPedido?.nombre_estado)}
            </span>
          </div>

          {/* Información de hora y tipo de envío */}
          <div className="mb-3">
            <p className="text-sm text-[#555555]">
              {/* Mostrar tiempo estimado si es para pedidos pendientes, o hora del pedido si es pasado */}
              {tipo === 'pendientes' && pedido.tiempoEstimado !== "0 minutos" 
                ? `${pedido.tiempoEstimado} - ${obtenerTipoEnvio()}`
                : `${obtenerHoraPedido(pedido.fecha)} - ${obtenerTipoEnvio()}`
              }
            </p>
            <p className="text-xs text-[#777777]">
              {formatearFechaString(pedido.fecha)}
            </p>
          </div>

          {/* Lista de productos */}
          <div className="mb-4">
            {pedido.detallePedidoList.map((detalle, index) => (
              <div key={index} className="text-sm text-[#333333] mb-1">
                {detalle.cantidad} × {detalle.articulo?.nombre || 'Artículo desconocido'}
              </div>
            ))}
            {pedido.detallePromocionList.map((detallePromo, index) => (
              <div key={`promo-${index}`} className="text-sm text-[#333333] mb-1 font-medium">
                {detallePromo.cantidad} × {detallePromo.promocion?.denominacion || 'Promoción'} 
                <span className="text-xs text-[#D93F21] ml-1">(Oferta)</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mb-4">
            <p className="text-sm font-bold text-[#262626]">
              Total: ${calcularTotal().toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botones anclados abajo */}
        <div className="flex gap-2 mt-auto">
          {tipo === 'pasadas' && (
            <button
              onClick={() => setMostrarDetalle(true)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#262626] py-2 px-3 rounded text-sm transition-colors font-lato"
            >
              Ver Factura
            </button>
          )}
          <button
            onClick={handleRepetirOrden}
            className="flex-1 bg-[#D93F21] hover:bg-[#b9331a] text-white py-2 px-3 rounded text-sm transition-colors font-lato"
          >
            Repetir Orden
          </button>
        </div>
      </div>

      {/* Modal de detalle */}
      {mostrarDetalle && (
        <DetallePedido 
          pedido={pedido}
          onClose={() => setMostrarDetalle(false)}
          calcularTotal={calcularTotal}
          obtenerTipoEnvio={obtenerTipoEnvio}
        />
      )}
    </>
  );
};

export default PedidoComponent;