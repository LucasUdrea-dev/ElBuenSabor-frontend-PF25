import { useEffect, useCallback, useRef, useState } from 'react';
import stompWebSocketService from '../services/StompWebSocketService';

interface UseStompWebSocketOptions {
  url: string;
  debug?: boolean;
  reconnectDelay?: number;
  autoConnect?: boolean;
}

interface UseStompWebSocketReturn {
  isConnected: boolean;
  subscribe: (topic: string, callback: (data: any) => void) => void;
  unsubscribe: (topic: string, callback?: (data: any) => void) => void;
  send: (destination: string, body: any) => void;
  cambiarEstadoPedido: (pedidoId: number, nuevoEstadoId: number, tiempoEstimado?: string) => void;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Hook para usar STOMP WebSocket en componentes React
 * Compatible con el backend Spring Boot de El Buen Sabor
 * 
 * @example
 * const { isConnected, subscribe, cambiarEstadoPedido } = useStompWebSocket({
 *   url: 'http://localhost:8080/ws',
 *   autoConnect: true,
 *   debug: true
 * });
 * 
 * useEffect(() => {
 *   const handlePedido = (data) => {
 *     console.log('Pedido actualizado:', data);
 *   };
 *   
 *   subscribe('/topic/pedidos', handlePedido);
 *   
 *   return () => unsubscribe('/topic/pedidos', handlePedido);
 * }, []);
 */
export const useStompWebSocket = (options: UseStompWebSocketOptions): UseStompWebSocketReturn => {
  const {
    url,
    debug = false,
    reconnectDelay = 5000,
    autoConnect = true
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const subscriptionsRef = useRef<Map<string, (data: any) => void>>(new Map());

  // Conectar al WebSocket
  const connect = useCallback(() => {
    stompWebSocketService.connect({
      url,
      debug,
      reconnectDelay
    });
  }, [url, debug, reconnectDelay]);

  // Desconectar del WebSocket
  const disconnect = useCallback(() => {
    stompWebSocketService.disconnect();
  }, []);

  // Suscribirse a un topic
  const subscribe = useCallback((topic: string, callback: (data: any) => void) => {
    stompWebSocketService.subscribe(topic, callback);
    subscriptionsRef.current.set(topic, callback);
  }, []);

  // Desuscribirse de un topic
  const unsubscribe = useCallback((topic: string, callback?: (data: any) => void) => {
    stompWebSocketService.unsubscribe(topic, callback);
    if (!callback) {
      subscriptionsRef.current.delete(topic);
    }
  }, []);

  // Enviar mensaje
  const send = useCallback((destination: string, body: any) => {
    stompWebSocketService.send(destination, body);
  }, []);

  // Cambiar estado de pedido (método de conveniencia)
  const cambiarEstadoPedido = useCallback((
    pedidoId: number, 
    nuevoEstadoId: number, 
    tiempoEstimado?: string
  ) => {
    stompWebSocketService.cambiarEstadoPedido(pedidoId, nuevoEstadoId, tiempoEstimado);
  }, []);

  // Configurar listeners de conexión/desconexión
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
    };

    stompWebSocketService.onConnect(handleConnected);
    stompWebSocketService.onDisconnect(handleDisconnected);

    // Auto-conectar si está habilitado
    if (autoConnect && !stompWebSocketService.getIsConnected()) {
      connect();
    }

    // Cleanup
    return () => {
      // Desuscribirse de todos los topics registrados por este hook
      subscriptionsRef.current.forEach((callback, topic) => {
        stompWebSocketService.unsubscribe(topic, callback);
      });
      subscriptionsRef.current.clear();
      
      // NO desconectar automáticamente - el servicio es singleton
      // El usuario debe llamar disconnect() manualmente si lo necesita
    };
  }, [connect, autoConnect]);

  return {
    isConnected,
    subscribe,
    unsubscribe,
    send,
    cambiarEstadoPedido,
    connect,
    disconnect
  };
};

export default useStompWebSocket;
