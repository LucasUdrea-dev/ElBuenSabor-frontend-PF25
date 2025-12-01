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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#444444] rounded-xl max-w-md w-full shadow-2xl">
        <div className="bg-[#333333]/40 px-6 py-4 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Editar contraseña</h3>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Contraseña actual
            </label>
            <input
              type="password"
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
              disabled={cargando}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
              disabled={cargando}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Repetir nueva contraseña
            </label>
            <input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
              disabled={cargando}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="bg-[#999999]/35 hover:bg-[#999999]/50 px-6 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="bg-[#D93F21] hover:bg-[#C13519] px-6 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cargando}
            >
              {cargando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContrasenaUser;
