/**
 * EJEMPLO COMPLETO DE DASHBOARD CON WEBSOCKET
 * 
 * Este archivo muestra cómo implementar un dashboard completo que:
 * - Se conecta al WebSocket automáticamente
 * - Muestra el estado de conexión
 * - Recibe notificaciones en tiempo real
 * - Permite cambiar el estado de pedidos
 * - Filtra pedidos por estado
 * - Maneja errores
 * 
 * Puedes copiar este código y adaptarlo a tus necesidades.
 */

import { usePedidoWebSocket, EstadoPedido, ESTADO_PEDIDO_NOMBRES } from '../index';
import { useState } from 'react';

/**
 * Dashboard de ejemplo para gestión de pedidos
 * 
 * Este componente puede ser adaptado para:
 * - Dashboard de Administrador (tipo: 'admin')
 * - Dashboard de Cocina (tipo: 'sucursal', sucursalId: X)
 * - Dashboard de Delivery (tipo: 'sucursal', sucursalId: X)
 * - Vista de Cliente (tipo: 'usuario', usuarioId: X)
 * 
 * FLUJO DE ESTADOS:
 * INCOMING (5) → PREPARING (1) → STANDBY (2) → DELIVERED (6)
 *            ↓                ↓
 *        REJECTED (4)    CANCELLED (3)
 */
export function DashboardEjemplo() {
  // ============================================================================
  // CONFIGURACIÓN DEL WEBSOCKET
  // ============================================================================
  
  // Opción 1: Dashboard de Administrador (ve todos los pedidos)
  const { conectado, notificaciones, cambiarEstado, error, limpiarNotificaciones } = 
    usePedidoWebSocket({ tipo: 'admin' });

  // Opción 2: Dashboard de Cocina/Delivery (solo pedidos de una sucursal)
  // const sucursalId = 1; // Obtener de contexto o props
  // const { conectado, notificaciones, cambiarEstado, error } = 
  //   usePedidoWebSocket({ tipo: 'sucursal', sucursalId });

  // Opción 3: Vista de Cliente (solo pedidos del usuario)
  // const usuarioId = 123; // Obtener del usuario logueado
  // const { conectado, notificaciones, cambiarEstado, error } = 
  //   usePedidoWebSocket({ tipo: 'usuario', usuarioId });

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================
  
  const [filtroEstado, setFiltroEstado] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // ============================================================================
  // LÓGICA DE FILTRADO
  // ============================================================================
  
  const pedidosFiltrados = notificaciones.filter(pedido => {
    // Filtrar por estado si hay filtro activo
    if (filtroEstado !== null && pedido.estadoId !== filtroEstado) {
      return false;
    }
    
    // Filtrar por búsqueda (ID de pedido o nombre de usuario)
    if (busqueda) {
      const searchLower = busqueda.toLowerCase();
      return (
        pedido.pedidoId.toString().includes(searchLower) ||
        pedido.usuarioNombre?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // ============================================================================
  // FUNCIONES DE CAMBIO DE ESTADO
  // ============================================================================
  
  const handleCambiarEstado = (pedidoId: number, nuevoEstado: EstadoPedido, tiempoEstimado?: string) => {
    try {
      cambiarEstado(pedidoId, nuevoEstado, tiempoEstimado);
      console.log(`Pedido #${pedidoId} cambiado a estado ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado del pedido');
    }
  };

  // ============================================================================
  // CONTADORES POR ESTADO
  // ============================================================================
  // Contadores por estado
  const contadores = {
    nuevos: notificaciones.filter(n => n.estadoId === EstadoPedido.INCOMING).length,
    enPreparacion: notificaciones.filter(n => n.estadoId === EstadoPedido.PREPARING).length,
    enEspera: notificaciones.filter(n => n.estadoId === EstadoPedido.STANDBY).length,
    entregados: notificaciones.filter(n => n.estadoId === EstadoPedido.DELIVERED).length,
    cancelados: notificaciones.filter(n => n.estadoId === EstadoPedido.CANCELLED).length,
    rechazados: notificaciones.filter(n => n.estadoId === EstadoPedido.REJECTED).length,
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="dashboard-container">
      {/* ====================================================================== */}
      {/* HEADER CON ESTADO DE CONEXIÓN */}
      {/* ====================================================================== */}
      <header className="dashboard-header">
        <h1>Dashboard de Pedidos</h1>
        
        <div className="conexion-status">
          {conectado ? (
            <span className="status-conectado">
              🟢 Conectado
            </span>
          ) : (
            <span className="status-desconectado">
              🔴 Desconectado
            </span>
          )}
        </div>
      </header>

      {/* ====================================================================== */}
      {/* MOSTRAR ERRORES SI EXISTEN */}
      {/* ====================================================================== */}
      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {/* ====================================================================== */}
      {/* ESTADÍSTICAS RÁPIDAS */}
      {/* ====================================================================== */}
      <div className="estadisticas">
        <div className="stat-card">
          <h3>{contadores.nuevos}</h3>
          <p>Nuevos</p>
        </div>
        <div className="stat-card">
          <h3>{contadores.enPreparacion}</h3>
          <p>En Preparación</p>
        </div>
        <div className="stat-card">
          <h3>{contadores.enEspera}</h3>
          <p>En Espera</p>
        </div>
        <div className="stat-card">
          <h3>{contadores.entregados}</h3>
          <p>Entregados</p>
        </div>
        <div className="stat-card">
          <h3>{contadores.cancelados}</h3>
          <p>Cancelados</p>
        </div>
        <div className="stat-card">
          <h3>{contadores.rechazados}</h3>
          <p>Rechazados</p>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* FILTROS Y BÚSQUEDA */}
      {/* ====================================================================== */}
      <div className="filtros-container">
        <div className="filtros-estados">
          <button 
            className={filtroEstado === null ? 'filtro-activo' : ''}
            onClick={() => setFiltroEstado(null)}
          >
            Todos ({notificaciones.length})
          </button>
          
          {Object.entries(ESTADO_PEDIDO_NOMBRES).map(([id, nombre]) => (
            <button
              key={id}
              className={filtroEstado === Number(id) ? 'filtro-activo' : ''}
              onClick={() => setFiltroEstado(Number(id))}
            >
              {nombre}
            </button>
          ))}
        </div>

        <div className="busqueda">
          <input
            type="text"
            placeholder="Buscar por ID o nombre de cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button onClick={limpiarNotificaciones} className="btn-limpiar">
          Limpiar Historial
        </button>
      </div>

      {/* ====================================================================== */}
      {/* LISTA DE PEDIDOS */}
      {/* ====================================================================== */}
      <div className="pedidos-lista">
        {pedidosFiltrados.length === 0 ? (
          <div className="sin-pedidos">
            <p>No hay pedidos para mostrar</p>
          </div>
        ) : (
          pedidosFiltrados.map(pedido => (
            <div key={pedido.pedidoId} className="pedido-card">
              {/* Información del Pedido */}
              <div className="pedido-info">
                <h3>Pedido #{pedido.pedidoId}</h3>
                
                {pedido.usuarioNombre && (
                  <p><strong>Cliente:</strong> {pedido.usuarioNombre}</p>
                )}
                
                {pedido.sucursalId && (
                  <p><strong>Sucursal:</strong> {pedido.sucursalId}</p>
                )}
                
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={`badge badge-estado-${pedido.estadoId}`}>
                    {pedido.estadoNombre}
                  </span>
                </p>
                
                {pedido.tiempoEstimado && (
                  <p><strong>Tiempo estimado:</strong> {pedido.tiempoEstimado}</p>
                )}
                
                <p className="pedido-timestamp">
                  <small>Actualizado: {new Date(pedido.timestamp).toLocaleString()}</small>
                </p>
              </div>

              {/* Acciones según el Estado Actual */}
              <div className="pedido-acciones">
                {pedido.estadoId === EstadoPedido.INCOMING && (
                  <>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleCambiarEstado(pedido.pedidoId, EstadoPedido.PREPARING)}
                    >
                      Comenzar Preparación
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => {
                        if (confirm(`¿Rechazar pedido #${pedido.pedidoId}?`)) {
                          handleCambiarEstado(pedido.pedidoId, EstadoPedido.REJECTED);
                        }
                      }}
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {pedido.estadoId === EstadoPedido.PREPARING && (
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      const tiempo = prompt('Tiempo estimado de entrega:');
                      handleCambiarEstado(pedido.pedidoId, EstadoPedido.STANDBY, tiempo || undefined);
                    }}
                  >
                    Marcar en Espera
                  </button>
                )}

                {pedido.estadoId === EstadoPedido.STANDBY && (
                  <button 
                    className="btn btn-info"
                    onClick={() => handleCambiarEstado(pedido.pedidoId, EstadoPedido.DELIVERED)}
                  >
                    Marcar como Entregado
                  </button>
                )}

                {/* Botón de Cancelar (disponible en estados INCOMING y PREPARING) */}
                {(pedido.estadoId === EstadoPedido.INCOMING || pedido.estadoId === EstadoPedido.PREPARING) && (
                  <button 
                    className="btn btn-warning"
                    onClick={() => {
                      if (confirm(`¿Cancelar pedido #${pedido.pedidoId}?`)) {
                        handleCambiarEstado(pedido.pedidoId, EstadoPedido.CANCELLED);
                      }
                    }}
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * ESTILOS CSS DE EJEMPLO (agregar a tu archivo CSS)
 * 
 * .dashboard-container {
 *   padding: 20px;
 * }
 * 
 * .dashboard-header {
 *   display: flex;
 *   justify-content: space-between;
 *   align-items: center;
 *   margin-bottom: 20px;
 * }
 * 
 * .status-conectado {
 *   color: #22c55e;
 *   font-weight: bold;
 * }
 * 
 * .status-desconectado {
 *   color: #ef4444;
 *   font-weight: bold;
 * }
 * 
 * .estadisticas {
 *   display: grid;
 *   grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
 *   gap: 15px;
 *   margin-bottom: 20px;
 * }
 * 
 * .stat-card {
 *   background: #f3f4f6;
 *   padding: 15px;
 *   border-radius: 8px;
 *   text-align: center;
 * }
 * 
 * .filtros-container {
 *   display: flex;
 *   gap: 15px;
 *   margin-bottom: 20px;
 *   flex-wrap: wrap;
 * }
 * 
 * .filtros-estados {
 *   display: flex;
 *   gap: 10px;
 *   flex-wrap: wrap;
 * }
 * 
 * .filtro-activo {
 *   background: #3b82f6;
 *   color: white;
 * }
 * 
 * .pedidos-lista {
 *   display: grid;
 *   gap: 15px;
 * }
 * 
 * .pedido-card {
 *   background: white;
 *   border: 1px solid #e5e7eb;
 *   border-radius: 8px;
 *   padding: 20px;
 *   display: flex;
 *   justify-content: space-between;
 *   align-items: center;
 * }
 * 
 * .pedido-acciones {
 *   display: flex;
 *   gap: 10px;
 *   flex-wrap: wrap;
 * }
 * 
 * .badge {
 *   padding: 4px 8px;
 *   border-radius: 4px;
 *   font-size: 12px;
 *   font-weight: bold;
 * }
 * 
 * .badge-estado-1 { background: #fef3c7; color: #92400e; }
 * .badge-estado-2 { background: #dbeafe; color: #1e40af; }
 * .badge-estado-3 { background: #d1fae5; color: #065f46; }
 * .badge-estado-4 { background: #e0e7ff; color: #3730a3; }
 * .badge-estado-5 { background: #d1fae5; color: #065f46; }
 * .badge-estado-6 { background: #fee2e2; color: #991b1b; }
 */
