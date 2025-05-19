import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";

// URL ejemplo
const API_URL = "http://localhost:8080/api/usuarios/registrarse";


//tipo de los errores
type Errors = {
  nombre?: string;
  telefono?: string;
  email?: string;
  contrasena?: string;
  repetirContrasena?: string;
  general?: string;
};


//estados para manejar los campos del formulario
const RegistroModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});


  //limpiar
  useEffect(() => {
    if (!isOpen) {
      setNombre("");
      setTelefono("");
      setEmail("");
      setContrasena("");
      setRepetirContrasena("");
      setErrors({});
    }
  }, [isOpen]);



  //valida los campos del formulario y actualiza el estado de errores.
  const validarCampos = (): boolean => {
    const nuevosErrores: Errors = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (!/^[a-zA-Z\s]*$/.test(nombre.trim())) {
      nuevosErrores.nombre = "El nombre solo puede contener letras y espacios.";
    }

    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (!/^[0-9]+$/.test(telefono.trim())) {
      nuevosErrores.telefono = "El teléfono solo puede contener números.";
    }

    if (!email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())) {
      nuevosErrores.email = "El email no tiene un formato válido.";
    }

    if (!contrasena) {
      nuevosErrores.contrasena = "La contraseña es obligatoria.";
    }

    if (!repetirContrasena) {
      nuevosErrores.repetirContrasena = "Debe repetir la contraseña.";
    }

    if (contrasena && repetirContrasena && contrasena !== repetirContrasena) {
      nuevosErrores.repetirContrasena = "Las contraseñas no coinciden.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };



  //función para enviar el formulario
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        nombre,
        telefono,
        email,
        contrasena,
      });

      console.log("Usuario registrado:", response.data);
      onClose();
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setErrors({ general: "Hubo un problema al registrar al usuario. Verifica los datos ingresados." });
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full p-2 border rounded font-lato ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1 font-lato ">{errors.nombre}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-lato">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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
              value={repetirContrasena}
              onChange={(e) => setRepetirContrasena(e.target.value)}
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
