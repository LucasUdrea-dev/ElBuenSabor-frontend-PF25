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

  const borradoLogicoCliente = async (cliente: any) => {
    const accion = cliente.existe ? "desactivar" : "activar";
    
    if (!confirm(`¿Estás seguro de que deseas ${accion} a ${cliente.nombre} ${cliente.apellido}?`)) return;

    try {
      await axios.delete(`${API_BASE_URL}/${cliente.id}`, {
        headers: getAuthHeaders()
      });

      setClientes(prevClientes =>
        prevClientes.map(emp =>
          emp.id === cliente.id ? { ...emp, existe: !emp.existe } : emp
        )
      );
    } catch (err) {
      console.error("Error:", err);
      alert(`Error al ${accion} el cliente`);
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
    <div className="bg-[#333333] w-full min-h-screen py-8 px-4 font-['Lato']">
      <div className="bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 border-b border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">Clientes</h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-stretch sm:items-center">
            <div className="flex flex-wrap gap-2 font-lato items-center">
              <span className="text-gray-700 font-medium text-sm">Filtrar por:</span>
              {["TODOS", "ACTIVOS", "INACTIVOS"].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado as any)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${
                    filtroEstado === estado ? "bg-[#D93F21]" : "bg-[#878787] hover:bg-[#6a6a6a]"
                  } text-white`}
                >
                  {estado}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                onChange={(e) => setBuscador(e.target.value)}
                className="bg-[#878787] text-white pl-10 pr-4 py-2 rounded-lg font-lato text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all w-full sm:w-auto"
                placeholder="Buscar..."
                type="text"
                value={buscador}
              />
              <img
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-80"
                src="/svg/LupaBuscador.svg"
                alt="Buscar"
              />
            </div>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="text-sm text-center py-3 bg-red-100 text-red-600 mx-6 mt-4 rounded-lg font-lato">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="text-base text-center py-20 text-gray-500 font-lato">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D93F21]" />
              <p>Cargando clientes...</p>
            </div>
          </div>
        ) : (
          <div className="w-full pb-6">
            {/* Encabezado tabla */}
            <div className="text-sm md:text-base w-full grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
              <h1 className="p-4 text-center">Cliente</h1>
              <h1 className="p-4 text-center">Email</h1>
              <h1 className="p-4 text-center">Teléfono</h1>
              <h1 className="p-4 text-center">Órdenes</h1>
              <h1 className="p-4 text-center">Acciones</h1>
            </div>

            {/* Filas */}
            {clientesMostrados.length > 0 ? (
            clientesMostrados
                .slice((paginaSeleccionada - 1) * cantidadPorPagina, paginaSeleccionada * cantidadPorPagina)
                .map(cliente => (
                <div
                    key={cliente.id}
                    className={`text-sm md:text-base grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] border-b border-gray-100 hover:bg-gray-50 transition-colors font-lato ${
                    !cliente.existe ? "opacity-40" : ""
                    }`}
                >
                    <div className="p-4 flex items-center justify-center text-gray-700">{cliente.nombre} {cliente.apellido}</div>
                    <div className="p-4 flex items-center justify-center text-gray-700 truncate">{cliente.email}</div>
                    <div className="p-4 flex items-center justify-center text-gray-700">{cliente.telefono}</div>
                    <div className="p-4 flex items-center justify-center text-gray-700 font-semibold">{cliente.ordenes}</div>
                    <div className="p-4 flex items-center justify-center gap-2">
                    <div
                        className={`text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium shadow-md ${
                        cliente.existe ? "bg-green-600" : "bg-gray-500"
                        }`}
                    >
                        {getEstadoTexto(cliente.existe)}
                    </div>
                    <button 
                      onClick={() => abrirDetalleCliente(cliente)}
                      className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                      title="Ver detalles"
                    >
                        <img className="h-7 w-7" src="/svg/DetallePreparacion.svg" alt="Ver detalles" />
                    </button>
                    <button 
                      onClick={() => borradoLogicoCliente(cliente)}
                      className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                      title={cliente.existe ? "Desactivar" : "Activar"}
                    >
                        <img className="h-7 w-7" src={`/svg/${cliente.existe ? "LogoBorrar.svg" : "LogoActivar.svg"}`} alt={cliente.existe ? "Desactivar" : "Activar"} />
                    </button>
                    </div>
                </div>
                ))
            ) : (
            <div className="text-base text-center py-12 text-gray-500 font-lato">
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
