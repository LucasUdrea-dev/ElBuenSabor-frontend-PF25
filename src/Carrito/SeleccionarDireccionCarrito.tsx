import { useContext, useEffect, useState, useCallback } from "react";
import { Direccion, host } from "../../ts/Clases";
import { CarritoContext } from "./CarritoContext";
import AgregarDireccion from "../Direcciones User/AgregarDireccion";
import axios from "axios";
import { useUser } from "../UserAuth/UserContext";

interface Props {
  isOpen: boolean;
  cerrarModal: () => void;
}

export default function SeleccionarDireccionCarrito({
  isOpen,
  cerrarModal,
}: Props) {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);

  const [agregarDireccion, setAgregarDireccion] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(0);
  const { userSession } = useUser();

  const obtenerDirecciones = useCallback(async () => {
    if (!userSession?.id_user) {
      console.error("No hay usuario logueado");
      return;
    }

    const URL = host + `/api/Direccion/usuario/${userSession.id_user}`;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const direccionesObtenidas: Direccion[] = response.data;

      setDirecciones(direccionesObtenidas);
    } catch (error) {
      console.error("Error al cargar las direcciones:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
          // Opcional: redirigir al login
          // window.location.href = "/login";
        } else if (error.response?.status === 404) {
          alert(
            "Usuario o direcciones no encontradas. Por favor, intenta de nuevo."
          );
        } else {
          alert(
            "Error al cargar las direcciones. Por favor, intenta de nuevo."
          );
        }
      } else {
        alert("Error al cargar las direcciones. Por favor, intenta de nuevo.");
      }
    }
  }, [userSession?.id_user]);

  //Volver a traer las direcciones del usuario
  useEffect(() => {
    if (userSession?.id_user) {
      obtenerDirecciones();
    }
  }, [agregarDireccion, obtenerDirecciones, userSession?.id_user]);

  useEffect(() => {
    if (userSession?.id_user) {
      obtenerDirecciones();
    }
  }, [obtenerDirecciones, userSession?.id_user]);

  const cerrarAgregarDireccion = () => {
    setAgregarDireccion(false);
  };

  const guardar = () => {
    const nuevaDireccion = direcciones.find(
      (direccion) => direccion.id == direccionSeleccionada
    );

    if (nuevaDireccion) {
      cambiarDireccion(nuevaDireccion);
      cerrarModal();
    } else alert("Ocurrio un error al elegir la direccion");
  };

  const carritoContext = useContext(CarritoContext);

  if (carritoContext === undefined) {
    return <p>No se encontro carrito provider</p>;
  }

  const { cambiarDireccion } = carritoContext;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/**Fondo oscurecido */}
      <div
        onClick={() => {
          cerrarModal();
        }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        {/**Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-lg md:w-1/2"
        >
          <div className="flex flex-col gap-10 items-center px-5 py-10">
            <div className="text-2xl font-bold text-center py-2">
              <h1>Cambiar dirección de envio</h1>
            </div>

            <div className="opacity-60">
              <h3>Seleccione una direccion de envio:</h3>
              <select
                value={direccionSeleccionada}
                onChange={(e) =>
                  setDireccionSeleccionada(Number(e.target.value))
                }
                className="bg-gray-300 py-1 px-2 rounded-xl"
              >
                <option value="0">Seleccionar...</option>
                {direcciones.map((direccion) => (
                  <option value={direccion.id}>
                    {direccion.nombreCalle} {direccion.numeracion},{" "}
                    {direccion.ciudad?.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-2/3 m-auto flex flex-col gap-2 items-center justify-center">
              <button
                onClick={() => guardar()}
                className="bg-[#0A76E1] text-white w-full py-4 text-xl rounded-4xl"
              >
                Guardar
              </button>
              <div className="flex gap-1">
                <h3>¿No tenes direccion?</h3>
                <button onClick={() => setAgregarDireccion(true)}>
                  Agrega una
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AgregarDireccion
        isOpen={agregarDireccion}
        onClose={cerrarAgregarDireccion}
      />
    </>
  );
}
