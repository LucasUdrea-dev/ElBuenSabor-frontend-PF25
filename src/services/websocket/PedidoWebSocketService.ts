import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import {
  CambioEstadoPedidoRequest,
  PedidoNotificacion,
  WebSocketConfig,
  NotificacionCallback,
  ErrorCallback,
  ConexionCallback
} from './types';

/**
 * Servicio de WebSocket para gestionar actualizaciones de estado de pedidos en tiempo real
 * 
 * Este servicio proporciona una interfaz completa para:
 * - Conectarse al servidor WebSocket del backend
 * - Suscribirse a diferentes topics (admin, sucursal, usuario)
 * - Enviar cambios de estado de pedidos
 * - Recibir notificaciones en tiempo real
 * - Gestionar reconexiones automáticas
 * 
 * @example
 * ```typescript
 * // Crear instancia del servicio
 * const wsService = new PedidoWebSocketService({
 *   url: 'http://localhost:8080/ws',
 *   autoReconnect: true,
 *   debug: true
 * });
 * 
 * // Conectar
 * await wsService.connect();
 * 
 * // Suscribirse a notificaciones
 * wsService.suscribirseAPedidos((notificacion) => {
 *   console.log('Pedido actualizado:', notificacion);
 * });
 * 
 * // Enviar cambio de estado
 * wsService.cambiarEstadoPedido(42, 3, '30 minutos');
 * ```
 */
export class PedidoWebSocketService {
  private client: Client | null = null;
  private config: Required<WebSocketConfig>;
  private suscripciones: Map<string, StompSubscription> = new Map();
  private conectado: boolean = false;
  private reconectando: boolean = false;
  private callbacks: {
    onConexion: ConexionCallback[];
    onError: ErrorCallback[];
  } = {
    onConexion: [],
    onError: []
  };

  /**
   * Constructor del servicio
   * 
   * @param config - Configuración de conexión WebSocket
   */
  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      autoReconnect: config.autoReconnect ?? true,
      reconnectDelay: config.reconnectDelay ?? 5000,
      debug: config.debug ?? false
    };
  }

  /**
   * Conecta al servidor WebSocket
   * 
   * @returns Promise que se resuelve cuando la conexión está establecida
   * 
   * @example
   * ```typescript
   * await wsService.connect();
   * console.log('Conectado al WebSocket');
   * ```
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Crear cliente STOMP sobre SockJS
        this.client = new Client({
          webSocketFactory: () => new SockJS(this.config.url) as any,
          
          // Configuración de reconexión
          reconnectDelay: this.config.autoReconnect ? this.config.reconnectDelay : 0,
          
          // Heartbeat para mantener la conexión viva
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          
          // Callbacks de conexión
          onConnect: () => {
            this.conectado = true;
            this.reconectando = false;
            this.log('✅ Conectado al WebSocket');
            this.notificarConexion(true);
            resolve();
          },
          
          onDisconnect: () => {
            this.conectado = false;
            this.log('❌ Desconectado del WebSocket');
            this.notificarConexion(false);
            
            if (this.config.autoReconnect && !this.reconectando) {
              this.reconectando = true;
              this.log(`🔄 Intentando reconectar en ${this.config.reconnectDelay}ms...`);
            }
          },
          
          onStompError: (frame) => {
            const error = new Error(`Error STOMP: ${frame.headers['message']}`);
            this.log('❌ Error STOMP:', frame.body);
            this.notificarError(error);
            reject(error);
          },
          
          onWebSocketError: (event) => {
            const error = new Error('Error de WebSocket');
            this.log('❌ Error de WebSocket:', event);
            this.notificarError(error);
            reject(error);
          },
          
          debug: this.config.debug ? (str) => this.log('🔍 Debug:', str) : undefined
        });

        // Activar el cliente
        this.client.activate();
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error desconocido al conectar');
        this.notificarError(err);
        reject(err);
      }
    });
  }

  /**
   * Desconecta del servidor WebSocket
   * 
   * @example
   * ```typescript
   * await wsService.disconnect();
   * console.log('Desconectado');
   * ```
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      // Cancelar todas las suscripciones
      this.suscripciones.forEach(sub => sub.unsubscribe());
      this.suscripciones.clear();
      
      // Desactivar el cliente
      await this.client.deactivate();
      this.client = null;
      this.conectado = false;
      this.log('🔌 Desconectado manualmente');
    }
  }

  /**
   * Verifica si el servicio está conectado
   * 
   * @returns true si está conectado, false en caso contrario
   */
  public isConectado(): boolean {
    return this.conectado && this.client?.connected === true;
  }

  /**
   * Suscribirse a notificaciones generales de todos los pedidos
   * Útil para dashboards administrativos que necesitan ver todos los pedidos
   * 
   * @param callback - Función que se ejecuta cuando llega una notificación
   * @returns ID de la suscripción (para cancelar después)
   * 
   * @example
   * ```typescript
   * const subId = wsService.suscribirseAPedidos((notificacion) => {
   *   console.log('Pedido actualizado:', notificacion.pedidoId);
   *   console.log('Nuevo estado:', notificacion.estadoNombre);
   * });
   * ```
   */
  public suscribirseAPedidos(callback: NotificacionCallback): string {
    return this.suscribirse('/topic/pedidos', callback);
  }

  /**
   * Suscribirse a notificaciones de pedidos para administradores
   * Recibe todos los pedidos de todas las sucursales
   * 
   * @param callback - Función que se ejecuta cuando llega una notificación
   * @returns ID de la suscripción
   * 
   * @example
   * ```typescript
   * wsService.suscribirseAPedidosAdmin((notificacion) => {
   *   // Actualizar dashboard de administrador
   *   actualizarEstadisticas(notificacion);
   * });
   * ```
   */
  public suscribirseAPedidosAdmin(callback: NotificacionCallback): string {
    return this.suscribirse('/topic/pedidos/admin', callback);
  }

  /**
   * Suscribirse a notificaciones de pedidos de una sucursal específica
   * Útil para dashboards de cocina y delivery
   * 
   * @param sucursalId - ID de la sucursal
   * @param callback - Función que se ejecuta cuando llega una notificación
   * @returns ID de la suscripción
   * 
   * @example
   * ```typescript
   * // Dashboard de cocina de la sucursal 1
   * wsService.suscribirseAPedidosSucursal(1, (notificacion) => {
   *   if (notificacion.estadoNombre === 'PENDIENTE') {
   *     mostrarNuevoPedido(notificacion);
   *   }
   * });
   * ```
   */
  public suscribirseAPedidosSucursal(sucursalId: number, callback: NotificacionCallback): string {
    return this.suscribirse(`/topic/pedidos/sucursal/${sucursalId}`, callback);
  }

  /**
   * Suscribirse a notificaciones de pedidos de un usuario específico
   * Útil para que los clientes vean el estado de sus propios pedidos
   * 
   * @param usuarioId - ID del usuario
   * @param callback - Función que se ejecuta cuando llega una notificación
   * @returns ID de la suscripción
   * 
   * @example
   * ```typescript
   * // Cliente viendo sus pedidos
   * const usuarioId = obtenerUsuarioLogueado();
   * wsService.suscribirseAPedidosUsuario(usuarioId, (notificacion) => {
   *   mostrarNotificacion(`Tu pedido #${notificacion.pedidoId} está ${notificacion.estadoNombre}`);
   * });
   * ```
   */
  public suscribirseAPedidosUsuario(usuarioId: number, callback: NotificacionCallback): string {
    return this.suscribirse(`/topic/pedidos/usuario/${usuarioId}`, callback);
  }

  /**
   * Método genérico para suscribirse a cualquier topic
   * 
   * @param topic - Topic al que suscribirse
   * @param callback - Función que se ejecuta cuando llega un mensaje
   * @returns ID de la suscripción
   */
  private suscribirse(topic: string, callback: NotificacionCallback): string {
    if (!this.client || !this.isConectado()) {
      throw new Error('No hay conexión WebSocket. Llama a connect() primero.');
    }

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const notificacion: PedidoNotificacion = JSON.parse(message.body);
        this.log(`📨 Notificación recibida de ${topic}:`, notificacion);
        callback(notificacion);
      } catch (error) {
        this.log('❌ Error al parsear notificación:', error);
        this.notificarError(error instanceof Error ? error : new Error('Error al parsear notificación'));
      }
    });

    const subscriptionId = `${topic}-${Date.now()}`;
    this.suscripciones.set(subscriptionId, subscription);
    this.log(`✅ Suscrito a ${topic}`);
    
    return subscriptionId;
  }

  /**
   * Cancela una suscripción específica
   * 
   * @param subscriptionId - ID de la suscripción a cancelar
   * 
   * @example
   * ```typescript
   * const subId = wsService.suscribirseAPedidos(callback);
   * // ... más tarde
   * wsService.cancelarSuscripcion(subId);
   * ```
   */
  public cancelarSuscripcion(subscriptionId: string): void {
    const subscription = this.suscripciones.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.suscripciones.delete(subscriptionId);
      this.log(`🚫 Suscripción cancelada: ${subscriptionId}`);
    }
  }

  /**
   * Envía un cambio de estado de pedido al backend
   * El backend actualizará la base de datos y notificará a todos los clientes suscritos
   * 
   * @param pedidoId - ID del pedido a actualizar
   * @param nuevoEstadoId - ID del nuevo estado (1-6)
   * @param tiempoEstimado - Tiempo estimado opcional (ej: "30 minutos")
   * 
   * @example
   * ```typescript
   * // Marcar pedido como "En Preparación"
   * wsService.cambiarEstadoPedido(42, 2);
   * 
   * // Marcar pedido como "Listo" con tiempo estimado
   * wsService.cambiarEstadoPedido(42, 3, '15 minutos');
   * ```
   */
  public cambiarEstadoPedido(
    pedidoId: number,
    nuevoEstadoId: number,
    tiempoEstimado?: string
  ): void {
    if (!this.client || !this.isConectado()) {
      throw new Error('No hay conexión WebSocket. Llama a connect() primero.');
    }

    const request: CambioEstadoPedidoRequest = {
      pedidoId,
      nuevoEstadoId,
      tiempoEstimado
    };

    this.client.publish({
      destination: '/app/pedido.cambiarEstado',
      body: JSON.stringify(request)
    });

    this.log(`📤 Cambio de estado enviado:`, request);
  }

  /**
   * Registra un callback para ser notificado cuando cambia el estado de conexión
   * 
   * @param callback - Función que recibe true cuando se conecta, false cuando se desconecta
   * 
   * @example
   * ```typescript
   * wsService.onConexion((conectado) => {
   *   if (conectado) {
   *     console.log('WebSocket conectado');
   *   } else {
   *     console.log('WebSocket desconectado');
   *   }
   * });
   * ```
   */
  public onConexion(callback: ConexionCallback): void {
    this.callbacks.onConexion.push(callback);
  }

  /**
   * Registra un callback para ser notificado de errores
   * 
   * @param callback - Función que recibe el error
   * 
   * @example
   * ```typescript
   * wsService.onError((error) => {
   *   console.error('Error en WebSocket:', error.message);
   *   mostrarNotificacionError(error.message);
   * });
   * ```
   */
  public onError(callback: ErrorCallback): void {
    this.callbacks.onError.push(callback);
  }

  /**
   * Notifica a todos los callbacks registrados sobre cambios de conexión
   */
  private notificarConexion(conectado: boolean): void {
    this.callbacks.onConexion.forEach(callback => {
      try {
        callback(conectado);
      } catch (error) {
        this.log('❌ Error en callback de conexión:', error);
      }
    });
  }

  /**
   * Notifica a todos los callbacks registrados sobre errores
   */
  private notificarError(error: Error): void {
    this.callbacks.onError.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        this.log('❌ Error en callback de error:', err);
      }
    });
  }

  /**
   * Función de logging interna
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[PedidoWebSocketService]', ...args);
    }
  }
}

/**
 * Instancia singleton del servicio WebSocket
 * Usa esta instancia en toda tu aplicación para mantener una única conexión
 * 
 * @example
 * ```typescript
 * import { pedidoWebSocketService } from './services/websocket/PedidoWebSocketService';
 * 
 * // En tu componente o servicio
 * await pedidoWebSocketService.connect();
 * pedidoWebSocketService.suscribirseAPedidos(callback);
 * ```
 */
export const pedidoWebSocketService = new PedidoWebSocketService({
  url: import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws',
  autoReconnect: true,
  reconnectDelay: 5000,
  debug: import.meta.env.DEV
});
