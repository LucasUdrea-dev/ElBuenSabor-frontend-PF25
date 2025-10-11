import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import axios from 'axios';
import EditCorreoUser from '../../Editar Usuario/EditCorreoUser';
import EditContrasenaUser from '../../Editar Usuario/EditContrasenaUser';
import { Usuario } from '../../../ts/Clases';
import { useEmpleado } from '../LoginEmpleados/EmpleadoContext';

// Esquema de validación
const empleadoSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1, "El nombre es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z.string().min(1, "El apellido es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  email: z.string().email('Correo inválido'),
  telefono: z.string().min(1, "El teléfono es obligatorio").regex(/^[0-9]+$/, "Solo números"),
  imagenUsuario: z.string().optional(),
});

export default function PerfilEmpleado() {
  const [empleado, setEmpleado] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState<Usuario>(new Usuario());
  const [errores, setErrores] = useState<Partial<Record<keyof Usuario, string>>>({});
  const navigate = useNavigate();
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [mostrarModalContrasena, setMostrarModalContrasena] = useState(false);
  const { empleadoSesion } = useEmpleado();

  const getToken = () => localStorage.getItem('token');
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  };

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        if (!empleadoSesion) {
          console.error('No hay empleado en la sesión');
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/usuarios/${empleadoSesion.id_user}`, // Ajusta según backend
          axiosConfig
        );

        const data = response.data;
        const emp = new Usuario();
        emp.id = data.id;
        emp.nombre = data.nombre;
        emp.apellido = data.apellido;
        emp.email = data.email;
        emp.telefonoList = data.telefonoList || [];
        emp.imagenUsuario = data.imagenUsuario || '';
        emp.existe = data.existe;

        setEmpleado(emp);
        setFormData(emp);
      } catch (error) {
        console.error('Error al cargar empleado:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setCargando(false);
      }
    };

    fetchEmpleado();
  }, [empleadoSesion, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      setFormData(prev => {
        const newFormData = new Usuario();
        Object.assign(newFormData, prev);

        if (newFormData.telefonoList && newFormData.telefonoList.length > 0) {
          newFormData.telefonoList = [{ id: newFormData.telefonoList[0].id, numero: parseInt(value) || 0 }];
        } else {
          newFormData.telefonoList = [{ id: null, numero: parseInt(value) || 0 }];
        }

        return newFormData;
      });
    } else {
      setFormData(prev => {
        const newFormData = new Usuario();
        Object.assign(newFormData, prev);
        (newFormData as any)[name] = value;
        return newFormData;
      });
    }

    if (errores[name as keyof Usuario]) {
      setErrores(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const guardarCambios = async () => {
    try {
      const empleadoPlano = {
        id: formData.id,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefonoList: formData.telefonoList,
        imagenUsuario: formData.imagenUsuario,
        existe: formData.existe,
      };

      empleadoSchema.parse({
        ...empleadoPlano,
        telefono: formData.telefonoList && formData.telefonoList.length > 0
          ? formData.telefonoList[0].numero.toString()
          : ''
      });

      setErrores({});

      await axios.put(
        `http://localhost:8080/api/usuarios/${formData.id}`,
        empleadoPlano,
        axiosConfig
      );

      setEmpleado(formData);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof Usuario, string>> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field as keyof Usuario] = err.message;
        });
        setErrores(newErrors);
      } else if (axios.isAxiosError(error)) {
        console.error('Error al actualizar empleado:', error.response?.data);
        alert('Error al actualizar el perfil.');
        if (error.response?.status === 401) navigate('/login');
      } else {
        console.error('Error inesperado:', error);
        alert('Error inesperado.');
      }
    }
  };

  const cancelar = () => {
    if (empleado) setFormData(empleado);
    navigate('/dashboard'); // Ajusta la ruta del panel de empleado
  };

  return (
    <div className="min-h-screen text-white p-6 bg-[#333333] font-lato">
      <div className="bg-[#444444] rounded-xl max-w-6xl mx-auto overflow-hidden shadow-lg">
        <div className="bg-[#333333]/40 px-6 py-4 border-b border-white/10">
          <h2 className="font-lato text-xl font-semibold">Perfil del Empleado</h2>
        </div>

        <div className="flex flex-col md:flex-row p-6 gap-8">
          <div className="flex flex-col items-center justify-center gap-1 md:w-1/3 mb-30">
            <img
              src="../../public/svg/imagenUsuario.svg"
              alt="Imagen del Empleado"
              className="w-82 h-82"
            />
            <div className="flex flex-row gap-4 mt-4">
              <button
                onClick={() => console.log("Cambiar imagen")}
                className="px-5 py-2 rounded-lg bg-[#888888] hover:bg-[#9c9c9c] text-white font-medium shadow transition duration-300"
              >
                Cambiar imagen
              </button>
            </div>
          </div>

          <div className="flex-1">
            {cargando ? (
              <p>Cargando...</p>
            ) : (
              <div className="flex flex-col space-y-4 mt-8">
                <div>
                  <label className="block text-sm font-bold mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white"
                  />
                  <p className="text-red-400 text-sm mt-1 min-h-[0.5rem]">{errores.nombre ?? '\u00A0'}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white"
                  />
                  <p className="text-red-400 text-sm mt-1 min-h-[0.5rem]">{errores.apellido ?? '\u00A0'}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefonoList && formData.telefonoList.length > 0 ? formData.telefonoList[0].numero : ''}
                    onChange={handleChange}
                    className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white"
                  />
                  <p className="text-red-400 text-sm mt-1 min-h-[0.5rem]">{errores.telefonoList ?? '\u00A0'}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Email</label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white pr-10"
                    />
                    <button
                      onClick={() => setMostrarModalCorreo(true)}
                      type="button"
                      className="absolute right-15 top-1/2 transform -translate-y-1/2 p-1 hover:scale-110 transition"
                    >
                      <img src="../../public/svg/LapizEdit.svg" alt="Editar correo" className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-red-400 text-sm mt-1 min-h-[0.5rem]">{errores.email ?? '\u00A0'}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Contraseña</label>
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      name="contrasena"
                      value="********"
                      readOnly
                      className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white"
                    />
                    <button
                      onClick={() => setMostrarModalContrasena(true)}
                      type="button"
                      className="absolute right-15 top-1/2 transform -translate-y-1/2 p-1 hover:scale-110 transition"
                    >
                      <img src="../../public/svg/LapizEdit.svg" alt="Editar contraseña" className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-red-400 text-sm mt-1 min-h-[0.5rem]">{'\u00A0'}</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={cancelar}
                    className="bg-[#999999]/35 hover:bg-[#999999]/20 px-4 py-2 rounded text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarCambios}
                    className="bg-[#D93F21] hover:bg-[#D93F21]/80 px-4 py-2 rounded text-white"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditContrasenaUser
        isOpen={mostrarModalContrasena}
        onClose={() => setMostrarModalContrasena(false)}
        usuarioId={formData.id!}
        onContrasenaActualizada={() => setMostrarModalContrasena(false)}
      />

      <EditCorreoUser
        isOpen={mostrarModalCorreo}
        onClose={() => setMostrarModalCorreo(false)}
        usuarioId={formData.id!}
        onCorreoActualizado={(nuevoCorreo) => {
          setFormData(prev => {
            const newFormData = new Usuario();
            Object.assign(newFormData, prev);
            newFormData.email = nuevoCorreo;
            return newFormData;
          });
        }}
      />
    </div>
  );
}
