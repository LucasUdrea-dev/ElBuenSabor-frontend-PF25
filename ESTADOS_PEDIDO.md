# 📊 Estados de Pedido - Guía Completa

## 🔢 Estados Disponibles en la Base de Datos

| ID | Nombre | Descripción | Uso |
|----|--------|-------------|-----|
| **1** | **PREPARING** | En preparación | Pedido siendo preparado en cocina |
| **2** | **STANDBY** | En espera | Pedido listo para ser entregado |
| **3** | **CANCELLED** | Cancelado | Pedido cancelado por el usuario o sistema |
| **4** | **REJECTED** | Rechazado | Pedido rechazado por el restaurante |
| **5** | **INCOMING** | Nuevo/Entrante | Pedido recién creado, esperando confirmación |
| **6** | **DELIVERED** | Entregado | Pedido completado y entregado |

---

## 🔄 Flujo Normal de Estados

```
┌─────────────┐
│  INCOMING   │  ← Pedido nuevo creado
│     (5)     │
└──────┬──────┘
       │
       │ Cocinero acepta
       ▼
┌─────────────┐
│  PREPARING  │  ← Pedido en cocina
│     (1)     │
└──────┬──────┘
       │
       │ Pedido terminado
       ▼
┌─────────────┐
│   STANDBY   │  ← Listo para entregar
│     (2)     │
└──────┬──────┘
       │
       │ Delivery entrega
       ▼
┌─────────────┐
│  DELIVERED  │  ← Pedido completado
│     (6)     │
└─────────────┘
```

---

## ❌ Flujos de Cancelación/Rechazo

### Desde INCOMING (Pedido Nuevo)

```
INCOMING (5) ──┬─→ PREPARING (1)  [Aceptado]
               │
               ├─→ REJECTED (4)   [Rechazado por restaurante]
               │
               └─→ CANCELLED (3)  [Cancelado por cliente]
```

### Desde PREPARING (En Preparación)

```
PREPARING (1) ──┬─→ STANDBY (2)    [Completado]
                │
                └─→ CANCELLED (3)  [Cancelado]
```

---

## 👥 Permisos por Rol

### 🔴 Cliente
**Puede ver:** Sus propios pedidos
**Puede cambiar:**
- `INCOMING → CANCELLED` (cancelar antes de que se acepte)

### 👨‍🍳 Cocinero
**Puede ver:** Pedidos de su sucursal
**Puede cambiar:**
- `INCOMING → PREPARING` (aceptar pedido)
- `INCOMING → REJECTED` (rechazar pedido)
- `PREPARING → STANDBY` (marcar listo)
- `PREPARING → CANCELLED` (cancelar en preparación)

### 🚗 Delivery
**Puede ver:** Pedidos de su sucursal
**Puede cambiar:**
- `STANDBY → DELIVERED` (marcar como entregado)

### 👔 Administrador
**Puede ver:** Todos los pedidos
**Puede cambiar:** Cualquier estado (control total)

---

## 💻 Uso en Código

### Importar Estados

```tsx
import { EstadoPedido } from './services/websocket';
```

### Estados Disponibles

```tsx
EstadoPedido.PREPARING   // 1
EstadoPedido.STANDBY     // 2
EstadoPedido.CANCELLED   // 3
EstadoPedido.REJECTED    // 4
EstadoPedido.INCOMING    // 5
EstadoPedido.DELIVERED   // 6
```

### Nombres en Español

```tsx
import { ESTADO_PEDIDO_NOMBRES } from './services/websocket';

console.log(ESTADO_PEDIDO_NOMBRES[EstadoPedido.PREPARING]);  // "En Preparación"
console.log(ESTADO_PEDIDO_NOMBRES[EstadoPedido.STANDBY]);    // "En Espera"
console.log(ESTADO_PEDIDO_NOMBRES[EstadoPedido.CANCELLED]);  // "Cancelado"
console.log(ESTADO_PEDIDO_NOMBRES[EstadoPedido.REJECTED]);   // "Rechazado"
console.log(ESTADO_PEDIDO_NOMBRES[EstadoPedido.INCOMING]);   // "Nuevo"
console.log(ESTADO_PEDIDO_NOMBRES[EstadoPedido.DELIVERED]);  // "Entregado"
```

---

## 🎯 Ejemplos por Dashboard

### Dashboard de Cocina

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';

function DashboardCocina() {
  const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
    tipo: 'sucursal', 
    sucursalId: 1 
  });

  // Filtrar por estado
  const nuevos = notificaciones.filter(n => n.estadoId === EstadoPedido.INCOMING);
  const enPreparacion = notificaciones.filter(n => n.estadoId === EstadoPedido.PREPARING);

  // Acciones
  const aceptarPedido = (pedidoId: number) => {
    cambiarEstado(pedidoId, EstadoPedido.PREPARING);
  };

  const rechazarPedido = (pedidoId: number) => {
    cambiarEstado(pedidoId, EstadoPedido.REJECTED);
  };

  const marcarListo = (pedidoId: number, tiempo?: string) => {
    cambiarEstado(pedidoId, EstadoPedido.STANDBY, tiempo);
  };

  return (
    <div>
      <div className="columna-nuevos">
        <h2>Pedidos Nuevos ({nuevos.length})</h2>
        {nuevos.map(pedido => (
          <div key={pedido.pedidoId}>
            <h3>Pedido #{pedido.pedidoId}</h3>
            <button onClick={() => aceptarPedido(pedido.pedidoId)}>
              Aceptar
            </button>
            <button onClick={() => rechazarPedido(pedido.pedidoId)}>
              Rechazar
            </button>
          </div>
        ))}
      </div>

      <div className="columna-preparacion">
        <h2>En Preparación ({enPreparacion.length})</h2>
        {enPreparacion.map(pedido => (
          <div key={pedido.pedidoId}>
            <h3>Pedido #{pedido.pedidoId}</h3>
            <button onClick={() => marcarListo(pedido.pedidoId, '15 minutos')}>
              Marcar Listo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Dashboard de Delivery

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';

function DashboardDelivery() {
  const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
    tipo: 'sucursal', 
    sucursalId: 1 
  });

  // Solo mostrar pedidos listos para entregar
  const listos = notificaciones.filter(n => n.estadoId === EstadoPedido.STANDBY);

  const marcarEntregado = (pedidoId: number) => {
    cambiarEstado(pedidoId, EstadoPedido.DELIVERED);
  };

  return (
    <div>
      <h2>Pedidos Listos para Entregar ({listos.length})</h2>
      {listos.map(pedido => (
        <div key={pedido.pedidoId}>
          <h3>Pedido #{pedido.pedidoId}</h3>
          <p>Cliente: {pedido.usuarioNombre}</p>
          <p>Tiempo estimado: {pedido.tiempoEstimado}</p>
          <button onClick={() => marcarEntregado(pedido.pedidoId)}>
            Marcar como Entregado
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Vista de Cliente

```tsx
import { usePedidoWebSocket, EstadoPedido, ESTADO_PEDIDO_NOMBRES } from './services/websocket';

function MisPedidos() {
  const usuarioId = obtenerUsuarioLogueado();
  const { notificaciones } = usePedidoWebSocket({ 
    tipo: 'usuario', 
    usuarioId 
  });

  // Mostrar solo pedidos activos (no entregados ni cancelados)
  const pedidosActivos = notificaciones.filter(n => 
    n.estadoId !== EstadoPedido.DELIVERED && 
    n.estadoId !== EstadoPedido.CANCELLED &&
    n.estadoId !== EstadoPedido.REJECTED
  );

  return (
    <div>
      <h2>Mis Pedidos Activos</h2>
      {pedidosActivos.map(pedido => (
        <div key={pedido.pedidoId}>
          <h3>Pedido #{pedido.pedidoId}</h3>
          <p>Estado: {ESTADO_PEDIDO_NOMBRES[pedido.estadoId]}</p>
          
          {/* Mostrar progreso visual */}
          <div className="progreso">
            <div className={pedido.estadoId >= EstadoPedido.INCOMING ? 'activo' : ''}>
              Recibido
            </div>
            <div className={pedido.estadoId >= EstadoPedido.PREPARING ? 'activo' : ''}>
              En Preparación
            </div>
            <div className={pedido.estadoId >= EstadoPedido.STANDBY ? 'activo' : ''}>
              Listo
            </div>
            <div className={pedido.estadoId === EstadoPedido.DELIVERED ? 'activo' : ''}>
              Entregado
            </div>
          </div>

          {pedido.tiempoEstimado && (
            <p>Tiempo estimado: {pedido.tiempoEstimado}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Estilos Sugeridos por Estado

```css
/* Colores por estado */
.estado-INCOMING {
  background: #fef3c7; /* Amarillo claro */
  color: #92400e;
}

.estado-PREPARING {
  background: #dbeafe; /* Azul claro */
  color: #1e40af;
}

.estado-STANDBY {
  background: #d1fae5; /* Verde claro */
  color: #065f46;
}

.estado-DELIVERED {
  background: #d1fae5; /* Verde claro */
  color: #065f46;
}

.estado-CANCELLED {
  background: #fee2e2; /* Rojo claro */
  color: #991b1b;
}

.estado-REJECTED {
  background: #fee2e2; /* Rojo claro */
  color: #991b1b;
}
```

---

## 📱 Notificaciones por Estado

### Mensajes Sugeridos para Clientes

```tsx
const mensajesCliente = {
  [EstadoPedido.INCOMING]: '📝 Tu pedido ha sido recibido',
  [EstadoPedido.PREPARING]: '👨‍🍳 Tu pedido está siendo preparado',
  [EstadoPedido.STANDBY]: '✅ Tu pedido está listo',
  [EstadoPedido.DELIVERED]: '🎉 Tu pedido ha sido entregado',
  [EstadoPedido.CANCELLED]: '❌ Tu pedido ha sido cancelado',
  [EstadoPedido.REJECTED]: '⛔ Tu pedido ha sido rechazado',
};
```

---

## ⚠️ Validaciones Recomendadas

### En el Frontend

```tsx
// Validar transiciones de estado permitidas
const transicionesPermitidas: Record<number, number[]> = {
  [EstadoPedido.INCOMING]: [EstadoPedido.PREPARING, EstadoPedido.REJECTED, EstadoPedido.CANCELLED],
  [EstadoPedido.PREPARING]: [EstadoPedido.STANDBY, EstadoPedido.CANCELLED],
  [EstadoPedido.STANDBY]: [EstadoPedido.DELIVERED],
  [EstadoPedido.DELIVERED]: [], // Estado final
  [EstadoPedido.CANCELLED]: [], // Estado final
  [EstadoPedido.REJECTED]: [], // Estado final
};

function puedecambiarEstado(estadoActual: number, nuevoEstado: number): boolean {
  return transicionesPermitidas[estadoActual]?.includes(nuevoEstado) || false;
}

// Uso
if (puedecambiarEstado(pedido.estadoId, EstadoPedido.PREPARING)) {
  cambiarEstado(pedido.pedidoId, EstadoPedido.PREPARING);
} else {
  alert('Transición de estado no permitida');
}
```

---

## 🔍 Filtros Útiles

```tsx
// Pedidos activos (no finalizados)
const pedidosActivos = notificaciones.filter(n => 
  n.estadoId !== EstadoPedido.DELIVERED && 
  n.estadoId !== EstadoPedido.CANCELLED &&
  n.estadoId !== EstadoPedido.REJECTED
);

// Pedidos pendientes de acción (cocina)
const pedidosPendientes = notificaciones.filter(n => 
  n.estadoId === EstadoPedido.INCOMING
);

// Pedidos en proceso
const pedidosEnProceso = notificaciones.filter(n => 
  n.estadoId === EstadoPedido.PREPARING
);

// Pedidos listos
const pedidosListos = notificaciones.filter(n => 
  n.estadoId === EstadoPedido.STANDBY
);

// Pedidos completados
const pedidosCompletados = notificaciones.filter(n => 
  n.estadoId === EstadoPedido.DELIVERED
);

// Pedidos cancelados/rechazados
const pedidosCancelados = notificaciones.filter(n => 
  n.estadoId === EstadoPedido.CANCELLED || 
  n.estadoId === EstadoPedido.REJECTED
);
```

---

## 📊 Estadísticas

```tsx
function EstadisticasPedidos({ notificaciones }: { notificaciones: PedidoNotificacion[] }) {
  const stats = {
    nuevos: notificaciones.filter(n => n.estadoId === EstadoPedido.INCOMING).length,
    enPreparacion: notificaciones.filter(n => n.estadoId === EstadoPedido.PREPARING).length,
    listos: notificaciones.filter(n => n.estadoId === EstadoPedido.STANDBY).length,
    entregados: notificaciones.filter(n => n.estadoId === EstadoPedido.DELIVERED).length,
    cancelados: notificaciones.filter(n => n.estadoId === EstadoPedido.CANCELLED).length,
    rechazados: notificaciones.filter(n => n.estadoId === EstadoPedido.REJECTED).length,
  };

  return (
    <div className="estadisticas">
      <div className="stat">
        <h3>{stats.nuevos}</h3>
        <p>Nuevos</p>
      </div>
      <div className="stat">
        <h3>{stats.enPreparacion}</h3>
        <p>En Preparación</p>
      </div>
      <div className="stat">
        <h3>{stats.listos}</h3>
        <p>Listos</p>
      </div>
      <div className="stat">
        <h3>{stats.entregados}</h3>
        <p>Entregados</p>
      </div>
    </div>
  );
}
```

---

## ✅ Resumen

- **6 estados** en total
- **Flujo principal:** INCOMING → PREPARING → STANDBY → DELIVERED
- **Estados finales:** DELIVERED, CANCELLED, REJECTED
- **Cada rol** tiene permisos específicos
- **Validar transiciones** en frontend y backend
- **Notificar cambios** a todos los interesados vía WebSocket

---

**¡Usa este documento como referencia para implementar la lógica de estados en tu aplicación!** 📚
