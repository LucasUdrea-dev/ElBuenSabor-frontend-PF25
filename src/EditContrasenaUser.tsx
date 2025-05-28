import React, { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  onContrasenaActualizada: (nuevaContrasena: string) => void;
}

// Esquema de validación con Zod
const contrasenaSchema = z
  .object({
    contrasenaActual: z.string().min(6, "La contraseña actual no es válida"),
    nuevaContrasena: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmarContrasena: z.string().min(6, "La confirmación debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.nuevaContrasena === data.confirmarContrasena, {
    message: "Las contraseñas nuevas no coinciden",
    path: ["confirmarContrasena"],
  });

const EditContrasenaUser: React.FC<Props> = ({
  isOpen,
  onClose,
  usuarioId,
  onContrasenaActualizada,
}) => {
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");



  //limpiar campos 
    useEffect(() => {
    if (!isOpen) {
      setContrasenaActual("");
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setError("");
    }
     }, [isOpen]);
  

  const handleGuardar = async () => {
    setError("");

    const resultado = contrasenaSchema.safeParse({
      contrasenaActual,
      nuevaContrasena,
      confirmarContrasena,
    });

    if (!resultado.success) {
      const errores = resultado.error.flatten().fieldErrors;
      setError(
        errores.contrasenaActual?.[0] ||
        errores.nuevaContrasena?.[0] ||
        errores.confirmarContrasena?.[0] ||
        resultado.error.message
      );
      return;
    }

    try {
      // Validar contraseña actual con el servidor
      const validacion = await axios.post("http://localhost:8080/api/usuarios/validarContrasena", {
        id: usuarioId,
        contrasena: contrasenaActual,
      });

      if (!validacion.data.validado) {
        setError("La contraseña actual no coincide.");
        return;
      }

      // Actualizar contraseña
      const respuesta = await axios.put("http://localhost:8080/api/usuarios/actualizarContrasena", {
        id: usuarioId,
        nuevaContrasena,
      });

      if (respuesta.status === 200) {
        onContrasenaActualizada(nuevaContrasena);
        onClose();
      } else {
        setError("Error al actualizar la contraseña.");
      }
    } catch (err) {
      setError("Error al procesar la solicitud.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md font-lato">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Editar contraseña</h2>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Contraseña actual</label>
          <input
            type="password"
            value={contrasenaActual}
            onChange={(e) => setContrasenaActual(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Nueva contraseña</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Repetir nueva contraseña</label>
          <input
            type="password"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
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

export default EditContrasenaUser;
