import React, { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { host } from "../../ts/Clases";
import { useUser } from "../UserAuth/UserContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  onCorreoActualizado: (nuevoCorreo: string) => void;
}

// Esquema de validación con Zod
const correoSchema = z
  .object({
    nuevoCorreo: z.string().email("El nuevo correo no es válido"),
    confirmarCorreo: z.string().email("La confirmación no es válida"),
  })
  .refine((data) => data.nuevoCorreo === data.confirmarCorreo, {
    message: "Los correos nuevos no coinciden",
    path: ["confirmarCorreo"],
  });


// Interfaz para la respuesta del backend
interface UpdateResponseDTO {
  mensaje: string;
  token: string; //JWT actualizado
}



const EditCorreoUser: React.FC<Props> = ({
  isOpen,
  onClose,
  usuarioId,
  onCorreoActualizado,
}) => {

  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [confirmarCorreo, setConfirmarCorreo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useUser();

  // Función para obtener la configuración de axios con token fresco
  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  // Limpiar campos
  useEffect(() => {
    if (!isOpen) {
      setNuevoCorreo("");
      setConfirmarCorreo("");
      setError("");
      setCargando(false);
    }
  }, [isOpen]);

  const handleGuardar = async () => {
    setError("");
    setCargando(true);

    // Validación con Zod
    const resultado = correoSchema.safeParse({
      nuevoCorreo,
      confirmarCorreo,
    });

    if (!resultado.success) {
      const errores = resultado.error.flatten().fieldErrors;
      setError(
        errores.nuevoCorreo?.[0] ||
        errores.confirmarCorreo?.[0] ||
        "Error de validación"
      );
      setCargando(false);
      return;
    }

    try {
      const respuesta = await axios.put<UpdateResponseDTO>(
        `${host}/api/auth/updateUsername/${usuarioId}`,
        {
          username: nuevoCorreo,
        },
        getAxiosConfig()
      );
      

      if (respuesta.status === 200) {
        // Actualizar el token en el contexto
        const nuevoToken = respuesta.data.token;
        
        if (nuevoToken) {
          // Llamar a login() del contexto para actualizar la sesión
          login(nuevoToken);
          
          console.log("✅ Token actualizado exitosamente");
        } else {
          console.warn("⚠️ El backend no devolvió un nuevo token");
        }

        // Notificar al componente padre que el correo cambió
        onCorreoActualizado(nuevoCorreo);
        
        // Cerrar el modal
        onClose();
      } else {
        setError("Error al actualizar el correo.");
      }

      
    } catch (err: any) {
      // Manejo de errores
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const mensaje = err.response.data?.message || err.response.data || "Error al actualizar el correo.";
        setError(typeof mensaje === 'string' ? mensaje : "Error al actualizar el correo.");
      } else if (err.request) {
        // La petición fue hecha pero no hubo respuesta
        setError("No se pudo conectar con el servidor.");
      } else {
        // Algo más causó el error
        setError("Error al procesar la solicitud.");
      }
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#444444] rounded-xl max-w-md w-full shadow-2xl">
        <div className="bg-[#333333]/40 px-6 py-4 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Editar email</h3>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Nuevo correo
            </label>
            <input
              type="email"
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
              disabled={cargando}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Repetir nuevo correo
            </label>
            <input
              type="email"
              value={confirmarCorreo}
              onChange={(e) => setConfirmarCorreo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
              disabled={cargando}
              placeholder="ejemplo@correo.com"
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

export default EditCorreoUser;