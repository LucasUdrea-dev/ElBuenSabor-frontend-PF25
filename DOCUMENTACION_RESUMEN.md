# 📚 Resumen de Documentación - El Buen Sabor Frontend

## 📖 Índice de Documentación

### 🏠 Documentación Principal
- **[README.md](README.md)** - Documentación general del proyecto
  - Descripción del proyecto
  - Stack tecnológico
  - Instalación y configuración
  - Estructura del proyecto
  - Scripts disponibles

### 🔌 Documentación WebSocket (STOMP)

#### 1. **[WEBSOCKET_SETUP.md](WEBSOCKET_SETUP.md)** - Guía Rápida ⚡
**Para:** Comenzar rápidamente con WebSocket
- Instalación de dependencias
- Configuración básica
- Ejemplo mínimo de uso
- Topics disponibles
- Estados de pedido
- Checklist de instalación

#### 2. **[WEBSOCKET_INTEGRATION.md](WEBSOCKET_INTEGRATION.md)** - Guía Completa 📖
**Para:** Integración detallada en componentes
- Archivos creados
- Pasos de integración completos
- Uso directo en componentes (con hook)
- Uso directo del servicio (sin hook)
- Casos de uso comunes:
  - Dashboard de cocina
  - Notificaciones para cliente
  - Dashboard admin
- Configuración del backend
- Testing
- Troubleshooting

#### 3. **[GUIA_WEBSOCKET_SUSCRIPCIONES.md](GUIA_WEBSOCKET_SUSCRIPCIONES.md)** - Guía por Rol 👥
**Para:** Implementación específica según tipo de usuario
- Topics disponibles por rol
- Estructura de notificaciones
- Estados de pedido
- Ejemplos por tipo de usuario:
  - Cliente (notificaciones personales)
  - Cocinero (pedidos por sucursal)
  - Delivery (pedidos listos)
  - Administrador (todos los pedidos)
  - Múltiples suscripciones
- Ejemplos de código completos
- Manejo de errores
- Mejores prácticas
- Troubleshooting específico

#### 4. **[COMO_VERIFICAR_WEBSOCKET.md](COMO_VERIFICAR_WEBSOCKET.md)** - Verificación y Debug 🔍
**Para:** Verificar que WebSocket funcione correctamente
- Método 1: Componente de prueba
- Método 2: Verificación manual en consola
- Método 3: Verificación desde backend
- Método 4: DevTools del navegador
- Problemas comunes y soluciones
- Checklist de verificación
- Interpretación de mensajes en consola

---

## 🎯 Flujo de Lectura Recomendado

### Para Desarrolladores Nuevos:
1. **[README.md](README.md)** - Entender el proyecto completo
2. **[WEBSOCKET_SETUP.md](WEBSOCKET_SETUP.md)** - Setup rápido
3. **[GUIA_WEBSOCKET_SUSCRIPCIONES.md](GUIA_WEBSOCKET_SUSCRIPCIONES.md)** - Ver ejemplos según tu rol
4. **[COMO_VERIFICAR_WEBSOCKET.md](COMO_VERIFICAR_WEBSOCKET.md)** - Verificar que funcione

### Para Integración Avanzada:
1. **[WEBSOCKET_INTEGRATION.md](WEBSOCKET_INTEGRATION.md)** - Guía completa de integración
2. **[GUIA_WEBSOCKET_SUSCRIPCIONES.md](GUIA_WEBSOCKET_SUSCRIPCIONES.md)** - Casos de uso específicos

### Para Troubleshooting:
1. **[COMO_VERIFICAR_WEBSOCKET.md](COMO_VERIFICAR_WEBSOCKET.md)** - Métodos de verificación
2. **[GUIA_WEBSOCKET_SUSCRIPCIONES.md](GUIA_WEBSOCKET_SUSCRIPCIONES.md)** - Sección de troubleshooting

---

## 🗂 Archivos de Implementación

### Servicios
- **`src/services/StompWebSocketService.ts`**
  - Servicio singleton para WebSocket STOMP
  - Maneja conexión, suscripciones y envío de mensajes
  - Compatible con Spring Boot backend

### Hooks
- **`src/hooks/useStompWebSocket.ts`**
  - Hook de React para usar WebSocket en componentes
  - Maneja estado de conexión
  - Auto-limpieza de suscripciones

### Tipos
- **`src/types/websocket.types.ts`**
  - Tipos TypeScript para WebSocket
  - Interfaces para notificaciones
  - Enums de estados de pedido
  - Tipos STOMP específicos

### Componentes de Prueba
- **`src/components/WebSocketTest.tsx`**
  - Componente para probar conexión WebSocket
  - Panel flotante con estado de conexión
  - Botón para enviar mensajes de prueba

---

## 📡 Topics WebSocket Disponibles

| Topic | Descripción | Quién lo usa |
|-------|-------------|--------------|
| `/topic/pedidos` | Todos los pedidos (legacy) | Cualquier dashboard |
| `/topic/pedidos/admin` | Todos los pedidos | Administradores |
| `/topic/pedidos/sucursal/{id}` | Pedidos de una sucursal | Cocineros, Delivery |
| `/topic/pedidos/usuario/{id}` | Pedidos de un usuario | Clientes |

## 🎯 Estados de Pedido

| ID | Estado | Descripción |
|----|--------|-------------|
| 1 | `PENDIENTE` | Pedido recibido |
| 2 | `EN_PREPARACION` | En cocina |
| 3 | `LISTO` | Listo para entrega |
| 4 | `EN_CAMINO` | En delivery |
| 5 | `ENTREGADO` | Completado |
| 6 | `CANCELADO` | Cancelado |

---

## ⚙️ Configuración Requerida

### Variables de Entorno (`.env`)
```env
# WebSocket Configuration (STOMP)
VITE_WS_URL=http://localhost:8080/ws

# API Configuration
VITE_API_URL=http://localhost:8080/api

# Environment
VITE_ENV=development
```

### Dependencias NPM
```bash
npm install @stomp/stompjs sockjs-client
npm install --save-dev @types/sockjs-client
```

---

## 🚀 Quick Start

```typescript
import { useEffect } from 'react';
import useStompWebSocket from './hooks/useStompWebSocket';

function MiComponente() {
  const { isConnected, subscribe, unsubscribe } = useStompWebSocket({
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

---

## 📞 Soporte

Para dudas o problemas:
1. Revisa la documentación específica según tu necesidad
2. Verifica la sección de troubleshooting en cada guía
3. Usa el componente `WebSocketTest` para debug
4. Habilita `debug: true` para ver logs detallados

---

## ✅ Estado de la Documentación

- ✅ README.md - Actualizado y corregido
- ✅ WEBSOCKET_SETUP.md - Completo y actualizado
- ✅ WEBSOCKET_INTEGRATION.md - Corregido y actualizado
- ✅ GUIA_WEBSOCKET_SUSCRIPCIONES.md - Completo y actualizado
- ✅ COMO_VERIFICAR_WEBSOCKET.md - Completo y actualizado
- ✅ Tipos TypeScript - Actualizados con tipos STOMP
- ✅ Implementación - Verificada y funcional

**Última actualización:** Octubre 2025
