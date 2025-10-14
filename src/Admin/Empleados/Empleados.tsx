import { useEffect, useState } from "react";
import axios from "axios";
import { host } from "../../../ts/Clases";

interface EmpleadoExtendido {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  existe: boolean;
  telefono?: string;
  rol?: string;
}

export default function Empleados() {
  const [empleados, setEmpleados] = useState<EmpleadoExtendido[]>([]);
  const [empleadosMostrados, setEmpleadosMostrados] = useState<EmpleadoExtendido[]>([]);
  const [buscador, setBuscador] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVOS" | "INACTIVOS">("TODOS");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cantidadPorPagina = 10;
  const API_BASE_URL = `${host}/api/usuarios`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    setCargando(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}`, { headers: getAuthHeaders() });
      const datos: EmpleadoExtendido[] = response.data
        .filter((u: any) => ["ADMIN", "CAJERO", "COCINERO", "DELIVERY"].includes(u.rol?.tipoRol?.rol))
        .map((emp: any) => ({
          id: emp.id,
          nombre: emp.nombre,
          apellido: emp.apellido,
          email: emp.email,
          existe: emp.existe,
          telefono: emp.telefonoList?.[0]?.numero?.toString() || "Sin teléfono",
          rol: emp.rol?.tipoRol?.rol || "Sin rol",
        }));
      setEmpleados(datos);
    } catch (err: any) {
      console.error("Error al cargar empleados:", err);
      setError(err.message || "Error al cargar empleados");
    } finally {
      setCargando(false);
    }
  };

        const borradoLogicoEmpleado = async (empleado: any) => {
        if (!empleado.id) return;

        const nuevoEstado = !empleado.existe;

        // Reconstruimos el objeto completo
        const payload = {
            id: empleado.id,
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            email: empleado.email,
            existe: nuevoEstado,
            telefonoList: empleado.telefonoList || [],
            direccionList: empleado.direccionList || [],
            rol: {
            id: empleado.rol?.id || null,
            fechaAlta: empleado.rol?.fechaAlta || null,
            tipoRol: {
                id: empleado.rol?.tipoRol?.id || null,
                rol: empleado.rol?.tipoRol?.rol || null,
            },
            },
            userAuthentication: empleado.userAuthentication || null,
        };

        try {
            await axios.put(`${API_BASE_URL}/${empleado.id}`, payload, { headers: getAuthHeaders() });
            setEmpleados(prev => prev.map(e => (e.id === empleado.id ? { ...e, existe: nuevoEstado } : e)));
        } catch (err) {
            console.error("Error al actualizar estado del empleado:", err);
            setError("Error al actualizar el estado del empleado");
            setTimeout(() => setError(null), 3000);
        }
        };

  useEffect(() => {
    let filtrado = [...empleados];

    if (filtroEstado !== "TODOS") {
      filtrado = filtrado.filter(e => (filtroEstado === "ACTIVOS" ? e.existe : !e.existe));
    }

    if (buscador) {
      const busq = buscador.toLowerCase();
      filtrado = filtrado.filter(
        e =>
          e.nombre.toLowerCase().includes(busq) ||
          e.apellido.toLowerCase().includes(busq) ||
          e.email.toLowerCase().includes(busq) ||
          e.rol?.toLowerCase().includes(busq)
      );
    }

    setPaginaSeleccionada(1);
    setEmpleadosMostrados(filtrado);
  }, [empleados, buscador, filtroEstado]);

  const getEstadoTexto = (existe: boolean) => (existe ? "Activo" : "Inactivo");

  return (
    <div className="bg-[#333333] w-full min-h-screen py-10 font-['Lato']">
      <div className="bg-white w-11/12 m-auto rounded-2xl">
        {/* Header */}
        <div className="flex justify-between p-6 h-2/12">
          <h1 className="pl-18 pt-2 text-5xl font-lato text-black drop-shadow-sm">Empleados</h1>

          <div className="flex gap-5 pr-[2%] text-2xl items-center">
            <div className="flex gap-2 items-center font-lato pr-10">
              <span className="text-black font-medium pr-5">Filtrar por:</span>
              {["TODOS", "ACTIVOS", "INACTIVOS"].map(estado => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado as any)}
                  className={`px-4 py-2 rounded-full transition-colors ${filtroEstado === estado ? "bg-[#D93F21]" : "bg-[#878787]"} text-white`}
                >
                  {estado}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                onChange={e => setBuscador(e.target.value)}
                value={buscador}
                className="bg-[#878787] text-white pl-12 pr-5 py-2 rounded-full font-lato"
                placeholder="Buscar..."
                type="text"
              />
              <img className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" src="/svg/LupaBuscador.svg" alt="Buscar" />
            </div>
          </div>
        </div>

        {error && <div className="text-2xl text-center py-4 bg-red-100 text-red-600 mx-6 rounded-lg font-lato">{error}</div>}

        {cargando ? (
          <div className="text-3xl text-center py-20 text-gray-500 font-lato">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D93F21]" />
              <p>Cargando empleados...</p>
            </div>
          </div>
        ) : (
          <div className="w-full pb-10">
            <div className="text-4xl w-full grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] border-b border-gray-500 text-center font-lato mt-5">
              <h1>Empleado</h1>
              <h1>Email</h1>
              <h1>Teléfono</h1>
              <h1>Rol</h1>
              <h1>Acciones</h1>
            </div>

            {empleadosMostrados.length > 0 ? (
              empleadosMostrados
                .slice((paginaSeleccionada - 1) * cantidadPorPagina, paginaSeleccionada * cantidadPorPagina)
                .map(emp => (
                  <div
                    key={emp.id}
                    className={`text-3xl grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] border-b border-gray-400 text-center font-lato py-2 mt-10 ${!emp.existe ? "opacity-40" : ""}`}
                  >
                    <div>{emp.nombre} {emp.apellido}</div>
                    <div>{emp.email}</div>
                    <div>{emp.telefono}</div>
                    <div>{emp.rol}</div>
                    <div className="flex justify-center gap-3">
                      <div className={`text-white px-3 py-2 rounded-full ${emp.existe ? "bg-green-600" : "bg-gray-500"}`}>
                        {getEstadoTexto(emp.existe)}
                      </div>
                      <button onClick={() => borradoLogicoEmpleado(emp)}>
                        <img className="h-10 w-10" src={`/svg/${emp.existe ? "LogoBorrar.svg" : "LogoActivar.svg"}`} alt={emp.existe ? "Desactivar" : "Activar"} />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-3xl text-center py-10 text-gray-500 font-lato">
                No se encontraron empleados
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
