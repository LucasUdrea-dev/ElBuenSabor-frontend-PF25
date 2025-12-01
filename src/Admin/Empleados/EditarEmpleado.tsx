import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { host } from "../../../ts/Clases";

// Esquema de validación con Zod
const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z.string().min(1, "El apellido es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),

  telefono: z.string()
    .regex(/^[0-9]+$/, "Solo números")
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos"),

  email: z.string().email("Formato de email inválido"),
  cargo: z.string().min(1, "El cargo es obligatorio"),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };

interface EditarEmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  empleado: any;
  onEmpleadoActualizado: () => void;
}

const EditarEmpleado = ({ isOpen, onClose, empleado, onEmpleadoActualizado }: EditarEmpleadoModalProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    cargo: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mapeo de roles a IDs según base de datos
  const rolesMap: { [key: string]: number } = {
    CAJERO: 3,
    COCINERO: 4,
    DELIVERY: 5,
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Cargar datos del empleado cuando se abre el modal
  useEffect(() => {
    if (isOpen && empleado) {
      setFormData({
        nombre: empleado.nombre || "",
        apellido: empleado.apellido || "",
        telefono: empleado.telefonoList?.[0]?.numero?.toString() || "",
        email: empleado.email || "",
        cargo: empleado.rol?.tipoRol?.rol || "",
      });
      setErrors({});
    }
  }, [isOpen, empleado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const cargoNuevo = formData.cargo.toUpperCase();
      const idRol = rolesMap[cargoNuevo];

      if (!idRol) {
        throw new Error("Cargo inválido seleccionado");
      }

      // Construir el payload según EmpleadoUpdateDTO
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefonoList: [
          {
            id: empleado.telefonoList?.[0]?.id || null,
            numero: parseInt(formData.telefono)
          }
        ],
        idRol: idRol,
        userAuthentication: empleado.userAuthentication ? {
          id: empleado.userAuthentication.id,
          username: formData.email,
          password: empleado.userAuthentication.password // Mantener la password existente
        } : null
      };

      console.log("Enviando payload:", payload);

      // Realizar la petición PUT al endpoint correcto
      const response = await axios.put(
        `${host}/api/empleados/${empleado.id}`,
        payload,
        { headers: getAuthHeaders() }
      );

      console.log("Empleado actualizado correctamente:", response.data);
      onEmpleadoActualizado();
      onClose();
    } catch (err: any) {
      console.error("Error al actualizar empleado:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Hubo un problema al actualizar al empleado.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-lato text-xl"
          disabled={isLoading}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-7 font-lato text-center">Editar Empleado</h2>

        {errors.general && (
          <div className="text-red-600 font-lato mb-2 text-center">{errors.general}</div>
        )}

        <form onSubmit={handleActualizar}>
          {["nombre", "apellido", "email", "telefono"].map((campo) => (
            <div className="mb-4" key={campo}>
              <label className="block mb-2 font-lato capitalize">{campo}</label>
              <input
                type={campo === "email" ? "email" : "text"}
                name={campo}
                value={(formData as any)[campo]}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full p-2 border rounded font-lato ${
                  errors[campo as keyof typeof errors] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[campo as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1 font-lato">
                  {errors[campo as keyof typeof errors]}
                </p>
              )}
            </div>
          ))}

          <div className="mb-6">
            <label className="block mb-2 font-lato">Cargo</label>
            <select
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.cargo ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar cargo</option>
              <option value="CAJERO">Cajero</option>
              <option value="COCINERO">Cocinero</option>
              <option value="DELIVERY">Delivery</option>
              
            </select>
            {errors.cargo && <p className="text-red-500 text-sm mt-1 font-lato">{errors.cargo}</p>}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="py-2 px-4 rounded-full w-full font-lato border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 rounded-full w-full font-lato transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#0A76E1] hover:bg-[#0A5BBE] text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEmpleado;