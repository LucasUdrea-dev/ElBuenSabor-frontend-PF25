/**
 * COMPONENTE DE PRUEBA PARA WEBSOCKET
 * 
 * Este componente te permite probar el WebSocket sin necesidad de crear
 * toda la interfaz de los dashboards.
 * 
 * CÓMO USAR:
 * 1. Importa este componente en tu App.tsx o archivo de rutas
 * 2. Agrega una ruta: <Route path="/prueba-websocket" element={<PruebaWebSocket />} />
 * 3. Abre http://localhost:5173/prueba-websocket en tu navegador
 * 4. Verifica que se conecte (🟢)
 * 5. Usa los botones para cambiar estados de pedidos
 * 6. Observa las notificaciones que llegan en tiempo real
 */

import { usePedidoWebSocket, EstadoPedido, ESTADO_PEDIDO_NOMBRES } from './services/websocket';
import { useState } from 'react';

export function PruebaWebSocket() {
  const [tipoSuscripcion, setTipoSuscripcion] = useState<'admin' | 'sucursal' | 'usuario'>('admin');
  const [sucursalId, setSucursalId] = useState(1);
  const [usuarioId, setUsuarioId] = useState(1);

  // Configurar suscripción según el tipo seleccionado
  const suscripcion = 
    tipoSuscripcion === 'admin' ? { tipo: 'admin' as const } :
    tipoSuscripcion === 'sucursal' ? { tipo: 'sucursal' as const, sucursalId } :
    { tipo: 'usuario' as const, usuarioId };

  const { conectado, notificaciones, cambiarEstado, error, limpiarNotificaciones } = 
    usePedidoWebSocket(suscripcion, { debug: true });

  // Función helper para cambiar estado
  const handleCambiarEstado = (estadoId: EstadoPedido, estadoNombre: string) => {
    const id = prompt(`ID del pedido a marcar como ${estadoNombre}:`);
    if (id) {
      const tiempoEstimado = estadoId === EstadoPedido.STANDBY 
        ? prompt('Tiempo estimado (opcional):') || undefined
        : undefined;
      
      cambiarEstado(Number(id), estadoId, tiempoEstimado);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>🧪 Prueba de WebSocket - Pedidos</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>
          Componente de prueba para verificar la conexión y funcionamiento del WebSocket
        </p>
      </div>

      {/* ESTADO DE CONEXIÓN */}
      <div style={{ 
        padding: '20px', 
        marginBottom: '20px',
        background: conectado ? '#d1fae5' : '#fee2e2',
        borderRadius: '8px',
        border: `2px solid ${conectado ? '#10b981' : '#ef4444'}`
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Estado de Conexión</h2>
        <p style={{ fontSize: '32px', margin: 0 }}>
          {conectado ? '🟢 CONECTADO' : '🔴 DESCONECTADO'}
        </p>
        {conectado && (
          <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#065f46' }}>
            ✓ Recibiendo actualizaciones en tiempo real
          </p>
        )}
      </div>

      {/* SELECTOR DE TIPO DE SUSCRIPCIÓN */}
      <div style={{ 
        padding: '20px', 
        marginBottom: '20px',
        background: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: '0 0 15px 0' }}>🎯 Tipo de Suscripción</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button
            onClick={() => setTipoSuscripcion('admin')}
            style={{
              padding: '10px 20px',
              background: tipoSuscripcion === 'admin' ? '#3b82f6' : 'white',
              color: tipoSuscripcion === 'admin' ? 'white' : 'black',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            👔 Admin (todos los pedidos)
          </button>
          
          <button
            onClick={() => setTipoSuscripcion('sucursal')}
            style={{
              padding: '10px 20px',
              background: tipoSuscripcion === 'sucursal' ? '#3b82f6' : 'white',
              color: tipoSuscripcion === 'sucursal' ? 'white' : 'black',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🏪 Sucursal
          </button>
          
          <button
            onClick={() => setTipoSuscripcion('usuario')}
            style={{
              padding: '10px 20px',
              background: tipoSuscripcion === 'usuario' ? '#3b82f6' : 'white',
              color: tipoSuscripcion === 'usuario' ? 'white' : 'black',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            👤 Usuario
          </button>
        </div>

        {tipoSuscripcion === 'sucursal' && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              ID de Sucursal:
            </label>
            <input
              type="number"
              value={sucursalId}
              onChange={(e) => setSucursalId(Number(e.target.value))}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        )}

        {tipoSuscripcion === 'usuario' && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              ID de Usuario:
            </label>
            <input
              type="number"
              value={usuarioId}
              onChange={(e) => setUsuarioId(Number(e.target.value))}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        )}

        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>Suscrito a:</strong> {
            tipoSuscripcion === 'admin' ? '/topic/pedidos/admin' :
            tipoSuscripcion === 'sucursal' ? `/topic/pedidos/sucursal/${sucursalId}` :
            `/topic/pedidos/usuario/${usuarioId}`
          }
        </p>
      </div>

      {/* ERRORES */}
      {error && (
        <div style={{ 
          padding: '15px', 
          marginBottom: '20px',
          background: '#fee2e2',
          borderRadius: '8px',
          color: '#991b1b',
          border: '1px solid #ef4444'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>❌ Error</h3>
          <p style={{ margin: 0 }}>{error.message}</p>
        </div>
      )}

      {/* BOTONES DE PRUEBA */}
      <div style={{ 
        padding: '20px', 
        marginBottom: '20px',
        background: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>🎮 Acciones de Prueba</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Cambia el estado de un pedido (necesitas el ID del pedido de tu base de datos):
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <button 
            onClick={() => handleCambiarEstado(EstadoPedido.INCOMING, 'NUEVO')}
            style={{ 
              padding: '12px 20px', 
              cursor: 'pointer',
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#92400e'
            }}
          >
            📝 INCOMING (Nuevo)
          </button>
          
          <button 
            onClick={() => handleCambiarEstado(EstadoPedido.PREPARING, 'EN PREPARACIÓN')}
            style={{ 
              padding: '12px 20px', 
              cursor: 'pointer',
              background: '#dbeafe',
              border: '2px solid #3b82f6',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#1e40af'
            }}
          >
            👨‍🍳 PREPARING
          </button>
          
          <button 
            onClick={() => handleCambiarEstado(EstadoPedido.STANDBY, 'EN ESPERA')}
            style={{ 
              padding: '12px 20px', 
              cursor: 'pointer',
              background: '#d1fae5',
              border: '2px solid #10b981',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#065f46'
            }}
          >
            ✅ STANDBY (Listo)
          </button>
          
          <button 
            onClick={() => handleCambiarEstado(EstadoPedido.DELIVERED, 'ENTREGADO')}
            style={{ 
              padding: '12px 20px', 
              cursor: 'pointer',
              background: '#d1fae5',
              border: '2px solid #10b981',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#065f46'
            }}
          >
            🎉 DELIVERED
          </button>
          
          <button 
            onClick={() => handleCambiarEstado(EstadoPedido.CANCELLED, 'CANCELADO')}
            style={{ 
              padding: '12px 20px', 
              cursor: 'pointer',
              background: '#fee2e2',
              border: '2px solid #ef4444',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#991b1b'
            }}
          >
            ❌ CANCELLED
          </button>
          
          <button 
            onClick={() => handleCambiarEstado(EstadoPedido.REJECTED, 'RECHAZADO')}
            style={{ 
              padding: '12px 20px', 
              cursor: 'pointer',
              background: '#fee2e2',
              border: '2px solid #ef4444',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#991b1b'
            }}
          >
            ⛔ REJECTED
          </button>
        </div>
      </div>

      {/* LISTA DE NOTIFICACIONES */}
      <div style={{ 
        padding: '20px', 
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>📨 Notificaciones Recibidas ({notificaciones.length})</h2>
          {notificaciones.length > 0 && (
            <button
              onClick={limpiarNotificaciones}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🗑️ Limpiar
            </button>
          )}
        </div>
        
        {notificaciones.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            color: '#9ca3af',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>📭</p>
            <p style={{ margin: 0 }}>
              No hay notificaciones aún.<br/>
              Cambia el estado de un pedido usando los botones arriba.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {notificaciones.map((notif, index) => (
              <div 
                key={`${notif.pedidoId}-${index}`}
                style={{
                  padding: '20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#f9fafb',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
                      Pedido #{notif.pedidoId}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      🕐 {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: getEstadoColor(notif.estadoId).bg,
                    color: getEstadoColor(notif.estadoId).text,
                    border: `2px solid ${getEstadoColor(notif.estadoId).border}`
                  }}>
                    {ESTADO_PEDIDO_NOMBRES[notif.estadoId]}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                  fontSize: '14px', 
                  color: '#374151' 
                }}>
                  {notif.usuarioNombre && (
                    <div>
                      <strong>👤 Cliente:</strong> {notif.usuarioNombre}
                    </div>
                  )}
                  {notif.sucursalId && (
                    <div>
                      <strong>🏪 Sucursal:</strong> {notif.sucursalId}
                    </div>
                  )}
                  {notif.tiempoEstimado && (
                    <div>
                      <strong>⏱️ Tiempo:</strong> {notif.tiempoEstimado}
                    </div>
                  )}
                  <div>
                    <strong>🔢 Estado ID:</strong> {notif.estadoId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INSTRUCCIONES */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: '#eff6ff',
        borderRadius: '8px',
        border: '1px solid #3b82f6'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>💡 Instrucciones</h3>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Verifica que el backend esté corriendo en <code>http://localhost:8080</code></li>
          <li>Verifica que veas 🟢 CONECTADO arriba</li>
          <li>Selecciona el tipo de suscripción (Admin, Sucursal o Usuario)</li>
          <li>Usa los botones de colores para cambiar el estado de un pedido</li>
          <li>Observa cómo aparecen las notificaciones en tiempo real</li>
          <li>Abre múltiples ventanas para ver las actualizaciones sincronizadas</li>
        </ol>
      </div>
    </div>
  );
}

// Helper function para obtener colores según el estado
function getEstadoColor(estadoId: number) {
  const colores: Record<number, { bg: string; text: string; border: string }> = {
    [EstadoPedido.INCOMING]: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
    [EstadoPedido.PREPARING]: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
    [EstadoPedido.STANDBY]: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    [EstadoPedido.DELIVERED]: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    [EstadoPedido.CANCELLED]: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    [EstadoPedido.REJECTED]: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
  };
  
  return colores[estadoId] || { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
}
