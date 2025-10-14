/**
 * Tipos TypeScript para el sistema de WebSocket de pedidos
 * 
 * Estos tipos están sincronizados con los DTOs del backend:
 * - CambioEstadoPedidoRequest.java
 * - PedidoNotificacion.java
 */

/**
 * Request para cambiar el estado de un pedido
 * Se envía desde el frontend al backend via WebSocket
 * 
 * Endpoint: /app/pedido.cambiarEstado
 */
export interface CambioEstadoPedidoRequest {
  /** ID del pedido a actualizar */
  pedidoId: number;
  
  /** ID del nuevo estado (1-6) */
  nuevoEstadoId: number;
  
  /** Tiempo estimado opcional (ej: "30 minutos") */
  tiempoEstimado?: string;
}

/**
 * Notificación de cambio de estado de pedido
 * Se recibe desde el backend via WebSocket
 * 
 * Topics disponibles:
 * - /topic/pedidos - Todos los pedidos (general)
 * - /topic/pedidos/admin - Solo para administradores
 * - /topic/pedidos/sucursal/{id} - Pedidos de una sucursal específica
 * - /topic/pedidos/usuario/{id} - Pedidos de un usuario específico
 */
export interface PedidoNotificacion {
  /** ID del pedido actualizado */
  pedidoId: number;
  
  /** ID del nuevo estado */
  estadoId: number;
  
  /** Nombre del estado (ej: "EN_PREPARACION") */
  estadoNombre: string;
  
  /** Tiempo estimado de entrega */
  tiempoEstimado?: string;
  
  /** Fecha del pedido */
  fecha: string;
  
  /** ID del usuario que realizó el pedido */
  usuarioId?: number;
  
  /** Nombre del usuario */
  usuarioNombre?: string;
  
  /** ID de la sucursal */
  sucursalId?: number;
  
  /** Mensaje descriptivo del cambio */
  mensaje?: string;
  
  /** Timestamp de la notificación */
  timestamp: string;
}

/**
 * Estados de pedido disponibles
 * Estos IDs corresponden a los estados precargados en la base de datos
 * 
 * 1 - PREPARING: Pedido en preparación (cocina)
 * 2 - STANDBY: Pedido en espera/listo para entregar
 * 3 - CANCELLED: Pedido cancelado
 * 4 - REJECTED: Pedido rechazado
 * 5 - INCOMING: Pedido entrante/nuevo
 * 6 - DELIVERED: Pedido entregado
 */
export enum EstadoPedido {
  PREPARING = 1,
  STANDBY = 2,
  CANCELLED = 3,
  REJECTED = 4,
  INCOMING = 5,
  DELIVERED = 6
}

/**
 * Nombres de estados de pedido en español
 */
export const ESTADO_PEDIDO_NOMBRES: Record<EstadoPedido, string> = {
  [EstadoPedido.PREPARING]: 'En Preparación',
  [EstadoPedido.STANDBY]: 'En Espera',
  [EstadoPedido.CANCELLED]: 'Cancelado',
  [EstadoPedido.REJECTED]: 'Rechazado',
  [EstadoPedido.INCOMING]: 'Nuevo',
  [EstadoPedido.DELIVERED]: 'Entregado'
};

/**
 * Configuración de conexión WebSocket
 */
export interface WebSocketConfig {
  /** URL del servidor WebSocket (ej: "http://localhost:8080/ws") */
  url: string;
  
  /** Reconectar automáticamente en caso de desconexión */
  autoReconnect?: boolean;
  
  /** Intervalo de reconexión en milisegundos */
  reconnectDelay?: number;
  
  /** Habilitar logs de debug */
  debug?: boolean;
}

/**
 * Callback para manejar notificaciones recibidas
 */
export type NotificacionCallback = (notificacion: PedidoNotificacion) => void;

/**
 * Callback para manejar errores
 */
export type ErrorCallback = (error: Error) => void;

/**
 * Callback para manejar cambios de estado de conexión
 */
export type ConexionCallback = (conectado: boolean) => void;
