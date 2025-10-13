# 🔌 WebSocket STOMP - Guía Rápida de Instalación

## ⚡ Instalación Rápida

### 1. Instalar Dependencias

```bash
npm install @stomp/stompjs sockjs-client
npm install --save-dev @types/sockjs-client
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está configurado con:

```env
VITE_WS_URL=http://localhost:8080/ws
```

### 3. Usar en tu Componente

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

    subscribe('/topic/pedidos', handlePedido);

    return () => unsubscribe('/topic/pedidos', handlePedido);
  }, [subscribe, unsubscribe]);

  return <div>Estado: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}</div>;
}
```

## 📡 Topics Disponibles (Backend)

| Topic | Descripción | Quién lo usa |
|-------|-------------|--------------|
| `/topic/pedidos` | Todos los pedidos (legacy) | Cualquier dashboard |
| `/topic/pedidos/admin` | Todos los pedidos | Dashboard Admin |
| `/topic/pedidos/sucursal/{id}` | Pedidos de una sucursal | Dashboard Cocina/Delivery |
| `/topic/pedidos/usuario/{id}` | Pedidos de un usuario | Cliente |

## 🎯 Estados de Pedido

| ID | Estado | Descripción |
|----|--------|-------------|
| 1 | PENDIENTE | Pedido recibido |
| 2 | EN_PREPARACION | En cocina |
| 3 | LISTO | Listo para entrega |
| 4 | EN_CAMINO | En delivery |
| 5 | ENTREGADO | Completado |
| 6 | CANCELADO | Cancelado |

## 💡 Ejemplos Rápidos

### Dashboard Cocina (Filtrar por Sucursal)

```tsx
const sucursalId = 1;
subscribe(`/topic/pedidos/sucursal/${sucursalId}`, handlePedido);
```

### Notificaciones Cliente (Filtrar por Usuario)

```tsx
const usuarioId = 123;
subscribe(`/topic/pedidos/usuario/${usuarioId}`, handleNotificacion);
```

### Cambiar Estado de Pedido

```tsx
// Marcar pedido 42 como LISTO (estado 3) con tiempo estimado
cambiarEstadoPedido(42, 3, '15 minutos');
```

## 📚 Documentación Completa

- **Guía de Integración:** `WEBSOCKET_INTEGRATION.md`
- **Documentación del Backend:** `ElBuenSabor-backend-PF25/BackEnd/WEBSOCKET_PEDIDOS_README.md`
- **Arquitectura:** `ElBuenSabor-backend-PF25/BackEnd/WEBSOCKET_ARQUITECTURA.md`

## 🚀 Archivos del Servicio

- `src/services/StompWebSocketService.ts` - Servicio STOMP
- `src/hooks/useStompWebSocket.ts` - Hook de React
- `src/types/websocket.types.ts` - Tipos TypeScript

## ✅ Checklist

- [x] Instalar `@stomp/stompjs` y `sockjs-client`
- [x] Configurar `.env` con `VITE_WS_URL=http://localhost:8080/ws`
- [ ] Importar `useStompWebSocket` en tu componente
- [ ] Suscribirse al topic apropiado
- [ ] Implementar cleanup con `unsubscribe`
- [ ] Verificar que el backend esté corriendo en `localhost:8080`

## 🐛 Troubleshooting

**Problema:** No se conecta
- Verifica que el backend esté corriendo
- Verifica la URL en `.env`
- Habilita `debug: true` para ver logs

**Problema:** No recibo mensajes
- Verifica que estés suscrito al topic correcto
- Verifica que el backend esté enviando a ese topic
- Revisa la consola del navegador

**Problema:** Errores de TypeScript
- Asegúrate de haber instalado `@types/sockjs-client`
- Ejecuta `npm install` nuevamente

## 🎉 ¡Listo!

Ahora puedes recibir actualizaciones en tiempo real de los pedidos.
