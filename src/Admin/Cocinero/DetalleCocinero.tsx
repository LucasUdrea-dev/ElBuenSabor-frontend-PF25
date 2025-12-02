import React, { useState } from 'react';
const LogoUser = '/svg/LogoUser.svg';
const LogoReloj = '/svg/LogoReloj.svg';
const LogoDetalle = '/svg/LogoDetalle.svg';
import { Pedido } from '../../../ts/Clases';

interface DetallePedidoProps {
  pedido: Pedido;
  isOpen: boolean;
  onClose: () => void;
}

const DetalleCocinero: React.FC<DetallePedidoProps> = ({ pedido, isOpen, onClose }) => {
  const [pestañaActiva, setPestañaActiva] = useState<'detalles' | 'productos'>('productos');

  if (!isOpen) return null;

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'INCOMING': return 'Entrante';
      case 'READY': return 'Listo';
      case 'STANDBY': return 'En Espera';
      case 'PREPARING': return 'Preparando';
      case 'REJECTED': return 'Rechazado';
      default: return estado;
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 font-lato">
      <div className="bg-white rounded-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#E9E9E9] rounded-t-2xl px-6 py-4 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl font-bold text-gray-800">Orden {pedido.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b px-6">
          <button
            onClick={() => setPestañaActiva('detalles')}
            className={`py-3 text-lg font-medium border-b-2 transition-colors mr-6 ${
              pestañaActiva === 'detalles'
                ? 'border-[#D93F21] text-[#D93F21]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Detalles
          </button>
          <button
            onClick={() => setPestañaActiva('productos')}
            className={`py-3 text-lg font-medium border-b-2 transition-colors ${
              pestañaActiva === 'productos'
                ? 'border-[#D93F21] text-[#D93F21]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Productos
          </button>
        </div>

        {/* Tab content */}
        <div className="px-6 space-y-6">
          {pestañaActiva === 'detalles' && (
            <div className="space-y-6">
              
              {/* Cliente */}
              <div className="bg-gray-50 p-6 border border-gray-300 rounded-none">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <img src={LogoUser} alt="Icono Cliente" className="mr-5 w-6 h-6" />

                  Cliente
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-800">{pedido.usuario.nombre} {pedido.usuario.apellido}</td>
                      <td className="py-3 px-4 text-gray-800">{pedido.usuario.email}</td>
                      <td className="py-3 px-4 text-gray-800">
                        {pedido.usuario.telefonoList && pedido.usuario.telefonoList.length > 0 
                          ? pedido.usuario.telefonoList[0].numero 
                          : '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Estado de la Orden */}
              <div className="bg-gray-50 p-6 border border-gray-300 rounded-none mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <img src={LogoReloj} alt="Icono Estado" className="mr-5 w-6 h-6" />

                  Estado de la Orden
                </h3>
                 <table className="table-auto w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado Actual</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4">
                        <span className="inline-block bg-[#878787] text-white px-3 py-1 rounded-lg text-sm">
                          {getEstadoTexto(pedido.estadoPedido.nombreEstado)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        {formatearFecha(pedido.fecha)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {pestañaActiva === 'productos' && (
            <div className="space-y-6 pb-6">
              {/* Productos */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <img src={LogoDetalle} alt="Icono Detalle" className="mr-5 w-6 h-6" />
                  Detalle de Productos
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Imagen</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Denominación</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.detallePedidoList.map((detalle, index) => (
                      <tr key={`prod-${index}`} className="border-b border-gray-200">
                        <td className="py-3 px-4">
                          <img
                            src={detalle.articulo?.imagenArticulo || '/img/hamburguesa.jpg'}
                            alt={detalle.articulo?.nombre}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-800 font-medium">{detalle.articulo?.nombre}</td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-800">
                          {detalle.cantidad}
                        </td>
                      </tr>
                    ))}
                     {pedido.detallePromocionList.map((detalle, index) => (
                      <tr key={`promo-${index}`} className="border-b border-gray-200 bg-yellow-50">
                        <td className="py-3 px-4">
                          <img
                            src={detalle.promocion?.imagen || '/img/hamburguesa.jpg'}
                            alt={detalle.promocion?.denominacion}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-800 font-medium">{detalle.promocion?.denominacion} (Promoción)</td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-800">
                          {detalle.cantidad}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleCocinero;
