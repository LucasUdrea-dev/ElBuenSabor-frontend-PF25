import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Inicio from './Inicio.tsx'
import Catalogo from './Catalogo/Catalogo.tsx'
import DireccionesUser from './Direcciones User/DireccionesUser.tsx'
import AdminCatalogo from './Admin/Manufacturados/AdminCatalogo.tsx'
import EditarPerfilUser from './Editar Usuario/EditarPerfilUser.tsx'
import CarritoProvider from './Carrito/CarritoContext.tsx'
import OrdenRecibida from './Carrito/OrdenRecibida.tsx'
import MisPedidos from './PedidosUser/MisPedidos.tsx'
import AdminCategoria from './Admin/Categorias/AdminCategoria.tsx'
import AppAdmin from './Admin/AppAdmin.tsx'
import Cajero from './Admin/Cajero/Cajero.tsx'
import Cocinero from './Admin/Cocinero/Cocinero.tsx'
import Administracion from './Admin/Administracion/Administracion.tsx'
import Clientes from './Admin/Clientes/Clientes.tsx'
import Facturas from './Admin/Facturas/Facturas.tsx'
import Empleados from './Admin/Empleados/Empleados.tsx'
import AdminSubcategoria from './Admin/Subcategorias/AdminSubcategoria.tsx'
import AdminInsumo from './Admin/Insumos/AdminInsumo.tsx'
import AdminPromocion from './Admin/Promociones/AdminPromocion.tsx'
import { UserProvider } from './UserAuth/UserContext.tsx' 
import { EmpleadoProvider } from './Admin/LoginEmpleados/EmpleadoContext.tsx'
import PerfilEmpleado from './Admin/Empleados/PerfilEmpleado.tsx'
import { DashboardEjemplo } from './services/websocket/ejemplos/DashboardEjemplo.tsx'
import { NotificacionesCliente } from './services/websocket/ejemplos/NotificacionesEjemplo.tsx'
import EntregaRepartidor from './Admin/Repartidor/EntregaRepartidor.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <CarritoProvider>
        <EmpleadoProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App/>}>
              <Route path='/inicio' element={<Inicio/>}/>

              <Route path='/catalogo' element={<Catalogo/>}/>
              <Route path="/ordenRecibida" element={<OrdenRecibida/>}/>

              <Route path='/misDirecciones' element={<DireccionesUser />} />
              <Route path='/miPerfil' element={<EditarPerfilUser />} />
              <Route path="/misOrdenes" element={<MisPedidos />} />

              {/* Rutas de prueba WebSocket */}
              <Route path='/test-websocket-dashboard' element={<DashboardEjemplo />} />
              <Route path='/test-websocket-notificaciones' element={<NotificacionesCliente />} />

              <Route path='*' element={<Inicio/>}/>
            </Route>

            <Route path='/admin' element={<AppAdmin/>}>
             <Route path='/admin/EntregaRepartidor' element={<EntregaRepartidor/>}/>
              <Route path='/admin/adminCatalogo' element={<AdminCatalogo/>}/>
              <Route path='/admin/adminInsumo' element={<AdminInsumo/>}/>
              <Route path='/admin/adminCategoria' element={<AdminCategoria/>}/>
              <Route path='/admin/adminSubcategoria' element={<AdminSubcategoria/>}/>
              <Route path='/admin/adminPromocion' element={<AdminPromocion/>}/>
              
              <Route path='/admin/adminCajero' element={<Cajero/>}/>
              <Route path='/admin/adminCocinero' element={<Cocinero/>}/>
              <Route path='/admin/administracion' element={<Administracion/>}/>

              <Route path='/admin/clientes' element={<Clientes/>}/>
              <Route path='/admin/facturas' element={<Facturas/>}/>
              <Route path='/admin/empleados' element={<Empleados/>}/>
              <Route path='/admin/miPerfil/empleado' element={<PerfilEmpleado />} />

            </Route>
          </Routes>
        </BrowserRouter>
        </EmpleadoProvider>
      </CarritoProvider>
    </UserProvider>
  </StrictMode>
)