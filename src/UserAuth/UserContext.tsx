import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "./firebaseConfig";

export interface UserSession {
  id_user: number;
  role: string;
  surname: string;
  name: string;
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

interface UserContextType {
  userSession: UserSession | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Decodifica el JWT (solo la parte del payload)
const decodeJWT = (token: string): UserSession | null => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as UserSession;
  } catch {
    return null;
  }
};




export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Inicialización: cargar sesión desde localStorage si existe y es válida
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = decodeJWT(token);

      if (decoded) {
        const currentTime = Math.floor(Date.now() / 1000);

        // Cargar si NO está expirado
        if (decoded.exp > currentTime) {
          return decoded;
        } else {
          // Token expirado, limpiar
          localStorage.removeItem('token');
        }
      }
    }

    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return userSession !== null;
  });

  // Flag para saber si ya terminó la inicialización (evita que Firebase Auth se ejecute antes de tiempo)
  const [isInitialized, setIsInitialized] = useState(false);




  // Login: guarda el token y establece la sesión
  const login = (token: string) => {
    const decoded = decodeJWT(token);

    if (!decoded) {
      throw new Error('Token inválido');
    }

    // Guardar token y establecer sesión
    localStorage.setItem('token', token);
    setUserSession(decoded);
    setIsAuthenticated(true);

    // Notificar cambio en localStorage
    window.dispatchEvent(new Event('storage'));
  };

  // Logout: cierra sesión de Firebase y limpia el estado
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión en Firebase:", error);
    }

    localStorage.removeItem('token');
    setUserSession(null);
    setIsAuthenticated(false);
  };

  // Verifica si el token JWT está expirado
  const isTokenExpired = () => {
    if (!userSession) return true;
    return userSession.exp < Math.floor(Date.now() / 1000);
  };






  // Marcar como inicializado después del primer render
  useEffect(() => {
    setIsInitialized(true);
  }, []);



  // Escuchar cambios en localStorage (login desde otros componentes/pestañas)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');

      if (token && !isAuthenticated) {
        const decoded = decodeJWT(token);

        if (decoded) {
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp > currentTime) {
            setUserSession(decoded);
            setIsAuthenticated(true);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]);



  // Listener de Firebase Auth: solo procesa usuarios de Google/Facebook
  useEffect(() => {
    if (!isInitialized) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const existingToken = localStorage.getItem('token');

      // Caso 1 Usuario de Firebase SIN token tradicional: autenticar con backend
      if (user && !existingToken) {
        try {
          const firebaseToken = await user.getIdToken();
          const response = await axios.post(
            "http://localhost:8080/api/auth/firebase-login",
            {},
            { headers: { "Firebase-Token": firebaseToken } }
          );

          if (response.data.jwt) {
            login(response.data.jwt);
          }
        } catch (err) {
          console.error("Error autenticando con Firebase:", err);
        }
      }
      // Caso 2 No hay usuario Firebase PERO hay token tradicional: validar que siga siendo válido
      else if (!user && existingToken) {
        const decoded = decodeJWT(existingToken);

        if (decoded) {
          const currentTime = Math.floor(Date.now() / 1000);

          // Si el token tradicional sigue válido, mantener sesión
          if (decoded.exp > currentTime) {
            return;
          }
        }

        // Token inválido o expirado
        logout();
      }
    });

    return () => unsubscribe();
  }, [isInitialized]);

  // Verificar periódicamente si el token expiró (cada minuto)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        if (isTokenExpired()) logout();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userSession]);


  // Exponemos todas las funciones y valores a través del contexto
  return (
    <UserContext.Provider value={{ userSession, isAuthenticated, login, logout, isTokenExpired }}>
      {children}
    </UserContext.Provider>
  );
};



//HOOK PERSONALIZADO - Facilita el acceso al contexto

export const useUser = () => {
  const context = useContext(UserContext);

  
  if (!context) throw new Error("useUser debe ser usado dentro de UserProvider");
  return context;
};















/*import { createContext, useContext, useState, useEffect, ReactNode } from 'react';



// ⚠️ MODO DE PRUEBA - Cambiar a false en producción
const TEST_MODE = true;
const TEST_EXPIRATION_SECONDS = 20; // 60 segundos para testing




// Interfaz para los datos del usuario decodificados del JWT
export interface UserSession {
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
  userSession: UserSession | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
  getTimeRemaining: () => number; //función para testing
}




// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Función para decodificar el JWT (solo la parte del payload)
const decodeJWT = (token: string): UserSession | null => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    // En modo de prueba, ajustar la expiración para testing
    if (TEST_MODE) {
      const now = Math.floor(Date.now() / 1000);
      decodedPayload.exp = now + TEST_EXPIRATION_SECONDS;
      console.log(`🧪 TEST MODE: Token expirará en ${TEST_EXPIRATION_SECONDS} segundos`);
    }


    return decodedPayload as UserSession;
    
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;

  }
};


// Provider del contexto
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si el token está expirado
  const isTokenExpired = (): boolean => {
    if (!userSession) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return userSession.exp < currentTime;
  };


  // Función de login
  const login = (token: string) => {
    const decoded = decodeJWT(token);
    if (decoded) {
      localStorage.setItem('token', token);
      setUserSession(decoded);
      setIsAuthenticated(true);
    }
  };


  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUserSession(null);
    setIsAuthenticated(false);
  };


  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        const currentTime = Math.floor(Date.now() / 1000);
        // Verificar si el token no está expirado
        if (decoded.exp > currentTime) {
          setUserSession(decoded);
          setIsAuthenticated(true);
        } else {
          // Si está expirado, limpiar el localStorage
          localStorage.removeItem('token');
        }
      }
    }
  }, []);


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
  }, [isAuthenticated, userSession]);



  // Nueva función para obtener tiempo restante
  const getTimeRemaining = (): number => {
    if (!userSession) return 0;
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, userSession.exp - currentTime);
  };

  
  return (
    <UserContext.Provider value={{ 
      userSession, 
      isAuthenticated, 
      login, 
      logout, 
      isTokenExpired,
      getTimeRemaining 
    }}>
      {children}
    </UserContext.Provider>
  );
};


// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};*/ 