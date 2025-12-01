import { useEffect, useState, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import axios from 'axios';
import EditCorreoUser from './EditCorreoUser';
import EditContrasenaUser from './EditContrasenaUser';
import AgregarTelefonoModal from './AgregarTelefonoModal';
import { Usuario, Telefono,host } from '../../ts/Clases';
import { useUser } from '../UserAuth/UserContext';
import { useCloudinary } from '../useCloudinary'; 



// Esquema de validación
const usuarioSchema = z.object({
  id: z.number(),
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  apellido: z
    .string()
    .min(1, "El apellido es obligatorio")
    .regex(/^[a-zA-Z\s]*$/, "Solo letras y espacios"),
  email: z.string().email("Correo inválido"),
  imagenUsuario: z.string().optional(),
});

export default function EditarPerfilUser() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState<Usuario>(new Usuario());
  const [errores, setErrores] = useState<
    Partial<Record<keyof Usuario, string>>
  >({});
  const navigate = useNavigate();
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [mostrarModalContrasena, setMostrarModalContrasena] = useState(false);
  const [mostrarModalAgregarTelefono, setMostrarModalAgregarTelefono] = useState(false);
  const { userSession } = useUser();

  // Usamos el hook de Cloudinary
  const {
    image,
    loading: subiendoImagen,
    uploadImage,
    setImage,
  } = useCloudinary();

  // Ref para el input file para abrir el selector de archivos sin que el usuario vea el input por fedecto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para manejo de teléfonos
  const [telefonos, setTelefonos] = useState<Telefono[]>([]);
  const [editandoTelefonoId, setEditandoTelefonoId] = useState<number | null>(
    null
  );
  const [telefonoEditado, setTelefonoEditado] = useState<string>("");
  const [errorTelefono, setErrorTelefono] = useState<string>("");

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  // Configurar axios con el token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        if (!userSession?.id_user) {
          console.error("No hay ID de usuario en la sesión");
          navigate("/login");
          return;
        }

        // Obtener datos del usuario desde el backend usando el id de la sesión (userSession.id_user)
        const response = await axios.get(
          host +`/api/usuarios/${userSession.id_user}`,
          axiosConfig
        );

        const userData = response.data;

        const user = new Usuario();
        user.id = userData.id;
        user.nombre = userData.nombre;
        user.apellido = userData.apellido;
        user.email = userData.email;
        user.telefonoList = userData.telefonoList || [];
        user.imagenUsuario = userData.imagenUsuario || "";
        user.existe = userData.existe;

        setUsuario(user);
        setFormData(user);
        setTelefonos(userData.telefonoList || []);

        // Seteamos la imagen existente en el hook de Cloudinary
        if (userData.imagenUsuario) {
          setImage(userData.imagenUsuario);
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setCargando(false);
      }
    };

    fetchUsuario();
  }, [userSession, navigate]);

  // Manejar la subida de imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImage(e);

    if (imageUrl) {
      // Actualizar el formData con la nueva URL
      setFormData((prev) => {
        const newFormData = new Usuario();
        Object.assign(newFormData, prev);
        newFormData.imagenUsuario = imageUrl;
        return newFormData;
      });

      // Actualizar en el backend inmediatamente
      try {
        const usuarioPlano = {
          id: formData.id,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          imagenUsuario: imageUrl,
          existe: formData.existe,
        };

        await axios.put(
          host + `/api/usuarios/${formData.id}`,
          usuarioPlano,
          axiosConfig
        );

        alert("Imagen actualizada correctamente");
      } catch (error) {
        console.error("Error al actualizar imagen en backend:", error);
        alert("Error al actualizar la imagen");
      }
    }
  };

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
      setErrores((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const iniciarEdicionTelefono = (telefono: Telefono) => {
    setEditandoTelefonoId(telefono.id);
    setTelefonoEditado(telefono.numero.toString());
    setErrorTelefono("");
  };

  const cancelarEdicionTelefono = () => {
    setEditandoTelefonoId(null);
    setTelefonoEditado("");
    setErrorTelefono("");
  };

  const guardarTelefono = async (telefono: Telefono) => {
    try {
      // Validación
      if (!telefonoEditado.trim()) {
        setErrorTelefono("El teléfono es obligatorio");
        return;
      }
      if (!/^[0-9]+$/.test(telefonoEditado)) {
        setErrorTelefono("Solo se permiten números");
        return;
      }

      if (telefonoEditado.length !== 10) {
        setErrorTelefono("El teléfono debe tener 10 dígitos");
        return;
      }

      const telefonoDTO = {
        id: telefono.id,
        numero: parseInt(telefonoEditado),
      };

      // Actualizar en el backend
      await axios.put(
        `${host}/api/telefonos/usuario/${userSession?.id_user}/${telefono.id}`,
        telefonoDTO,
        axiosConfig
      );

      // Actualizar estado local
      setTelefonos((prev) =>
        prev.map((t) =>
          t.id === telefono.id ? { ...t, numero: parseInt(telefonoEditado) } : t
        )
      );

      setEditandoTelefonoId(null);
      setTelefonoEditado("");
      setErrorTelefono("");

      alert("Teléfono actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar teléfono:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      } else {
        setErrorTelefono("Error al actualizar el teléfono");
      }
    }
  };

  const eliminarTelefono = async (telefono: Telefono) => {
    if (!confirm("¿Estás seguro de eliminar este teléfono?")) {
      return;
    }

    try {
      await axios.delete(
        `${host}/api/telefonos/usuario/${userSession?.id_user}/${telefono.id}`,
        axiosConfig
      );

      // Actualizar estado local
      setTelefonos((prev) => prev.filter((t) => t.id !== telefono.id));

      alert("Teléfono eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar teléfono:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Error al eliminar el teléfono");
      }
    }
  };

  const agregarTelefono = async (nuevoNumero: string) => {
    try {
      const telefonoDTO = {
        numero: parseInt(nuevoNumero),
      };

      const response = await axios.post(
        `${host}/api/telefonos/usuario/${userSession?.id_user}`,
        telefonoDTO,
        axiosConfig
      );

      // Agregar al estado local
      setTelefonos((prev) => [...prev, response.data]);

      alert("Teléfono agregado correctamente");
    } catch (error) {
      console.error("Error al agregar teléfono:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Error al agregar el teléfono");
      }
    }
  };

  const guardarCambios = async () => {
    try {
      const usuarioPlano = {
        id: formData.id,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        imagenUsuario: formData.imagenUsuario,
        existe: formData.existe,
      };

      // Validar los datos con Zod
      usuarioSchema.parse(usuarioPlano);

      setErrores({});

      // Enviar PUT al backend
      const response = await axios.put(
        `${host}/api/usuarios/${formData.id}`,
        usuarioPlano,
        axiosConfig
      );

      console.log("Usuario actualizado:", response.data);
      setUsuario(formData);

      alert("Perfil actualizado correctamente");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof Usuario, string>> = {};

        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field as keyof Usuario] = err.message;
        });

        setErrores(newErrors);
      } else if (axios.isAxiosError(error)) {
        console.error("Error al actualizar usuario:", error.response?.data);
        alert("Error al actualizar el perfil. Por favor, intenta de nuevo.");

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } else {
        console.error("Error inesperado al validar:", error);
        alert("Error inesperado. Por favor, intenta de nuevo.");
      }
    }
  };

  const cancelar = () => {
    if (usuario) setFormData(usuario);
    navigate("/catalogo");
  };

  const irADirecciones = () => {
    navigate("/misDirecciones");
  };

  return (
    <div className="min-h-screen text-white p-6 bg-[#333333] font-lato">
      <div className="bg-[#444444] rounded-xl max-w-5xl mx-auto overflow-hidden shadow-xl">
        <div className="bg-[#333333]/40 px-6 py-4 border-b border-white/10">
          <h2 className="font-lato text-2xl font-semibold">Editar perfil</h2>
        </div>

        <div className="flex flex-col md:flex-row p-6 gap-8">
          <div className="flex flex-col items-center justify-start gap-4 md:w-1/3">
            {/* Input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Imagen de perfil */}
            <div className="relative">
              {subiendoImagen ? (
                <div className="w-48 h-48 flex items-center justify-center bg-[#555555] rounded-full shadow-lg">
                  <p className="text-white text-sm">Subiendo...</p>
                </div>
              ) : (
                <img
                  //image de Cloudinary o default
                  src={image || "../public/svg/imagenUsuario.svg"}
                  alt="Imagen de Usuario"
                  className="w-48 h-48 rounded-full object-cover shadow-lg ring-4 ring-white/10"
                />
              )}
            </div>

            <div className="flex flex-col w-full gap-3">
              <button
                onClick={irADirecciones}
                className="w-full px-5 py-2.5 rounded-lg bg-[#666666] hover:bg-[#7a7a7a] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Mis direcciones
              </button>
              <button
                onClick={() => fileInputRef.current?.click()} // Activa el input file
                disabled={subiendoImagen} // Deshabilitado mientras sube
                className="w-full px-5 py-2.5 rounded-lg bg-[#888888] hover:bg-[#9c9c9c] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subiendoImagen ? "Subiendo..." : "Cambiar imagen"}
              </button>
            </div>
          </div>

          <div className="flex-1">
            {cargando ? (
              <p>Cargando...</p>
            ) : (
              <div className="flex flex-col space-y-5">
                {/* Campo: Nombre */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
                  />
                  <p className="text-red-400 text-sm mt-1 min-h-[1.25rem]">
                    {errores.nombre ?? "\u00A0"}
                  </p>
                </div>

                {/* Campo: Apellido */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
                  />
                  <p className="text-red-400 text-sm mt-1 min-h-[1.25rem]">
                    {errores.apellido ?? "\u00A0"}
                  </p>
                </div>

                {/* Lista de Teléfonos */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <label className="text-sm font-semibold">Teléfonos</label>
                    <button
                      type="button"
                      onClick={() => setMostrarModalAgregarTelefono(true)}
                      className="text-sm px-4 py-1.5 rounded-lg bg-[#D93F21] hover:bg-[#C13519] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      + Agregar teléfono
                    </button>
                  </div>

                  {telefonos.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No hay teléfonos registrados
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {telefonos.map((telefono) => (
                        <div
                          key={telefono.id}
                          className="flex items-center gap-2"
                        >
                          {editandoTelefonoId === telefono.id ? (
                            <>
                              <input
                                type="text"
                                value={telefonoEditado}
                                onChange={(e) => setTelefonoEditado(e.target.value)}
                                maxLength={10}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all"
                                autoFocus
                              />
                              <button
                                onClick={() => guardarTelefono(telefono)}
                                className="p-2 hover:bg-green-600/20 rounded-lg transition"
                                title="Guardar"
                              >
                                <svg
                                  className="w-5 h-5 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={cancelarEdicionTelefono}
                                className="p-2 hover:bg-red-600/20 rounded-lg transition"
                                title="Cancelar"
                              >
                                <svg
                                  className="w-5 h-5 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={telefono.numero}
                                readOnly
                                className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white"
                              />

                              <div className="flex gap-1">
                                <button
                                  onClick={() =>
                                    iniciarEdicionTelefono(telefono)
                                  }
                                  className="p-2 hover:scale-110 hover:bg-white/10 rounded-lg transition"
                                  title="Editar"
                                >
                                  <img
                                    src="../public/svg/LapizEdit.svg"
                                    alt="Editar"
                                    className="w-5 h-5"
                                  />
                                </button>

                                <button
                                  onClick={() => eliminarTelefono(telefono)}
                                  className="p-2 hover:bg-red-600/20 rounded-lg transition"
                                  title="Eliminar"
                                >
                                  <img
                                    src="../../public/svg/LogoBorrar.svg"
                                    alt="Borrar"
                                    className="w-6 h-6"
                                  />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {errorTelefono && (
                        <p className="text-red-400 text-sm mt-1">
                          {errorTelefono}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Campo: Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white pr-12"
                    />
                    <button
                      onClick={() => setMostrarModalCorreo(true)}
                      type="button"
                      className="absolute right-3 p-1.5 hover:scale-110 hover:bg-white/10 rounded-lg transition"
                    >
                      <img
                        src="../public/svg/LapizEdit.svg"
                        alt="Editar correo"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <p className="text-red-400 text-sm mt-1 min-h-[1.25rem]">
                    {errores.email ?? "\u00A0"}
                  </p>
                </div>

                {/* Campo: Contraseña */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      name="contrasena"
                      value="********"
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg bg-[#999999]/35 text-white pr-12"
                    />
                    <button
                      onClick={() => setMostrarModalContrasena(true)}
                      type="button"
                      className="absolute right-3 p-1.5 hover:scale-110 hover:bg-white/10 rounded-lg transition"
                    >
                      <img
                        src="../public/svg/LapizEdit.svg"
                        alt="Editar contraseña"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <p className="text-red-400 text-sm mt-1 min-h-[1.25rem]">
                    {"\u00A0"}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={cancelar}
                    className="bg-[#999999]/35 hover:bg-[#999999]/50 px-6 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarCambios}
                    className="bg-[#D93F21] hover:bg-[#C13519] px-6 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
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
          setFormData((prev) => {
            const newFormData = new Usuario();
            Object.assign(newFormData, prev);
            newFormData.email = nuevoCorreo;
            return newFormData;
          });
        }}
      />

      <AgregarTelefonoModal
        isOpen={mostrarModalAgregarTelefono}
        onClose={() => setMostrarModalAgregarTelefono(false)}
        onAgregar={(numero) => {
          agregarTelefono(numero);
          setMostrarModalAgregarTelefono(false);
        }}
      />
    </div>
  );
}
