import React from 'react';
import LogoUser from '../../../public/svg/LogoUser.svg';
import LogoDetalle from '../../../public/svg/LogoDetalle.svg';
import LogoFactura from '../../../public/svg/LogoFactura.svg';

interface Orden {
  id: number;
  numeroOrden: string;
  fecha: Date;
  total: number;
  estado: 'Pendiente' | 'En proceso' | 'Listo' | 'Completado' | 'Cancelado';
  envio: 'Domicilio' | 'Retiro' | 'Local';
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ordenes: number;
  fechaRegistro: Date;
  activo: boolean;
}

interface DetalleClienteAdminProps {
  cliente: Cliente;
  isOpen: boolean;
  onClose: () => void;
}

const DetalleClienteAdmin: React.FC<DetalleClienteAdminProps> = ({ cliente, isOpen, onClose }) => {

  // Datos de ejemplo para las órdenes del cliente
  const ordenesCliente: Orden[] = [
    {
      id: 16452,
      numeroOrden: '16452',
      fecha: new Date('2025-01-12T10:30:00'),
      total: 750,
      estado: 'Pendiente',
      envio: 'Domicilio'
    },
    {
      id: 6421,
      numeroOrden: '6421',
      fecha: new Date('2025-02-25T14:15:00'),
      total: 350,
      estado: 'En proceso',
      envio: 'Domicilio'
    },
    {
      id: 98756,
      numeroOrden: '98756',
      fecha: new Date('2025-03-07T16:45:00'),
      total: 845,
      estado: 'Listo',
      envio: 'Domicilio'
    }
  ];

  if (!isOpen) return null;

  const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'Pendiente': return 'bg-amber-500 text-amber-800';
    case 'En proceso': return 'bg-blue-500 text-blue-800';
    case 'Listo': return 'bg-emerald-500 text-emerald-800';
    case 'Completado': return 'bg-slate-500 text-slate-800';
    case 'Cancelado': return 'bg-rose-500 text-rose-800';
    default: return 'bg-gray-500 text-gray-800';
  }
};


  const formatearFecha = (fecha: Date) =>
    fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const formatearFechaRegistro = (fecha: Date) =>
    fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Función placeholder para el botón de factura
  const handleVerFactura = (ordenId: number) => {
    console.log(`Ver factura para orden ${ordenId}`);
    // Aquí irá la funcionalidad futura
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 font-lato">
      <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#E9E9E9] rounded-t-2xl px-6 py-4 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl font-bold text-gray-800">
            {cliente.nombre} {cliente.apellido}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-none mt-4">
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha Registro</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-800">
                    {cliente.nombre} {cliente.apellido}
                  </td>
                  <td className="py-3 px-4 text-gray-800">{cliente.email}</td>
                  <td className="py-3 px-4 text-gray-800">{cliente.telefono}</td>
                  <td className="py-3 px-4 text-gray-800">
                    {formatearFechaRegistro(cliente.fechaRegistro)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-white px-3 py-1 rounded-lg text-sm ${
                      cliente.activo ? 'bg-emerald-500 text-emerald-800' : 'bg-[#878787]'
                    }`}>
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Órdenes por período */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-none">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <img src={LogoDetalle} alt="Icono Órdenes" className="mr-5 w-6 h-6" />
              Órdenes por período
            </h3>
            {ordenesCliente.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Orden</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Envío</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Factura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenesCliente.map((orden) => (
                      <tr key={orden.id} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-800 font-medium">{orden.numeroOrden}</td>
                        <td className="py-3 px-4 text-gray-800">{formatearFecha(orden.fecha)}</td>
                        <td className="py-3 px-4 text-gray-800 font-semibold">${orden.total}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-white px-3 py-1 rounded-lg text-sm ${getEstadoColor(orden.estado)}`}>
                            {orden.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-800">{orden.envio}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleVerFactura(orden.id)}
                            className="bg-[#878787] hover:bg-[#333333] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <img src={LogoFactura} alt="Ver Factura" className="w-4 h-4" />
                            Ver Factura
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">Este cliente no tiene órdenes registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleClienteAdmin;