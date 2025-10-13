import { useEffect, useState } from 'react';
import axios from 'axios';
import AgregarDireccion from './AgregarDireccion';
import EliminarDireccion from './EliminarDireccion';
import EditDireccion from './EditDireccion';
import { Direccion, host } from '../../ts/Clases'; 
import { useUser } from "../UserAuth/UserContext";




export default function DireccionesUser() {
  
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isAgregarDireccionOpen, setAgregarDireccionOpen] = useState(false);
  const [isEliminarDireccionOpen, setEliminarDireccionOpen] = useState(false);
  const [direccionAEliminar, setDireccionAEliminar] = useState<number | null | undefined>(null);
  const [direccionAEditar, setDireccionAEditar] = useState<Direccion | null>(null);
  const [isEditarDireccionOpen, setEditarDireccionOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { userSession } = useUser();
      

  //Si el usuario no está logueado userSession es null
  const apiUrl = userSession
    ? `${host}/api/Direccion/usuario/${userSession.id_user}` : null;




  useEffect(() => {
    if (!apiUrl) return;

    const fetchDirecciones = async () => {
      setCargando(true); 
      try {

        //Llama al backend
        const token = localStorage.getItem("token");
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        //Guarda la lista de direcciones
        setDirecciones(response.data);
      } catch (error) {
        console.error("Error al cargar las direcciones:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchDirecciones();
  }, [apiUrl, refreshKey]); 





  // Función para eliminar una dirección
  const eliminarDireccion = async () => {
    if (direccionAEliminar === null || !userSession) return;

    try {
      const token = localStorage.getItem("token");
      
      // Usar el endpoint correcto según el controller
      await axios.delete(
        `${host}/api/Direccion/usuario/${userSession.id_user}/${direccionAEliminar}`, 
        { 
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualiza el estado local
      setDirecciones((prev) => prev.filter((d) => d.id !== direccionAEliminar));
      
      console.log("✅ Dirección eliminada exitosamente");
    } catch (error: any) {
      console.error("Error al eliminar la dirección:", error);
      console.error("📥 Respuesta del servidor:", error.response?.data);
      
      // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
      alert(error.response?.data?.error || "Error al eliminar la dirección");
    } finally {
      setEliminarDireccionOpen(false);
      setDireccionAEliminar(null);
    }
  };




  // Modales de agregar dirección (Apertura y cierre)
  const abrirAgregarDireccion = () => {
    setAgregarDireccionOpen(true);
  };
  
  const cerrarAgregarDireccion = () => {
    setAgregarDireccionOpen(false);
    setRefreshKey(prev => prev + 1); 
  };




  return (
    <div className="min-h-screen text-white p-4 bg-[#333333] font-lato">
      <div className="bg-[#444444] rounded-xl max-w-4xl mx-auto overflow-hidden">
        <div className="bg-[#333333]/40 px-4 py-3">
          <h2 className="font-lato text-lg">Mis direcciones</h2>
        </div>

        <div className="p-4">
          {cargando ? (
            <p>Cargando...</p>
          ) : direcciones.length === 0 ? (
            <div className="text-center p-6 rounded-xl bg-[#444444]">
              <p className="mb-4">Aún no has agregado ninguna dirección</p>
              <button onClick={abrirAgregarDireccion} className="bg-[#D93F21] hover:bg-[#b9331a] px-4 py-2 rounded">
                Agregar dirección
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {direcciones.map((dir) => (
                <div
                  key={dir.id}
                  className="flex max-md:gap-5 items-center justify-between bg-[#FAF8F5] text-[#262626] px-4 py-3 rounded-xl"
                >
                  <div>
                    <p className="font-bold">{dir.alias}</p>
                    <p className="text-sm">
                      {dir.nombreCalle} {dir.numeracion}, {dir.ciudad?.nombre}, {dir.ciudad?.provincia?.nombre}, {dir.ciudad?.provincia?.pais?.nombre}
                    </p>
                  </div>
                  <div className="flex max-md:flex-col-reverse gap-2">
                    <button
                      onClick={() => {
                        setDireccionAEditar(dir);
                        setEditarDireccionOpen(true);
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded flex items-center gap-1"
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={() => {
                        setDireccionAEliminar(dir.id);
                        setEliminarDireccionOpen(true);
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded flex items-center gap-1"
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-right mt-4">
                <button
                  onClick={abrirAgregarDireccion}
                  className="bg-[#D93F21] hover:bg-[#b9331a] px-4 py-2 rounded text-white"
                >
                  Agregar dirección
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AgregarDireccion 
        isOpen={isAgregarDireccionOpen} 
        onClose={cerrarAgregarDireccion} 
      />

      <EliminarDireccion
        isOpen={isEliminarDireccionOpen}
        onClose={() => {
          setEliminarDireccionOpen(false);
          setDireccionAEliminar(null);
        }}
        onConfirm={eliminarDireccion}
      />

      {direccionAEditar && (
        <EditDireccion
          isOpen={isEditarDireccionOpen}
          direccion={direccionAEditar}
          onClose={() => {
            setEditarDireccionOpen(false);
            setDireccionAEditar(null);
            setRefreshKey(prev => prev + 1); 
          }}
        />
      )}
    </div>
  );
}