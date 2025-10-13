/**
 * Tipos para el servicio de WebSocket
 */

// Tipos de eventos del WebSocket
export type WebSocketEventType = 
  | 'connected'
  | 'disconnected'
  | 'message'
  | 'error'
  | 'reconnecting'
  | 'maxReconnectAttemptsReached'
  | 'sendError'
  | string; // Permite eventos personalizados

// Callback para eventos
export type WebSocketEventCallback<T = any> = (data: T) => void;

// Configuración del WebSocket
export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  debug?: boolean;
}

// Opciones para el hook useWebSocket
export interface UseWebSocketOptions extends WebSocketConfig {
  autoConnect?: boolean;
}

// Estado de reconexión
export interface ReconnectState {
  attempt: number;
  maxAttempts: number;
}

// Estado de máximo de intentos alcanzado
export interface MaxReconnectState {
  attempts: number;
}

// Mensaje base para WebSocket
export interface WebSocketMessage<T = any> {
  type: string;
  data?: T;
  timestamp?: string;
}

// Estados del WebSocket (según la API estándar)
export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

// Tipos específicos para El Buen Sabor

// Mensaje de notificación
export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  data: {
    id: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    timestamp: string;
  };
}

// Mensaje de actualización de pedido
export interface OrderUpdateMessage extends WebSocketMessage {
  type: 'orderUpdate';
  data: {
    orderId: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    estimatedTime?: number;
    timestamp: string;
  };
}

// Mensaje de chat
export interface ChatMessage extends WebSocketMessage {
  type: 'chat';
  data: {
    userId: string;
    username: string;
    message: string;
    timestamp: string;
  };
}

// Mensaje de actualización de stock
export interface StockUpdateMessage extends WebSocketMessage {
  type: 'stockUpdate';
  data: {
    productId: number;
    stock: number;
    available: boolean;
    timestamp: string;
  };
}

// Mensaje de actualización de promoción
export interface PromotionUpdateMessage extends WebSocketMessage {
  type: 'promotionUpdate';
  data: {
    promotionId: number;
    action: 'created' | 'updated' | 'deleted';
    promotion?: any;
    timestamp: string;
  };
}

// Union type de todos los mensajes posibles
export type AppWebSocketMessage = 
  | NotificationMessage
  | OrderUpdateMessage
  | ChatMessage
  | StockUpdateMessage
  | PromotionUpdateMessage
  | WebSocketMessage;

// Tipo para el retorno del hook
export interface UseWebSocketReturn {
  isConnected: boolean;
  send: (data: any) => void;
  connect: () => void;
  disconnect: () => void;
  on: (event: string, callback: WebSocketEventCallback) => void;
  off: (event: string, callback: WebSocketEventCallback) => void;
}

// Tipo para el contexto de WebSocket (si se usa Context API)
export interface WebSocketContextValue extends UseWebSocketReturn {
  readyState: number | null;
}

// ========================================
// Tipos específicos para STOMP (El Buen Sabor)
// ========================================

/**
 * Estados de pedido en El Buen Sabor
 */
export enum EstadoPedido {
  PENDIENTE = 1,
  EN_PREPARACION = 2,
  LISTO = 3,
  EN_CAMINO = 4,
  ENTREGADO = 5,
  CANCELADO = 6
}

/**
 * Notificación de pedido recibida por STOMP
 */
export interface PedidoNotificacion {
  pedidoId: number;
  estadoId: number;
  estadoNombre: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO';
  tiempoEstimado: string;
  fecha: string;
  usuarioId: number;
  usuarioNombre: string;
  sucursalId: number;
  mensaje: string | null;
  timestamp: string;
}

/**
 * Mensaje para cambiar estado de pedido
 */
export interface CambiarEstadoPedidoRequest {
  pedidoId: number;
  nuevoEstadoId: number;
  tiempoEstimado?: string;
}

/**
 * Configuración del servicio STOMP
 */
export interface StompConfig {
  url: string;
  debug?: boolean;
  reconnectDelay?: number;
}

/**
 * Opciones para el hook useStompWebSocket
 */
export interface UseStompWebSocketOptions extends StompConfig {
  autoConnect?: boolean;
}

/**
 * Retorno del hook useStompWebSocket
 */
export interface UseStompWebSocketReturn {
  isConnected: boolean;
  subscribe: (topic: string, callback: (data: any) => void) => void;
  unsubscribe: (topic: string, callback?: (data: any) => void) => void;
  send: (destination: string, body: any) => void;
  cambiarEstadoPedido: (pedidoId: number, nuevoEstadoId: number, tiempoEstimado?: string) => void;
  connect: () => void;
  disconnect: () => void;
}
