import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import EditCorreoUser from './EditCorreoUser';
import EditContrasenaUser from './EditContrasenaUser';

type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  imagenUsuario?: string;
  contrasena: string;
};

// Esquema de validación
const usuarioSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1, "El nombre es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z.string().min(1, "El apellido es obligatorio").regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  email: z.string().email('Correo inválido'),
  telefono: z.string().min(1, "El teléfono es obligatorio").regex(/^[0-9]+$/, "Solo números"),
  imagenUsuario: z.string().optional(),
  contrasena: z .string() .min(6, 'La contraseña debe tener al menos 6 caracteres') .optional(),

});

export default function EditarPerfilUser() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState<Usuario>({

    id: 1,
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    imagenUsuario: '',
    contrasena: '',
  });

  const [errores, setErrores] = useState<Partial<Record<keyof Usuario, string>>>({});
  const navigate = useNavigate();
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [mostrarModalContrasena, setMostrarModalContrasena] = useState(false);


  



  useEffect(() => {
    // Simulamos carga de datos hardcodeados
    const fakeUser: Usuario = {
      id: 1,
      nombre: 'Agustin',
      apellido: 'Del Monte',
      email: 'agustin@mail.com',
      telefono: '1122334455',
      imagenUsuario: '',
      contrasena: '123456',
    };

    setUsuario(fakeUser);
    setFormData(fakeUser);
    setCargando(false);
  }, 
  
  // FUTURO: Reemplazar por llamada real
    /*
    const fetchUsuario = async () => {
      try {
        const response = await axios.get<Usuario>('https://api.tuservidor.com/usuario/1');
        setUsuario(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error al cargar el usuario', error);
      } finally {
        setCargando(false);
      }
    };

    fetchUsuario();
    */
  
  []);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const guardarCambios = async () => {
  try {
    // Validar los datos con Zod
    const datosValidados = usuarioSchema.parse(formData);

    console.log('Usuario válido:', datosValidados);
    setUsuario(formData);
    setErrores({});
    navigate('/catalogo');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const newErrors: Partial<Record<keyof Usuario, string>> = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof Usuario;
        newErrors[field] = err.message;
      });
      setErrores(newErrors);
    } else {
      console.error('Error inesperado al validar:', error);
    }
  }
};

  const cancelar = () => {
    if (usuario) setFormData(usuario);
    navigate('/catalogo');
  };

  const irADirecciones = () => {
    navigate('/misDirecciones');
  };




  return (
    <div className="min-h-screen text-white p-6 bg-[#333333] font-lato">
      <div className="bg-[#444444] rounded-xl max-w-6xl mx-auto overflow-hidden shadow-lg">
        <div className="bg-[#333333]/40 px-6 py-4 border-b border-white/10">
          <h2 className="font-lato text-xl font-semibold">Editar perfil</h2>
        </div>

        <div className="flex flex-col md:flex-row p-6 gap-8">
          <div className="flex flex-col items-center justify-center gap-1 md:w-1/3 mb-30">
            <img
              src="../public/svg/imagenUsuario.svg"
              alt="Imagen de Usuario"
              className="w-82 h-82"
            />
            <div className="flex flex-row gap-4 mt-4">
              <button
                onClick={irADirecciones}
                className="px-5 py-2 rounded-lg bg-[#666666] hover:bg-[#7a7a7a] text-white font-medium shadow transition duration-300"
              >
                Mis direcciones
              </button>
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

                {/* Campo: Teléfono */}
                <div>
                  <label className="block text-sm font-bold mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white"
                  />
                  
                  <p className="text-red-400 text-sm mt-1 min-h-[0.5rem]">{errores.telefono ?? '\u00A0'}</p>
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
                      <img src="../public/svg/LapizEdit.svg" alt="Editar correo" className="w-5 h-5" />
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
                    value={formData.contrasena}
                    readOnly
                    onChange={handleChange}
                    className="w-6/7 px-3 py-2 rounded bg-[#999999]/35 text-white"
                  />
                  <button
                      onClick={() => setMostrarModalContrasena(true)}
                      type="button"
                      className="absolute right-15 top-1/2 transform -translate-y-1/2 p-1 hover:scale-110 transition"
                    >
                      <img src="../public/svg/LapizEdit.svg" alt="Editar correo" className="w-5 h-5" />
                    </button>
                  <p className="text-red-400 text-sm mt-1 min-h-[0.5rem]">{errores.contrasena ?? '\u00A0'}</p>
                </div>
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
        usuarioId={formData.id}
        onContrasenaActualizada={(nuevaContrasena)=> {
          setFormData(prev=> ({ ...prev, contrasena: nuevaContrasena }));


        }}
      />

      <EditCorreoUser
        isOpen={mostrarModalCorreo}
        onClose={() => setMostrarModalCorreo(false)}
        usuarioId={formData.id}
        onCorreoActualizado={(nuevoCorreo) => {
          setFormData(prev => ({ ...prev, email: nuevoCorreo }));
        }}
      />
    </div>
  );
}