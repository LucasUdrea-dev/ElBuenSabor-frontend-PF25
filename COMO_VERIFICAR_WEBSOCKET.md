# ✅ Cómo Verificar la Conexión WebSocket

## 🎯 Método 1: Usar el Componente de Prueba (Recomendado)

### Paso 1: Agregar el componente de prueba

En tu `App.tsx` o cualquier componente principal:

```tsx
import WebSocketTest from './components/WebSocketTest';

function App() {
  return (
    <div>
      {/* Tu aplicación */}
      
      {/* Componente de prueba (solo en desarrollo) */}
      {import.meta.env.VITE_ENV === 'development' && <WebSocketTest />}
    </div>
  );
}
```

### Paso 2: Iniciar el frontend

```bash
npm run dev
```

### Paso 3: Verificar en el navegador

1. **Abrir la aplicación** en el navegador
2. **Buscar el panel flotante** en la esquina inferior derecha
3. **Verificar el estado:**
   - 🟢 **CONECTADO** = Todo funciona correctamente
   - 🔴 **DESCONECTADO** = Hay un problema

### Paso 4: Abrir la consola del navegador (F12)

Buscar estos mensajes:

```
✅ Mensajes de ÉXITO:
[StompWebSocketService] Connecting to STOMP WebSocket: http://localhost:8080/ws
[STOMP] Web Socket Opened...
[STOMP] connected to server
[StompWebSocketService] Connected to STOMP server
✅ WebSocket CONECTADO a: http://localhost:8080/ws
```

```
❌ Mensajes de ERROR:
[StompWebSocketService] WebSocket error: ...
[STOMP] Whoops! Lost connection to ...
❌ WebSocket DESCONECTADO
```

### Paso 5: Probar envío de mensajes

1. Hacer clic en el botón **"🚀 Enviar Prueba"**
2. Verificar en la consola:
   ```
   🚀 Enviando cambio de estado de prueba...
   [StompWebSocketService] Message sent to /app/pedido.cambiarEstado: ...
   ```
3. Si el backend procesa correctamente, verás una notificación aparecer en el panel

---

## 🎯 Método 2: Verificación Manual en la Consola

### Paso 1: Abrir la consola del navegador (F12)

### Paso 2: Ejecutar este código

```javascript
// Verificar si el servicio está disponible
import('../services/StompWebSocketService').then(module => {
  const service = module.stompWebSocketService;
  console.log('Estado de conexión:', service.getIsConnected());
});
```

### Paso 3: Conectar manualmente

```javascript
import('../services/StompWebSocketService').then(module => {
  const service = module.stompWebSocketService;
  
  service.connect({
    url: 'http://localhost:8080/ws',
    debug: true
  });
  
  // Esperar 2 segundos y verificar
  setTimeout(() => {
    console.log('¿Conectado?', service.getIsConnected());
  }, 2000);
});
```

---

## 🎯 Método 3: Verificar desde el Backend

### Paso 1: Verificar que el backend esté corriendo

```bash
curl http://localhost:8080/actuator/health
```

Debería responder:
```json
{"status":"UP"}
```

### Paso 2: Verificar el endpoint WebSocket

El endpoint `/ws` debe estar disponible. Puedes verificar en los logs del backend al iniciar:

```
Tomcat started on port(s): 8080 (http)
```

### Paso 3: Ver logs del backend

Cuando el frontend se conecta, deberías ver en los logs del backend:

```
INFO - WebSocket connection established
```

---

## 🎯 Método 4: Usar las DevTools del Navegador

### Paso 1: Abrir DevTools (F12)

### Paso 2: Ir a la pestaña "Network" (Red)

### Paso 3: Filtrar por "WS" (WebSocket)

### Paso 4: Recargar la página

Deberías ver:
- **Conexión a:** `ws://localhost:8080/ws/...`
- **Estado:** `101 Switching Protocols` (éxito)
- **Frames:** Mensajes STOMP enviados y recibidos

### Paso 5: Ver los frames

Haz clic en la conexión WebSocket y ve a la pestaña "Messages" o "Frames":

```
CONNECTED
version:1.2
heart-beat:0,0
```

---

## 🐛 Problemas Comunes y Soluciones

### ❌ Problema 1: "WebSocket DESCONECTADO"

**Causas posibles:**
1. Backend no está corriendo
2. URL incorrecta en `.env`
3. CORS bloqueando la conexión

**Solución:**
```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:8080/actuator/health

# 2. Verificar .env
cat .env | grep VITE_WS_URL
# Debe ser: VITE_WS_URL=http://localhost:8080/ws

# 3. Reiniciar el frontend
npm run dev
```

---

### ❌ Problema 2: "ERR_CONNECTION_REFUSED"

**Causa:** El backend no está corriendo en el puerto 8080

**Solución:**
```bash
# Ir al directorio del backend
cd ElBuenSabor-backend-PF25/BackEnd

# Iniciar el backend
./gradlew bootRun
# o
./mvnw spring-boot:run
```

---

### ❌ Problema 3: "CORS policy error"

**Causa:** El backend no permite conexiones desde el frontend

**Solución:** Verificar que `WebSocketConfig.java` tenga:
```java
.setAllowedOriginPatterns("*")
```

---

### ❌ Problema 4: No recibo notificaciones

**Causas posibles:**
1. No estás suscrito al topic correcto
2. El backend no está enviando a ese topic
3. El callback no está registrado correctamente

**Solución:**
```typescript
// Verificar suscripción
useEffect(() => {
  const handler = (data) => {
    console.log('✅ Notificación recibida:', data);
  };
  
  subscribe('/topic/pedidos', handler);
  
  // ✅ Importante: cleanup
  return () => unsubscribe('/topic/pedidos', handler);
}, [subscribe, unsubscribe]);
```

---

## ✅ Checklist de Verificación

- [ ] Backend corriendo en `localhost:8080`
- [ ] Frontend corriendo (generalmente `localhost:5173`)
- [ ] `.env` configurado con `VITE_WS_URL=http://localhost:8080/ws`
- [ ] Componente `WebSocketTest` agregado a la app
- [ ] Panel de prueba visible en la esquina inferior derecha
- [ ] Estado muestra "🟢 CONECTADO"
- [ ] Consola del navegador muestra mensajes de STOMP
- [ ] DevTools → Network → WS muestra la conexión activa
- [ ] Al hacer clic en "Enviar Prueba" se recibe la notificación

---

## 🎓 Interpretación de Mensajes en la Consola

### ✅ Conexión Exitosa

```
[StompWebSocketService] Connecting to STOMP WebSocket: http://localhost:8080/ws
[STOMP] Web Socket Opened...
[STOMP] >>> CONNECT
[STOMP] <<< CONNECTED
[StompWebSocketService] Connected to STOMP server
[StompWebSocketService] Subscribed to topic: /topic/pedidos
```

### ✅ Mensaje Recibido

```
[StompWebSocketService] Message received from /topic/pedidos: {"pedidoId":1,"estadoNombre":"EN_PREPARACION",...}
📦 NOTIFICACIÓN RECIBIDA: {pedidoId: 1, estadoNombre: "EN_PREPARACION", ...}
```

### ✅ Mensaje Enviado

```
🚀 Enviando cambio de estado de prueba...
[StompWebSocketService] Message sent to /app/pedido.cambiarEstado: {"pedidoId":1,"nuevoEstadoId":2,"tiempoEstimado":"30 minutos"}
```

### ❌ Error de Conexión

```
[StompWebSocketService] WebSocket error: Event {isTrusted: true, ...}
[STOMP] Whoops! Lost connection to http://localhost:8080/ws
```

---

## 📞 Ayuda Adicional

Si después de seguir estos pasos aún tienes problemas:

1. **Verificar versiones de dependencias** en `package.json`
2. **Limpiar caché del navegador** (Ctrl+Shift+Delete)
3. **Reiniciar ambos servidores** (backend y frontend)
4. **Verificar firewall** que no esté bloqueando el puerto 8080
5. **Revisar logs del backend** para ver errores específicos

---

**¡Listo!** Con estos métodos puedes verificar fácilmente si tu WebSocket está funcionando correctamente.
