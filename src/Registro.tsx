import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { z } from "zod";
import { Usuario } from "../ts/Clases";


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
const API_URL = "http://localhost:8080/api/usuarios/registrarse";


// Tipo para manejar los errores de validación
type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };


//estados para manejar los datos del formulario (names)
const RegistroModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido:"",
    telefono: "",
    email: "",
    contrasena: "",
    repetirContrasena: "",
  });


  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);


  //limpiar
  useEffect(() => {
    if (!isOpen) {
      setFormData({ nombre: "", apellido:"", telefono: "", email: "", contrasena: "", repetirContrasena: "" });
      setErrors({});
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



  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    // Adaptar los datos al tipo UsuarioEntidad
    const usuario: Usuario = {
      nombre: formData.nombre,
      apellido:formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      contrasena: formData.contrasena,
      repetirContrasena:formData.repetirContrasena

    };

    try {
      const response = await axios.post(API_URL, usuario);
      console.log("Usuario registrado:", response.data);
      onClose();
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setErrors({ general: "Hubo un problema al registrar al usuario." });
    }
  };



  

  // Login con Google y Facebook
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario con Google:", result.user);
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

      <h2 className="text-2xl font-bold mb-7 font-lato text-center">Registrate</h2> 

        {errors.general && (
          <div className="text-red-600 font-lato mb-2 text-center font-lato">{errors.general}</div>
        )}

        <form onSubmit={handleRegistro}>
          <div className="mb-4">
            <label className="block mb-2 font-lato">Nombre Completo</label>
            <input
              type="text"
              name="nombre"// atributo name
              value={formData.nombre}// Se enlaza al estado formData
              onChange={handleChange} // Llama a la función handleChange al cambiar el valor
              className={`w-full p-2 border rounded font-lato ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1 font-lato ">{errors.nombre}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-lato">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={`w-full p-2 border rounded font-lato ${
                errors.apellido ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.apellido && <p className="text-red-500 text-sm mt-1 font-lato ">{errors.apellido}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-lato">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
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
              className={`w-full p-2 border rounded font-lato ${
                errors.contrasena ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
              className={`w-full p-2 border rounded font-lato ${
                errors.repetirContrasena ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
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
            className="bg-[#0A76E1] text-white py-2 px-4 rounded-full hover:bg-[#0A5BBE] w-full mb-4 font-lato"
          >
            Registrate
          </button>

          <div className="text-center mb-4 font-lato">---- o ingresa con ----</div>

          <div className="flex justify-center mb-4 space-x-10">
            <button onClick={handleFacebookLogin} type="button">
              <img src="public/svg/devicon_facebook.svg" alt="Facebook" className="w-10 h-10" />
            </button>
            <button onClick={handleGoogleLogin} type="button">
              <img src="public/svg/flat-color-icons_google.svg" alt="Google" className="w-10 h-10" />
            </button>
          </div>

      
        </form>
      </div>
    </div>
  );
};

export default RegistroModal;
