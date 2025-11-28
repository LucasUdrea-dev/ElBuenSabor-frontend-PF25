import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaz para los datos del usuario decodificados del JWT
export interface EmpleadoSesion {
  id_user: number;
  role: string;
  surname: string;
  name: string;
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

// Interfaz para el contexto
interface UserContextType {
  empleadoSesion: EmpleadoSesion | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

// Crear el contexto
const EmpleadoContext = createContext<UserContextType | undefined>(undefined);

// Función para decodificar el JWT (solo la parte del payload)
const decodeJWT = (token: string): EmpleadoSesion | null => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload as EmpleadoSesion;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

// Función para verificar el rol
const isCustomerRole = (role: string): boolean => {
  return role === 'CUSTOMER';
};




// Provider del contexto
export const EmpleadoProvider = ({ children }: { children: ReactNode }) => {
  const [empleadoSesion, setEmpleadoSesion] = useState<EmpleadoSesion | null>(() => {
    // Leer solo del token general, NO borrarlo si es CUSTOMER
    const token = localStorage.getItem('token');
    
    if (token) {
      const decoded = decodeJWT(token);
      
      if (decoded) {
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Solo cargar si NO es CUSTOMER y NO está expirado
        if (decoded.exp > currentTime && !isCustomerRole(decoded.role)) {
          return decoded;
        }
      }
    }
    
    return null;
  });

  
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return empleadoSesion !== null;
  });

  // Verificar si el token está expirado
  const isTokenExpired = (): boolean => {
    if (!empleadoSesion) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return empleadoSesion.exp < currentTime;
  };

  // Función de login con validación de rol
  const login = (token: string) => {
    const decoded = decodeJWT(token);

    if (!decoded) {
      throw new Error('Token inválido');
    }

    // Verificar si el usuario tiene rol CUSTOMER
    if (isCustomerRole(decoded.role)) {
      throw new Error('Los clientes no tienen acceso al panel de administración');
    }

    // Si todo está bien, proceder con el login
    localStorage.setItem('token', token);
    setEmpleadoSesion(decoded);
    setIsAuthenticated(true);
  };

  // Función de logout
  const logout = () => {
    // Solo borrar el token si hay una sesión de empleado activa
    if (empleadoSesion && !isCustomerRole(empleadoSesion.role)) {
      localStorage.removeItem('token');
    }
    setEmpleadoSesion(null);
    setIsAuthenticated(false);
  };


  // Verificar periódicamente si el token expiró
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        if (isTokenExpired()) {
          logout();
        }
      }, 60000); // Verificar cada minuto

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, empleadoSesion]);

  return (
    <EmpleadoContext.Provider value={{ empleadoSesion, isAuthenticated, login, logout, isTokenExpired }}>
      {children}
    </EmpleadoContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useEmpleado = () => {
  const context = useContext(EmpleadoContext);
  if (context === undefined) {
    throw new Error('useEmpleado debe ser usado dentro de un EmpleadoProvider');
  }
  return context;
};