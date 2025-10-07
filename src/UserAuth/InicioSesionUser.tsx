import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";
import RecuperarContrasena from "./RecuperarContrasena";
import { z } from "zod";
import { userAuthentication } from "../../ts/Clases";
import { useUser } from "./UserContext";

const schema = z.object({
  username: z.string().min(1, "El usuario es obligatorio").email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const API_URL = "http://localhost:8080/api/auth/login";

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };

//componente 
const InicioSesionUser = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

    //Estado para manejar los errores de validación
    const { login } = useUser();
    const [errors, setErrors] = useState<Errors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isRecuperarOpen, setIsRecuperarOpen] = useState(false);
    const [formData, setFormData] = useState<userAuthentication>(new userAuthentication());//estado para almacenar datos del formulario
    const navigate = useNavigate();//hook para redirigir despues del login

    //limpiar
    useEffect(() => {
      if (!isOpen) {
        setFormData(new userAuthentication());
        setErrors({});
      }
    }, [isOpen]);

    // Maneja el cambio en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };




    // Función para validar los campos del formulario
    const validarCampos = (): boolean => {
      console.log("Validando campos con datos:", formData);
      const result = schema.safeParse(formData);

      if (!result.success) {
        console.log("Errores de validación:", result.error.issues);
      }

      const newErrors = result.success
        ? {}
        : result.error.issues.reduce((acc, issue) => {
          acc[issue.path[0] as keyof typeof acc] = issue.message;
          return acc;
        }, {} as Errors);

      setErrors(newErrors);
      console.log("Errores después de validación:", newErrors);
      return Object.keys(newErrors).length === 0;
    };




    // Manejo de inicio de sesión
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Formulario enviado");
      console.log("Datos del formulario:", formData);
      
      if (!validarCampos()) {
        console.log("Validación falló");
        return;
      }
      
      console.log("Validación exitosa, enviando petición...");
      
      try {
        const response = await axios.post(API_URL, {
          username: formData.username,
          password: formData.password
        });

        console.log("Respuesta del servidor:", response.data);

        if (response.data.jwt) {
          login(response.data.jwt); // Actualizar el contexto de usuario
          localStorage.setItem('token', response.data.jwt); // Almacenar el token
          console.log("Token almacenado, cerrando modal y navegando...");
          onClose();
          navigate('/catalogo'); // Redirigir a la página de catálogo
        } else {
          console.error("No se recibió token en la respuesta");
          setErrors({ general: "No se recibió token de autenticación" });
        }

      } catch (err) {
        console.error("Error al iniciar sesión:", err);
        if (axios.isAxiosError(err)) {
          console.error("Error de Axios:", err.response?.data);
          setErrors({ general: "Datos incorrectos" });

        } else {
          setErrors({ general: "Error desconocido en el inicio de sesión." });
        }
      }
    };



    

    //Inicio con Google y Facebook
    const handleGoogleLogin = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("Usuario con Google:", result.user);
        // Aquí se podría enviar el usuario al backend
      } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
      }
    };

    const handleFacebookLogin = async () => {
      const provider = new FacebookAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("Usuario con Facebook:", result.user);
      } catch (error) {
        console.error("Error al iniciar sesión con Facebook:", error);
      }
    };




    // función para abrir el modal de recuperación de contraseña:
    const handleOpenRecuperar = () => {
      setIsRecuperarOpen(true);
    };

    const handleCloseRecuperar = () => {
      setIsRecuperarOpen(false);
    };

    if (!isOpen) return null;


    

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">

          <button
            type="button"
            onClick={onClose}
            className="absolute top-9 right-8 text-gray-500 hover:text-gray-700 font-lato"
          >
            X
          </button>

          <h2 className="text-2xl font-bold mb-7 font-lato text-center">Iniciar Sesión</h2>

          {errors.general && (
            <div className="text-red-600 font-lato mb-2 text-center">{errors.general}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-2 font-lato">Email</label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded font-lato"
                required
              />
              {errors.username && (
                <div className="text-red-600 text-sm mt-1">{errors.username}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-lato">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 pr-10 border border-gray-300 rounded font-lato"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <img
                    src={`public/svg/${showPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"}`}
                    alt="Visibilidad"
                    className="w-6 h-6"
                  />
                </button>
              </div>
              {errors.password && (
                <div className="text-red-600 text-sm mt-1">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#0A76E1] text-white py-2 px-4 rounded-full hover:bg-[#0A5BBE] w-full mb-4 font-lato"
            >
              Ingresar
            </button>

            <div className="text-center mb-4 font-lato">
              <button
                type="button"
                onClick={handleOpenRecuperar}
                className="text-blue-500"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>

            <div className="text-center mb-4 font-lato">---- o ingresa con ----</div>

            <div className="flex justify-center mb-4 space-x-10">
              <button type="button" onClick={handleFacebookLogin}>
                <img src="public/svg/devicon_facebook.svg" alt="" className="w-10 h-10" />
              </button>
              <button type="button" onClick={handleGoogleLogin}>
                <img src="public/svg/flat-color-icons_google.svg" alt="" className="w-10 h-10" />
              </button>
            </div>

          </form>
        </div>

        <RecuperarContrasena isOpen={isRecuperarOpen} onClose={handleCloseRecuperar} />

      </div>
    );
};

export default InicioSesionUser;