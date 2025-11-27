# 📦 WebSocket Frontend - Resumen de Implementación

## ✅ ¿Qué se ha creado?

Se ha implementado un **sistema completo de WebSocket** para el frontend que se conecta al backend de Spring Boot y permite recibir/enviar actualizaciones de estado de pedidos en tiempo real.

---

## 📁 Archivos Creados

### 1. **Servicio WebSocket** (`src/services/websocket/`)

```
src/services/websocket/
├── index.ts                          # Exportaciones principales
├── types.ts                          # Tipos TypeScript
├── PedidoWebSocketService.ts         # Servicio principal
├── usePedidoWebSocket.tsx            # Hooks de React
├── README.md                         # Documentación técnica
└── ejemplos/
    ├── DashboardEjemplo.tsx          # Ejemplo de dashboard completo
    └── NotificacionesEjemplo.tsx     # Ejemplo de notificaciones
```

### 2. **Documentación**

- `WEBSOCKET_GUIA_COMPLETA.md` - Guía detallada con explicaciones y ejemplos
- `WEBSOCKET_QUICK_START.md` - Inicio rápido en 3 pasos
- `WEBSOCKET_RESUMEN.md` - Este archivo
- `.env.example` - Configuración de variables de entorno

### 3. **Dependencias Instaladas**

- `sockjs-client` - Cliente WebSocket con fallback
- `@stomp/stompjs` - Protocolo STOMP sobre WebSocket

---

## 🚀 Cómo Usar

### Opción 1: Hook de React (Recomendado)

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';

function MiDashboard() {
  const { conectado, notificaciones, cambiarEstado } = usePedidoWebSocket({
    tipo: 'admin' // o 'sucursal', 'usuario'
  });

  return (
    <div>
      <p>Estado: {conectado ? '🟢' : '🔴'}</p>
      {notificaciones.map(n => (
        <div key={n.pedidoId}>
          Pedido #{n.pedidoId} - {n.estadoNombre}
          <button onClick={() => cambiarEstado(n.pedidoId, EstadoPedido.LISTO)}>
            Marcar Listo
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Opción 2: Servicio Directo

```tsx
import { pedidoWebSocketService } from './services/websocket';

await pedidoWebSocketService.connect();
pedidoWebSocketService.suscribirseAPedidos((notificacion) => {
  console.log('Nueva notificación:', notificacion);
});
```

---

## 🎯 Tipos de Suscripción

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `admin` | Ver todos los pedidos | Dashboard administrativo |
| `sucursal` | Ver pedidos de una sucursal | Dashboard cocina/delivery |
| `usuario` | Ver pedidos de un usuario | Vista cliente |
| `todos` | Ver todos (legacy) | Cualquier dashboard |

---

## 📊 Estados de Pedido

```typescript
EstadoPedido.PREPARING   // 1 - En preparación (cocina)
EstadoPedido.STANDBY     // 2 - En espera/listo para entregar
EstadoPedido.CANCELLED   // 3 - Cancelado
EstadoPedido.REJECTED    // 4 - Rechazado
EstadoPedido.INCOMING    // 5 - Nuevo/entrante
EstadoPedido.DELIVERED   // 6 - Entregado
```

**Flujo normal:** `INCOMING → PREPARING → STANDBY → DELIVERED`

---

## 🔧 Configuración

### 1. Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_WEBSOCKET_URL=http://localhost:8080/ws
```

### 2. Verificar Backend

Asegúrate de que el backend esté corriendo en `http://localhost:8080`

---

## 📚 Hooks Disponibles

### `usePedidoWebSocket`
Hook principal con gestión completa de WebSocket.

**Retorna:**
- `conectado`: Estado de conexión
- `notificaciones`: Array de notificaciones recibidas
- `ultimaNotificacion`: Última notificación
- `error`: Error si ocurrió
- `cambiarEstado()`: Función para cambiar estado de pedido
- `conectar()`: Conectar manualmente
- `desconectar()`: Desconectar manualmente
- `limpiarNotificaciones()`: Limpiar historial

### `usePedidoNotificacion`
Hook simplificado para solo recibir notificaciones.

```tsx
usePedidoNotificacion(
  { tipo: 'usuario', usuarioId: 123 },
  (notificacion) => {
    alert(`Pedido #${notificacion.pedidoId} actualizado`);
  }
);
```

### `useWebSocketConexion`
Hook para solo gestionar la conexión.

```tsx
const { conectado, conectar, desconectar } = useWebSocketConexion();
```

---

## 💡 Ejemplos de Uso

### Dashboard de Administrador

```tsx
const { notificaciones } = usePedidoWebSocket({ tipo: 'admin' });
// Ve TODOS los pedidos de TODAS las sucursales
```

### Dashboard de Cocina

```tsx
const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId: 1 
});
// Ve solo pedidos de la sucursal 1
// Puede cambiar estados
```

### Dashboard de Delivery

```tsx
const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId: 1 
});
// Ve solo pedidos de la sucursal 1
// Puede marcar como "En Camino" y "Entregado"
```

### Vista de Cliente

```tsx
const usuarioId = obtenerUsuarioLogueado();
const { notificaciones } = usePedidoWebSocket({ 
  tipo: 'usuario', 
  usuarioId 
});
// Ve solo SUS propios pedidos
// NO puede cambiar estados
```

---

## 🔔 Sistema de Notificaciones

Ver `src/services/websocket/ejemplos/NotificacionesEjemplo.tsx` para un ejemplo completo que incluye:

- ✅ Notificaciones toast
- ✅ Notificaciones del navegador
- ✅ Sonidos
- ✅ Vibración (móviles)
- ✅ Permisos del navegador

---

## 🎨 Componentes de Ejemplo

### Dashboard Completo
`src/services/websocket/ejemplos/DashboardEjemplo.tsx`

Incluye:
- Estado de conexión
- Filtros por estado
- Búsqueda
- Estadísticas
- Acciones según estado
- Manejo de errores

### Sistema de Notificaciones
`src/services/websocket/ejemplos/NotificacionesEjemplo.tsx`

Incluye:
- Notificaciones para clientes
- Permisos del navegador
- Sonidos y vibración
- Indicador de notificaciones

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│  COMPONENTE REACT                                        │
│  usePedidoWebSocket({ tipo: 'admin' })                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  PedidoWebSocketService                                  │
│  • Conecta al servidor                                   │
│  • Se suscribe a topics                                  │
│  • Recibe/envía mensajes                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  BACKEND (Spring Boot)                                   │
│  ws://localhost:8080/ws                                  │
│                                                           │
│  Topics:                                                 │
│  • /topic/pedidos/admin                                  │
│  • /topic/pedidos/sucursal/{id}                          │
│  • /topic/pedidos/usuario/{id}                           │
│                                                           │
│  Endpoints:                                              │
│  • /app/pedido.cambiarEstado                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| No conecta | Verifica que el backend esté en `http://localhost:8080` |
| No recibo notificaciones | Verifica el `sucursalId` o `usuarioId` correcto |
| Se desconecta | Normal, se reconecta automáticamente |
| Notificaciones duplicadas | Usa el hook, no el servicio directo |
| Error de CORS | Verifica configuración CORS en el backend |

---

## 📖 Documentación Completa

### Para Desarrolladores que NO conocen WebSocket
👉 **WEBSOCKET_GUIA_COMPLETA.md**
- Explicación de qué es WebSocket
- Diferencia con HTTP
- Arquitectura del sistema
- Ejemplos paso a paso
- API completa
- Mejores prácticas

### Para Inicio Rápido
👉 **WEBSOCKET_QUICK_START.md**
- Inicio en 3 pasos
- Ejemplos por dashboard
- Configuración básica
- Checklist de implementación

### Para Detalles Técnicos
👉 **src/services/websocket/README.md**
- Estructura de archivos
- Flujo de datos
- Configuración avanzada
- Testing
- Próximas mejoras

---

## ✅ Características Implementadas

- ✅ Conexión WebSocket con STOMP
- ✅ Reconexión automática
- ✅ Suscripción a múltiples topics
- ✅ Envío de cambios de estado
- ✅ Hooks de React fáciles de usar
- ✅ Manejo de errores
- ✅ TypeScript completo
- ✅ Documentación exhaustiva
- ✅ Ejemplos prácticos
- ✅ Comentarios claros en el código

---

## 🚀 Próximos Pasos

1. **Copiar el código de ejemplo** a tu componente
2. **Adaptar según tu dashboard** (admin, cocina, delivery, cliente)
3. **Configurar variables de entorno**
4. **Probar con el backend corriendo**
5. **Agregar estilos CSS**
6. **Implementar notificaciones** (opcional)

---

## 🎯 Casos de Uso Reales

### Escenario 1: Dashboard de Cocina
```tsx
// 1. Cocinero ve pedidos nuevos (INCOMING)
// 2. Hace clic en "Comenzar Preparación"
// 3. WebSocket envía cambio al backend (INCOMING → PREPARING)
// 4. Backend actualiza BD y notifica a todos
// 5. Cliente recibe notificación "Tu pedido está en preparación"
// 6. Cuando termina, marca como STANDBY (listo para entregar)
```

### Escenario 2: Cliente Esperando su Pedido
```tsx
// 1. Cliente hace pedido (estado INCOMING)
// 2. Se suscribe a notificaciones de su usuario
// 3. Recibe actualización cuando cambia a PREPARING
// 4. Recibe actualización cuando cambia a STANDBY (listo)
// 5. Recibe actualización cuando cambia a DELIVERED
```

### Escenario 3: Administrador Monitoreando
```tsx
// 1. Admin se suscribe a todos los pedidos
// 2. Ve pedidos de TODAS las sucursales en tiempo real
// 3. Puede intervenir y cambiar estados si es necesario
// 4. Ve estadísticas actualizadas en tiempo real
```

---

## 📞 Soporte

Si tienes dudas:
1. Revisa **WEBSOCKET_GUIA_COMPLETA.md**
2. Revisa los ejemplos en `src/services/websocket/ejemplos/`
3. Revisa los comentarios en el código fuente
4. Habilita `debug: true` para ver logs detallados

---

## 🎉 ¡Todo Listo!

El sistema de WebSocket está **completamente implementado y documentado**. 

Solo necesitas:
1. Importar el hook
2. Elegir el tipo de suscripción
3. Usar las notificaciones en tu UI

**¡Es así de simple!** 🚀
