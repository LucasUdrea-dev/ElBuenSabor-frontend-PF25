import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";


//url ejemplo
const API_URL = "http://localhost:8080/api/usuarios/iniciarSesion";

const InicioSesionUs = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setContrasena("");
      setError("");
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !contrasena) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        email,
        contrasena,
      });

      console.log("Usuario logueado:", response.data);
      onClose();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Email o contraseña incorrectos.");
    }
  };

  //Inico con Google y Facebook
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
  

  if (!isOpen) return null;




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-lato text-center">Iniciar Sesión</h2>
        

        <div className="h-8">
        {error && <div className="mb-4 text-red-500 font-lato ">{error}</div>}
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-lato">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-lato"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block mb-2 font-lato">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-lato"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-13 transform -translate-y-1/2"
            >
              <img
                src={`public/svg/${showPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"}`}
                alt="Visibilidad"
                className="w-6 h-6"
              />
            </button>
          </div>


          <button
            type="submit"
            className="bg-[#0A76E1] text-white py-2 px-4 rounded-full hover:bg-[#0A5BBE] w-full mb-4 font-lato"
          >
            Ingresar
          </button>

          <div className="text-center mb-4 font-lato">
            <a href="#" className="text-blue-500">¿Olvidó su contraseña?</a>
          </div>

          <div className="text-center mb-4 font-lato">---- o ingresa con ----</div>

          <div className="flex justify-center mb-4 space-x-10">
            <button onClick={handleFacebookLogin}>
              <img src="public/svg/devicon_facebook.svg" alt="" className="w-10 h-10" />
            </button>
              <button onClick={handleGoogleLogin}>
              <img src="public/svg/flat-color-icons_google.svg" alt="" className="w-10 h-10" />
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={onClose}
            className="absolute bottom-103 right-0 text-gray-500 mb-4 font-lato">X


            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InicioSesionUs;
