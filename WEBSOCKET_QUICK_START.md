# 🚀 WebSocket Quick Start

## Inicio Rápido en 3 Pasos

### 1️⃣ Importar el Hook

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';
```

### 2️⃣ Usar en tu Componente

```tsx
function MiDashboard() {
  const { conectado, notificaciones, cambiarEstado } = usePedidoWebSocket({
    tipo: 'admin' // o 'sucursal', 'usuario', 'todos'
  });

  return (
    <div>
      <p>Estado: {conectado ? '🟢' : '🔴'}</p>
      {notificaciones.map(n => (
        <div key={n.pedidoId}>
          Pedido #{n.pedidoId} - {n.estadoNombre}
        </div>
      ))}
    </div>
  );
}
```

### 3️⃣ ¡Listo! Ya estás recibiendo actualizaciones en tiempo real

---

## 📋 Tipos de Suscripción

```tsx
// Ver TODOS los pedidos
{ tipo: 'admin' }

// Ver pedidos de UNA sucursal
{ tipo: 'sucursal', sucursalId: 1 }

// Ver pedidos de UN usuario
{ tipo: 'usuario', usuarioId: 123 }

// Ver todos (legacy)
{ tipo: 'todos' }
```

---

## 🎯 Ejemplos por Dashboard

### Dashboard Admin
```tsx
const { notificaciones } = usePedidoWebSocket({ tipo: 'admin' });
```

### Dashboard Cocina
```tsx
const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId: 1 
});

// Marcar en preparación
cambiarEstado(pedidoId, EstadoPedido.PREPARING);
```

### Dashboard Delivery
```tsx
const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId: 1 
});

// Marcar como entregado
cambiarEstado(pedidoId, EstadoPedido.DELIVERED);
```

### Vista Cliente
```tsx
const { notificaciones } = usePedidoWebSocket({ 
  tipo: 'usuario', 
  usuarioId: miUsuarioId 
});
```

---

## 🔔 Solo Notificaciones (sin historial)

```tsx
import { usePedidoNotificacion } from './services/websocket';

usePedidoNotificacion(
  { tipo: 'usuario', usuarioId: 123 },
  (notificacion) => {
    alert(`Tu pedido #${notificacion.pedidoId} está ${notificacion.estadoNombre}`);
  }
);
```

---

## 📊 Estados Disponibles

```tsx
EstadoPedido.PREPARING   // 1 - En preparación (cocina)
EstadoPedido.STANDBY     // 2 - En espera/listo para entregar
EstadoPedido.CANCELLED   // 3 - Cancelado
EstadoPedido.REJECTED    // 4 - Rechazado
EstadoPedido.INCOMING    // 5 - Nuevo/entrante
EstadoPedido.DELIVERED   // 6 - Entregado
```

### Flujo Normal de Estados:
```
INCOMING → PREPARING → STANDBY → DELIVERED
```

---

## 🔧 Configuración (Opcional)

```tsx
const { ... } = usePedidoWebSocket(
  { tipo: 'admin' },
  {
    url: 'http://localhost:8080/ws',  // URL del servidor
    autoConnect: true,                 // Conectar automáticamente
    autoReconnect: true,               // Reconectar si se cae
    debug: true                        // Ver logs en consola
  }
);
```

---

## 📦 Estructura de Notificación

```typescript
{
  pedidoId: 42,
  estadoId: 3,
  estadoNombre: "LISTO",
  tiempoEstimado: "15 minutos",
  fecha: "2025-10-13T15:30:00",
  usuarioId: 123,
  usuarioNombre: "Juan Pérez",
  sucursalId: 1,
  timestamp: "2025-10-13T15:35:00"
}
```

---

## 🎨 Ejemplo Completo

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';

function DashboardCocina() {
  const { conectado, notificaciones, cambiarEstado } = usePedidoWebSocket({
    tipo: 'sucursal',
    sucursalId: 1
  });

  const nuevos = notificaciones.filter(n => n.estadoId === EstadoPedido.INCOMING);
  const enPreparacion = notificaciones.filter(n => n.estadoId === EstadoPedido.PREPARING);

  return (
    <div>
      <header>
        <h1>Cocina</h1>
        <span>{conectado ? '🟢 Online' : '🔴 Offline'}</span>
      </header>

      <div className="columnas">
        <div>
          <h2>Nuevos ({nuevos.length})</h2>
          {nuevos.map(p => (
            <div key={p.pedidoId}>
              <h3>Pedido #{p.pedidoId}</h3>
              <button onClick={() => cambiarEstado(p.pedidoId, EstadoPedido.PREPARING)}>
                Comenzar
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2>En Preparación ({enPreparacion.length})</h2>
          {enPreparacion.map(p => (
            <div key={p.pedidoId}>
              <h3>Pedido #{p.pedidoId}</h3>
              <button onClick={() => cambiarEstado(p.pedidoId, EstadoPedido.STANDBY, '15 min')}>
                Marcar Listo
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🐛 Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| No conecta | Verifica que el backend esté en `http://localhost:8080` |
| No recibo notificaciones | Verifica el `sucursalId` o `usuarioId` |
| Se desconecta | Es normal, se reconecta automáticamente |
| Notificaciones duplicadas | Usa el hook, no el servicio directo |

---

## 📚 Más Información

Ver **WEBSOCKET_GUIA_COMPLETA.md** para:
- Explicación detallada de WebSocket
- Más ejemplos
- API completa
- Mejores prácticas
- Solución de problemas avanzada

---

## ✅ Checklist de Implementación

- [ ] Importar el hook
- [ ] Elegir tipo de suscripción correcto
- [ ] Mostrar estado de conexión
- [ ] Renderizar notificaciones
- [ ] Implementar cambios de estado (si aplica)
- [ ] Probar con el backend corriendo
- [ ] Agregar manejo de errores
- [ ] Agregar indicadores visuales

---

**¡Ya estás listo para usar WebSocket en tiempo real!** 🎉
