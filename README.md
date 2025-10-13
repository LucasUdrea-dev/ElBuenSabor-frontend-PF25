<div align="center">

# 🍕 El Buen Sabor - Frontend

Ordena tus comidas desde la comodidad de tu casa

<img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-6.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4.1.7-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Firebase-11.7.3-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
<img src="https://img.shields.io/badge/MercadoPago-1.0.3-009EE3?style=for-the-badge&logo=mercadopago&logoColor=white" alt="MercadoPago" />

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/LucasUdrea-dev/ElBuenSabor-frontend-PF25)
[![License](https://img.shields.io/badge/license-Private-red?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.0.0-blue?style=flat-square)](package.json)

</div>

---

## 🎯 Descripción

*El Buen Sabor* es una aplicación web moderna de pedidos de comida online que permite a los usuarios explorar un catálogo de productos, realizar pedidos desde la comodidad de su hogar y gestionar sus direcciones de entrega.

> 🚀 *Plataforma completa* que incluye tanto una interfaz intuitiva para clientes como un panel de administración robusto para gestionar el catálogo de productos manufacturados.

---

## ✨ Características Principales

<div align="center">

### 🛒 *Para Clientes*

</div>

| Característica | Descripción |
|----------------|-------------|
| 🍽 *Catálogo Interactivo* | Explora productos y promociones con filtros avanzados |
| 🛒 *Carrito Inteligente* | Gestión completa de pedidos con cálculo automático |
| 🔐 *Autenticación Segura* | Login con Firebase y redes sociales |
| 📍 *Gestión de Direcciones* | Administra múltiples direcciones de entrega |
| 📋 *Historial de Pedidos* | Revisa tus órdenes anteriores |
| 💳 *Pagos Seguros* | Integración completa con MercadoPago |
| 👤 *Perfil Personalizable* | Edita tu información personal |

<div align="center">

### 👨‍💼 *Para Administradores*

</div>

| Característica | Descripción |
|----------------|-------------|
| 🎛 *Panel de Control* | Dashboard completo para gestión |
| 🏭 *Productos Manufacturados* | CRUD completo de productos |
| 📊 *Inventario Inteligente* | Control de stock y disponibilidad |
| 📈 *Reportes* | Análisis de ventas y pedidos |

---

## 🛠 Stack Tecnológico

<div align="center">

### 🎨 *Frontend Framework*

</div>

bash
React 19.0.0          # Biblioteca de interfaces de usuario
TypeScript 5.7.2      # Superset tipado de JavaScript  
React Router DOM 7.5.1 # Enrutamiento SPA


<div align="center">

### ⚡ *Herramientas de Desarrollo*

</div>

bash
Vite 6.3.1            # Bundler ultrarrápido
ESLint 9.22.0         # Linter para calidad de código


<div align="center">

### 🎨 *Estilos y UI*

</div>

bash
Tailwind CSS 4.1.7    # Framework CSS utilitario
Bootstrap 5.3.6       # Componentes CSS preconstruidos


<div align="center">

### 🌐 *Servicios Externos*

</div>

bash
Firebase 11.7.3       # Autenticación y base de datos
MercadoPago SDK 1.0.3 # Procesamiento de pagos
Axios 1.9.0           # Cliente HTTP para APIs


<div align="center">

### ✅ *Validación*

</div>

bash
Zod 3.25.28           # Validación de esquemas TypeScript


---

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos

- *Node.js* (versión 18 o superior)
- *npm* o *yarn*
- *Git*

### 🔧 Pasos de Instalación

bash
# 1. Clonar el repositorio
git clone https://github.com/LucasUdrea-dev/ElBuenSabor-frontend-PF25.git
cd ElBuenSabor-frontend-PF25

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase y MercadoPago

# 4. Ejecutar en modo desarrollo
npm run dev



> 🌐 *La aplicación estará disponible en:* http://localhost:5173

---

## 📁 Estructura del Proyecto

```


src/
├── 🏗  Admin/                    # Panel de administración
│   └── Manufacturados/           # Gestión de productos manufacturados
├── 🛒 Carrito/                   # Funcionalidad del carrito de compras
├── 💳 MercadoPago/               # Integración de pagos
├── 📦 PedidosUser/               # Gestión de pedidos del usuario
├── 🏠 App.tsx                    # Componente principal de la aplicación
├── 🚀 main.tsx                   # Punto de entrada y configuración de rutas
├── 🔥 firebaseConfig.ts          # Configuración de Firebase
└── 📄 ...                       # Otros componentes y páginas

```
---

## 📜 Scripts Disponibles

<div align="center">

| Script | Comando | Descripción |
|--------|---------|-------------|
| 🚀 *Desarrollo* | npm run dev | Inicia servidor de desarrollo con HMR |
| 🏗 *Construcción* | npm run build | Genera build optimizado para producción |
| 🔍 *Linting* | npm run lint | Ejecuta análisis de código con ESLint |
| 👀 *Preview* | npm run preview | Previsualiza la versión de producción |

</div>

---

## 🌐 Funcionalidades Destacadas

### 🔀 Sistema de Rutas Avanzado

Navegación fluida mediante React Router con rutas protegidas:

- 🏠 *Página de inicio* - Landing page atractiva
- 📋 *Catálogo de productos* - Exploración con filtros
- 🛒 *Carrito y pedidos* - Proceso de compra completo
- 👤 *Perfil y direcciones* - Gestión de cuenta
- 🎛 *Panel de administración* - Dashboard administrativo

### 📱 Diseño Responsivo

Optimizado para todos los dispositivos con *Tailwind CSS* y componentes adaptativos.

### 🔐 Autenticación Robusta

Sistema completo de autenticación con Firebase:
- 📧 *Email/Password*
- 🌐 *Google OAuth*
- 📱 *Facebook Login*

### 🔌 WebSocket en Tiempo Real

Integración STOMP para notificaciones en tiempo real:
- 📦 *Actualizaciones de pedidos* - Seguimiento en vivo
- 🔔 *Notificaciones instantáneas* - Para clientes y administradores
- 🍳 *Dashboard de cocina* - Gestión de pedidos por sucursal
- 🚚 *Sistema de delivery* - Coordinación de entregas

**Documentación WebSocket:**
- [Guía de Integración](WEBSOCKET_INTEGRATION.md)
- [Setup Rápido](WEBSOCKET_SETUP.md)
- [Guía de Suscripciones](GUIA_WEBSOCKET_SUSCRIPCIONES.md)
- [Cómo Verificar](COMO_VERIFICAR_WEBSOCKET.md)

---

## 📚 Documentación Completa

<div align="center">


[![Deep Wiki](https://img.shields.io/badge/📖_DEEP_WIKI-Explore_Full_Documentation-4A90E2?style=for-the-badge&logo=gitbook&logoColor=white)](https://deepwiki.com/LucasUdrea-dev/ElBuenSabor-frontend-PF25#key-components-and-data-flow)


🚀 Accede a documentación técnica detallada, guías de implementación y arquitectura del sistema

</div>

---

### 📋 Contenido de la Wiki

<div align="center">

| 🎯 Sección | 📝 Descripción | 🔗 Enlace Directo |
|------------|----------------|-------------------|
| 🏗 *Gestión de Productos* | Sistema completo de administración de productos manufacturados | [📖 Ver Documentación](../../wiki/Product-Management) |
| ⚙ *Implementación Técnica* | Detalles de arquitectura, dependencias y configuración | [🔧 Ver Guía](../../wiki/Technical-Implementation) |
| 🛒 *Sistema de Carrito* | Funcionalidad de carrito de compras y gestión de pedidos | [🛍 Ver Detalles](../../wiki/Shopping-Cart-System) |
| 🏠 *Gestión de Direcciones* | Administración de direcciones de entrega | [📍 Ver Sistema](../../wiki/Address-Management) |
| 💳 *Integración de Pagos* | Configuración y uso de MercadoPago | [💰 Ver Pagos](../../wiki/Payment-Integration) |

</div>

<div align="center">
  <img src="https://img.shields.io/badge/Wiki-Documentación_Completa-success?style=for-the-badge&logo=notion&logoColor=white" alt="Wiki Documentation" />
</div>

---

## 🔧 Configuración del Servidor

El servidor de desarrollo está optimizado para:

- 🌐 *Host:* 0.0.0.0 (acceso desde cualquier dispositivo)
- 🚀 *Puerto:* 5173
- 🔗 *Desarrollo remoto:* Compatible con ngrok y túneles

---

## 🤝 Contribución

<div align="center">

### 🎯 *¿Quieres contribuir?*

</div>

bash
# 1. Fork el proyecto
git fork https://github.com/LucasUdrea-dev/ElBuenSabor-frontend-PF25

# 2. Crea tu rama de feature
git checkout -b feature/AmazingFeature

# 3. Commit tus cambios
git commit -m 'Add some AmazingFeature'

# 4. Push a la rama
git push origin feature/AmazingFeature

# 5. Abre un Pull Request


### 📋 Guías de Contribución

- 🔍 *Code Review:* Todos los PRs requieren revisión
- ✅ *Testing:* Incluye tests para nuevas funcionalidades
- 📝 *Documentación:* Actualiza la wiki si es necesario
- 🎨 *Estilo:* Sigue las convenciones de ESLint

---

## 📄 Licencia

<div align="center">

*🔒 Proyecto Privado*

Este proyecto está destinado únicamente para fines *académicos* y *profesionales*.

[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

</div>

---

## 📧 Contacto

<div align="center">

### 👥 *Equipo de Desarrollo*

*🎓 Estudiantes UTN*

[![GitHub](https://img.shields.io/badge/GitHub-LucasUdrea--dev-181717?style=for-the-badge&logo=github)](https://github.com/LucasUdrea-dev/ElBuenSabor-frontend-PF25)

</div>

---

<div align="center">

### 🍕 *Hecho para una experiencia gastronómica excepcional*


[![El Buen](https://img.shields.io/badge/EL%20Buen-Sabor-red?style=for-the-badge)](https://github.com/LucasUdrea-dev/ElBuenSabor-frontend-PF25)

</div>
