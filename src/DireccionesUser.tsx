import { useEffect, useState } from 'react';
import axios from 'axios';
import AgregarDireccion from './AgregarDireccion';
import EliminarDireccion from './EliminarDireccion';
import EditDireccion from './EditDireccion';



type Direccion = {
  id: number;
  calle: string;
  numero: string;
  piso?: string;
  depto?: string;
  ciudad: string;
  localidad: string;
  alias: string;
  aclaraciones?: string;
  latitud?: string;
  longitud?: string;
};

export default function DireccionesUser() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isAgregarDireccionOpen, setAgregarDireccionOpen] = useState(false);
  const [isEliminarDireccionOpen, setEliminarDireccionOpen] = useState(false);
  const [direccionAEliminar, setDireccionAEliminar] = useState<number | null>(null);
  const [direccionAEditar, setDireccionAEditar] = useState<Direccion | null>(null);
  const [isEditarDireccionOpen, setEditarDireccionOpen] = useState(false);



  // Simula ID de usuario actual (debería venir de contexto o props)
  const idUsuario = 1;
  const apiUrl = 'http://localhost:8080/api/direcciones'; // Cambia esta URL a la de tu backend


  useEffect(() => {
    // Simulamos la carga de datos
    const direccionesSimuladas: Direccion[] = [
      { id: 1, alias: 'Casa', calle: 'Av. Siempre Viva', numero: '742', ciudad: 'Springfield', localidad: 'Illinois' },
      { id: 2, alias: 'Trabajo', calle: 'Calle Falsa', numero: '123', ciudad: 'Springfield', localidad: 'Illinois' },
    ];

    // Simulamos un retraso en la carga
    setTimeout(() => {
      setDirecciones(direccionesSimuladas);
      setCargando(false);
    }, 1000); // 1 segundo de retraso


    const fetchDirecciones = async () => {
      try {
        const response = await axios.get(`${apiUrl}/usuario/${idUsuario}`);
        setDirecciones(response.data);
      } catch (error) {
        console.error('Error al cargar las direcciones:', error);
      } finally {
        setCargando(false);
      }
    };

  
    fetchDirecciones();
  }, [apiUrl, idUsuario]);


  //funcion para eliminar una direccion
  const eliminarDireccion = async () => {
  if (direccionAEliminar === null) return;

  try {
    await axios.delete(`${apiUrl}/${direccionAEliminar}`);
    setDirecciones((prev) => prev.filter((d) => d.id !== direccionAEliminar));
  } catch (error) {
    console.error('Error al eliminar la dirección:', error);
  } finally {
    setEliminarDireccionOpen(false);
    setDireccionAEliminar(null);
  }
};

   //modales de agregar direccion (Apertura y cierre)
    const abrirAgregarDireccion = () => {
        setAgregarDireccionOpen(true) 
    }
    const cerrarAgregarDireccion = () => {
        setAgregarDireccionOpen(false) 
    }
  



  return (
    <div className="min-h-screen text-white p-4 bg-[#333333] font-lato">
      <div className="bg-[#444444] rounded-xl max-w-5xl mx-auto overflow-hidden">
        
        <div className="bg-[#333333]/40 px-4 py-3">
          <h2 className="font-lato text-lg">Mis direcciones</h2>
        </div>

        <div className="p-4 ">
          {cargando ? (
            <p>Cargando...</p>
          ) : direcciones.length === 0 ? (
            <div className="text-center p-6 rounded-xl bg-[#444444]">
              <p className="mb-4">Aun no has agregado ninguna dirección</p>
              <button 
                onClick={abrirAgregarDireccion}
                className="bg-[#D93F21] hover:bg-[#b9331a] px-4 py-2 rounded"> 
                
                Agregar dirección
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {direcciones.map((dir) => (
                <div
                  key={dir.id}
                  className="flex items-center justify-between bg-[#FAF8F5] text-[#262626] px-4 py-3 rounded-xl"
                >
                  <div>
                    <p className="font-bold">{dir.alias}</p>
                    <p className="text-sm">
                      {dir.calle} {dir.numero}, {dir.ciudad}, {dir.localidad}
                    </p>
                  </div>
                  <div className="flex gap-2">



                    <button 
                    
                    onClick={() => {
                      setDireccionAEditar(dir);
                      setEditarDireccionOpen(true);
                    }}
                    
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded flex items-center gap-1">
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
                    className="bg-[#D93F21] hover:bg-[#b9331a] px-4 py-2 rounded text-white">
                  Agregar dirección
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

          <AgregarDireccion isOpen={isAgregarDireccionOpen} onClose={cerrarAgregarDireccion} />


          <EliminarDireccion
              isOpen={isEliminarDireccionOpen}
              onClose={() => {
                setEliminarDireccionOpen(false);
                setDireccionAEliminar(null);
              }}
              onConfirm={eliminarDireccion}
            />


            <EditDireccion
              isOpen={isEditarDireccionOpen}
              direccion={direccionAEditar}
              onClose={() => {
                setEditarDireccionOpen(false);
                setDireccionAEditar(null);
              }}
              onDireccionActualizada={() => {
                // Aquí podrías volver a llamar a fetchDirecciones o actualizar el estado manualmente
                window.location.reload(); // Provisorio
              }}
            />

    </div>
  );
}
