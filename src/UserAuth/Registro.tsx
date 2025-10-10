import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { z } from "zod";
import { userAuthentication, Usuario } from "../../ts/Clases";
import { useUser } from "../UserAuth/UserContext";
import { useNavigate } from "react-router-dom";




// Esquema de validación con Zod
const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z.string().min(1, "El apellido es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  telefono: z.string().min(1, "El teléfono es obligatorio").regex(/^[0-9]+$/, "Solo números"),
  email: z.string().email("Formato de email inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  repetirContrasena: z.string(),
}).refine((data) => data.contrasena === data.repetirContrasena, {
  path: ["repetirContrasena"],
  message: "Las contraseñas no coinciden",
});


// URL ejemplo
const API_URL = "http://localhost:8080/api/auth/crear";
// URL para login con Firebase
const FIREBASE_LOGIN_URL = "http://localhost:8080/api/auth/firebase-login";


// Tipo para manejar los errores de validación
type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };

const RegistroModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido:"",
    telefono: "",
    email: "",
    contrasena: "",
    repetirContrasena: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({ nombre: "", apellido:"", telefono: "", email: "", contrasena: "", repetirContrasena: "" });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);



  // Maneja el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  // Función para validar los campos del formulario
  const validarCampos = (): boolean => {
    const result = schema.safeParse(formData);
    
    const newErrors = result.success 
        ? {} 
        : result.error.issues.reduce((acc, issue) => {
            acc[issue.path[0] as keyof typeof acc] = issue.message;
            return acc;
          }, {} as Errors);

    if (formData.contrasena !== formData.repetirContrasena) {
      newErrors.repetirContrasena = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  // Registro tradicional (con email y contraseña)
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    setIsLoading(true);
    setErrors({});

    // Instanciamos Usuario
    const usuario = new Usuario();
    usuario.nombre = formData.nombre;
    usuario.apellido = formData.apellido;
    usuario.email = formData.email;
    usuario.existe = true;
    usuario.imagenUsuario = "";
    usuario.telefonoList = [
      { id: null, numero: parseInt(formData.telefono) }
    ];

    // Instanciamos userAuthentication
    const authData = new userAuthentication();
    authData.username = formData.email;
    authData.password = formData.contrasena;

    // Armamos el objeto final que espera el backend
    const datosRegistro = {
      ...usuario,
      userAuth: authData
    };

    try {
      console.log("Enviando al backend:", JSON.stringify(datosRegistro, null, 2));
      const response = await axios.post(API_URL, datosRegistro);
      console.log("Usuario registrado:", response.data);
      
      
      onClose();
      setTimeout(() => navigate('/catalogo'), 0);
    } catch (err: any) {
      console.error("Error al registrar usuario:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Hubo un problema al registrar al usuario.";

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };





  // Función COMPLETA de login con Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setErrors({});

    try {
      // 1. Autenticar con Firebase
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario autenticado con Google:", result.user);

      // 2. Obtener el token de Firebase
      const firebaseToken = await result.user.getIdToken();
      console.log("Token de Firebase obtenido");

      // 3. Enviar el token al backend
      const response = await axios.post(
        FIREBASE_LOGIN_URL,
        {}, // Body vacío
        {
          headers: {
            "Firebase-Token": firebaseToken,
          },
        }
      );

      console.log(" Respuesta del backend:", response.data);
      
      
      console.log("JWT recibido:", response.data.jwt);
      console.log("Usuario:", response.data);

      login(response.data.jwt);

      // 5. Cerrar el modal
      onClose();
      setTimeout(() => navigate('/catalogo'), 0);
      

    } catch (error: any) {
      console.error(" Error al iniciar sesión con Google:", error);
      
      // Manejo de errores específicos
      let errorMessage = "Error al autenticar con Google. Intenta nuevamente.";
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = "El popup fue bloqueado. Permite los popups para este sitio.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Cerraste el popup de autenticación.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };




  // Función COMPLETA de login con Facebook
  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    setIsLoading(true);
    setErrors({});

    try {
      // 1. Autenticar con Firebase
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario autenticado con Facebook:", result.user);

      // 2. Obtener el token de Firebase
      const firebaseToken = await result.user.getIdToken();
      console.log("Token de Firebase obtenido");

      // 3. Enviar el token al backend
      const response = await axios.post(
        FIREBASE_LOGIN_URL,
        {},
        {
          headers: {
            "Firebase-Token": firebaseToken,
          },
        }
      );

      console.log("Respuesta del backend:", response.data);
      
      login(response.data.jwt);

      // 5. Cerrar el modal
      onClose();

    } catch (error: any) {
      console.error(" Error al iniciar sesión con Facebook:", error);
      
      let errorMessage = "Error al autenticar con Facebook. Intenta nuevamente.";
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = "El popup fue bloqueado. Permite los popups para este sitio.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Cerraste el popup de autenticación.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };



  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-9 right-8 text-gray-500 hover:text-gray-700 font-lato"
          disabled={isLoading}
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-7 font-lato text-center">Registrate</h2> 

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-lato text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleRegistro}>
          <div className="mb-4">
            <label className="block mb-2 font-lato">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1 font-lato">{errors.nombre}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-lato">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.apellido ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.apellido && <p className="text-red-500 text-sm mt-1 font-lato">{errors.apellido}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-lato">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.telefono && <p className="text-red-500 text-sm mt-1 font-lato">{errors.telefono}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-lato">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 font-lato">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="block mb-2 font-lato">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.contrasena ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-2 top-13 transform -translate-y-1/2"
            >
              <img
                src={`public/svg/${
                  showPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"
                }`}
                alt="Visibilidad"
                className="w-6 h-6"
              />
            </button>
            {errors.contrasena && <p className="text-red-500 text-sm mt-1 font-lato">{errors.contrasena}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="block mb-2 font-lato">Repetir Contraseña</label>
            <input
              type={showRepeatPassword ? "text" : "password"}
              value={formData.repetirContrasena}
              name="repetirContrasena"
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.repetirContrasena ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              disabled={isLoading}
              className="absolute right-2 top-13 transform -translate-y-1/2"
            >
              <img
                src={`public/svg/${
                  showRepeatPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"
                }`}
                alt="Visibilidad"
                className="w-6 h-6"
              />
            </button>
            {errors.repetirContrasena && (
              <p className="text-red-500 text-sm mt-1 font-lato">{errors.repetirContrasena}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`py-2 px-4 rounded-full w-full mb-4 font-lato transition-all duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                : 'bg-[#0A76E1] hover:bg-[#0A5BBE] text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Registrate'
            )}
          </button>

          <div className="text-center mb-4 font-lato">---- o ingresa con ----</div>

        
          <div className="flex justify-center mb-4 space-x-10">
            <button 
              onClick={handleFacebookLogin} 
              type="button"
              disabled={isLoading}
              className={`transition-opacity ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
              }`}
            >
              <img 
                src="public/svg/devicon_facebook.svg" 
                alt="Facebook" 
                className="w-10 h-10" 
              />
            </button>
            
            <button 
              onClick={handleGoogleLogin} 
              type="button"
              disabled={isLoading}
              className={`transition-opacity ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
              }`}
            >
              <img 
                src="public/svg/flat-color-icons_google.svg" 
                alt="Google" 
                className="w-10 h-10" 
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroModal;