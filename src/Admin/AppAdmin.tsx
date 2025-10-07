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