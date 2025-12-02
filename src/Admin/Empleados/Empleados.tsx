import { useEffect, useState } from "react";
import axios from "axios";
import { host } from "../../../ts/Clases";
import AgregarEmpleados from "./AgregarEmpleados";
import EditarEmpleado from "./EditarEmpleado";

export default function Empleados() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [empleadosMostrados, setEmpleadosMostrados] = useState<any[]>([]);
  const [buscador, setBuscador] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVOS" | "INACTIVOS">("TODOS");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const cantidadPorPagina = 10;
  const API_BASE_URL = `${host}/api/empleados`;

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
      const response = await axios.get(`${API_BASE_URL}/getEmpleados`, {
        headers: getAuthHeaders()
      });

      setEmpleados(response.data);
    } catch (err: any) {
      console.error("Error al cargar empleados:", err);
      setError(err.response?.data?.error || err.message || "Error al cargar empleados");
    } finally {
      setCargando(false);
    }
  };



  const borradoLogicoEmpleado = async (empleado: any) => {
    const accion = empleado.existe ? "desactivar" : "activar";
    
    if (!confirm(`¿Estás seguro de que deseas ${accion} a ${empleado.nombre} ${empleado.apellido}?`)) return;
    
    setLoadingAction(true);
    try {
      await axios.delete(`${API_BASE_URL}/${empleado.id}`, {
        headers: getAuthHeaders()
      });

      setEmpleados(prevEmpleados =>
        prevEmpleados.map(emp =>
          emp.id === empleado.id ? { ...emp, existe: !emp.existe } : emp
        )
      );
    } catch (err) {
      console.error("Error:", err);
      alert(`Error al ${accion} el empleado`);
    } finally {
      setLoadingAction(false);
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
          e.email.toLowerCase().includes(busq)
      );
    }

    setPaginaSeleccionada(1);
    // filtra y/o busca en empleados escribe el resultado en empleadosMostrados
    setEmpleadosMostrados(filtrado);
  }, [empleados, buscador, filtroEstado]);


  
  const getEstadoTexto = (existe: boolean) => (existe ? "Activo" : "Inactivo");

  const handleEmpleadoCreado = () => {
    cargarEmpleados(); // Recargar la lista de empleados
  };

  const handleEmpleadoActualizado = () => {
    cargarEmpleados(); // Recargar la lista de empleados
  };

  const abrirModalEditar = (empleado: any) => {
    setEmpleadoSeleccionado(empleado);
    setModalEditarAbierto(true);
  };

  return (
    <div className="bg-[#333333] w-full min-h-screen py-8 px-4 font-['Lato']">
      <div className="bg-white w-full max-w-7xl mx-auto rounded-xl shadow-xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
          <h1 className="text-2xl lg:text-3xl font-bold font-lato text-gray-800">Empleados</h1>

          <button
            onClick={() => setModalAgregarAbierto(true)}
            className="bg-[#D93F21] hover:bg-[#B8341B] text-white px-6 py-2.5 rounded-lg font-lato text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            + Agregar Empleado
          </button>
        </div>

        {/* Filtros y buscador */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 items-stretch sm:items-center p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 items-center font-lato">
            <span className="text-gray-700 font-medium text-sm">Filtrar por:</span>
            {["TODOS", "ACTIVOS", "INACTIVOS"].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado as any)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${filtroEstado === estado ? "bg-[#D93F21]" : "bg-[#878787] hover:bg-[#6a6a6a]"} text-white`}
              >
                {estado}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              onChange={e => setBuscador(e.target.value)}
              value={buscador}
              className="bg-[#878787] text-white pl-10 pr-4 py-2 rounded-lg font-lato text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all w-full sm:w-auto"
              placeholder="Buscar..."
              type="text"
            />
            <img className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-80" src="/svg/LupaBuscador.svg" alt="Buscar" />
          </div>
        </div>

        {error && (
          <div className="text-sm text-center py-3 bg-red-100 text-red-600 mx-6 mt-4 rounded-lg font-lato">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="text-base text-center py-20 text-gray-500 font-lato">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D93F21]" />
              <p>Cargando empleados...</p>
            </div>
          </div>
        ) : (
          <div className="w-full pb-6">

            {/* Encabezado tabla */}
            <div className="text-sm md:text-base w-full grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] bg-gray-50 border-b border-gray-200 font-lato font-semibold text-gray-700">
              <h1 className="p-4 text-center">Empleado</h1>
              <h1 className="p-4 text-center">Email</h1>
              <h1 className="p-4 text-center">Teléfono</h1>
              <h1 className="p-4 text-center">Rol</h1>
              <h1 className="p-4 text-center">Acciones</h1>
            </div>

            {/* Filas paginadas */}
            {empleadosMostrados.length > 0 ? (
              empleadosMostrados
                .slice((paginaSeleccionada - 1) * cantidadPorPagina, paginaSeleccionada * cantidadPorPagina)
                .map(emp => (
                  <div
                    key={emp.id}
                    className={`text-sm md:text-base grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] border-b border-gray-100 hover:bg-gray-50 transition-colors font-lato ${!emp.existe ? "opacity-40" : ""}`}
                  >
                    <div className="p-4 flex items-center justify-center text-gray-700">
                      {emp.nombre} {emp.apellido}
                    </div>

                    <div className="p-4 flex items-center justify-center text-gray-700 truncate">
                      {emp.email}
                    </div>

                    <div className="p-4 flex items-center justify-center text-gray-700">
                      {Array.isArray(emp.telefonoList)
                        ? emp.telefonoList.length > 0
                          ? emp.telefonoList.map((tel: any, idx: number) => (
                            <span key={idx}>
                              {tel.numero}
                              {idx < emp.telefonoList.length - 1 ? ", " : ""}
                            </span>
                          ))
                          : "Sin teléfono"
                        : emp.telefonoList || "Sin teléfono"}
                    </div>

                    <div className="p-4 flex items-center justify-center text-gray-700">
                      {typeof emp.rol === "string"
                        ? emp.rol
                        : emp.rol?.tipoRol?.rol || "Sin rol"}
                    </div>

                    <div className="p-4 flex items-center justify-center gap-2">
                      <div
                        className={`text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium shadow-md ${
                          emp.existe ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {getEstadoTexto(emp.existe)}
                      </div>

                      <button
                        onClick={() => abrirModalEditar(emp)}
                        title="Editar empleado"
                        className="hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg"
                      >
                        <img className="h-7 w-7" src="/public/svg/LogoEditar.svg" alt="Editar" />
                      </button>

                      <button
                        onClick={() => borradoLogicoEmpleado(emp)}
                        className={`hover:scale-110 transition-transform p-1 hover:bg-gray-200 rounded-lg ${
                          loadingAction ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title={emp.existe ? "Desactivar" : "Activar"}
                        disabled={loadingAction}
                      >
                        <img
                          className="h-7 w-7"
                          src={`/svg/${emp.existe ? "LogoBorrar.svg" : "LogoActivar.svg"}`}
                          alt={emp.existe ? "Desactivar" : "Activar"}
                        />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-base text-center py-12 text-gray-500 font-lato">
                No se encontraron empleados
              </div>
            )}

            {/* PAGINACIÓN — AGREGADA SIN MODIFICAR NADA MÁS */}
            {empleadosMostrados.length > 0 && (
              <div className="text-gray-600 flex items-center justify-between px-6 pt-6 gap-4 text-sm flex-wrap">

                {/* Info de rango mostrado */}
                <div>
                  <h4>
                    {paginaSeleccionada * cantidadPorPagina - cantidadPorPagina + 1}
                    -
                    {paginaSeleccionada * cantidadPorPagina < empleadosMostrados.length
                      ? paginaSeleccionada * cantidadPorPagina
                      : empleadosMostrados.length}{" "}
                    de {empleadosMostrados.length}
                  </h4>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaginaSeleccionada(1)}
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img className="h-8 w-8" src="/svg/PrimeraPagina.svg" />
                  </button>

                  <button
                    onClick={() =>
                      setPaginaSeleccionada(prev => (prev > 1 ? prev - 1 : prev))
                    }
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img className="h-8 w-8" src="/svg/AnteriorPagina.svg" />
                  </button>

                  <button
                    onClick={() =>
                      setPaginaSeleccionada(prev =>
                        prev <
                        Math.ceil(empleadosMostrados.length / cantidadPorPagina)
                          ? prev + 1
                          : prev
                      )
                    }
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img className="h-8 w-8" src="/svg/SiguientePagina.svg" />
                  </button>

                  <button
                    onClick={() =>
                      setPaginaSeleccionada(
                        Math.ceil(empleadosMostrados.length / cantidadPorPagina)
                      )
                    }
                    className="hover:scale-110 transition-transform p-1 hover:bg-gray-100 rounded"
                  >
                    <img className="h-8 w-8" src="/svg/UltimaPagina.svg" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Agregar Empleado */}
      <AgregarEmpleados
        isOpen={modalAgregarAbierto}
        onClose={() => setModalAgregarAbierto(false)}
        onEmpleadoCreado={handleEmpleadoCreado}
      />

      {/* Modal Editar Empleado */}
      <EditarEmpleado
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        empleado={empleadoSeleccionado}
        onEmpleadoActualizado={handleEmpleadoActualizado}
      />
    </div>
  );
}