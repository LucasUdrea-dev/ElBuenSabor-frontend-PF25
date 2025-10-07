import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Empleado, Telefono } from "../../../ts/Clases";

// Esquema de validación con Zod
const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z.string().min(1, "El apellido es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  telefono: z.string().min(1, "El teléfono es obligatorio").regex(/^[0-9\s\-\+]*$/, "Formato de teléfono inválido"),
  email: z.string().email("Formato de email inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  cargo: z.string().min(1, "El cargo es obligatorio"),
});

// Tipo para errores de validación
type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };

interface EditarEmpleadoProps {
  isOpen: boolean;
  empleado: Empleado | null;
  onClose: () => void;
  onEmpleadoActualizado: (empleado: Empleado) => void;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ isOpen, empleado, onClose, onEmpleadoActualizado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    contrasena: "",
    rol: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del empleado al abrir el modal
  useEffect(() => {
    if (isOpen && empleado) {
      setFormData({
        nombre: empleado.nombre || "",
        apellido: empleado.apellido || "",
        telefono: empleado.telefonoList?.[0]?.numero?.toString() || "",
        email: empleado.email || "",
        contrasena: "",
        rol:"",
      });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen, empleado]);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        contrasena: "",
        rol: "",
      });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  // Manejador de cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validar campos
  const validarCampos = (): boolean => {
    const dataToValidate = formData.contrasena
      ? formData
      : { ...formData, contrasena: "password123" }; // Contraseña temporal

    const result = schema.safeParse(dataToValidate);

    const newErrors = result.success
      ? {}
      : result.error.issues.reduce((acc, issue) => {
          if (issue.path[0] === "contrasena" && !formData.contrasena) {
            return acc;
          }
          acc[issue.path[0] as keyof typeof acc] = issue.message;
          return acc;
        }, {} as Errors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar actualización
  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empleado || !validarCampos()) return;

    setIsLoading(true);
    setErrors({});

    // Construir objeto actualizado
    const empleadoActualizado: Empleado = {
      ...empleado,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      rol: { id: null, fechaAlta: new Date().toISOString(), tipoRol: { id: null, rol: 2 } }, // Rol EMPLOYEE
      telefonoList: [
        new Telefono(), // Genera uno nuevo
      ],
    };

    // Actualizar número de teléfono
    empleadoActualizado.telefonoList[0].numero = Number(formData.telefono);

    // Solo actualizar contraseña si se ingresó
    if (formData.contrasena) {
      (empleadoActualizado as any).contrasena = formData.contrasena;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de delay
      console.log("Empleado actualizado:", empleadoActualizado);

      onEmpleadoActualizado(empleadoActualizado);
      onClose();
    } catch (err: any) {
      console.error("Error al actualizar empleado:", err);
      setErrors({
        general:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Hubo un problema al actualizar el empleado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !empleado) return null;

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

        {errors.general && <div className="text-red-600 mb-2 text-center">{errors.general}</div>}

        <form onSubmit={handleActualizar}>
          {["nombre", "apellido", "email", "telefono", "cargo"].map((campo) => (
            <div key={campo} className="mb-4">
              <label className="block mb-2 font-lato capitalize">{campo}</label>
              <input
                type={campo === "email" ? "email" : campo === "telefono" ? "tel" : "text"}
                name={campo}
                value={(formData as any)[campo]}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full p-2 border rounded font-lato ${
                  (errors as any)[campo] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {(errors as any)[campo] && (
                <p className="text-red-500 text-sm mt-1 font-lato">{(errors as any)[campo]}</p>
              )}
            </div>
          ))}

          {/* Campo Contraseña */}
          <div className="mb-6 relative">
            <label className="block mb-2 font-lato">Nueva Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Dejar vacío para mantener la actual"
              className={`w-full p-2 border rounded font-lato pr-10 ${
                errors.contrasena ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-2 top-9 transform"
            >
              <img
                src={`/svg/${
                  showPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"
                }`}
                alt="Visibilidad"
                className="w-6 h-8"
              />
            </button>
            {errors.contrasena && <p className="text-red-500 text-sm mt-1 font-lato">{errors.contrasena}</p>}
          </div>

          {/* Botones */}
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
                  Actualizando...
                </div>
              ) : (
                "Actualizar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEmpleado;
