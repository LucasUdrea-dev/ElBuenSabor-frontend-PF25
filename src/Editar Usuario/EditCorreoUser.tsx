import React, { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { host } from "../../ts/Clases";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  onCorreoActualizado: (nuevoCorreo: string) => void;
}

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
};

// Esquema de validación con Zod
const correoSchema = z
  .object({
    correoActual: z.string().email("El correo actual no es válido"),
    nuevoCorreo: z.string().email("El nuevo correo no es válido"),
    confirmarCorreo: z.string().email("La confirmación no es válida"),
  })
  .refine((data) => data.nuevoCorreo === data.confirmarCorreo, {
    message: "Los correos nuevos no coinciden",
    path: ["confirmarCorreo"],
  });

const EditCorreoUser: React.FC<Props> = ({
  isOpen,
  onClose,
  usuarioId,
  onCorreoActualizado,
}) => {
  const [correoActual, setCorreoActual] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [confirmarCorreo, setConfirmarCorreo] = useState("");
  const [error, setError] = useState("");

  //limpiar campos
  useEffect(() => {
    if (!isOpen) {
      setCorreoActual("");
      setNuevoCorreo("");
      setConfirmarCorreo("");
      setError("");
    }
  }, [isOpen]);

  const handleGuardar = async () => {
    setError("");

    // Validación con Zod
    const resultado = correoSchema.safeParse({
      correoActual,
      nuevoCorreo,
      confirmarCorreo,
    });

    if (!resultado.success) {
      const errores = resultado.error.flatten().fieldErrors;
      setError(
        errores.correoActual?.[0] ||
          errores.nuevoCorreo?.[0] ||
          errores.confirmarCorreo?.[0] ||
          resultado.error.message
      );
      return;
    }

    try {
      // Validar correo actual con el servidor
      const validacion = await axios.post(
        `${host}/api/usuarios/validarCorreo`,
        { id: usuarioId, correo: correoActual },
        axiosConfig
      );

      if (!validacion.data.validado) {
        setError("El correo actual no coincide.");
        return;
      }

      // Actualizar correo
      const respuesta = await axios.put(
        `${host}/api/usuarios/actualizarCorreo`,
        { id: usuarioId, nuevoCorreo },
        axiosConfig
      );

      if (respuesta.status === 200) {
        onCorreoActualizado(nuevoCorreo);
        onClose();
      } else {
        setError("Error al actualizar el correo.");
      }
    } catch (err) {
      setError("Error al procesar la solicitud.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md font-lato">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Editar email
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Correo actual</label>
          <input
            type="email"
            value={correoActual}
            onChange={(e) => setCorreoActual(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Nuevo correo</label>
          <input
            type="email"
            value={nuevoCorreo}
            onChange={(e) => setNuevoCorreo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            Repetir nuevo correo
          </label>
          <input
            type="email"
            value={confirmarCorreo}
            onChange={(e) => setConfirmarCorreo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="flex justify-between gap-2 mt-10">
          <button
            onClick={onClose}
            className="bg-white text-[#0A76E1] py-3 px-3 rounded-full hover:bg-gray-200 border border-[#0A76E1] w-40"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-[#0A76E1] text-white py-3 px-3 rounded-full hover:bg-[#0A5BBE] w-40"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCorreoUser;
