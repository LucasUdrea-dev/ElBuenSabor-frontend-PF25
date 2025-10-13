import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import axios from 'axios';
import EditCorreoUser from '../../Editar Usuario/EditCorreoUser';
import EditContrasenaUser from '../../Editar Usuario/EditContrasenaUser';
import { Usuario, Telefono } from '../../../ts/Clases';
import { useEmpleado } from '../LoginEmpleados/EmpleadoContext';


// Esquema de validación
const empleadoSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1, "El nombre es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z.string().min(1, "El apellido es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  email: z.string().email('Correo inválido'),
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

  // Estados para manejo de teléfonos
    const [telefonos, setTelefonos] = useState<Telefono[]>([]);
    const [editandoTelefonoId, setEditandoTelefonoId] = useState<number | null>(null);
    const [telefonoEditado, setTelefonoEditado] = useState<string>('');
    const [errorTelefono, setErrorTelefono] = useState<string>('');
  


      // Obtener token del localStorage
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
          `http://localhost:8080/api/usuarios/${empleadoSesion.id_user}`,
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
        setTelefonos(data.telefonoList || []); // ✅ AGREGA ESTA LÍNEA

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
    
    setFormData((prev) => {
      const newFormData = new Usuario();
      Object.assign(newFormData, prev);
      (newFormData as any)[name] = value;
      return newFormData;
    });

    // Limpia el error del campo cuando el usuario empieza a escribir
    if (errores[name as keyof Usuario]) {
      setErrores(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };


  const iniciarEdicionTelefono = (telefono: Telefono) => {
    setEditandoTelefonoId(telefono.id);
    setTelefonoEditado(telefono.numero.toString());
    setErrorTelefono('');
  };

  const cancelarEdicionTelefono = () => {
    setEditandoTelefonoId(null);
    setTelefonoEditado('');
    setErrorTelefono('');
  };



  const guardarTelefono = async (telefono: Telefono) => {
    try {
      // Validación
      if (!telefonoEditado.trim()) {
        setErrorTelefono('El teléfono es obligatorio');
        return;
      }
      if (!/^[0-9]+$/.test(telefonoEditado)) {
        setErrorTelefono('Solo se permiten números');
        return;
      }

      const telefonoDTO = {
        id: telefono.id,
        numero: parseInt(telefonoEditado)
      };

      // Actualizar en el backend
      await axios.put(
        `http://localhost:8080/api/telefonos/usuario/${empleadoSesion?.id_user}/${telefono.id}`,
        telefonoDTO,
        axiosConfig
      );

      // Actualizar estado local
      setTelefonos(prev => prev.map(t => 
        t.id === telefono.id ? { ...t, numero: parseInt(telefonoEditado) } : t
      ));

      setEditandoTelefonoId(null);
      setTelefonoEditado('');
      setErrorTelefono('');
      
      alert('Teléfono actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar teléfono:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        setErrorTelefono('Error al actualizar el teléfono');
      }
    }
  };

  const eliminarTelefono = async (telefono: Telefono) => {
    if (!confirm('¿Estás seguro de eliminar este teléfono?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/telefonos/usuario/${empleadoSesion?.id_user}/${telefono.id}`,
        axiosConfig
      );

      // Actualizar estado local
      setTelefonos(prev => prev.filter(t => t.id !== telefono.id));
      
      alert('Teléfono eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar teléfono:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Error al eliminar el teléfono');
      }
    }
  };

  const agregarTelefono = async () => {
    const nuevoNumero = prompt('Ingrese el nuevo número de teléfono:');
    
    if (!nuevoNumero) return;
    
    if (!/^[0-9]+$/.test(nuevoNumero)) {
      alert('Solo se permiten números');
      return;
    }

    try {
      const telefonoDTO = {
        numero: parseInt(nuevoNumero)
      };

      const response = await axios.post(
        `http://localhost:8080/api/telefonos/usuario/${empleadoSesion?.id_user}`,
        telefonoDTO,
        axiosConfig
      );

      // Agregar al estado local
      setTelefonos(prev => [...prev, response.data]);
      
      alert('Teléfono agregado correctamente');
    } catch (error) {
      console.error('Error al agregar teléfono:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Error al agregar el teléfono');
      }
    }
  };




  const guardarCambios = async () => {
    try {
      const empleadoPlano = {
        id: formData.id,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        imagenUsuario: formData.imagenUsuario,
        existe: formData.existe,
      };

      // Validar los datos con Zod
      empleadoSchema.parse(empleadoPlano);

      setErrores({});


      // Enviar PUT al backend
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
    navigate('/admin'); }

  return (
    <div className="min-h-screen text-white p-6 bg-[#333333] font-lato">
      <div className="bg-[#444444] rounded-xl max-w-6xl mx-auto overflow-hidden shadow-lg">
        <div className="bg-[#333333]/40 px-6 py-4 border-b border-white/10">
          <h2 className="font-lato text-xl font-semibold">Editar perfil</h2>
        </div>

        <div className="flex flex-col md:flex-row p-6 gap-8">
          <div className="flex flex-col items-center justify-center gap-1 md:w-1/3 mb-30">
            <img
              src="../../public/svg/imagenUsuario.svg"
              alt="Imagen de Usuario"
              className="w-82 h-82"
            />
            <div className="flex flex-row gap-4 mt-4">
              <button
                onClick={() => {
                  console.log("Abrir selector de imagen o lógica de actualización");
                }}
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
                {/* Campo: Nombre */}
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

                {/* Campo: Apellido */}
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

                {/* Lista de Teléfonos */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <label className="text-sm font-bold">Teléfonos</label>
                    <button
                      onClick={agregarTelefono}
                      className="text-sm px-3 py-1 rounded bg-[#D93F21] hover:bg-[#D93F21]/80 text-white"
                    >
                      + Agregar teléfono
                    </button>
                  </div>

                  
                  {telefonos.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay teléfonos registrados</p>
                  ) : (
                    <div className="space-y-2">
                      {telefonos.map((telefono) => (
                        <div key={telefono.id} className="flex items-center gap-2">
                          {editandoTelefonoId === telefono.id ? (
                            <>
                              <input
                                type="text"
                                value={telefonoEditado}
                                onChange={(e) => setTelefonoEditado(e.target.value)}
                                className="flex-1 px-3 py-2 rounded bg-[#999999]/35 text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => guardarTelefono(telefono)}
                                className="p-2 hover:bg-green-600/20 rounded transition"
                                title="Guardar"
                              >
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={cancelarEdicionTelefono}
                                className="p-2 hover:bg-red-600/20 rounded transition"
                                title="Cancelar"
                              >
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={telefono.numero}
                                readOnly
                                className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white"
                              />

                              <div className="flex gap-0">
                              <button
                                onClick={() => iniciarEdicionTelefono(telefono)}
                                className="p-2 hover:scale-110 transition"
                                title="Editar"
                              >
                                <img src="../../public/svg/LapizEdit.svg" alt="Editar" className="w-5 h-5" />
                              </button>


                              <button
                                onClick={() => eliminarTelefono(telefono)}
                                className="p-2 hover:bg-red-600/20 rounded transition"
                                title="Eliminar"
                              >
                                <img src="../../public/svg/LogoBorrar.svg" alt="Borrar" className="w-7 h-7"  />
                              </button>
                              </div>
                            </>
                            
                          )}
                        </div>
                      ))}
                      {errorTelefono && (
                        <p className="text-red-400 text-sm mt-1">{errorTelefono}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Campo: Email */}
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

                {/* Campo: Contraseña */}
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
        onContrasenaActualizada={() => {
          setMostrarModalContrasena(false);
        }}
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

