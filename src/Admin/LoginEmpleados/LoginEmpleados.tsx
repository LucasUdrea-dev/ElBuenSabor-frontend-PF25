import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import RecuperarContrasena from "../../UserAuth/RecuperarContrasena";
import { z } from "zod";
import { userAuthentication } from "../../../ts/Clases";
import { useEmpleado } from "./EmpleadoContext";



const schema = z.object({
  username: z.string().min(1, "El usuario es obligatorio").email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const API_URL = "http://localhost:8080/api/auth/login";

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };

//componente 
const InicioSesionEmpleado = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

  //Estado para manejar los errores de validación
  const { login } = useEmpleado();
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

    if (!validarCampos()) {
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        username: formData.username,
        password: formData.password
      });

      if (response.data.jwt) {
        try {
          login(response.data.jwt);
          localStorage.setItem('token', response.data.jwt);
          onClose();
          navigate('/admin/administracion');
        } catch (loginError) {
          // Error del EmpleadoContext (ej: usuario con rol CUSTOMER)
          if (loginError instanceof Error) {
            setErrors({ general: loginError.message });
          } else {
            setErrors({ general: "Acceso Denegado: No tienes permisos para acceder a la sección de administración." });
          }
        }
      } else {
        setErrors({ general: "No se recibió token de autenticación" });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Capturar el mensaje específico del backend
        const errorMessage = err.response?.data;

        // Si el backend devuelve el mensaje como string directo
        if (typeof errorMessage === 'string') {
          // Verificar si es el error de usuario inactivo
          if (errorMessage.includes("no está activo") || errorMessage.includes("no existe")) {
            setErrors({ general: "La cuenta está actualmente inactiva." });
          } else {
            setErrors({ general: errorMessage });
          }
        }
        // Si el backend devuelve un objeto con mensaje
        else if (errorMessage?.message) {
          setErrors({ general: errorMessage.message });
        }
        // Fallback para otros errores
        else if (err.response?.status === 401) {
          setErrors({ general: "Credenciales incorrectas" });
        } else {
          setErrors({ general: "Error al iniciar sesión. Intenta nuevamente." });
        }
      } else {
        setErrors({ general: "Error desconocido en el inicio de sesión." });
      }
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

        </form>
      </div>

      <RecuperarContrasena isOpen={isRecuperarOpen} onClose={handleCloseRecuperar} />

    </div>
  );
};

export default InicioSesionEmpleado;