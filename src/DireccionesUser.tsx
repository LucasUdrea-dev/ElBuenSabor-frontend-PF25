import { useEffect, useState } from 'react';
import axios from 'axios';
import AgregarDireccion from './AgregarDireccion';
import EliminarDireccion from './EliminarDireccion';
import EditDireccion from './EditDireccion';
import { Direccion, Ciudad, Provincia, Pais } from '../ts/Clases'; 



export default function DireccionesUser() {
  const paisArgentina: Pais = { id: 1, nombre: "Argentina", provincias: [] };

  const provinciaMendoza: Provincia = {
    id: 1,
    nombre: "Mendoza",
    pais: paisArgentina,
    ciudadList: []
  };

  const ciudadMendoza: Ciudad = {
    id: 1,
    nombre: "Ciudad de Mendoza",
    provincia: provinciaMendoza
  };

  const ciudadLasHeras: Ciudad = {
    id: 2,
    nombre: "Las Heras",
    provincia: provinciaMendoza
  };

  const ciudadGuaymallen: Ciudad = {
    id: 3,
    nombre: "Guaymallén",
    provincia: provinciaMendoza
  };

  const [direcciones, setDirecciones] = useState<Direccion[]>([
    {
      id: 1,
      nombreCalle: "Calle Falsa",
      numeracion: "123",
      alias: "Casa",
      descripcionEntrega: "Aclaración 1",
      latitud: 12.345678,
      longitud: 123.456789,
      ciudad: ciudadMendoza
    },
    {
      id: 2,
      nombreCalle: "Avenida Siempre Viva",
      numeracion: "742",
      alias: "Oficina",
      descripcionEntrega: "Aclaración 2",
      latitud: 23.456789,
      longitud: -98.765432,
      ciudad: ciudadLasHeras
    },
    {
      id: 3,
      nombreCalle: "Calle de los Héroes",
      numeracion: "456",
      alias: "Departamento",
      descripcionEntrega: "Aclaración 3",
      latitud: 34.56789,
      longitud: 87.654321,
      ciudad: ciudadGuaymallen
    },
  ]);

      const [cargando, setCargando] = useState(true);
      const [isAgregarDireccionOpen, setAgregarDireccionOpen] = useState(false);
      const [isEliminarDireccionOpen, setEliminarDireccionOpen] = useState(false);
      const [direccionAEliminar, setDireccionAEliminar] = useState<number | null | undefined>(null);
      const [direccionAEditar, setDireccionAEditar] = useState<Direccion | null>(null);
      const [isEditarDireccionOpen, setEditarDireccionOpen] = useState(false);
      

  // Simula ID de usuario actual (debería venir de contexto o props)
  const idUsuario = 1;
  const apiUrl = 'http://localhost:8080/api/Direccion/usuario/{id}'; // Cambia esta URL a la de tu backend


  useEffect(() => {
  
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
      <div className="bg-[#444444] rounded-xl max-w-4xl mx-auto overflow-hidden">
        <div className="bg-[#333333]/40 px-4 py-3">
          <h2 className="font-lato text-lg">Mis direcciones</h2>
        </div>

        <div className="p-4">
          {cargando ? (
            <p>Cargando...</p>
          ) : direcciones.length === 0 ? (
            <div className="text-center p-6 rounded-xl bg-[#444444]">
              <p className="mb-4">Aun no has agregado ninguna dirección</p>
              <button onClick={abrirAgregarDireccion} className="bg-[#D93F21] hover:bg-[#b9331a] px-4 py-2 rounded">
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
                      {dir.nombreCalle} {dir.numeracion}, {dir.ciudad?.nombre}, {dir.ciudad?.provincia?.nombre}, {dir.ciudad?.provincia?.pais?.nombre}
                    </p>
                  </div>
                  <div className="flex gap-2">
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

      <AgregarDireccion isOpen={isAgregarDireccionOpen} onClose={cerrarAgregarDireccion} />

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
          }}
          onDireccionActualizada={() => {
            window.location.reload(); // Provisorio
          }}
        />
      )}
    </div>
  );
}