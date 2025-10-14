# 🎯 Guía de Uso - ¿Cuándo usar qué?

## 📊 Comparación de Métodos

| Método | Cuándo Usar | Complejidad | Características |
|--------|-------------|-------------|-----------------|
| **usePedidoWebSocket** | Dashboards que necesitan mostrar lista de pedidos | ⭐ Fácil | Gestión completa, historial, cambio de estado |
| **usePedidoNotificacion** | Solo mostrar notificaciones al usuario | ⭐ Muy Fácil | Solo callback, sin historial |
| **useWebSocketConexion** | Solo mostrar estado de conexión | ⭐ Muy Fácil | Solo conexión, sin notificaciones |
| **PedidoWebSocketService** | Control total y personalizado | ⭐⭐⭐ Avanzado | Máxima flexibilidad |

---

## 🎨 Casos de Uso por Dashboard

### 1️⃣ Dashboard de Administrador

**Necesita:**
- Ver TODOS los pedidos
- Cambiar estados
- Filtrar por sucursal/estado
- Estadísticas en tiempo real

**Usar:**
```tsx
const { conectado, notificaciones, cambiarEstado } = usePedidoWebSocket({ 
  tipo: 'admin' 
});
```

**Por qué:**
- Necesita historial completo
- Necesita cambiar estados
- Necesita ver todas las actualizaciones

---

### 2️⃣ Dashboard de Cocina

**Necesita:**
- Ver pedidos de SU sucursal
- Cambiar estados (Pendiente → En Preparación → Listo)
- Organizar por columnas (Pendientes, En Preparación)

**Usar:**
```tsx
const sucursalId = 1; // De contexto o props
const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId 
});

// Filtrar localmente
const pendientes = notificaciones.filter(n => n.estadoId === EstadoPedido.PENDIENTE);
const enPreparacion = notificaciones.filter(n => n.estadoId === EstadoPedido.EN_PREPARACION);
```

**Por qué:**
- Solo ve pedidos de su sucursal
- Necesita cambiar estados
- Necesita organizar pedidos

---

### 3️⃣ Dashboard de Delivery

**Necesita:**
- Ver pedidos LISTOS de SU sucursal
- Cambiar estados (Listo → En Camino → Entregado)
- Ver pedidos que está entregando

**Usar:**
```tsx
const sucursalId = 1;
const { notificaciones, cambiarEstado } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId 
});

// Filtrar solo los relevantes para delivery
const listos = notificaciones.filter(n => n.estadoId === EstadoPedido.LISTO);
const enCamino = notificaciones.filter(n => n.estadoId === EstadoPedido.EN_CAMINO);
```

**Por qué:**
- Solo ve pedidos de su sucursal
- Necesita cambiar estados
- Necesita filtrar por estados relevantes

---

### 4️⃣ Vista de Cliente

**Necesita:**
- Ver SUS propios pedidos
- Recibir notificaciones
- NO puede cambiar estados

**Opción A - Con historial:**
```tsx
const usuarioId = obtenerUsuarioLogueado();
const { notificaciones } = usePedidoWebSocket({ 
  tipo: 'usuario', 
  usuarioId 
});

// Mostrar lista de pedidos del usuario
```

**Opción B - Solo notificaciones:**
```tsx
const usuarioId = obtenerUsuarioLogueado();
usePedidoNotificacion(
  { tipo: 'usuario', usuarioId },
  (notificacion) => {
    toast.success(`Tu pedido #${notificacion.pedidoId} está ${notificacion.estadoNombre}`);
  }
);
```

**Por qué:**
- Opción A: Si necesitas mostrar lista de pedidos
- Opción B: Si solo necesitas notificar cambios

---

### 5️⃣ Indicador de Conexión en Navbar

**Necesita:**
- Solo mostrar si está conectado o no
- Botón para reconectar

**Usar:**
```tsx
const { conectado, conectar } = useWebSocketConexion();

return (
  <div>
    {conectado ? '🟢' : '🔴'}
    {!conectado && <button onClick={conectar}>Reconectar</button>}
  </div>
);
```

**Por qué:**
- No necesita notificaciones
- Solo necesita estado de conexión

---

## 🔄 Flujos de Trabajo Comunes

### Flujo 1: Pedido Nuevo → Entregado

```
1. Cliente hace pedido
   └─> Backend crea pedido con estado PENDIENTE
       └─> WebSocket notifica a:
           ├─> Dashboard Admin
           ├─> Dashboard Cocina (sucursal X)
           └─> Cliente (usuario Y)

2. Cocinero ve pedido en "Pendientes"
   └─> Hace clic en "Comenzar Preparación"
       └─> cambiarEstado(pedidoId, EstadoPedido.EN_PREPARACION)
           └─> WebSocket envía a backend
               └─> Backend actualiza BD
                   └─> WebSocket notifica a todos

3. Cocinero termina pedido
   └─> Hace clic en "Marcar Listo"
       └─> cambiarEstado(pedidoId, EstadoPedido.LISTO, "15 minutos")
           └─> WebSocket envía a backend
               └─> Backend actualiza BD
                   └─> WebSocket notifica a todos
                       └─> Dashboard Delivery recibe alerta

4. Delivery toma pedido
   └─> Hace clic en "Tomar Pedido"
       └─> cambiarEstado(pedidoId, EstadoPedido.EN_CAMINO)
           └─> Cliente recibe notificación "Tu pedido está en camino"

5. Delivery entrega pedido
   └─> Hace clic en "Marcar Entregado"
       └─> cambiarEstado(pedidoId, EstadoPedido.ENTREGADO)
           └─> Cliente recibe notificación "Tu pedido ha sido entregado"
```

---

## 🎯 Decisión Rápida

### ¿Necesitas mostrar LISTA de pedidos?
→ **usePedidoWebSocket**

### ¿Solo necesitas NOTIFICAR al usuario?
→ **usePedidoNotificacion**

### ¿Solo necesitas mostrar ESTADO DE CONEXIÓN?
→ **useWebSocketConexion**

### ¿Necesitas CONTROL TOTAL?
→ **PedidoWebSocketService**

---

## 📝 Plantillas de Código

### Plantilla 1: Dashboard Básico

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';

function MiDashboard() {
  const { conectado, notificaciones, cambiarEstado, error } = usePedidoWebSocket({
    tipo: 'admin' // Cambiar según necesidad
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <span>{conectado ? '🟢 Online' : '🔴 Offline'}</span>
      </header>

      <div className="pedidos">
        {notificaciones.map(pedido => (
          <div key={pedido.pedidoId}>
            <h3>Pedido #{pedido.pedidoId}</h3>
            <p>Estado: {pedido.estadoNombre}</p>
            {/* Botones según estado */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Plantilla 2: Notificaciones para Cliente

```tsx
import { usePedidoNotificacion } from './services/websocket';

function App() {
  const usuarioId = obtenerUsuarioLogueado();

  if (usuarioId) {
    usePedidoNotificacion(
      { tipo: 'usuario', usuarioId },
      (notificacion) => {
        // Mostrar notificación
        toast.success(`Pedido #${notificacion.pedidoId} - ${notificacion.estadoNombre}`);
      }
    );
  }

  return <div>{/* Tu app */}</div>;
}
```

### Plantilla 3: Dashboard con Filtros

```tsx
import { usePedidoWebSocket, EstadoPedido } from './services/websocket';
import { useState } from 'react';

function DashboardConFiltros() {
  const { notificaciones, cambiarEstado } = usePedidoWebSocket({ tipo: 'admin' });
  const [filtro, setFiltro] = useState<number | null>(null);

  const pedidosFiltrados = filtro 
    ? notificaciones.filter(n => n.estadoId === filtro)
    : notificaciones;

  return (
    <div>
      <div className="filtros">
        <button onClick={() => setFiltro(null)}>Todos</button>
        <button onClick={() => setFiltro(EstadoPedido.PENDIENTE)}>Pendientes</button>
        <button onClick={() => setFiltro(EstadoPedido.EN_PREPARACION)}>En Preparación</button>
        {/* Más filtros */}
      </div>

      <div className="pedidos">
        {pedidosFiltrados.map(pedido => (
          <div key={pedido.pedidoId}>
            {/* Renderizar pedido */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ⚠️ Errores Comunes

### Error 1: "No hay conexión WebSocket"

**Causa:** Intentar usar el servicio antes de conectar

**Solución:** El hook `usePedidoWebSocket` conecta automáticamente. Si usas el servicio directo, llama a `connect()` primero.

```tsx
// ❌ Mal
pedidoWebSocketService.cambiarEstado(1, 2); // Error!

// ✅ Bien
await pedidoWebSocketService.connect();
pedidoWebSocketService.cambiarEstado(1, 2);

// ✅ Mejor - Usa el hook
const { cambiarEstado } = usePedidoWebSocket({ tipo: 'admin' });
cambiarEstado(1, 2); // Funciona automáticamente
```

### Error 2: Múltiples suscripciones

**Causa:** Crear múltiples suscripciones al mismo topic

**Solución:** Usa el hook que gestiona automáticamente las suscripciones

```tsx
// ❌ Mal - Crea nueva suscripción en cada render
useEffect(() => {
  pedidoWebSocketService.suscribirseAPedidos(callback);
}, []); // Falta cleanup!

// ✅ Bien - Usa el hook
const { notificaciones } = usePedidoWebSocket({ tipo: 'admin' });
```

### Error 3: No recibo notificaciones

**Causa:** ID incorrecto de sucursal o usuario

**Solución:** Verifica que el ID sea correcto

```tsx
// ❌ Mal
const { notificaciones } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId: undefined // ¡Error!
});

// ✅ Bien
const sucursalId = obtenerSucursalActual(); // Función que retorna ID válido
const { notificaciones } = usePedidoWebSocket({ 
  tipo: 'sucursal', 
  sucursalId 
});
```

---

## 🔍 Debug

### Habilitar Logs

```tsx
const { ... } = usePedidoWebSocket(
  { tipo: 'admin' },
  { debug: true } // Muestra logs en consola
);
```

### Logs que verás:

```
[PedidoWebSocketService] ✅ Conectado al WebSocket
[PedidoWebSocketService] ✅ Suscrito a /topic/pedidos/admin
[PedidoWebSocketService] 📨 Notificación recibida de /topic/pedidos/admin: {...}
[PedidoWebSocketService] 📤 Cambio de estado enviado: {...}
```

---

## 📚 Recursos

- **WEBSOCKET_GUIA_COMPLETA.md** - Guía detallada
- **WEBSOCKET_QUICK_START.md** - Inicio rápido
- **WEBSOCKET_RESUMEN.md** - Resumen ejecutivo
- **src/services/websocket/README.md** - Documentación técnica
- **src/services/websocket/ejemplos/** - Ejemplos completos

---

## ✅ Checklist de Implementación

- [ ] Decidir qué hook usar según necesidad
- [ ] Importar el hook correcto
- [ ] Configurar tipo de suscripción
- [ ] Renderizar notificaciones en UI
- [ ] Implementar cambios de estado (si aplica)
- [ ] Agregar indicador de conexión
- [ ] Manejar errores
- [ ] Probar con backend corriendo
- [ ] Agregar estilos CSS
- [ ] Implementar filtros (si aplica)

---

**¡Ahora sabes exactamente qué usar en cada situación!** 🎉
