import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import axios from 'axios';

//url ejemplo
const API_URL = "http://localhost:8080/api/usuarios/recuperar-contrasena";

const RecuperarContrasena = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("El email es obligatorio.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Se ha enviado un correo para restablecer la contraseña.");
      await axios.post(API_URL, { email });
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      setError("Error al enviar el correo. Verifique el email ingresado.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm font-lato">
        <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h2>

        <p className="mb-6 text-center text-gray-700 font-lato">
          Introduce tu dirección de correo electrónico para recibir un enlace de recuperación
        </p>

        {error && <div className="mb-4 text-red-500 font-lato">{error}</div>}
        {message && <div className="mb-4 text-green-500 font-lato">{message}</div>}

        <form onSubmit={handlePasswordReset}>
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

          <button
            type="submit"
            className="bg-[#0A76E1] text-white py-2 px-4 rounded-full hover:bg-[#0A5BBE] w-full mb-4 font-lato"
          >
            Enviar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 w-full mt-4 font-lato"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
