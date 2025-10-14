import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Empleado, host } from "../../../ts/Clases";

// Esquema de validación con Zod
const schema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z
    .string()
    .min(1, "El apellido es obligatorio")
    .regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  telefono: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[0-9\s\-\+]*$/, "Formato de teléfono inválido"),
  email: z.string().email("Formato de email inválido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  cargo: z.string().min(1, "El cargo es obligatorio"),
});

// URL ejemplo
// const API_URL = `${host}/api/empleados`;

// Tipo para manejar los errores de validación
type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & {
  general?: string;
};

interface AgregarEmpleadoProps {
  isOpen: boolean;
  onClose: () => void;
  onEmpleadoAgregado: (empleado: Empleado) => void; // Callback para actualizar la lista
}

const AgregarEmpleado = ({
  isOpen,
  onClose,
  onEmpleadoAgregado,
}: AgregarEmpleadoProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    contrasena: "",
    cargo: "",
  });

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        contrasena: "",
        cargo: "",
      });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  // Maneja el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para validar los campos del formulario
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

    // Crear nuevo empleado
    const nuevoEmpleado: Empleado = {
      id: Date.now(), // ID temporal hasta tener backend
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefonoList: [],
      existe: true,
      fechaAlta: new Date().toISOString(),
      sueldo: 0, // Se puede agregar después o tener un valor por defecto
      idSucursal: { id: 1, nombre: "" }, // Sucursal por defecto
      rol: {
        id: null,
        fechaAlta: new Date().toISOString(),
        tipoRol: { id: null, rol: 2 },
      }, // Rol EMPLOYEE
      direccionList: [],
    };

    try {
      // Implementar llamada al backend
      // const response = await axios.post(API_URL, nuevoEmpleado);
      // console.log("Empleado agregado:", response.data);

      // Simulación de delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Empleado agregado:", nuevoEmpleado);
      onEmpleadoAgregado(nuevoEmpleado); // Callback para actualizar la lista
      onClose();
    } catch (err: any) {
      console.error("Error al agregar empleado:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Hubo un problema al agregar el empleado.";

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

        <h2 className="text-2xl font-bold mb-7 font-lato text-center">
          Añadir Empleado
        </h2>

        {errors.general && (
          <div className="text-red-600 font-lato mb-2 text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleAgregar}>
          {/* Campo Nombre */}
          <div className="mb-4">
            <label className="block mb-2 font-lato">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1 font-lato">
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Campo Apellido */}
          <div className="mb-4">
            <label className="block mb-2 font-lato">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.apellido ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.apellido && (
              <p className="text-red-500 text-sm mt-1 font-lato">
                {errors.apellido}
              </p>
            )}
          </div>

          {/* Campo Email */}
          <div className="mb-4">
            <label className="block mb-2 font-lato">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 font-lato">
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo Teléfono */}
          <div className="mb-4">
            <label className="block mb-2 font-lato">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1 font-lato">
                {errors.telefono}
              </p>
            )}
          </div>

          {/* Campo Cargo */}
          <div className="mb-4">
            <label className="block mb-2 font-lato">Cargo</label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded font-lato ${
                errors.cargo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cargo && (
              <p className="text-red-500 text-sm mt-1 font-lato">
                {errors.cargo}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="mb-6 relative">
            <label className="block mb-2 font-lato">Contraseña</label>

            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              disabled={isLoading}
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
                  showPassword
                    ? "ic_baseline-visibility-off.svg"
                    : "ic_baseline-visibility.svg"
                }`}
                alt="Visibilidad"
                className="w-6 h-8"
              />
            </button>
            {errors.contrasena && (
              <p className="text-red-500 text-sm mt-1 font-lato">
                {errors.contrasena}
              </p>
            )}
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
                  Agregando...
                </div>
              ) : (
                "Agregar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarEmpleado;
