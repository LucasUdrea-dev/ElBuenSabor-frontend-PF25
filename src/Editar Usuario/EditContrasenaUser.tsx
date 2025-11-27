import React, { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { host } from "../../ts/Clases";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  onContrasenaActualizada: () => void;
}

// Esquema de validación con Zod
const contrasenaSchema = z
  .object({
    contrasenaActual: z.string().min(6, "La contraseña actual debe tener al menos 6 caracteres"),
    nuevaContrasena: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmarContrasena: z.string().min(6, "La confirmación debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.nuevaContrasena === data.confirmarContrasena, {
    message: "Las contraseñas nuevas no coinciden",
    path: ["confirmarContrasena"],
  })
  .refine((data) => data.contrasenaActual !== data.nuevaContrasena, {
    message: "La nueva contraseña no puede ser igual a la actual",
    path: ["nuevaContrasena"],
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
  const [cargando, setCargando] = useState(false);

  // Función para obtener la configuración de axios con token fresco
  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  // Limpiar campos cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setContrasenaActual("");
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setError("");
      setCargando(false);
    }
  }, [isOpen]);

  const handleGuardar = async () => {
    setError("");
    setCargando(true);

    // Validación con Zod
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
        "Error en la validación"
      );
      setCargando(false);
      return;
    }

    try {
      const respuesta = await axios.put(
        `${host}/api/auth/updatePassword/${usuarioId}`,
        {
          passwordActual: contrasenaActual,
          passwordNuevo: nuevaContrasena,
        },
        getAxiosConfig()
      );

      if (respuesta.status === 200) {
        // No se pasa la contraseña como parámetro por seguridad
        onContrasenaActualizada();
        onClose();
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          // El backend devuelve el mensaje de error directamente como string
          const mensajeError = err.response.data;
          setError(
            typeof mensajeError === "string"
              ? mensajeError
              : "La contraseña actual es incorrecta."
          );
        } else if (err.response?.status === 404) {
          setError("Usuario no encontrado.");
        } else if (err.response?.data) {
          // Intentar extraer el mensaje de error si viene en otro formato
          const mensajeError =
            typeof err.response.data === "string"
              ? err.response.data
              : err.response.data.message || err.response.data.error;

          setError(mensajeError || "Error al actualizar la contraseña.");
        } else {
          setError("Error al actualizar la contraseña.");
        }
      } else {
        setError("Error al procesar la solicitud.");
      }
      console.error("Error al actualizar contraseña:", err);
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl max-md:w-xs max-md:p-5 shadow-lg w-full max-w-md font-lato">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Editar contraseña
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Contraseña actual</label>
          <input
            type="password"
            value={contrasenaActual}
            onChange={(e) => setContrasenaActual(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#0A76E1] focus:border-transparent"
            disabled={cargando}
            placeholder="••••••••"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Nueva contraseña</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#0A76E1] focus:border-transparent"
            disabled={cargando}
            placeholder="••••••••"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            Repetir nueva contraseña
          </label>
          <input
            type="password"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#0A76E1] focus:border-transparent"
            disabled={cargando}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2 mt-10">
          <button
            onClick={onClose}
            className="bg-white text-[#0A76E1] py-3 px-3 rounded-full hover:bg-gray-200 border border-[#0A76E1] w-40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-[#0A76E1] text-white py-3 px-3 rounded-full hover:bg-[#0A5BBE] w-40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContrasenaUser;