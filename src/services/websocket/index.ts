/**
 * Módulo de WebSocket para gestión de pedidos en tiempo real
 * 
 * Este módulo proporciona todo lo necesario para conectarse al WebSocket del backend
 * y recibir/enviar actualizaciones de estado de pedidos.
 * 
 * @module services/websocket
 */

// Exportar servicio
export { PedidoWebSocketService, pedidoWebSocketService } from './PedidoWebSocketService';

// Exportar hooks de React
export { 
  usePedidoWebSocket, 
  usePedidoNotificacion, 
  useWebSocketConexion 
} from './usePedidoWebSocket';

// Exportar tipos
export type {
  CambioEstadoPedidoRequest,
  PedidoNotificacion,
  WebSocketConfig,
  NotificacionCallback,
  ErrorCallback,
  ConexionCallback
} from './types';

export { EstadoPedido, ESTADO_PEDIDO_NOMBRES } from './types';
