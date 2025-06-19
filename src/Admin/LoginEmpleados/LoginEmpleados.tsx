import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import RecuperarContrasena from "../../RecuperarContrasena";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Formato de email inválido"),
  contrasena: z.string().min(1, "La contraseña es obligatoria"),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>> & { general?: string };

const LoginEmpleados = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // Estados para manejar los datos del formulario
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isRecuperarOpen, setIsRecuperarOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", contrasena: "" });
  const navigate = useNavigate();

  // Credenciales hardcodeadas
  const CREDENCIALES_EMPLEADO = {
    email: "agustin@gmail.com",
    contrasena: "1234"
  };

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", contrasena: "" });
      setErrors({});
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      // Validar credenciales hardcodeadas
      if (formData.email === CREDENCIALES_EMPLEADO.email && 
          formData.contrasena === CREDENCIALES_EMPLEADO.contrasena) {
        
        // Simular token de empleado
        localStorage.setItem('employeeToken', 'employee_auth_token_123');
        localStorage.setItem('userRole', 'employee');
        
        onClose(); 
        navigate('/admin/administracion'); // Redirigir a la página de administración
      } else {
        setErrors({ general: "Credenciales incorrectas. Verifique su email y contraseña." });
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setErrors({ general: "Error en el inicio de sesión." });
    }
  };

  // Función para abrir el modal de recuperación de contraseña
  const handleOpenRecuperar = () => {
    setIsRecuperarOpen(true);
  };

  const handleCloseRecuperar = () => {
    setIsRecuperarOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-9 right-8 text-gray-500 hover:text-gray-700 font-lato"
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-7 font-lato text-center">Ingrese a su cuenta</h2>
        
        {errors.general && (
          <div className="text-red-600 font-lato mb-2 text-center">{errors.general}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-lato">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded font-lato focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su email"
            />
            {errors.email && (
              <div className="text-red-600 text-sm mt-1 font-lato">{errors.email}</div>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block mb-2 font-lato">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded font-lato focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-10 transform translate-y-1"
            >
              <img
                src={`public/svg/${showPassword ? "ic_baseline-visibility-off.svg" : "ic_baseline-visibility.svg"}`}
                alt="Visibilidad"
                className="w-6 h-6"
              />
            </button>
            {errors.contrasena && (
              <div className="text-red-600 text-sm mt-1 font-lato">{errors.contrasena}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#0A76E1] text-white py-2 px-4 rounded-full hover:bg-[#0A5BBE] w-full mb-4 font-lato transition-colors duration-200"
          >
            Ingresar
          </button>

          <div className="text-center mb-4 font-lato">
            <button 
              type="button" 
              onClick={handleOpenRecuperar} 
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        {/* Información de prueba para desarrollo 
        <div className="mt-6 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 font-lato text-center">
            <strong>Credenciales de prueba:</strong><br />
            Email: agustin@gmail.com<br />
            Contraseña: 1234
          </p>
        </div>*/}
      </div>

      <RecuperarContrasena isOpen={isRecuperarOpen} onClose={handleCloseRecuperar} />
    </div>
  );
};

export default LoginEmpleados;