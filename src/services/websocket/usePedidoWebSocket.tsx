import { useEffect, useState, useCallback, useRef } from 'react';
import { PedidoWebSocketService } from './PedidoWebSocketService';
import { PedidoNotificacion, EstadoPedido } from './types';

/**
 * Opciones de configuración para el hook usePedidoWebSocket
 */
interface UsePedidoWebSocketOptions {
  /** URL del servidor WebSocket (opcional, usa variable de entorno por defecto) */
  url?: string;
  
  /** Conectar automáticamente al montar el componente */
  autoConnect?: boolean;
  
  /** Reconectar automáticamente en caso de desconexión */
  autoReconnect?: boolean;
  
  /** Habilitar logs de debug */
  debug?: boolean;
}

/**
 * Tipo de suscripción disponible
 */
type TipoSuscripcion = 
  | { tipo: 'todos' }
  | { tipo: 'admin' }
  | { tipo: 'sucursal'; sucursalId: number }
  | { tipo: 'usuario'; usuarioId: number };

/**
 * Hook de React para gestionar WebSocket de pedidos de forma sencilla
 * 
 * Este hook proporciona:
 * - Gestión automática de conexión/desconexión
 * - Estado de conexión reactivo
 * - Suscripción fácil a diferentes topics
 * - Función para enviar cambios de estado
 * - Manejo de errores
 * 
 * @param suscripcion - Tipo de suscripción (todos, admin, sucursal, usuario)
 * @param options - Opciones de configuración
 * @returns Estado y funciones para interactuar con WebSocket
 * 
 * @example
 * ```tsx
 * // Dashboard de administrador - Ver todos los pedidos
 * function DashboardAdmin() {
 *   const { notificaciones, conectado, cambiarEstado } = usePedidoWebSocket({ tipo: 'admin' });
 *   
 *   return (
 *     <div>
 *       <p>Estado: {conectado ? 'Conectado' : 'Desconectado'}</p>
 *       {notificaciones.map(notif => (
 *         <div key={notif.pedidoId}>
 *           Pedido #{notif.pedidoId} - {notif.estadoNombre}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * // Dashboard de cocina - Ver pedidos de una sucursal
 * function DashboardCocina() {
 *   const sucursalId = 1;
 *   const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
 *     tipo: 'sucursal', 
 *     sucursalId 
 *   });
 *   
 *   const marcarEnPreparacion = (pedidoId: number) => {
 *     cambiarEstado(pedidoId, EstadoPedido.EN_PREPARACION);
 *   };
 *   
 *   return <div>...</div>;
 * }
 * 
 * // Vista de cliente - Ver sus propios pedidos
 * function MisPedidos() {
 *   const usuarioId = obtenerUsuarioLogueado();
 *   const { notificaciones } = usePedidoWebSocket({ 
 *     tipo: 'usuario', 
 *     usuarioId 
 *   });
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePedidoWebSocket(
  suscripcion: TipoSuscripcion,
  options: UsePedidoWebSocketOptions = {}
) {
  const {
    url = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws',
    autoConnect = true,
    autoReconnect = true,
    debug = import.meta.env.DEV
  } = options;

  // Estado
  const [conectado, setConectado] = useState(false);
  const [notificaciones, setNotificaciones] = useState<PedidoNotificacion[]>([]);
  const [ultimaNotificacion, setUltimaNotificacion] = useState<PedidoNotificacion | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Referencias
  const serviceRef = useRef<PedidoWebSocketService | null>(null);
  const subscriptionIdRef = useRef<string | null>(null);

  /**
   * Inicializa el servicio WebSocket
   */
  useEffect(() => {
    // Crear servicio si no existe
    if (!serviceRef.current) {
      serviceRef.current = new PedidoWebSocketService({
        url,
        autoReconnect,
        debug
      });

      // Registrar callbacks de conexión y error
      serviceRef.current.onConexion(setConectado);
      serviceRef.current.onError(setError);
    }

    // Conectar automáticamente si está habilitado
    if (autoConnect && !serviceRef.current.isConectado()) {
      serviceRef.current.connect().catch(err => {
        console.error('Error al conectar WebSocket:', err);
        setError(err);
      });
    }

    // Cleanup al desmontar
    return () => {
      if (subscriptionIdRef.current && serviceRef.current) {
        serviceRef.current.cancelarSuscripcion(subscriptionIdRef.current);
      }
    };
  }, [url, autoConnect, autoReconnect, debug]);

  /**
   * Gestiona la suscripción según el tipo
   */
  useEffect(() => {
    if (!serviceRef.current || !conectado) return;

    // Cancelar suscripción anterior si existe
    if (subscriptionIdRef.current) {
      serviceRef.current.cancelarSuscripcion(subscriptionIdRef.current);
    }

    // Callback para manejar notificaciones
    const handleNotificacion = (notificacion: PedidoNotificacion) => {
      setUltimaNotificacion(notificacion);
      setNotificaciones(prev => [notificacion, ...prev].slice(0, 100)); // Mantener últimas 100
    };

    // Suscribirse según el tipo
    try {
      switch (suscripcion.tipo) {
        case 'todos':
          subscriptionIdRef.current = serviceRef.current.suscribirseAPedidos(handleNotificacion);
          break;
        case 'admin':
          subscriptionIdRef.current = serviceRef.current.suscribirseAPedidosAdmin(handleNotificacion);
          break;
        case 'sucursal':
          subscriptionIdRef.current = serviceRef.current.suscribirseAPedidosSucursal(
            suscripcion.sucursalId,
            handleNotificacion
          );
          break;
        case 'usuario':
          subscriptionIdRef.current = serviceRef.current.suscribirseAPedidosUsuario(
            suscripcion.usuarioId,
            handleNotificacion
          );
          break;
      }
    } catch (err) {
      console.error('Error al suscribirse:', err);
      setError(err instanceof Error ? err : new Error('Error al suscribirse'));
    }

    // Cleanup
    return () => {
      if (subscriptionIdRef.current && serviceRef.current) {
        serviceRef.current.cancelarSuscripcion(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [conectado, suscripcion]);

  /**
   * Función para cambiar el estado de un pedido
   * 
   * @param pedidoId - ID del pedido
   * @param nuevoEstadoId - ID del nuevo estado
   * @param tiempoEstimado - Tiempo estimado opcional
   */
  const cambiarEstado = useCallback(
    (pedidoId: number, nuevoEstadoId: number | EstadoPedido, tiempoEstimado?: string) => {
      if (!serviceRef.current) {
        throw new Error('Servicio WebSocket no inicializado');
      }
      serviceRef.current.cambiarEstadoPedido(pedidoId, nuevoEstadoId, tiempoEstimado);
    },
    []
  );

  /**
   * Función para conectar manualmente
   */
  const conectar = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Servicio WebSocket no inicializado');
    }
    await serviceRef.current.connect();
  }, []);

  /**
   * Función para desconectar manualmente
   */
  const desconectar = useCallback(async () => {
    if (!serviceRef.current) return;
    await serviceRef.current.disconnect();
  }, []);

  /**
   * Función para limpiar las notificaciones
   */
  const limpiarNotificaciones = useCallback(() => {
    setNotificaciones([]);
    setUltimaNotificacion(null);
  }, []);

  return {
    /** Indica si el WebSocket está conectado */
    conectado,
    
    /** Array de todas las notificaciones recibidas (últimas 100) */
    notificaciones,
    
    /** Última notificación recibida */
    ultimaNotificacion,
    
    /** Error si ocurrió alguno */
    error,
    
    /** Función para cambiar el estado de un pedido */
    cambiarEstado,
    
    /** Función para conectar manualmente */
    conectar,
    
    /** Función para desconectar manualmente */
    desconectar,
    
    /** Función para limpiar las notificaciones */
    limpiarNotificaciones
  };
}

/**
 * Hook simplificado para recibir solo la última notificación
 * Útil cuando solo necesitas reaccionar a cambios sin mantener historial
 * 
 * @param suscripcion - Tipo de suscripción
 * @param callback - Función que se ejecuta cuando llega una notificación
 * @param options - Opciones de configuración
 * 
 * @example
 * ```tsx
 * function NotificacionesCliente() {
 *   const usuarioId = obtenerUsuarioLogueado();
 *   
 *   usePedidoNotificacion(
 *     { tipo: 'usuario', usuarioId },
 *     (notificacion) => {
 *       // Mostrar notificación toast
 *       toast.success(`Tu pedido #${notificacion.pedidoId} está ${notificacion.estadoNombre}`);
 *       
 *       // Reproducir sonido
 *       new Audio('/notification.mp3').play();
 *     }
 *   );
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePedidoNotificacion(
  suscripcion: TipoSuscripcion,
  callback: (notificacion: PedidoNotificacion) => void,
  options: UsePedidoWebSocketOptions = {}
) {
  const { ultimaNotificacion } = usePedidoWebSocket(suscripcion, options);

  useEffect(() => {
    if (ultimaNotificacion) {
      callback(ultimaNotificacion);
    }
  }, [ultimaNotificacion, callback]);
}

/**
 * Hook para obtener solo el estado de conexión
 * Útil para mostrar indicadores de conexión en la UI
 * 
 * @param options - Opciones de configuración
 * @returns Estado de conexión y funciones de control
 * 
 * @example
 * ```tsx
 * function ConexionIndicador() {
 *   const { conectado, conectar, desconectar } = useWebSocketConexion();
 *   
 *   return (
 *     <div>
 *       <span className={conectado ? 'text-green-500' : 'text-red-500'}>
 *         {conectado ? '● Conectado' : '● Desconectado'}
 *       </span>
 *       {!conectado && (
 *         <button onClick={conectar}>Reconectar</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useWebSocketConexion(options: UsePedidoWebSocketOptions = {}) {
  const {
    url = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws',
    autoConnect = true,
    autoReconnect = true,
    debug = import.meta.env.DEV
  } = options;

  const [conectado, setConectado] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const serviceRef = useRef<PedidoWebSocketService | null>(null);

  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = new PedidoWebSocketService({
        url,
        autoReconnect,
        debug
      });

      serviceRef.current.onConexion(setConectado);
      serviceRef.current.onError(setError);
    }

    if (autoConnect && !serviceRef.current.isConectado()) {
      serviceRef.current.connect().catch(setError);
    }
  }, [url, autoConnect, autoReconnect, debug]);

  const conectar = useCallback(async () => {
    if (!serviceRef.current) return;
    await serviceRef.current.connect();
  }, []);

  const desconectar = useCallback(async () => {
    if (!serviceRef.current) return;
    await serviceRef.current.disconnect();
  }, []);

  return { conectado, error, conectar, desconectar };
}
