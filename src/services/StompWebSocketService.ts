import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type MessageCallback = (data: any) => void;

interface StompConfig {
  url: string;
  debug?: boolean;
  reconnectDelay?: number;
}

/**
 * Servicio WebSocket usando STOMP para El Buen Sabor
 * Compatible con el backend Spring Boot
 */
class StompWebSocketService {
  private client: Client | null = null;
  private url: string = '';
  private debug: boolean = false;
  private reconnectDelay: number = 5000;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageCallbacks: Map<string, Set<MessageCallback>> = new Map();
  private isConnected: boolean = false;
  private connectionCallbacks: Set<() => void> = new Set();
  private disconnectionCallbacks: Set<() => void> = new Set();

  constructor() {
    this.log('StompWebSocketService initialized');
  }

  /**
   * Conecta al servidor WebSocket usando STOMP
   */
  public connect(config: StompConfig): void {
    this.url = config.url;
    this.debug = config.debug || false;
    this.reconnectDelay = config.reconnectDelay || 5000;

    this.log(`Connecting to STOMP WebSocket: ${this.url}`);

    // Crear cliente STOMP
    this.client = new Client({
      // Usar SockJS como transporte (compatible con Spring Boot)
      webSocketFactory: () => new SockJS(this.url) as any,
      
      // Configuración de debug
      debug: (str) => {
        if (this.debug) {
          console.log('[STOMP]', str);
        }
      },

      // Reconexión automática
      reconnectDelay: this.reconnectDelay,

      // Heartbeat (mantener conexión viva)
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // Callbacks
      onConnect: () => {
        this.log('Connected to STOMP server');
        this.isConnected = true;
        this.connectionCallbacks.forEach(callback => callback());
      },

      onDisconnect: () => {
        this.log('Disconnected from STOMP server');
        this.isConnected = false;
        this.disconnectionCallbacks.forEach(callback => callback());
      },

      onStompError: (frame) => {
        this.log('STOMP error:', frame);
      },

      onWebSocketError: (event) => {
        this.log('WebSocket error:', event);
      }
    });

    // Activar el cliente
    this.client.activate();
  }

  /**
   * Suscribe a un topic para recibir mensajes
   * 
   * Topics disponibles:
   * - /topic/pedidos - Todos los pedidos (legacy)
   * - /topic/pedidos/admin - Para administradores
   * - /topic/pedidos/sucursal/{id} - Por sucursal
   * - /topic/pedidos/usuario/{id} - Por usuario
   */
  public subscribe(topic: string, callback: MessageCallback): void {
    if (!this.client) {
      this.log('Client not initialized. Call connect() first.');
      return;
    }

    // Guardar callback
    if (!this.messageCallbacks.has(topic)) {
      this.messageCallbacks.set(topic, new Set());
    }
    this.messageCallbacks.get(topic)!.add(callback);

    // Si ya está conectado, suscribirse inmediatamente
    if (this.isConnected && !this.subscriptions.has(topic)) {
      this.performSubscription(topic);
    } else if (!this.isConnected) {
      // Si no está conectado, suscribirse cuando se conecte
      const connectCallback = () => {
        if (!this.subscriptions.has(topic)) {
          this.performSubscription(topic);
        }
      };
      this.connectionCallbacks.add(connectCallback);
    }

    this.log(`Subscribed to topic: ${topic}`);
  }

  /**
   * Realiza la suscripción real al topic
   */
  private performSubscription(topic: string): void {
    if (!this.client || !this.isConnected) return;

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      this.log(`Message received from ${topic}:`, message.body);
      
      try {
        const data = JSON.parse(message.body);
        
        // Llamar a todos los callbacks registrados para este topic
        const callbacks = this.messageCallbacks.get(topic);
        if (callbacks) {
          callbacks.forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              this.log(`Error in callback for topic ${topic}:`, error);
            }
          });
        }
      } catch (error) {
        this.log('Error parsing message:', error);
      }
    });

    this.subscriptions.set(topic, subscription);
  }

  /**
   * Desuscribe de un topic
   */
  public unsubscribe(topic: string, callback?: MessageCallback): void {
    if (callback) {
      // Remover callback específico
      const callbacks = this.messageCallbacks.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        
        // Si no quedan callbacks, desuscribirse del topic
        if (callbacks.size === 0) {
          this.unsubscribeFromTopic(topic);
        }
      }
    } else {
      // Desuscribirse completamente del topic
      this.unsubscribeFromTopic(topic);
    }

    this.log(`Unsubscribed from topic: ${topic}`);
  }

  /**
   * Desuscribe completamente de un topic
   */
  private unsubscribeFromTopic(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
    this.messageCallbacks.delete(topic);
  }

  /**
   * Envía un mensaje al servidor
   * 
   * Destinos disponibles:
   * - /app/pedido.cambiarEstado - Cambiar estado de pedido
   */
  public send(destination: string, body: any): void {
    if (!this.client || !this.isConnected) {
      this.log('Cannot send message: not connected');
      return;
    }

    try {
      const message = typeof body === 'string' ? body : JSON.stringify(body);
      this.client.publish({
        destination,
        body: message
      });
      this.log(`Message sent to ${destination}:`, message);
    } catch (error) {
      this.log('Error sending message:', error);
    }
  }

  /**
   * Cambia el estado de un pedido (método de conveniencia)
   */
  public cambiarEstadoPedido(pedidoId: number, nuevoEstadoId: number, tiempoEstimado?: string): void {
    this.send('/app/pedido.cambiarEstado', {
      pedidoId,
      nuevoEstadoId,
      tiempoEstimado
    });
  }

  /**
   * Registra un callback para cuando se conecte
   */
  public onConnect(callback: () => void): void {
    this.connectionCallbacks.add(callback);
    
    // Si ya está conectado, llamar inmediatamente
    if (this.isConnected) {
      callback();
    }
  }

  /**
   * Registra un callback para cuando se desconecte
   */
  public onDisconnect(callback: () => void): void {
    this.disconnectionCallbacks.add(callback);
  }

  /**
   * Desconecta del servidor
   */
  public disconnect(): void {
    if (this.client) {
      this.log('Disconnecting from STOMP server');
      
      // Desuscribirse de todos los topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.messageCallbacks.clear();
      
      // Desactivar cliente
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Verifica si está conectado
   */
  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Logger interno
   */
  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[StompWebSocketService]', ...args);
    }
  }
}

// Exportar instancia singleton
export const stompWebSocketService = new StompWebSocketService();
export default stompWebSocketService;
