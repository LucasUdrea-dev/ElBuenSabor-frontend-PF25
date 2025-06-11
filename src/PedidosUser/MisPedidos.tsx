import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pedido, TypeState } from "../../ts/Clases";
import PedidoComponent from './Pedido';
import { pedidosMock } from './mockData';

interface MisPedidosProps {
  pedidos?: Pedido[];
}

const MisPedidos: React.FC<MisPedidosProps> = ({ pedidos }) => {
  // Usar datos mock si no se pasan pedidos como prop
  const pedidosData = pedidos || pedidosMock;
  
  const [tabActiva, setTabActiva] = useState<'pendientes' | 'pasadas'>('pendientes');
  const [filtroFecha, setFiltroFecha] = useState<string>('');
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    filtrarPedidos();
  }, [tabActiva, filtroFecha, pedidosData]);

  const filtrarPedidos = () => {
    let pedidosFiltrados = pedidosData;

    // Filtrar por tab activa
    if (tabActiva === 'pendientes') {
      pedidosFiltrados = pedidosData.filter(pedido => 
        pedido.estadoPedido?.nombre_estado === TypeState.EN_CAMINO || 
        pedido.estadoPedido?.nombre_estado === TypeState.LISTO
      );
    } else {
      pedidosFiltrados = pedidosData.filter(pedido => 
        pedido.estadoPedido?.nombre_estado === TypeState.ENTREGADO || 
        pedido.estadoPedido?.nombre_estado === TypeState.CANCELADO
      );
    }

    // Filtrar por fecha si se especifica
    if (filtroFecha) {
      const hoy = new Date();
      const inicioSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - hoy.getDay());
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      
      pedidosFiltrados = pedidosFiltrados.filter(pedido => {
        if (!pedido.fecha) return false;
        const fechaPedido = new Date(pedido.fecha);
        
        switch (filtroFecha) {
          case 'hoy':
            return fechaPedido.toDateString() === hoy.toDateString();
          case 'semana':
            return fechaPedido >= inicioSemana;
          case 'mes':
            return fechaPedido >= inicioMes;
          default:
            return true;
        }
      });
    }

    setPedidosFiltrados(pedidosFiltrados);
  };

  const formatearFecha = (fecha: Date | undefined): string => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatearHora = (fecha: Date | undefined): string => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para determinar qué pedidos están disponibles en la tab actual (sin filtro de fecha)
  const getPedidosDeTabActual = () => {
    if (tabActiva === 'pendientes') {
      return pedidosData.filter(pedido => 
        pedido.estadoPedido?.nombre_estado === TypeState.EN_CAMINO || 
        pedido.estadoPedido?.nombre_estado === TypeState.LISTO
      );
    } else {
      return pedidosData.filter(pedido => 
        pedido.estadoPedido?.nombre_estado === TypeState.ENTREGADO || 
        pedido.estadoPedido?.nombre_estado === TypeState.CANCELADO
      );
    }
  };

  const irACatalogo = () => {
    navigate('/catalogo');
  };

   return (
     <div className="min-h-screen text-white p-4 bg-[#333333] font-lato">
    <div className="bg-[#444444] rounded-xl max-w-6xl mx-auto overflow-hidden">
      <div className="bg-[#333333]/40 px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="font-lato text-lg">Mis ordenes</h2>
          
          {/* Mostrar dropdown si hay pedidos en la tab actual (sin considerar filtro de fecha) */}
          {getPedidosDeTabActual().length > 0 && (
            <div>
              <select 
                className="bg-[#444444] text-white px-4 py-2 rounded border border-[#555555] font-lato"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              >
                <option value="">Ordenar por</option>
                <option value="hoy">Hoy</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
              </select>
            </div>
            )}
          </div>
          
        </div>

        <div className="p-4">
          

          {pedidosData.length === 0 ? (
            /* Estado vacío */
             <div className="text-center p-6 rounded-xl bg-[#444444]">
              <p className="mb-4 font-lato">Aun no has agregado ninguna orden</p>
              <button 
                onClick={irACatalogo}
                className="bg-[#D93F21] hover:bg-[#b9331a] px-4 py-2 rounded text-white font-lato inline-block transition-colors"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex mb-6 border-b border-[#555555]">
                <button
                  className={`px-4 py-2 font-lato ${
                    tabActiva === 'pendientes' 
                      ? 'text-white border-b-2 border-[#D93F21]' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setTabActiva('pendientes')}
                >
                  Pendiente
                </button>
                <button
                  className={`px-4 py-2 font-lato ml-6 ${
                    tabActiva === 'pasadas' 
                      ? 'text-white border-b-2 border-[#D93F21]' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setTabActiva('pasadas')}
                >
                  Órdenes pasadas
                </button>
              </div>

              {/* Lista de pedidos */}
              {pedidosFiltrados.length === 0 ? (
                <div className="text-center p-6 rounded-xl bg-[#444444]">
                  <p className="text-gray-400 font-lato">
                    {filtroFecha ? 
                      `No hay órdenes ${filtroFecha === 'hoy' ? 'de hoy' : filtroFecha === 'semana' ? 'de esta semana' : 'de este mes'} en esta categoría` :
                      'No hay órdenes en esta categoría'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pedidosFiltrados.map((pedido) => (
                    <PedidoComponent 
                      key={pedido.id} 
                      pedido={pedido} 
                      tipo={tabActiva}
                      formatearFecha={formatearFecha}
                      formatearHora={formatearHora}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisPedidos;