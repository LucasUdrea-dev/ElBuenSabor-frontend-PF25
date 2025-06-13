import React from 'react';
import { Pedido } from "../../ts/Clases";

  interface DetallePedidoProps {
    pedido: Pedido;
    onClose: () => void;
  }

  const DetallePedido: React.FC<DetallePedidoProps> = ({ 
    pedido, 
    onClose
  }) => {

  const calcularSubtotal = (): number => {
    const detallePedidoList = pedido.detallePedidoList || [];
    const detallePromocionList = pedido.detallePromocionList || [];

    const totalArticulos = detallePedidoList.reduce((total, detalle) => {
      const precio = detalle.articulo?.precio || 0;
      return total + (precio * detalle.cantidad);
    }, 0);

    const totalPromociones = detallePromocionList.reduce((total, detallePromo) => {
      const precio = detallePromo.promocion?.precioRebajado || 0;
      return total + (precio * detallePromo.cantidad);
    }, 0);

    return totalArticulos + totalPromociones;
  };

  const calcularDelivery = (): number => {
    const esDelivery = pedido.direccionPedido !== null && pedido.direccionPedido !== undefined;
    
    if (!esDelivery) {
      return 0; // Sin costo de delivery para retiro en local
    }

    const subtotal = calcularSubtotal();
    // El delivery es el 10% del subtotal según tu lógica original
    return subtotal * 0.1;
  };



  const calcularTotal = (): number => {
    return calcularSubtotal() + calcularDelivery();
  };



  const formatearHoraEntrega = (): string => {
    if (!pedido.tiempoEstimado) return 'No especificado';
    
    if (typeof pedido.tiempoEstimado === 'string') {
      if (pedido.tiempoEstimado === "0 minutos" || !pedido.tiempoEstimado) {
        return 'No especificado';
      }
      return `En ${pedido.tiempoEstimado}`;
    }

      // Si es una fecha
      try {
        const fecha = new Date(pedido.tiempoEstimado);
        if (isNaN(fecha.getTime())) {
          return 'No especificado';
        }
        return fecha.toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'No especificado';
      }
    };

  

  const esDelivery = (): boolean => {
  return pedido.tipoEnvio?.tipoDelivery === 'DELIVERY';
  };

  const formatearDireccion = (direccion: any): string => {
    if (!direccion) return '';
    
    const ciudad = direccion.ciudad?.nombre || '';
    const provincia = direccion.ciudad?.provincia?.nombre || '';
    
    return `${direccion.nombreCalle || ''} ${direccion.numeracion || ''}, ${ciudad}, ${provincia}`.trim();
  };

  const obtenerDireccionEntrega = (): string => {
    if (esDelivery()) {
      // dirección del cliente
      const direccionCliente = pedido.direccionPedido?.direccion;
      return direccionCliente ? formatearDireccion(direccionCliente) : 'Dirección de entrega no especificada';
    } else {
      // dirección de sucursal
      const direccionSucursal = pedido.sucursal?.direccion;
      return direccionSucursal ? formatearDireccion(direccionSucursal) : 'Dirección de sucursal no especificada';
    }
  };

  const obtenerTipoEntrega = (): string => {
    return esDelivery() ? 'Delivery' : 'Retiro en local';
  };

  


  const obtenerFormaPago = (): string => {
    if (!pedido.tipoPago || !pedido.tipoPago.tipoPago) {
      return 'Forma de pago no especificada';
    }
    
    // Formatear el tipo de pago para mostrarlo más amigable
    const tipoPago = pedido.tipoPago.tipoPago;
    
    switch (tipoPago) {
      case 'CASH':
        return 'Efectivo';
      case 'MERCADOPAGO':
        return 'MercadoPago';
      default:
        return tipoPago;
    }
  };


  const formatearFecha = (fecha: Date | string | undefined): string => {
    if (!fecha) return 'Fecha no disponible';
    
    try {
      const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
      
      if (isNaN(fechaObj.getTime())) {
        return 'Fecha no válida';
      }
      
      return fechaObj.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Factura - Orden #{pedido.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Información del pedido */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Información del pedido</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Fecha:</strong> {formatearFecha(pedido.fecha)}</p>
              <p><strong>Estado:</strong> {pedido.estadoPedido?.nombreEstado || 'No especificado'}</p>
              <p><strong>Tipo:</strong> {obtenerTipoEntrega()}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Su orden */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Detalle de productos</h3>
            <div className="space-y-2">
              {(pedido.detallePedidoList || []).map((detalle, index) => (
                <div key={`articulo-${index}`} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {detalle.cantidad} × {detalle.articulo?.nombre || 'Artículo'}
                  </span>
                  <span className="text-gray-700">
                    ${((detalle.articulo?.precio || 0) * detalle.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
              
              {(pedido.detallePromocionList || []).map((detallePromo, index) => (
                <div key={`promo-${index}`} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {detallePromo.cantidad} × {detallePromo.promocion?.denominacion || 'Promoción'}
                    <span className="text-xs text-red-600 ml-1">(Oferta)</span>
                  </span>
                  <span className="text-gray-700">
                    ${((detallePromo.promocion?.precioRebajado || 0) * detallePromo.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Mensaje si no hay productos */}
              {(!pedido.detallePedidoList?.length && !pedido.detallePromocionList?.length) && (
                <div className="text-sm text-gray-500 italic">
                  No hay productos en este pedido
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Totales */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-700">${calcularSubtotal().toFixed(2)}</span>
            </div>
            
            {obtenerTipoEntrega() === 'Delivery' && (
              <div className="flex justify-between">
                <span className="text-gray-700">Delivery (10%)</span>
                <span className="text-gray-700">${calcularDelivery().toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span className="text-gray-800">TOTAL</span>
              <span className="text-gray-800">${calcularTotal().toFixed(2)}</span>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Detalles de entrega */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Detalles de entrega</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>{obtenerTipoEntrega()}</strong></p>
              <p><strong>Dirección:</strong> {obtenerDireccionEntrega()}</p>
              {obtenerTipoEntrega() === 'Delivery' && (
                <p><strong>Tiempo estimado:</strong> {formatearHoraEntrega()}</p>
              )}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Forma de pago */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Forma de pago</h3>
            <p className="text-sm text-gray-600">{obtenerFormaPago()}</p>
          </div>

          {/* Cliente */}
          {pedido.usuario && (
            <>
              <hr className="border-gray-200" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Cliente</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nombre:</strong> {pedido.usuario.nombre} {pedido.usuario.apellido}</p>
                  <p><strong>Email:</strong> {pedido.usuario.email}</p>
                  {pedido.usuario.telefono && (
                    <p><strong>Teléfono:</strong> {pedido.usuario.telefono}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;