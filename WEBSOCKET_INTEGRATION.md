# 🚀 Guía de Integración - WebSocket Service (STOMP)

## ⚠️ IMPORTANTE: El Backend usa STOMP

El backend de El Buen Sabor usa **STOMP sobre WebSocket** (no WebSocket puro). Por lo tanto, debes usar los archivos con prefijo **Stomp**.

## 📋 Archivos Creados

```
src/
├── services/
│   └── StompWebSocketService.ts     # Servicio STOMP
├── hooks/
│   └── useStompWebSocket.ts         # Hook de React para STOMP
├── types/
│   └── websocket.types.ts           # Tipos TypeScript
├── .env                              # Variables de entorno (configurado)
└── .env.example                      # Ejemplo de variables de entorno
```

## 🎯 Pasos de Integración

### 1. Instalar Dependencias

**IMPORTANTE:** Debes instalar las librerías de STOMP:

```bash
npm install @stomp/stompjs sockjs-client
npm install --save-dev @types/sockjs-client
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tu URL de WebSocket:

```env
VITE_WS_URL=http://localhost:8080/ws
```

**Nota:** Usa `http://` (no `ws://`) porque SockJS maneja la conexión WebSocket internamente.

### 3. Opción A: Uso Directo en Componentes (Recomendado)

```tsx
import { useEffect } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function MiComponente() {
  const { isConnected, subscribe, unsubscribe, cambiarEstadoPedido } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true,
    debug: true
  });

  useEffect(() => {
    const handlePedido = (data) => {
      console.log('Pedido actualizado:', data);
    };

    // Suscribirse a todos los pedidos
    subscribe('/topic/pedidos', handlePedido);
    
    // O suscribirse a pedidos de un usuario específico
    const usuarioId = 123;
    subscribe(`/topic/pedidos/usuario/${usuarioId}`, handlePedido);

    return () => {
      unsubscribe('/topic/pedidos', handlePedido);
      unsubscribe(`/topic/pedidos/usuario/${usuarioId}`, handlePedido);
    };
  }, [subscribe, unsubscribe]);

  const handleCambiarEstado = () => {
    cambiarEstadoPedido(42, 3, '15 minutos'); // Cambiar pedido 42 a estado 3
  };

  return (
    <div>
      <p>Estado: {isConnected ? 'Conectado' : 'Desconectado'}</p>
      <button onClick={handleCambiarEstado}>Cambiar Estado</button>
    </div>
  );
}
```

### 4. Opción B: Uso Directo del Servicio (Sin Hook)

```tsx
import { useEffect } from 'react';
import stompWebSocketService from './services/StompWebSocketService';

function MiComponente() {
  useEffect(() => {
    // Conectar
    stompWebSocketService.connect({
      url: import.meta.env.VITE_WS_URL,
      debug: true
    });

    // Suscribirse
    const handlePedido = (data) => {
      console.log('Pedido:', data);
    };
    stompWebSocketService.subscribe('/topic/pedidos', handlePedido);

    // Cleanup
    return () => {
      stompWebSocketService.unsubscribe('/topic/pedidos', handlePedido);
      stompWebSocketService.disconnect();
    };
  }, []);

  const cambiarEstado = () => {
    stompWebSocketService.cambiarEstadoPedido(42, 3, '15 minutos');
  };

  return <button onClick={cambiarEstado}>Cambiar Estado</button>;
}
```

## 📦 Casos de Uso Comunes

### 1. Dashboard de Cocina (Pedidos por Sucursal)

```tsx
import { useEffect, useState } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function DashboardCocina() {
  const [pedidos, setPedidos] = useState([]);
  const sucursalId = 1; // ID de la sucursal
  
  const { isConnected, subscribe, unsubscribe, cambiarEstadoPedido } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true
  });

  useEffect(() => {
    const handlePedido = (data) => {
      console.log('Pedido actualizado:', data);
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

    // Suscribirse a pedidos de esta sucursal
    subscribe(`/topic/pedidos/sucursal/${sucursalId}`, handlePedido);

    return () => unsubscribe(`/topic/pedidos/sucursal/${sucursalId}`, handlePedido);
  }, [subscribe, unsubscribe, sucursalId]);

  const marcarComoListo = (pedidoId) => {
    cambiarEstadoPedido(pedidoId, 3, '15 minutos'); // Estado 3 = LISTO
  };

  return (
    <div>
      <h2>Pedidos de Cocina {isConnected ? '🟢' : '🔴'}</h2>
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

### 2. Notificaciones para Cliente (Por Usuario)

```tsx
import { useEffect, useState } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function NotificacionesCliente() {
  const [notificaciones, setNotificaciones] = useState([]);
  const usuarioId = 123; // ID del usuario logueado
  
  const { subscribe, unsubscribe } = useStompWebSocket({
    url: import.meta.env.VITE_WS_URL,
    autoConnect: true
  });

  useEffect(() => {
    const handleNotificacion = (data) => {
      setNotificaciones(prev => [...prev, data]);
      
      // Mostrar notificación del navegador
      if (Notification.permission === 'granted') {
        new Notification('El Buen Sabor', {
          body: `Tu pedido #${data.pedidoId} está ${data.estadoNombre}`,
          icon: '/logo.png'
        });
      }
    };

    subscribe(`/topic/pedidos/usuario/${usuarioId}`, handleNotificacion);

    return () => unsubscribe(`/topic/pedidos/usuario/${usuarioId}`, handleNotificacion);
  }, [subscribe, unsubscribe, usuarioId]);

  return (
    <div>
      <h3>Mis Notificaciones</h3>
      {notificaciones.map((notif, i) => (
        <div key={i}>
          Pedido #{notif.pedidoId}: {notif.estadoNombre}
        </div>
      ))}
    </div>
  );
}
```

### 3. Dashboard Admin (Todos los Pedidos)

```tsx
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
      console.log('📊 Admin - Pedido actualizado:', data);
      setPedidos(prev => {
        const index = prev.findIndex(p => p.id === data.pedidoId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], estado: data.estadoNombre };
          return updated;
        }
        return [...prev, { id: data.pedidoId, estado: data.estadoNombre }];
      });
    };

    subscribe('/topic/pedidos/admin', handlePedido);
    return () => unsubscribe('/topic/pedidos/admin', handlePedido);
  }, [subscribe, unsubscribe]);

  return (
    <div>
      <h2>Todos los Pedidos</h2>
      {pedidos.map(pedido => (
        <div key={pedido.id}>
          Pedido #{pedido.id} - {pedido.estado}
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Configuración del Backend

El backend debe tener un endpoint WebSocket. Ejemplo con Spring Boot:

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler(), "/ws")
                .setAllowedOrigins("http://localhost:5173"); // URL del frontend
    }
    
    @Bean
    public WebSocketHandler webSocketHandler() {
        return new MyWebSocketHandler();
    }
}
```

### Formato de Mensajes

El servicio espera mensajes en formato JSON:

```json
{
  "type": "orderUpdate",
  "data": {
    "orderId": 123,
    "status": "preparing",
    "estimatedTime": 15,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🧪 Testing

Para probar el WebSocket sin backend, puedes usar un servidor de prueba:

```bash
npm install -g wscat
wscat -l 8080
```

O usar el componente de ejemplo:

```tsx
import WebSocketExample from './services/WebSocketExample';

function App() {
  return <WebSocketExample />;
}
```

## 🐛 Troubleshooting

### Problema: No se conecta al WebSocket

**Solución:**
1. Verifica que la URL en `.env` sea correcta
2. Verifica que el backend esté corriendo
3. Revisa la consola con `debug: true`

### Problema: Los mensajes no se reciben

**Solución:**
1. Verifica que estés suscrito al evento correcto con `on()`
2. Verifica el formato del mensaje del backend
3. Usa `debug: true` para ver los mensajes en consola

### Problema: Memory leaks

**Solución:**
Siempre limpia los listeners en el cleanup del useEffect:

```tsx
useEffect(() => {
  const handler = (data) => { /* ... */ };
  on('event', handler);
  return () => off('event', handler); // ✅ Importante
}, [on, off]);
```

## 📚 Recursos Adicionales

- **Servicio STOMP:** `src/services/StompWebSocketService.ts`
- **Hook de React:** `src/hooks/useStompWebSocket.ts`
- **Tipos TypeScript:** `src/types/websocket.types.ts`
- **Componente de prueba:** `src/components/WebSocketTest.tsx`

## 🎓 Mejores Prácticas

1. **Siempre limpia los listeners** en el cleanup de useEffect
2. **Usa el Context** si necesitas WebSocket en múltiples componentes
3. **Habilita debug** durante el desarrollo
4. **Maneja errores** con los eventos `error` y `maxReconnectAttemptsReached`
5. **Usa tipos TypeScript** para mayor seguridad

## 📡 Soporte

Para dudas o problemas, revisa:
- [Guía de Suscripciones](GUIA_WEBSOCKET_SUSCRIPCIONES.md) - Ejemplos por tipo de usuario
- [Cómo Verificar](COMO_VERIFICAR_WEBSOCKET.md) - Troubleshooting y verificación
- [Setup Rápido](WEBSOCKET_SETUP.md) - Instalación rápida
