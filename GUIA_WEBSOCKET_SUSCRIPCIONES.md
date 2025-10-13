# 🔌 Guía de Suscripciones WebSocket - El Buen Sabor

## 📋 Índice

1. [Topics Disponibles](#topics-disponibles)
2. [Suscripción por Tipo de Usuario](#suscripción-por-tipo-de-usuario)
3. [Ejemplos de Código](#ejemplos-de-código)
4. [Manejo de Errores](#manejo-de-errores)

---

## 📡 Topics Disponibles

| Topic | Descripción | Quién lo usa |
|-------|-------------|--------------|
| `/topic/pedidos` | Todos los pedidos (legacy) | Cualquier dashboard |
| `/topic/pedidos/admin` | Todos los pedidos | Administradores |
| `/topic/pedidos/sucursal/{id}` | Pedidos de una sucursal | Cocineros, Delivery |
| `/topic/pedidos/usuario/{id}` | Pedidos de un usuario | Clientes |

### Estructura de Notificación

```typescript
interface PedidoNotificacion {
  pedidoId: number;
  estadoId: number;
  estadoNombre: string;        // "PENDIENTE", "EN_PREPARACION", etc.
  tiempoEstimado: string;
  fecha: string;
  usuarioId: number;
  usuarioNombre: string;
  sucursalId: number;
  mensaje: string | null;
  timestamp: string;
}
```

### Estados de Pedido

| ID | Estado | Descripción |
|----|--------|-------------|
| 1 | `PENDIENTE` | Pedido recibido |
| 2 | `EN_PREPARACION` | En cocina |
| 3 | `LISTO` | Listo para entrega |
| 4 | `EN_CAMINO` | En delivery |
| 5 | `ENTREGADO` | Completado |
| 6 | `CANCELADO` | Cancelado |

---

## 👥 Suscripción por Tipo de Usuario

### 1️⃣ CLIENTE

**Topic:** `/topic/pedidos/usuario/{usuarioId}`

```typescript
import { useEffect } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function MisPedidos() {
  const usuarioId = 123; // ID del usuario logueado
  
  const { isConnected, subscribe, unsubscribe } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true
  });

  useEffect(() => {
    const handleNotificacion = (data) => {
      console.log('📦 Pedido actualizado:', data);
      // Actualizar UI con data.pedidoId, data.estadoNombre, etc.
    };

    subscribe(`/topic/pedidos/usuario/${usuarioId}`, handleNotificacion);

    return () => {
      unsubscribe(`/topic/pedidos/usuario/${usuarioId}`, handleNotificacion);
    };
  }, [subscribe, unsubscribe, usuarioId]);

  return <div>Estado: {isConnected ? '🟢' : '🔴'}</div>;
}
```

---

### 2️⃣ COCINERO

**Topic:** `/topic/pedidos/sucursal/{sucursalId}`

```typescript
import { useEffect, useState } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function DashboardCocina() {
  const sucursalId = 1; // ID de la sucursal
  const [pedidos, setPedidos] = useState([]);
  
  const { subscribe, unsubscribe, cambiarEstadoPedido } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true
  });

  useEffect(() => {
    const handlePedido = (data) => {
      console.log('🍳 Pedido:', data);
      
      // Actualizar lista de pedidos
      setPedidos(prev => {
        const index = prev.findIndex(p => p.id === data.pedidoId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], estado: data.estadoNombre };
          return updated;
        }
        return prev;
      });
    };

    subscribe(`/topic/pedidos/sucursal/${sucursalId}`, handlePedido);

    return () => {
      unsubscribe(`/topic/pedidos/sucursal/${sucursalId}`, handlePedido);
    };
  }, [subscribe, unsubscribe, sucursalId]);

  const marcarComoListo = (pedidoId) => {
    cambiarEstadoPedido(pedidoId, 3, '15 minutos'); // Estado 3 = LISTO
  };

  return (
    <div>
      {pedidos.map(pedido => (
        <div key={pedido.id}>
          <p>Pedido #{pedido.id} - {pedido.estado}</p>
          <button onClick={() => marcarComoListo(pedido.id)}>
            Marcar como Listo
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 3️⃣ DELIVERY

**Topic:** `/topic/pedidos/sucursal/{sucursalId}` (filtrar por estado LISTO)

```typescript
import { useEffect, useState } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function DashboardDelivery() {
  const sucursalId = 1;
  const [pedidosListos, setPedidosListos] = useState([]);
  
  const { subscribe, unsubscribe, cambiarEstadoPedido } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true
  });

  useEffect(() => {
    const handlePedido = (data) => {
      // Solo procesar pedidos LISTOS
      if (data.estadoNombre === 'LISTO') {
        console.log('🚚 Pedido listo:', data);
        setPedidosListos(prev => [...prev, {
          id: data.pedidoId,
          usuario: data.usuarioNombre
        }]);
      } else if (data.estadoNombre === 'EN_CAMINO') {
        // Remover pedido que ya está en camino
        setPedidosListos(prev => prev.filter(p => p.id !== data.pedidoId));
      }
    };

    subscribe(`/topic/pedidos/sucursal/${sucursalId}`, handlePedido);

    return () => {
      unsubscribe(`/topic/pedidos/sucursal/${sucursalId}`, handlePedido);
    };
  }, [subscribe, unsubscribe, sucursalId]);

  const tomarPedido = (pedidoId) => {
    cambiarEstadoPedido(pedidoId, 4); // Estado 4 = EN_CAMINO
  };

  return (
    <div>
      <h2>Pedidos Listos</h2>
      {pedidosListos.map(pedido => (
        <div key={pedido.id}>
          <p>Pedido #{pedido.id} - {pedido.usuario}</p>
          <button onClick={() => tomarPedido(pedido.id)}>
            Tomar Pedido
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 4️⃣ ADMINISTRADOR

**Topic:** `/topic/pedidos/admin`

```typescript
import { useEffect, useState } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function DashboardAdmin() {
  const [pedidos, setPedidos] = useState([]);
  
  const { subscribe, unsubscribe } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true
  });

  useEffect(() => {
    const handlePedido = (data) => {
      console.log('📊 Admin - Pedido:', data);
      
      setPedidos(prev => {
        const index = prev.findIndex(p => p.id === data.pedidoId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            estado: data.estadoNombre,
            sucursal: data.sucursalId,
            usuario: data.usuarioNombre
          };
          return updated;
        }
        return [...prev, {
          id: data.pedidoId,
          estado: data.estadoNombre,
          sucursal: data.sucursalId,
          usuario: data.usuarioNombre
        }];
      });
    };

    subscribe('/topic/pedidos/admin', handlePedido);

    return () => {
      unsubscribe('/topic/pedidos/admin', handlePedido);
    };
  }, [subscribe, unsubscribe]);

  return (
    <div>
      <h2>Todos los Pedidos</h2>
      {pedidos.map(pedido => (
        <div key={pedido.id}>
          <p>
            Pedido #{pedido.id} - Sucursal {pedido.sucursal} - 
            {pedido.usuario} - {pedido.estado}
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

### 5️⃣ MÚLTIPLES SUSCRIPCIONES

```typescript
function DashboardMultiple() {
  const usuarioId = 123;
  const sucursalId = 1;
  
  const { subscribe, unsubscribe } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true
  });

  useEffect(() => {
    const handleAdmin = (data) => {
      console.log('Admin:', data);
    };

    const handleSucursal = (data) => {
      console.log('Sucursal:', data);
    };

    // Suscribirse a múltiples topics
    subscribe('/topic/pedidos/admin', handleAdmin);
    subscribe(`/topic/pedidos/sucursal/${sucursalId}`, handleSucursal);

    return () => {
      unsubscribe('/topic/pedidos/admin', handleAdmin);
      unsubscribe(`/topic/pedidos/sucursal/${sucursalId}`, handleSucursal);
    };
  }, [subscribe, unsubscribe, sucursalId]);

  // ... resto del componente
}
```

---

## 💻 Ejemplos de Código

### Enviar Cambio de Estado

```typescript
const { cambiarEstadoPedido } = useStompWebSocket({
  url: import.meta.env.VITE_WS_URL,
  autoConnect: true
});

// Cambiar a EN_PREPARACION (estado 2) con tiempo estimado
cambiarEstadoPedido(42, 2, '30 minutos');

// Cambiar a LISTO (estado 3) sin tiempo estimado
cambiarEstadoPedido(42, 3);
```

### Notificaciones del Navegador

```typescript
useEffect(() => {
  const handleNotificacion = (data) => {
    if (Notification.permission === 'granted') {
      new Notification('El Buen Sabor', {
        body: `Pedido #${data.pedidoId} está ${data.estadoNombre}`,
        icon: '/logo.png'
      });
    }
  };

  subscribe(`/topic/pedidos/usuario/${usuarioId}`, handleNotificacion);

  // Solicitar permiso
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  return () => unsubscribe(`/topic/pedidos/usuario/${usuarioId}`, handleNotificacion);
}, [subscribe, unsubscribe, usuarioId]);
```

### Reproducir Sonido

```typescript
const handlePedido = (data) => {
  console.log('Pedido:', data);
  
  // Reproducir sonido
  const audio = new Audio('/notification.mp3');
  audio.play().catch(err => console.log('Error:', err));
};
```

---

## ⚠️ Manejo de Errores

### Verificar Conexión

```typescript
const { isConnected } = useStompWebSocket({
  url: import.meta.env.VITE_WS_URL,
  autoConnect: true,
  reconnectDelay: 5000 // Reintentar cada 5 segundos
});

useEffect(() => {
  if (!isConnected) {
    console.error('❌ WebSocket desconectado');
    // Mostrar alerta al usuario
  }
}, [isConnected]);
```

### Manejo de Errores en Callbacks

```typescript
const handlePedido = (data) => {
  try {
    // Procesar datos
    actualizarPedido(data);
  } catch (error) {
    console.error('Error procesando pedido:', error);
    // Mostrar mensaje de error al usuario
  }
};
```

### Reconexión Manual

```typescript
const { isConnected, connect, disconnect } = useStompWebSocket({
  url: import.meta.env.VITE_WS_URL,
  autoConnect: false // No conectar automáticamente
});

const handleReconnect = () => {
  disconnect();
  setTimeout(() => connect(), 1000);
};

return (
  <div>
    {!isConnected && (
      <button onClick={handleReconnect}>
        🔄 Reconectar
      </button>
    )}
  </div>
);
```

---

## 🎯 Mejores Prácticas

### 1. Siempre limpiar suscripciones

```typescript
useEffect(() => {
  const handler = (data) => { /* ... */ };
  subscribe('/topic/pedidos', handler);
  
  return () => unsubscribe('/topic/pedidos', handler); // ✅ Importante
}, [subscribe, unsubscribe]);
```

### 2. Usar debug en desarrollo

```typescript
const { subscribe } = useStompWebSocket({
  url: import.meta.env.VITE_WS_URL,
  autoConnect: true,
  debug: import.meta.env.VITE_ENV === 'development' // Solo en desarrollo
});
```

### 3. Validar datos recibidos

```typescript
const handlePedido = (data) => {
  if (!data || !data.pedidoId) {
    console.error('Datos inválidos:', data);
    return;
  }
  
  // Procesar datos válidos
  actualizarPedido(data);
};
```

### 4. Evitar múltiples conexiones

```typescript
// ❌ MAL: Crear múltiples instancias
function ComponenteA() {
  const ws1 = useStompWebSocket({ url: '...' });
}
function ComponenteB() {
  const ws2 = useStompWebSocket({ url: '...' });
}

// ✅ BIEN: Usar el mismo servicio singleton
import stompWebSocketService from './services/StompWebSocketService';

function ComponenteA() {
  useEffect(() => {
    stompWebSocketService.subscribe('/topic/pedidos', handler);
    return () => stompWebSocketService.unsubscribe('/topic/pedidos', handler);
  }, []);
}
```

---

## 🐛 Troubleshooting

### Problema: No se conecta

**Solución:**
1. Verificar que el backend esté corriendo en `localhost:8080`
2. Verificar la URL en `.env`: `VITE_WS_URL=http://localhost:8080/ws`
3. Habilitar `debug: true` para ver logs
4. Revisar CORS en el backend

### Problema: No recibo mensajes

**Solución:**
1. Verificar que estés suscrito al topic correcto
2. Verificar que el backend esté enviando a ese topic
3. Revisar la consola del navegador con `debug: true`
4. Verificar que el callback esté correctamente registrado

### Problema: Múltiples notificaciones duplicadas

**Solución:**
1. Asegurarte de desuscribirte en el cleanup de useEffect
2. Usar el mismo callback en subscribe y unsubscribe
3. No suscribirse múltiples veces al mismo topic

### Problema: Memory leaks

**Solución:**
```typescript
// ✅ BIEN: Limpiar correctamente
useEffect(() => {
  const handler = (data) => { /* ... */ };
  subscribe('/topic/pedidos', handler);
  return () => unsubscribe('/topic/pedidos', handler);
}, [subscribe, unsubscribe]);

// ❌ MAL: No limpiar
useEffect(() => {
  subscribe('/topic/pedidos', (data) => { /* ... */ });
  // Sin cleanup
}, []);
```

---

## 📚 Recursos Adicionales

- **Configuración Backend:** `ElBuenSabor-backend-PF25/BackEnd/WEBSOCKET_PEDIDOS_README.md`
- **Servicio STOMP:** `src/services/StompWebSocketService.ts`
- **Hook React:** `src/hooks/useStompWebSocket.ts`
- **Tipos TypeScript:** `src/types/websocket.types.ts`

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias: `npm install @stomp/stompjs sockjs-client`
- [ ] Configurar `.env` con `VITE_WS_URL=http://localhost:8080/ws`
- [ ] Importar `useStompWebSocket` en tu componente
- [ ] Suscribirse al topic apropiado según tipo de usuario
- [ ] Implementar handler para procesar notificaciones
- [ ] Implementar cleanup con `unsubscribe` en useEffect
- [ ] Verificar que el backend esté corriendo
- [ ] Probar con `debug: true` en desarrollo

---

**¡Listo para usar!** 🎉
