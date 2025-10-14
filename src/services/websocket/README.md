# 🔌 WebSocket Service - Documentación Técnica

## 📁 Estructura de Archivos

```
services/websocket/
├── index.ts                      # Exportaciones principales
├── types.ts                      # Tipos TypeScript
├── PedidoWebSocketService.ts     # Servicio WebSocket
├── usePedidoWebSocket.tsx        # Hooks de React
└── README.md                     # Esta documentación
```

---

## 📄 Archivos

### `types.ts`
Define todos los tipos TypeScript utilizados en el sistema:
- `CambioEstadoPedidoRequest`: Request para cambiar estado
- `PedidoNotificacion`: Notificación recibida del backend
- `EstadoPedido`: Enum con los estados disponibles
- `WebSocketConfig`: Configuración del servicio
- Callbacks y tipos auxiliares

### `PedidoWebSocketService.ts`
Servicio principal que gestiona la conexión WebSocket:
- Conexión/desconexión al servidor
- Suscripción a diferentes topics
- Envío de cambios de estado
- Reconexión automática
- Manejo de errores

**Uso directo:**
```typescript
import { pedidoWebSocketService } from './services/websocket';

await pedidoWebSocketService.connect();
pedidoWebSocketService.suscribirseAPedidos(callback);
```

### `usePedidoWebSocket.tsx`
Hooks de React para facilitar el uso del servicio:

**`usePedidoWebSocket`**: Hook principal con gestión completa
```typescript
const { conectado, notificaciones, cambiarEstado } = usePedidoWebSocket({ tipo: 'admin' });
```

**`usePedidoNotificacion`**: Hook para solo recibir notificaciones
```typescript
usePedidoNotificacion({ tipo: 'usuario', usuarioId: 123 }, (notif) => {
  console.log(notif);
});
```

**`useWebSocketConexion`**: Hook para solo gestionar conexión
```typescript
const { conectado, conectar, desconectar } = useWebSocketConexion();
```

### `index.ts`
Archivo de exportación que expone toda la API pública del módulo.

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENTE REACT                          │
│                                                               │
│  usePedidoWebSocket({ tipo: 'admin' })                      │
│         │                                                     │
│         ├─ conectado: boolean                                │
│         ├─ notificaciones: PedidoNotificacion[]              │
│         └─ cambiarEstado(id, estado)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              PedidoWebSocketService                          │
│                                                               │
│  • Gestiona conexión STOMP                                   │
│  • Mantiene suscripciones activas                            │
│  • Envía mensajes al backend                                 │
│  • Notifica cambios a los hooks                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  STOMP over SockJS                           │
│                                                               │
│  • Protocolo de mensajería                                   │
│  • Conexión WebSocket persistente                            │
│  • Heartbeat para mantener conexión                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot)                           │
│                                                               │
│  ws://localhost:8080/ws                                      │
│                                                               │
│  Topics:                                                     │
│  • /topic/pedidos                                            │
│  • /topic/pedidos/admin                                      │
│  • /topic/pedidos/sucursal/{id}                              │
│  • /topic/pedidos/usuario/{id}                               │
│                                                               │
│  Endpoints:                                                  │
│  • /app/pedido.cambiarEstado                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Casos de Uso

### 1. Dashboard que muestra todos los pedidos
```typescript
const { notificaciones } = usePedidoWebSocket({ tipo: 'admin' });
```

### 2. Dashboard filtrado por sucursal
```typescript
const { notificaciones } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId: 1 
});
```

### 3. Vista de cliente
```typescript
const { notificaciones } = usePedidoWebSocket({ 
  tipo: 'usuario', 
  usuarioId: 123 
});
```

### 4. Cambiar estado de pedido
```typescript
const { cambiarEstado } = usePedidoWebSocket({ tipo: 'admin' });
cambiarEstado(42, EstadoPedido.EN_PREPARACION);
```

### 5. Notificaciones en tiempo real
```typescript
usePedidoNotificacion({ tipo: 'usuario', usuarioId: 123 }, (notif) => {
  toast.success(`Pedido #${notif.pedidoId} actualizado`);
});
```

---

## 🔒 Seguridad

### Autenticación (Pendiente)
El sistema actualmente no implementa autenticación en WebSocket. Para producción se recomienda:

1. Enviar token JWT en la conexión
2. Validar permisos en el backend
3. Filtrar notificaciones según rol del usuario

### CORS
El backend debe tener configurado CORS para permitir conexiones desde el frontend:
```java
.setAllowedOriginPatterns("*") // Desarrollo
.setAllowedOriginPatterns("https://tu-dominio.com") // Producción
```

---

## ⚡ Rendimiento

### Optimizaciones Implementadas

1. **Singleton Service**: Una única instancia de conexión WebSocket
2. **Historial Limitado**: Solo se mantienen las últimas 100 notificaciones
3. **Reconexión Inteligente**: Delay exponencial para evitar sobrecarga
4. **Heartbeat**: Mantiene la conexión viva sin overhead

### Recomendaciones

- No crear múltiples instancias del servicio
- Usar hooks en lugar del servicio directo
- Limpiar suscripciones cuando no se necesiten
- Filtrar notificaciones en el cliente si es necesario

---

## 🧪 Testing

### Probar Conexión
```typescript
const service = new PedidoWebSocketService({ 
  url: 'http://localhost:8080/ws',
  debug: true 
});

await service.connect();
console.log('Conectado:', service.isConectado());
```

### Probar Suscripción
```typescript
service.suscribirseAPedidos((notif) => {
  console.log('Notificación recibida:', notif);
});
```

### Probar Envío
```typescript
service.cambiarEstadoPedido(42, 2);
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# .env
VITE_WEBSOCKET_URL=http://localhost:8080/ws
```

### Configuración Personalizada
```typescript
const service = new PedidoWebSocketService({
  url: 'http://localhost:8080/ws',
  autoReconnect: true,
  reconnectDelay: 5000,  // 5 segundos
  debug: true
});
```

### Usar en Hooks
```typescript
const { ... } = usePedidoWebSocket(
  { tipo: 'admin' },
  {
    url: 'http://localhost:8080/ws',
    autoConnect: true,
    autoReconnect: true,
    debug: true
  }
);
```

---

## 📊 Estados del Sistema

### Estados de Conexión
- **Desconectado**: No hay conexión
- **Conectando**: Intentando conectar
- **Conectado**: Conexión establecida
- **Reconectando**: Intentando reconectar tras desconexión

### Estados de Pedido
1. **PENDIENTE**: Pedido recibido
2. **EN_PREPARACION**: En cocina
3. **LISTO**: Listo para entregar
4. **EN_CAMINO**: En delivery
5. **ENTREGADO**: Completado
6. **CANCELADO**: Cancelado

---

## 🐛 Debug

### Habilitar Logs
```typescript
const { ... } = usePedidoWebSocket(
  { tipo: 'admin' },
  { debug: true }
);
```

### Logs Disponibles
- `✅ Conectado al WebSocket`
- `❌ Desconectado del WebSocket`
- `📨 Notificación recibida de /topic/...`
- `📤 Cambio de estado enviado`
- `🔄 Intentando reconectar...`
- `🚫 Suscripción cancelada`

---

## 📚 Referencias

- [STOMP Protocol](https://stomp.github.io/)
- [SockJS](https://github.com/sockjs/sockjs-client)
- [Spring WebSocket](https://docs.spring.io/spring-framework/reference/web/websocket.html)

---

## 🚀 Próximas Mejoras

- [ ] Autenticación con JWT
- [ ] Compresión de mensajes
- [ ] Persistencia de notificaciones offline
- [ ] Notificaciones push del navegador
- [ ] Métricas y analytics
- [ ] Tests unitarios y de integración

---

## 📞 Soporte

Para más información, consulta:
- **WEBSOCKET_GUIA_COMPLETA.md**: Guía detallada con ejemplos
- **WEBSOCKET_QUICK_START.md**: Inicio rápido
- Código fuente con comentarios detallados
