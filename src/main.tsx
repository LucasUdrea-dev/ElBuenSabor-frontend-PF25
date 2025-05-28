import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Inicio from './Inicio.tsx'
import Catalogo from './Catalogo.tsx'
import DireccionesUser from './DireccionesUser.tsx'
import EditarPerfilUser from './EditarPerfilUser.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route path='/inicio' element={<Inicio/>}/>

          <Route path='/catalogo' element={<Catalogo/>}/>
          <Route path='/misDirecciones' element={<DireccionesUser />} />
          <Route path='/miPeril' element={<EditarPerfilUser />} />


          <Route path='*' element={<Inicio/>}/>
        </Route>
      </Routes>
    </BrowserRouter> 
  </StrictMode>
)
