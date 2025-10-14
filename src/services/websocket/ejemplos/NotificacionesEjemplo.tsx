/**
 * EJEMPLO DE SISTEMA DE NOTIFICACIONES EN TIEMPO REAL
 * 
 * Este archivo muestra cómo implementar notificaciones para clientes que:
 * - Reciben actualizaciones de sus pedidos en tiempo real
 * - Muestran notificaciones toast
 * - Reproducen sonidos
 * - Solicitan permisos para notificaciones del navegador
 * - Muestran notificaciones push del navegador
 */

import { usePedidoNotificacion, PedidoNotificacion } from '../index';
import { useEffect, useState } from 'react';

/**
 * Componente de notificaciones para clientes
 * Debe ser incluido en el layout principal de la aplicación
 */
export function NotificacionesCliente() {
  const [permisoNotificaciones, setPermisoNotificaciones] = useState<NotificationPermission>('default');
  const [ultimaNotificacion, setUltimaNotificacion] = useState<PedidoNotificacion | null>(null);

  // ============================================================================
  // SOLICITAR PERMISOS DE NOTIFICACIONES DEL NAVEGADOR
  // ============================================================================
  
  useEffect(() => {
    if ('Notification' in window) {
      setPermisoNotificaciones(Notification.permission);
      
      // Solicitar permiso si aún no se ha solicitado
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setPermisoNotificaciones(permission);
        });
      }
    }
  }, []);

  // ============================================================================
  // OBTENER ID DEL USUARIO LOGUEADO
  // ============================================================================
  
  // TODO: Reemplazar con tu lógica para obtener el usuario logueado
  const obtenerUsuarioLogueado = (): number | null => {
    // Ejemplo: obtener del localStorage, contexto, o estado global
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return null;
  };

  const usuarioId = obtenerUsuarioLogueado();

  // ============================================================================
  // FUNCIONES DE NOTIFICACIÓN
  // ============================================================================
  
  /**
   * Muestra una notificación toast en la pantalla
   */
  const mostrarToast = (mensaje: string, tipo: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    // Si usas una librería como react-toastify:
    // toast[tipo](mensaje);
    
    // Implementación simple sin librería:
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${tipo === 'success' ? '#22c55e' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  /**
   * Reproduce un sonido de notificación
   */
  const reproducirSonido = (tipo: 'nuevo' | 'actualizado' | 'completado') => {
    const sonidos = {
      nuevo: '/sounds/new-order.mp3',
      actualizado: '/sounds/update.mp3',
      completado: '/sounds/completed.mp3'
    };
    
    const audio = new Audio(sonidos[tipo]);
    audio.volume = 0.5; // 50% de volumen
    audio.play().catch(err => {
      console.log('No se pudo reproducir el sonido:', err);
    });
  };

  /**
   * Muestra una notificación del navegador
   */
  const mostrarNotificacionNavegador = (titulo: string, mensaje: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(titulo, {
        body: mensaje,
        icon: '/logo.png', // Ruta a tu logo
        badge: '/badge.png', // Icono pequeño
        tag: 'pedido-update', // Agrupa notificaciones similares
        requireInteraction: false, // Se cierra automáticamente
      });
    }
  };

  /**
   * Vibra el dispositivo (móviles)
   */
  const vibrar = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]); // Patrón de vibración
    }
  };

  // ============================================================================
  // MANEJAR NOTIFICACIONES DE WEBSOCKET
  // ============================================================================
  
  const manejarNotificacion = (notificacion: PedidoNotificacion) => {
    console.log('📨 Notificación recibida:', notificacion);
    
    setUltimaNotificacion(notificacion);

    // Construir mensaje según el estado
    const mensajes: Record<string, { titulo: string; mensaje: string; tipo: 'info' | 'success' | 'warning' }> = {
      'INCOMING': {
        titulo: '📝 Pedido Recibido',
        mensaje: `Tu pedido #${notificacion.pedidoId} ha sido recibido y está siendo procesado.`,
        tipo: 'info'
      },
      'PREPARING': {
        titulo: '👨‍🍳 En Preparación',
        mensaje: `Tu pedido #${notificacion.pedidoId} está siendo preparado en la cocina.`,
        tipo: 'info'
      },
      'STANDBY': {
        titulo: '✅ Pedido Listo',
        mensaje: `Tu pedido #${notificacion.pedidoId} está listo para ser entregado${notificacion.tiempoEstimado ? ` (${notificacion.tiempoEstimado})` : ''}.`,
        tipo: 'success'
      },
      'DELIVERED': {
        titulo: '🎉 Pedido Entregado',
        mensaje: `Tu pedido #${notificacion.pedidoId} ha sido entregado. ¡Buen provecho!`,
        tipo: 'success'
      },
      'CANCELLED': {
        titulo: '❌ Pedido Cancelado',
        mensaje: `Tu pedido #${notificacion.pedidoId} ha sido cancelado.`,
        tipo: 'warning'
      },
      'REJECTED': {
        titulo: '⛔ Pedido Rechazado',
        mensaje: `Tu pedido #${notificacion.pedidoId} ha sido rechazado.`,
        tipo: 'warning'
      }
    };

    const notifInfo = mensajes[notificacion.estadoNombre] || {
      titulo: 'Actualización de Pedido',
      mensaje: `Tu pedido #${notificacion.pedidoId} ha sido actualizado.`,
      tipo: 'info' as const
    };

    // Mostrar notificaciones
    mostrarToast(notifInfo.mensaje, notifInfo.tipo);
    mostrarNotificacionNavegador(notifInfo.titulo, notifInfo.mensaje);
    
    // Efectos según el estado
    if (notificacion.estadoNombre === 'STANDBY') {
      reproducirSonido('completado');
      vibrar();
    } else if (notificacion.estadoNombre === 'DELIVERED') {
      reproducirSonido('completado');
      vibrar();
    } else {
      reproducirSonido('actualizado');
    }
  };

  // ============================================================================
  // SUSCRIBIRSE A NOTIFICACIONES DEL USUARIO
  // ============================================================================
  
  // Solo suscribirse si hay un usuario logueado
  if (usuarioId) {
    usePedidoNotificacion(
      { tipo: 'usuario', usuarioId },
      manejarNotificacion,
      { debug: true }
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="notificaciones-container">
      {/* Mostrar estado de permisos de notificaciones */}
      {permisoNotificaciones === 'denied' && (
        <div className="alert alert-warning">
          ⚠️ Las notificaciones del navegador están bloqueadas. 
          Habilítalas en la configuración de tu navegador para recibir alertas.
        </div>
      )}

      {permisoNotificaciones === 'default' && (
        <div className="alert alert-info">
          🔔 Habilita las notificaciones para recibir actualizaciones de tus pedidos.
          <button onClick={() => Notification.requestPermission().then(setPermisoNotificaciones)}>
            Habilitar
          </button>
        </div>
      )}

      {/* Mostrar última notificación recibida (opcional) */}
      {ultimaNotificacion && (
        <div className="ultima-notificacion">
          <h4>Última Actualización</h4>
          <p>Pedido #{ultimaNotificacion.pedidoId}</p>
          <p>Estado: {ultimaNotificacion.estadoNombre}</p>
          <small>{new Date(ultimaNotificacion.timestamp).toLocaleString()}</small>
        </div>
      )}
    </div>
  );
}

/**
 * Componente alternativo: Solo el indicador de notificaciones
 * Útil para mostrar en el navbar o header
 */
export function IndicadorNotificaciones() {
  const [contador, setContador] = useState(0);
  const usuarioId = obtenerUsuarioLogueado();

  if (!usuarioId) return null;

  usePedidoNotificacion(
    { tipo: 'usuario', usuarioId },
    () => {
      setContador(prev => prev + 1);
      
      // Resetear después de 3 segundos
      setTimeout(() => setContador(0), 3000);
    }
  );

  return (
    <div className="notificacion-badge">
      🔔
      {contador > 0 && (
        <span className="badge-contador">{contador}</span>
      )}
    </div>
  );
}

/**
 * Hook personalizado para gestionar notificaciones
 * Útil si quieres más control sobre las notificaciones
 */
export function useNotificacionesPedido(usuarioId: number) {
  const [notificaciones, setNotificaciones] = useState<PedidoNotificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);

  usePedidoNotificacion(
    { tipo: 'usuario', usuarioId },
    (notificacion) => {
      setNotificaciones(prev => [notificacion, ...prev].slice(0, 50)); // Últimas 50
      setNoLeidas(prev => prev + 1);
    }
  );

  const marcarComoLeidas = () => {
    setNoLeidas(0);
  };

  const limpiarNotificaciones = () => {
    setNotificaciones([]);
    setNoLeidas(0);
  };

  return {
    notificaciones,
    noLeidas,
    marcarComoLeidas,
    limpiarNotificaciones
  };
}

// ============================================================================
// FUNCIÓN AUXILIAR
// ============================================================================

function obtenerUsuarioLogueado(): number | null {
  // TODO: Implementar según tu sistema de autenticación
  const userStr = localStorage.getItem('usuario');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * ESTILOS CSS DE EJEMPLO
 * 
 * @keyframes slideIn {
 *   from {
 *     transform: translateX(100%);
 *     opacity: 0;
 *   }
 *   to {
 *     transform: translateX(0);
 *     opacity: 1;
 *   }
 * }
 * 
 * @keyframes slideOut {
 *   from {
 *     transform: translateX(0);
 *     opacity: 1;
 *   }
 *   to {
 *     transform: translateX(100%);
 *     opacity: 0;
 *   }
 * }
 * 
 * .notificacion-badge {
 *   position: relative;
 *   cursor: pointer;
 * }
 * 
 * .badge-contador {
 *   position: absolute;
 *   top: -8px;
 *   right: -8px;
 *   background: #ef4444;
 *   color: white;
 *   border-radius: 50%;
 *   width: 20px;
 *   height: 20px;
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 *   font-size: 12px;
 *   font-weight: bold;
 * }
 */
