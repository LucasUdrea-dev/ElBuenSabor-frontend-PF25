import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { host } from "../../../ts/Clases";

// --- Validación con Zod ---
const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z.string().min(1, "El apellido es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  telefono: z.string().min(1, "El teléfono es obligatorio").regex(/^[0-9]+$/, "Solo números"),
  email: z.string().email("Formato de email inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),

  cargo: z.enum(["CAJERO", "COCINERO", "DELIVERY"], {
    errorMap: () => ({ message: "Debe seleccionar un cargo válido" })
  }),

});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };


const API_URL = `${host}/api/empleados/crear`;


// --- MAPEO DE ROLES ---
const ROLES_MAP: Record<string, number> = {
  CAJERO: 3,
  COCINERO: 4,
  DELIVERY: 5,
};

interface AgregarEmpleadosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmpleadoCreado: () => void;
}

const AgregarEmpleados = ({ isOpen, onClose, onEmpleadoCreado }: AgregarEmpleadosModalProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    contrasena: "",
    cargo: "CAJERO" as "CAJERO" | "COCINERO" | "DELIVERY",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        contrasena: "",
        cargo: "CAJERO",
      });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarCampos = (): boolean => {
    const result = schema.safeParse(formData);

    const newErrors = result.success
      ? {}
      : result.error.issues.reduce((acc, issue) => {
        acc[issue.path[0] as keyof typeof acc] = issue.message;
        return acc;
      }, {} as Errors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    setIsLoading(true);
    setErrors({});


    // Obtener token de autenticación
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setErrors({ general: "No hay token de autenticación. Inicia sesión nuevamente." });
      setIsLoading(false);
      return;
    }

    // --- Construcción del DTO EXACTO para EmpleadoRegistroDTO ---
    const datosRegistro = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      existe: true,
      urlImagen: "",
      sueldo: 0,
      telefonoList: [
        {
          id: null,
          numero: parseInt(formData.telefono),
        },
      ],
      idRol: ROLES_MAP[formData.cargo],
      //idSucursal: 1,
      userAuth: {
        id: null,
        username: formData.email,
        password: formData.contrasena,
      },
    };


    try {
      console.log("Enviando al backend:", JSON.stringify(datosRegistro, null, 2));
      console.log("Token enviado:", token.substring(0, 20) + "...");

      const response = await axios.post(API_URL, datosRegistro, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Empleado creado:", response.data);

      onEmpleadoCreado();
      onClose();
    } catch (err: any) {
      console.error("Error al registrar empleado:", err);
      console.error("Respuesta del servidor:", err.response?.data);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Hubo un problema al registrar al empleado.";

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative font-lato">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          disabled={isLoading}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-7 text-center">Añadir Empleado</h2>

        {errors.general && (
          <div className="text-red-600 mb-2 text-center">{errors.general}</div>
        )}

        <form onSubmit={handleAgregar}>
          {/* Nombre */}
          <div className="mb-4">
            <label className="block mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded ${errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>

          {/* Apellido */}
          <div className="mb-4">
            <label className="block mb-2">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded ${errors.apellido ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block mb-2">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded ${errors.telefono ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
          </div>

          {/* Cargo */}
          <div className="mb-4">
            <label className="block mb-2">Cargo</label>
            <select
              name="cargo"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value as "CAJERO" | "COCINERO" | "DELIVERY" })}
              disabled={isLoading}
              className={`w-full p-2 border rounded ${errors.cargo ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="CAJERO">Cajero</option>
              <option value="COCINERO">Cocinero</option>
              <option value="DELIVERY">Delivery</option>

            </select>
            {errors.cargo && <p className="text-red-500 text-sm">{errors.cargo}</p>}
          </div>

          {/* Contraseña */}
          <div className="mb-6 relative">
            <label className="block mb-2">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded pr-10 ${errors.contrasena ? "border-red-500" : "border-gray-300"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-2 top-9"
            >
              <img
                src={`/svg/${showPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"}`}
                alt="Visibilidad"
                className="w-6 h-8"
              />
            </button>
            {errors.contrasena && <p className="text-red-500 text-sm">{errors.contrasena}</p>}
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="py-2 px-4 rounded-full w-full border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 rounded-full w-full text-white ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0A76E1] hover:bg-[#0A5BBE]"
                }`}
            >
              {isLoading ? "Agregando..." : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarEmpleados;
