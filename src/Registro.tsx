import React, { useState, useEffect } from "react";
import axios from "axios";


//URL ejemplo
const API_URL = "http://localhost:8080/api/usuarios/registrarse";

const RegistroModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setNombre("");
      setTelefono("");
      setEmail("");
      setContrasena("");
      setRepetirContrasena("");
      setError("");
    }
  }, [isOpen]);



  // Función para manejar el registro de un nuevo usuario
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (contrasena !== repetirContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!nombre || !telefono || !email || !contrasena) {
      setError("Todos los campos son obligatorios.");
      return;
    }


    try {      // Enviar los datos a la API
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
      setError("Hubo un problema al registrar al usuario. Verifica los datos ingresados.");
    }
  };

  if (!isOpen) return null;




  // Renderizado del modal de registro

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-lato text-center -mt-4">Registrate</h2>

        <div className="h-13">
        {error && <div className="mb-4 text-red-500 font-lato ">{error}</div>}
        </div>
        
        <form onSubmit={handleRegistro}>
          <div className="mb-4">
            <label className="block mb-2 font-lato">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                const valor = e.target.value;
                //solo letras (mayúsculas o minúsculas)
                if (/^[a-zA-Z\s]*$/.test(valor)) {
                  setNombre(valor);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded font-lato"
              required
            />
          </div>


          <div className="mb-4">
            <label className="block mb-2 font-lato">Teléfono</label>
            <input
                type="tel"
                value={telefono}
                onChange={(e) => {
                  // Permitir sólo números
                  const valor = e.target.value;
                  if (/^[0-9]*$/.test(valor)) {
                    setTelefono(valor);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded font-lato"
                required
              />
          </div>

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
                
                
                src={`public/svg/${
                  showPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"
                }`}
                alt="Visibilidad"
                className="w-6 h-6"
              />
            </button>
          </div>



          <div className=" h-25 mb-4 relative">
            <label className="block mb-2 font-lato">Repetir Contraseña</label>
            <input
              type={showRepeatPassword ? "text" : "password"}
              value={repetirContrasena}
              onChange={(e) => setRepetirContrasena(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-lato"
              required
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
          </div>

          
          <button
            type="submit"
            className="bg-[#0A76E1] text-white py-2 px-4 rounded-full hover:bg-[#0A5BBE] w-full mb-4 font-lato"
          >
            Registrate
          </button>

          <div className="text-center mb-4 font-lato">---- o ingresa con ----</div>

          <div className="flex justify-center mb-4 space-x-10">
            <button className="">
              <img src="public/svg/devicon_facebook.svg" alt="" className="w-10 h-10" />

            </button>
            <button className="">
              <img src="public/svg/flat-color-icons_google.svg" alt="" className="w-10 h-10" />

            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute bottom-172 right-0 text-gray-500 mb-4 font-lato"> X


            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroModal;
