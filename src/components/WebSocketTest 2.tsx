import { useEffect, useState } from 'react';
import useStompWebSocket from '../hooks/useStompWebSocket';

export function WebSocketTest() {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [connectionTime, setConnectionTime] = useState<string>('');

  const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

  const { isConnected, subscribe, unsubscribe, cambiarEstadoPedido } = useStompWebSocket({
    url: wsUrl,
    autoConnect: true,
    debug: true
  });

  // Registrar tiempo de conexión
  useEffect(() => {
    if (isConnected) {
      setConnectionTime(new Date().toLocaleTimeString());
      console.log('✅ WebSocket CONECTADO a:', wsUrl);
    } else {
      console.log('❌ WebSocket DESCONECTADO');
    }
  }, [isConnected, wsUrl]);

  // Suscribirse a todos los pedidos (para testing)
  useEffect(() => {
    const handleNotificacion = (data: any) => {
      console.log('📦 NOTIFICACIÓN RECIBIDA:', data);
      setNotificaciones(prev => [
        {
          ...data,
          receivedAt: new Date().toLocaleTimeString()
        },
        ...prev
      ].slice(0, 10)); // Mantener solo las últimas 10
    };

    // Suscribirse al topic general
    subscribe('/topic/pedidos', handleNotificacion);

    return () => {
      unsubscribe('/topic/pedidos', handleNotificacion);
    };
  }, [subscribe, unsubscribe]);

  // Función de prueba para enviar un cambio de estado
  const enviarPrueba = () => {
    console.log('🚀 Enviando cambio de estado de prueba...');
    // Cambiar pedido 1 a estado 2 (EN_PREPARACION)
    cambiarEstadoPedido(1, 2, '30 minutos');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
        🔌 WebSocket Test
      </h3>

      {/* Estado de conexión */}
      <div style={{
        padding: '8px',
        borderRadius: '4px',
        marginBottom: '12px',
        background: isConnected ? '#d4edda' : '#f8d7da',
        color: isConnected ? '#155724' : '#721c24',
        fontWeight: 'bold'
      }}>
        {isConnected ? '🟢 CONECTADO' : '🔴 DESCONECTADO'}
        {connectionTime && (
          <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '4px' }}>
            Conectado a las {connectionTime}
          </div>
        )}
      </div>

      {/* Información de conexión */}
      <div style={{ fontSize: '12px', marginBottom: '12px', color: '#666' }}>
        <div><strong>URL:</strong> {wsUrl}</div>
        <div><strong>Topic:</strong> /topic/pedidos</div>
      </div>

      {/* Botón de prueba */}
      <button
        onClick={enviarPrueba}
        disabled={!isConnected}
        style={{
          width: '100%',
          padding: '8px',
          background: isConnected ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isConnected ? 'pointer' : 'not-allowed',
          marginBottom: '12px',
          fontWeight: 'bold'
        }}
      >
        🚀 Enviar Prueba
      </button>

      {/* Notificaciones recibidas */}
      <div>
        <strong style={{ fontSize: '14px' }}>
          Notificaciones ({notificaciones.length})
        </strong>
        <div style={{ marginTop: '8px' }}>
          {notificaciones.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
              No hay notificaciones aún
            </div>
          ) : (
            notificaciones.map((notif, index) => (
              <div
                key={index}
                style={{
                  background: '#f8f9fa',
                  padding: '8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  borderLeft: '3px solid #007bff'
                }}
              >
                <div><strong>Pedido #{notif.pedidoId}</strong></div>
                <div>Estado: {notif.estadoNombre}</div>
                {notif.tiempoEstimado && (
                  <div>Tiempo: {notif.tiempoEstimado}</div>
                )}
                <div style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>
                  {notif.receivedAt}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instrucciones */}
      <div style={{
        marginTop: '12px',
        padding: '8px',
        background: '#fff3cd',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#856404'
      }}>
        <strong>💡 Instrucciones:</strong>
        <ol style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
          <li>Verifica que esté "CONECTADO"</li>
          <li>Abre la consola del navegador (F12)</li>
          <li>Busca mensajes con [StompWebSocketService]</li>
          <li>Haz clic en "Enviar Prueba"</li>
          <li>Deberías ver la notificación aparecer aquí</li>
        </ol>
      </div>
    </div>
  );
}

export default WebSocketTest;
