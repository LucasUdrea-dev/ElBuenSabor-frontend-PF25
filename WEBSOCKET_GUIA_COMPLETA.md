# 🔌 Guía Completa de WebSocket para Pedidos - Frontend

## 📋 Índice

1. [¿Qué es WebSocket?](#qué-es-websocket)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Instalación](#instalación)
4. [Uso Básico](#uso-básico)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [API Completa](#api-completa)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🤔 ¿Qué es WebSocket?

WebSocket es una tecnología que permite **comunicación bidireccional en tiempo real** entre el navegador (frontend) y el servidor (backend).

### Diferencia con HTTP tradicional:

**HTTP (Request-Response):**
```
Cliente → Servidor: "¿Hay algo nuevo?"
Servidor → Cliente: "No"
(5 segundos después)
Cliente → Servidor: "¿Y ahora?"
Servidor → Cliente: "Sí, hay un pedido nuevo"
```

**WebSocket (Tiempo Real):**
```
Cliente ↔ Servidor: Conexión permanente abierta
Servidor → Cliente: "¡Pedido nuevo!" (envía inmediatamente cuando ocurre)
```

### Ventajas:
- ✅ **Actualizaciones instantáneas** sin necesidad de recargar la página
- ✅ **Menor consumo de recursos** (no hay que preguntar constantemente)
- ✅ **Experiencia de usuario mejorada** (notificaciones en tiempo real)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                     │
│                                                               │
│  WebSocket Server: http://localhost:8080/ws                 │
│                                                               │
│  Endpoints:                                                  │
│  • /app/pedido.cambiarEstado (recibe cambios)               │
│                                                               │
│  Topics (canales de notificación):                          │
│  • /topic/pedidos (todos los pedidos)                       │
│  • /topic/pedidos/admin (solo admin)                        │
│  • /topic/pedidos/sucursal/{id} (por sucursal)              │
│  • /topic/pedidos/usuario/{id} (por usuario)                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ WebSocket Connection
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                    FRONTEND (React)                          │
│                                                               │
│  PedidoWebSocketService                                      │
│  ├─ Conecta al servidor                                      │
│  ├─ Se suscribe a topics                                     │
│  ├─ Recibe notificaciones                                    │
│  └─ Envía cambios de estado                                  │
│                                                               │
│  Hooks de React:                                             │
│  • usePedidoWebSocket (gestión completa)                     │
│  • usePedidoNotificacion (solo notificaciones)               │
│  • useWebSocketConexion (solo conexión)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Instalación

Las dependencias ya están instaladas en el proyecto:
- `sockjs-client`: Cliente WebSocket con fallback
- `@stomp/stompjs`: Protocolo STOMP sobre WebSocket

---

## 🚀 Uso Básico

### Opción 1: Usando el Hook de React (Recomendado)

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';

function DashboardCocina() {
  // Conectar y suscribirse a pedidos de la sucursal 1
  const { conectado, notificaciones, cambiarEstado } = usePedidoWebSocket({
    tipo: 'sucursal',
    sucursalId: 1
  });

  return (
    <div>
      <p>Estado: {conectado ? '🟢 Conectado' : '🔴 Desconectado'}</p>
      
      <h2>Pedidos Recientes</h2>
      {notificaciones.map(notif => (
        <div key={notif.pedidoId}>
          <p>Pedido #{notif.pedidoId}</p>
          <p>Estado: {notif.estadoNombre}</p>
          <button onClick={() => cambiarEstado(notif.pedidoId, EstadoPedido.EN_PREPARACION)}>
            Marcar en Preparación
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Opción 2: Usando el Servicio Directamente

```tsx
import { pedidoWebSocketService } from './services/websocket';
import { useEffect } from 'react';

function MiComponente() {
  useEffect(() => {
    // Conectar
    pedidoWebSocketService.connect().then(() => {
      console.log('Conectado!');
      
      // Suscribirse
      pedidoWebSocketService.suscribirseAPedidos((notificacion) => {
        console.log('Nueva notificación:', notificacion);
      });
    });

    // Desconectar al desmontar
    return () => {
      pedidoWebSocketService.disconnect();
    };
  }, []);

  return <div>...</div>;
}
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Dashboard de Administrador

```tsx
import { usePedidoWebSocket } from './services/websocket';

function DashboardAdmin() {
  const { conectado, notificaciones, error } = usePedidoWebSocket({ tipo: 'admin' });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <header>
        <h1>Dashboard Administrativo</h1>
        <span className={conectado ? 'badge-success' : 'badge-danger'}>
          {conectado ? 'Conectado' : 'Desconectado'}
        </span>
      </header>

      <div className="pedidos-grid">
        {notificaciones.map(notif => (
          <div key={notif.pedidoId} className="pedido-card">
            <h3>Pedido #{notif.pedidoId}</h3>
            <p>Cliente: {notif.usuarioNombre}</p>
            <p>Sucursal: {notif.sucursalId}</p>
            <p>Estado: <span className="badge">{notif.estadoNombre}</span></p>
            {notif.tiempoEstimado && <p>Tiempo: {notif.tiempoEstimado}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Ejemplo 2: Dashboard de Cocina

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';
import { useState, useEffect } from 'react';

function DashboardCocina() {
  const sucursalId = 1; // Obtener de contexto o props
  const { notificaciones, cambiarEstado } = usePedidoWebSocket({
    tipo: 'sucursal',
    sucursalId
  });

  // Filtrar pedidos por estado
  const pedidosPendientes = notificaciones.filter(n => n.estadoId === EstadoPedido.PENDIENTE);
  const pedidosEnPreparacion = notificaciones.filter(n => n.estadoId === EstadoPedido.EN_PREPARACION);

  const marcarEnPreparacion = (pedidoId: number) => {
    cambiarEstado(pedidoId, EstadoPedido.EN_PREPARACION);
  };

  const marcarListo = (pedidoId: number, tiempoEstimado: string) => {
    cambiarEstado(pedidoId, EstadoPedido.LISTO, tiempoEstimado);
  };

  return (
    <div className="cocina-dashboard">
      <div className="columna">
        <h2>Pendientes ({pedidosPendientes.length})</h2>
        {pedidosPendientes.map(pedido => (
          <div key={pedido.pedidoId} className="pedido-card">
            <h3>Pedido #{pedido.pedidoId}</h3>
            <button onClick={() => marcarEnPreparacion(pedido.pedidoId)}>
              Comenzar Preparación
            </button>
          </div>
        ))}
      </div>

      <div className="columna">
        <h2>En Preparación ({pedidosEnPreparacion.length})</h2>
        {pedidosEnPreparacion.map(pedido => (
          <div key={pedido.pedidoId} className="pedido-card">
            <h3>Pedido #{pedido.pedidoId}</h3>
            <input 
              type="text" 
              placeholder="Tiempo estimado"
              id={`tiempo-${pedido.pedidoId}`}
            />
            <button onClick={() => {
              const input = document.getElementById(`tiempo-${pedido.pedidoId}`) as HTMLInputElement;
              marcarListo(pedido.pedidoId, input.value);
            }}>
              Marcar Listo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Ejemplo 3: Notificaciones para Cliente

```tsx
import { usePedidoNotificacion } from './services/websocket';
import { toast } from 'react-toastify'; // o tu librería de notificaciones

function NotificacionesCliente() {
  const usuarioId = obtenerUsuarioLogueado(); // Tu función para obtener el usuario

  // Este hook solo ejecuta el callback cuando llega una notificación
  usePedidoNotificacion(
    { tipo: 'usuario', usuarioId },
    (notificacion) => {
      // Mostrar notificación toast
      toast.info(`Tu pedido #${notificacion.pedidoId} está ${notificacion.estadoNombre}`);
      
      // Reproducir sonido
      const audio = new Audio('/notification.mp3');
      audio.play();
      
      // Mostrar notificación del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Actualización de Pedido', {
          body: `Tu pedido #${notificacion.pedidoId} está ${notificacion.estadoNombre}`,
          icon: '/logo.png'
        });
      }
    }
  );

  return null; // Este componente solo maneja notificaciones
}

// Usar en tu App.tsx
function App() {
  return (
    <div>
      <NotificacionesCliente />
      {/* Resto de tu app */}
    </div>
  );
}
```

### Ejemplo 4: Indicador de Conexión

```tsx
import { useWebSocketConexion } from './services/websocket';

function ConexionIndicador() {
  const { conectado, error, conectar } = useWebSocketConexion();

  return (
    <div className="conexion-status">
      {conectado ? (
        <span className="text-green-500">🟢 Conectado</span>
      ) : (
        <div>
          <span className="text-red-500">🔴 Desconectado</span>
          <button onClick={conectar} className="btn-reconectar">
            Reconectar
          </button>
        </div>
      )}
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
}
```

### Ejemplo 5: Dashboard de Delivery

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';

function DashboardDelivery() {
  const sucursalId = 1;
  const { notificaciones, cambiarEstado } = usePedidoWebSocket({
    tipo: 'sucursal',
    sucursalId
  });

  // Solo mostrar pedidos listos y en camino
  const pedidosListos = notificaciones.filter(n => n.estadoId === EstadoPedido.LISTO);
  const pedidosEnCamino = notificaciones.filter(n => n.estadoId === EstadoPedido.EN_CAMINO);

  const tomarPedido = (pedidoId: number) => {
    cambiarEstado(pedidoId, EstadoPedido.EN_CAMINO);
  };

  const marcarEntregado = (pedidoId: number) => {
    cambiarEstado(pedidoId, EstadoPedido.ENTREGADO);
  };

  return (
    <div className="delivery-dashboard">
      <div className="columna">
        <h2>Listos para Entregar ({pedidosListos.length})</h2>
        {pedidosListos.map(pedido => (
          <div key={pedido.pedidoId} className="pedido-card">
            <h3>Pedido #{pedido.pedidoId}</h3>
            <p>Cliente: {pedido.usuarioNombre}</p>
            <p>Tiempo estimado: {pedido.tiempoEstimado}</p>
            <button onClick={() => tomarPedido(pedido.pedidoId)}>
              Tomar Pedido
            </button>
          </div>
        ))}
      </div>

      <div className="columna">
        <h2>En Camino ({pedidosEnCamino.length})</h2>
        {pedidosEnCamino.map(pedido => (
          <div key={pedido.pedidoId} className="pedido-card">
            <h3>Pedido #{pedido.pedidoId}</h3>
            <p>Cliente: {pedido.usuarioNombre}</p>
            <button onClick={() => marcarEntregado(pedido.pedidoId)}>
              Marcar como Entregado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📚 API Completa

### Hook: `usePedidoWebSocket`

```typescript
const {
  conectado,           // boolean: Estado de conexión
  notificaciones,      // PedidoNotificacion[]: Historial de notificaciones
  ultimaNotificacion,  // PedidoNotificacion | null: Última notificación
  error,               // Error | null: Error si ocurrió
  cambiarEstado,       // Function: Cambiar estado de pedido
  conectar,            // Function: Conectar manualmente
  desconectar,         // Function: Desconectar manualmente
  limpiarNotificaciones // Function: Limpiar historial
} = usePedidoWebSocket(suscripcion, options);
```

**Tipos de Suscripción:**
```typescript
// Ver todos los pedidos
{ tipo: 'todos' }

// Solo administradores
{ tipo: 'admin' }

// Pedidos de una sucursal
{ tipo: 'sucursal', sucursalId: 1 }

// Pedidos de un usuario
{ tipo: 'usuario', usuarioId: 123 }
```

**Opciones:**
```typescript
{
  url?: string,              // URL del WebSocket (default: env variable)
  autoConnect?: boolean,     // Conectar automáticamente (default: true)
  autoReconnect?: boolean,   // Reconectar automáticamente (default: true)
  debug?: boolean            // Habilitar logs (default: true en dev)
}
```

### Hook: `usePedidoNotificacion`

```typescript
usePedidoNotificacion(
  suscripcion,
  (notificacion) => {
    // Tu código aquí
  },
  options
);
```

### Hook: `useWebSocketConexion`

```typescript
const { conectado, error, conectar, desconectar } = useWebSocketConexion(options);
```

### Servicio: `PedidoWebSocketService`

```typescript
import { pedidoWebSocketService } from './services/websocket';

// Conectar
await pedidoWebSocketService.connect();

// Suscribirse
const subId = pedidoWebSocketService.suscribirseAPedidos(callback);
const subId = pedidoWebSocketService.suscribirseAPedidosAdmin(callback);
const subId = pedidoWebSocketService.suscribirseAPedidosSucursal(sucursalId, callback);
const subId = pedidoWebSocketService.suscribirseAPedidosUsuario(usuarioId, callback);

// Cancelar suscripción
pedidoWebSocketService.cancelarSuscripcion(subId);

// Cambiar estado
pedidoWebSocketService.cambiarEstadoPedido(pedidoId, estadoId, tiempoEstimado);

// Callbacks
pedidoWebSocketService.onConexion((conectado) => { ... });
pedidoWebSocketService.onError((error) => { ... });

// Desconectar
await pedidoWebSocketService.disconnect();
```

### Tipos

```typescript
interface PedidoNotificacion {
  pedidoId: number;
  estadoId: number;
  estadoNombre: string;
  tiempoEstimado?: string;
  fecha: string;
  usuarioId?: number;
  usuarioNombre?: string;
  sucursalId?: number;
  mensaje?: string;
  timestamp: string;
}

enum EstadoPedido {
  PENDIENTE = 1,
  EN_PREPARACION = 2,
  LISTO = 3,
  EN_CAMINO = 4,
  ENTREGADO = 5,
  CANCELADO = 6
}
```

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_WEBSOCKET_URL=http://localhost:8080/ws
```

Para producción:
```env
VITE_WEBSOCKET_URL=https://tu-dominio.com/ws
```

---

## 🐛 Solución de Problemas

### Problema: No se conecta al WebSocket

**Solución:**
1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Verifica que la URL en `.env` sea correcta
3. Revisa la consola del navegador para ver errores
4. Verifica que el backend tenga CORS configurado correctamente

### Problema: No recibo notificaciones

**Solución:**
1. Verifica que estés suscrito al topic correcto
2. Verifica que el `sucursalId` o `usuarioId` sean correctos
3. Revisa los logs del backend para ver si se están enviando notificaciones
4. Habilita `debug: true` en las opciones para ver logs detallados

### Problema: Se desconecta constantemente

**Solución:**
1. Verifica tu conexión a internet
2. Verifica que el backend esté estable
3. Aumenta el `reconnectDelay` en las opciones
4. Revisa los logs del backend para ver si hay errores

### Problema: Las notificaciones llegan duplicadas

**Solución:**
1. Asegúrate de no estar creando múltiples suscripciones
2. Usa el hook `usePedidoWebSocket` que gestiona automáticamente las suscripciones
3. Verifica que no estés llamando a `suscribirse` múltiples veces

---

## 📝 Mejores Prácticas

### 1. Usar el Hook en lugar del Servicio Directo

```tsx
// ✅ Recomendado
const { notificaciones } = usePedidoWebSocket({ tipo: 'admin' });

// ❌ No recomendado (más complejo)
useEffect(() => {
  pedidoWebSocketService.connect();
  pedidoWebSocketService.suscribirseAPedidos(...);
}, []);
```

### 2. Limpiar Suscripciones

```tsx
useEffect(() => {
  const subId = pedidoWebSocketService.suscribirseAPedidos(callback);
  
  return () => {
    pedidoWebSocketService.cancelarSuscripcion(subId);
  };
}, []);
```

### 3. Manejar Errores

```tsx
const { error } = usePedidoWebSocket({ tipo: 'admin' });

if (error) {
  return <div>Error: {error.message}</div>;
}
```

### 4. Mostrar Estado de Conexión

```tsx
const { conectado } = usePedidoWebSocket({ tipo: 'admin' });

return (
  <div>
    <span className={conectado ? 'online' : 'offline'}>
      {conectado ? '🟢 Online' : '🔴 Offline'}
    </span>
  </div>
);
```

---

## 🎯 Casos de Uso Completos

### Dashboard Completo con Todas las Funcionalidades

```tsx
import { usePedidoWebSocket, EstadoPedido, ESTADO_PEDIDO_NOMBRES } from './services/websocket';
import { useState } from 'react';

function DashboardCompleto() {
  const { conectado, notificaciones, cambiarEstado, error } = usePedidoWebSocket({ tipo: 'admin' });
  const [filtroEstado, setFiltroEstado] = useState<number | null>(null);

  const pedidosFiltrados = filtroEstado
    ? notificaciones.filter(n => n.estadoId === filtroEstado)
    : notificaciones;

  return (
    <div className="dashboard">
      {/* Header */}
      <header>
        <h1>Dashboard de Pedidos</h1>
        <div className="status">
          {conectado ? '🟢 Conectado' : '🔴 Desconectado'}
        </div>
      </header>

      {/* Filtros */}
      <div className="filtros">
        <button onClick={() => setFiltroEstado(null)}>Todos</button>
        {Object.entries(ESTADO_PEDIDO_NOMBRES).map(([id, nombre]) => (
          <button key={id} onClick={() => setFiltroEstado(Number(id))}>
            {nombre}
          </button>
        ))}
      </div>

      {/* Errores */}
      {error && (
        <div className="alert alert-error">
          Error: {error.message}
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="pedidos-lista">
        {pedidosFiltrados.map(pedido => (
          <div key={pedido.pedidoId} className="pedido-item">
            <h3>Pedido #{pedido.pedidoId}</h3>
            <p>Cliente: {pedido.usuarioNombre}</p>
            <p>Estado: {pedido.estadoNombre}</p>
            <p>Sucursal: {pedido.sucursalId}</p>
            {pedido.tiempoEstimado && <p>Tiempo: {pedido.tiempoEstimado}</p>}
            
            <div className="acciones">
              {pedido.estadoId === EstadoPedido.PENDIENTE && (
                <button onClick={() => cambiarEstado(pedido.pedidoId, EstadoPedido.EN_PREPARACION)}>
                  Comenzar Preparación
                </button>
              )}
              {pedido.estadoId === EstadoPedido.EN_PREPARACION && (
                <button onClick={() => cambiarEstado(pedido.pedidoId, EstadoPedido.LISTO, '15 minutos')}>
                  Marcar Listo
                </button>
              )}
              {pedido.estadoId === EstadoPedido.LISTO && (
                <button onClick={() => cambiarEstado(pedido.pedidoId, EstadoPedido.EN_CAMINO)}>
                  En Camino
                </button>
              )}
              {pedido.estadoId === EstadoPedido.EN_CAMINO && (
                <button onClick={() => cambiarEstado(pedido.pedidoId, EstadoPedido.ENTREGADO)}>
                  Entregado
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 ¡Listo para Usar!

Ahora tienes todo lo necesario para integrar WebSocket en tu aplicación. El sistema está diseñado para ser:

- ✅ **Fácil de usar**: Hooks de React simples
- ✅ **Robusto**: Reconexión automática y manejo de errores
- ✅ **Flexible**: Múltiples formas de uso según tus necesidades
- ✅ **Bien documentado**: Ejemplos y comentarios claros

Si tienes dudas, revisa los ejemplos o los comentarios en el código fuente.
