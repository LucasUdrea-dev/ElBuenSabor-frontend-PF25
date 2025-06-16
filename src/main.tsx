import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Inicio from './Inicio.tsx'
import Catalogo from './Catalogo/Catalogo.tsx'
import DireccionesUser from './DireccionesUser.tsx'
import AdminCatalogo from './Admin/Manufacturados/AdminCatalogo.tsx'
import EditarPerfilUser from './EditarPerfilUser.tsx'
import CarritoProvider from './Carrito/CarritoContext.tsx'
import OrdenRecibida from './Carrito/OrdenRecibida.tsx'
import MisPedidos from './PedidosUser/MisPedidos.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}>
            <Route path='/inicio' element={<Inicio/>}/>

            <Route path='/catalogo' element={<Catalogo/>}/>
            <Route path="/ordenRecibida" element={<OrdenRecibida/>}/>

            <Route path='/misDirecciones' element={<DireccionesUser />} />
            <Route path='/miPerfil' element={<EditarPerfilUser />} />
            <Route path="/misOrdenes" element={<MisPedidos />} />


            <Route path='*' element={<Inicio/>}/>
          </Route>

          <Route path='/admin' element={<App/>}>
            <Route path='/admin/adminCatalogo' element={<AdminCatalogo/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </CarritoProvider>
  </StrictMode>
)
