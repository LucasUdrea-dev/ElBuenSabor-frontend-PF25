import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";
import RecuperarContrasena from "./RecuperarContrasena";
import { z } from "zod";
import { host, userAuthentication } from "../../ts/Clases";
import { useUser } from "./UserContext";

const schema = z.object({
  username: z
    .string()
    .min(1, "El usuario es obligatorio")
    .email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const API_URL = `${host}/api/auth/login`;
//URL para autenticación con Firebase
const FIREBASE_LOGIN_URL = `${host}/api/auth/firebase-login`;

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & {
  general?: string;
};

const InicioSesionUser = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { login } = useUser();
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isRecuperarOpen, setIsRecuperarOpen] = useState(false);
  const [formData, setFormData] = useState<userAuthentication>(
    new userAuthentication()
  );
  const navigate = useNavigate();
  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData(new userAuthentication());
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

  // Manejo de inicio de sesión tradicional (email/password)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");
    console.log("Datos del formulario:", formData);

    if (!validarCampos()) {
      console.log("Validación falló");
      return;
    }

    console.log("Validación exitosa, enviando petición...");
    setIsLoading(true);
    setErrors({}); // Limpiar errores previos

    try {
      const response = await axios.post(API_URL, {
        username: formData.username,
        password: formData.password,
      });

      console.log("Respuesta del servidor:", response.data);

      if (response.data.jwt) {
        login(response.data.jwt);
        localStorage.setItem("token", response.data.jwt);
        console.log("Token almacenado, cerrando modal y navegando...");
        onClose();
        navigate("/catalogo");
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
    } finally {
      setIsLoading(false);
    }
  };

  // Inicio con Google usando Firebase
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setErrors({});

    try {
      // 1. Autenticar con Firebase
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Usuario autenticado con Google:", result.user);

      // 2. Obtener el token de Firebase
      const firebaseToken = await result.user.getIdToken();
      console.log("✅ Token de Firebase obtenido");

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

      console.log(" Respuesta del backend:", response.data);

      // 4. Guardar el JWT en localStorage y contexto
      if (response.data.jwt) {
        localStorage.setItem("token", response.data.jwt);
        console.log(
          "Token guardado en localStorage:",
          localStorage.getItem("token")
        );
        login(response.data.jwt); // Actualizar el contexto
        console.log("Token almacenado, cerrando modal y navegando...");

        // 5. Cerrar modal y redirigir
        onClose();
        navigate("/catalogo");
      } else {
        setErrors({ general: "No se recibió token de autenticación" });
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error);

      // Manejo de errores específicos
      let errorMessage = "Error al autenticar con Google. Intenta nuevamente.";

      if (error.code === "auth/popup-blocked") {
        errorMessage =
          "El popup fue bloqueado. Permite los popups para este sitio.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Cerraste el popup de autenticación.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para abrir el modal de recuperación de contraseña
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
          disabled={isLoading}
          className="absolute top-9 right-8 text-gray-500 hover:text-gray-700 font-lato"
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-7 font-lato text-center">
          Iniciar Sesión
        </h2>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-lato text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-lato">Email</label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
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
                disabled={isLoading}
                className="w-full p-2 pr-10 border border-gray-300 rounded font-lato"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <img
                  src={`public/svg/${
                    showPassword
                      ? "ic_baseline-visibility-off.svg"
                      : "ic_baseline-visibility.svg"
                  }`}
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
            disabled={isLoading}
            className={`py-2 px-4 rounded-full w-full mb-4 font-lato transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-[#0A76E1] hover:bg-[#0A5BBE] text-white"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Ingresando...
              </div>
            ) : (
              "Ingresar"
            )}
          </button>

          <div className="text-center mb-4 font-lato">
            <button
              type="button"
              onClick={handleOpenRecuperar}
              disabled={isLoading}
              className="text-blue-500 hover:text-blue-700"
            >
              ¿Olvidó su contraseña?
            </button>
          </div>

          {/* Bloque de inicio con redes sociales */}
          <div className="text-center mb-4 font-lato">
            <div className="flex justify-center items-center gap-2 mb-4">
              <p className="m-0">Ingresa con</p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-full shadow-sm transition-all duration-200 bg-white text-gray-700 font-medium ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 hover:shadow-md"
                }`}
              >
                <img
                  src="public/svg/flat-color-icons_google.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
                <span>Google</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <RecuperarContrasena
        isOpen={isRecuperarOpen}
        onClose={handleCloseRecuperar}
      />
    </div>
  );
};

export default InicioSesionUser;
