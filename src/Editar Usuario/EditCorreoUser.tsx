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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md font-lato">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Editar email
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Nuevo correo</label>
          <input
            type="email"
            value={nuevoCorreo}
            onChange={(e) => setNuevoCorreo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            disabled={cargando}
            placeholder="ejemplo@correo.com"
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
            disabled={cargando}
            placeholder="ejemplo@correo.com"
          />
        </div>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <div className="flex justify-between gap-2 mt-10">
          <button
            onClick={onClose}
            className="bg-white text-[#0A76E1] py-3 px-3 rounded-full hover:bg-gray-200 border border-[#0A76E1] w-40"
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-[#0A76E1] text-white py-3 px-3 rounded-full hover:bg-[#0A5BBE] w-40 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCorreoUser;