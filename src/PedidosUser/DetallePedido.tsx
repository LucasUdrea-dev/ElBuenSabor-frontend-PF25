import React from 'react';
import { Pedido } from "../../ts/Clases";

interface DetallePedidoProps {
  pedido: Pedido;
  onClose: () => void;
  calcularTotal: () => number;
  obtenerTipoEnvio: () => string;
}

const DetallePedido: React.FC<DetallePedidoProps> = ({ 
  pedido, 
  onClose, 
  //calcularTotal,
  //obtenerTipoEnvio 
}) => {
  const calcularSubtotal = (): number => {
    return pedido.detallePedidoList.reduce((total, detalle) => {
      const precio = detalle.articulo?.precio || 0;
      return total + (precio * detalle.cantidad);
    }, 0);
  };

  const calcularDelivery = (): number => {
    // Lógica para calcular el costo de delivery
    // Esto debería venir de tu lógica de negocio
    return 50; // Valor ejemplo
  };

  const formatearHoraEntrega = (): string => {
    if (!pedido.tiempoEstimado) return '';
    return new Date(pedido.tiempoEstimado).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerDireccionEntrega = (): string => {
    // Esto debería venir de la información del usuario o del pedido
    return pedido.sucursal?.direccion?.nombreCalle || 'San Martín 454, Mendoza, Mendoza';
  };

  const obtenerFormaPago = (): string => {
    // Esto debería venir del tipo de pago del pedido
    return 'Contra reembolso'; // Valor por defecto
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Detalles de pedido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-6">
          {/* Su orden */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Su orden</h3>
            <div className="space-y-2">
              {pedido.detallePedidoList.map((detalle, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {detalle.cantidad} x {detalle.articulo?.nombre || 'Artículo'}
                  </span>
                  <span className="text-gray-700">
                    ${((detalle.articulo?.precio || 0) * detalle.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
              
              {pedido.detallePromocionList.map((detallePromo, index) => (
                <div key={`promo-${index}`} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {detallePromo.cantidad} x {detallePromo.promocion?.denominacion || 'Promoción'}
                  </span>
                  <span className="text-gray-700">
                    ${((detallePromo.promocion?.precioRebajado || 0) * detallePromo.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Totales */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-700">${calcularSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Delivery</span>
              <span className="text-gray-700">${calcularDelivery().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-gray-800">TOTAL</span>
              <span className="text-gray-800">${(calcularSubtotal() + calcularDelivery()).toFixed(2)}</span>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Detalles de entrega */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Detalles de entrega</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Delivery</strong> - {obtenerDireccionEntrega()}</p>
              <p>Su pedido llegará aproximadamente a las {formatearHoraEntrega()}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Forma de pago */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Forma de pago</h3>
            <p className="text-sm text-gray-600">{obtenerFormaPago()}</p>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default DetallePedido;