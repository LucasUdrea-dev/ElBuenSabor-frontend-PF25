import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarAdmin from "./NavbarYDashboard/NavbarAdmin";
import InicioSesionUser from "./LoginEmpleados/LoginEmpleados";

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // Verificar si hay token al cargar el componente
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoginOpen(true);
    }
  }, []);

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        <div className="m-0">
          <NavbarAdmin />
        </div>
        <div>
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
            <div className="text-center bg-white rounded-2xl shadow-2xl p-10 md:p-12 max-w-2xl w-full">
              <div className="mb-6">
                <div className="inline-block bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full p-4 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight font-lato">
                Bienvenido al Panel de Administración
                <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-lato">
                  El Buen Sabor
                </span>
              </h1>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8">
                <p className="text-gray-700 text-lg leading-relaxed font-lato">
                  Este portal es exclusivo para el personal autorizado. Aquí podrá desempeñar sus funciones administrativas de manera segura y eficiente.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Conexión segura y encriptada</span>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
      
      <InicioSesionUser 
        isOpen={isLoginOpen} 
        onClose={handleCloseLogin} 
      />
    </>
  );
}