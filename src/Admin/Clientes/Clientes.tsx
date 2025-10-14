import { useEffect, useState } from "react";
import axios from "axios";
import DetalleClienteAdmin from "./DetalleClienteAdmin";
import { Usuario, host } from "../../../ts/Clases";

interface ClienteExtendido extends Usuario {
  telefono?: string;
  ordenes?: number;
  fechaRegistro?: Date;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<ClienteExtendido[]>([]);
  const [clientesMostrados, setClientesMostrados] = useState<ClienteExtendido[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVOS" | "INACTIVOS">("TODOS");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteExtendido | null>(null);

  const cantidadPorPagina = 10;
  const API_BASE_URL = `${host}/api/usuarios`;

  // Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const borradoLogicoCliente = async (cliente: ClienteExtendido) => {
    if (!cliente.id) {
      setError("El cliente no tiene un ID válido");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const nuevoEstado = !cliente.existe;

    try {
      await axios.put(
        `${API_BASE_URL}/${cliente.id}`,
        { ...cliente, existe: nuevoEstado },
        { headers: getAuthHeaders() }
      );

      setClientes((prev) =>
        prev.map((c) => (c.id === cliente.id ? { ...c, existe: nuevoEstado } : c))
      );
    } catch (error) {
      console.error("Error en borrado lógico:", error);
      setError("Error al actualizar el estado del cliente");
      setTimeout(() => setError(null), 3000);
    }
  };

  const cargarClientes = async () => {
    setCargando(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/customer`, {
        headers: getAuthHeaders(),
      });

      const data = response.data;
      if (!Array.isArray(data)) {
        throw new Error("La respuesta del servidor no es un array");
      }

      const clientesMapeados: ClienteExtendido[] = data.map((usuario: any) => {
        // Si el usuario tiene lista de teléfonos, tomamos el primero
        const numeroTelefono =
          usuario.telefonoList?.length > 0
            ? usuario.telefonoList[0].numero.toString()
            : "Sin teléfono";

        return {
          ...usuario,
          existe: Boolean(usuario.existe),
          telefono: numeroTelefono,
          ordenes: usuario.ordenes || 0,
          fechaRegistro: usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : new Date(),
        };
      });

      setClientes(clientesMapeados);
    } catch (error: any) {
      console.error("Error al cargar clientes:", error);
      const mensaje =
        error.response?.data?.error ||
        error.message ||
        "Error al cargar los clientes desde el servidor";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  const abrirDetalleCliente = (cliente: ClienteExtendido) => {
    setClienteSeleccionado(cliente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteSeleccionado(null);
  };

  useEffect(() => {
    let filtrado = [...clientes];

    if (filtroEstado !== "TODOS") {
      filtrado = filtrado.filter((c) =>
        filtroEstado === "ACTIVOS" ? c.existe : !c.existe
      );
    }

    if (buscador) {
      const busq = buscador.toLowerCase();
      filtrado = filtrado.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(busq) ||
          c.apellido?.toLowerCase().includes(busq) ||
          c.email?.toLowerCase().includes(busq)
      );
    }

    setPaginaSeleccionada(1);
    setClientesMostrados(filtrado);
  }, [clientes, buscador, filtroEstado]);

  const getEstadoTexto = (existe: boolean) => (existe ? "Activo" : "Inactivo");

  return (
    <div className="bg-[#333333] w-full min-h-screen py-10 font-['Lato']">
      <div className="bg-white w-11/12 m-auto rounded-2xl">
        {/* Header */}
        <div className="flex justify-between p-6 h-2/12">
            <h1 className="pl-18 pt-2 text-5xl font-lato text-black drop-shadow-sm">Clientes</h1>

          <div className="flex gap-5 pr-[2%] text-2xl items-center">
            <div className="flex gap-2 items-center font-lato pr-10">
              <span className="text-black font-medium pr-5">Filtrar por:</span>
              {["TODOS", "ACTIVOS", "INACTIVOS"].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado as any)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    filtroEstado === estado ? "bg-[#D93F21]" : "bg-[#878787]"
                  } text-white`}
                >
                  {estado}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                onChange={(e) => setBuscador(e.target.value)}
                className="bg-[#878787] text-white pl-12 pr-5 py-2 rounded-full font-lato"
                placeholder="Buscar..."
                type="text"
                value={buscador}
              />
              <img
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                src="/svg/LupaBuscador.svg"
                alt="Buscar"
              />
            </div>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="text-2xl text-center py-4 bg-red-100 text-red-600 mx-6 rounded-lg font-lato">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="text-3xl text-center py-20 text-gray-500 font-lato">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D93F21]" />
              <p>Cargando clientes...</p>
            </div>
          </div>
        ) : (
          <div className="w-full pb-10">
            {/* Encabezado tabla */}
            <div className="text-4xl w-full grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] border-b border-gray-500 text-center font-lato mt-5">
              <h1>Cliente</h1>
              <h1>Email</h1>
              <h1>Teléfono</h1>
              <h1>Órdenes</h1>
              <h1>Acciones</h1>
            </div>

            {/* Filas */}
            {clientesMostrados.length > 0 ? (
            clientesMostrados
                .slice((paginaSeleccionada - 1) * cantidadPorPagina, paginaSeleccionada * cantidadPorPagina)
                .map(cliente => (
                <div
                    key={cliente.id}
                    className={`text-3xl grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] border-b border-gray-400 text-center font-lato py-2 mt-10 ${
                    !cliente.existe ? "opacity-40" : ""
                    }`}
                >
                    <div>{cliente.nombre} {cliente.apellido}</div>
                    <div>{cliente.email}</div>
                    <div>{cliente.telefono}</div>
                    <div>{cliente.ordenes}</div>
                    <div className="flex justify-center gap-3">
                    <div
                        className={`text-white px-3 py-2 rounded-full ${
                        cliente.existe ? "bg-green-600" : "bg-gray-500"
                        }`}
                    >
                        {getEstadoTexto(cliente.existe)}
                    </div>
                    <button onClick={() => abrirDetalleCliente(cliente)}>
                        <img className="h-10 w-10" src="/svg/DetallePreparacion.svg" alt="Ver detalles" />
                    </button>
                    <button onClick={() => borradoLogicoCliente(cliente)}>
                        <img className="h-10 w-10" src={`/svg/${cliente.existe ? "LogoBorrar.svg" : "LogoActivar.svg"}`} alt={cliente.existe ? "Desactivar" : "Activar"} />
                    </button>
                    </div>
                </div>
                ))
            ) : (
            <div className="text-3xl text-center py-10 text-gray-500 font-lato">
                No se encontraron clientes
            </div>
            )}

          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {modalAbierto && clienteSeleccionado && (
        <DetalleClienteAdmin
          cliente={clienteSeleccionado}
          isOpen={modalAbierto}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
}
