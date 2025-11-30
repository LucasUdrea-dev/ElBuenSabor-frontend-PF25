import { useEffect, useState } from "react";
import DetalleCocinero from "./DetalleCocinero";
import {
  axiosConfig,
  EstadosPedidosEnum,
  host,
  Pedido,
} from "../../../ts/Clases";
import axios from "axios";
import { usePedidosSocket } from "../../services/websocket/usePedidosSocket";

const ESTADOS_COCINERO = [
  EstadosPedidosEnum.STANDBY,
  EstadosPedidosEnum.PREPARING,
];

export default function Cocinero() {
  const { pedidos, setPedidos } = usePedidosSocket(
    "/topic/dashboard/cocina",
    ESTADOS_COCINERO
  );

  const [pedidosMostrados, setPedidosMostrados] = useState<Pedido[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<
    "TODOS" | "STANDBY" | "PREPARING"
  >("TODOS");

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(
    null
  );

  const cantidadPorPagina = 10;

  const cargarPedidos = async () => {
    const URL = `${host}/api/pedidos/all`;

    try {
      const response = await axios.get(URL, axiosConfig);
      setPedidos(
        response.data.filter((pedido: Pedido) =>
          ESTADOS_COCINERO.includes(pedido.estadoPedido.nombreEstado)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cambiarEstadoPedido = async (
    pedido: Pedido,
    nuevoEstado: EstadosPedidosEnum
  ) => {
    const URL = `${host}/api/pedidos/${pedido.id}/estado?estado=${nuevoEstado}`;

    try {
      await axios.put(URL, "nada", axiosConfig);

      if (!ESTADOS_COCINERO.includes(nuevoEstado)) {
        setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
      }
    } catch (error) {
      alert("Error al cambiar el estado del pedido");
    }
  };

  const avanzar = (pedido: Pedido) => {
    switch (pedido.estadoPedido.nombreEstado) {
      case EstadosPedidosEnum.STANDBY:
        return cambiarEstadoPedido(pedido, EstadosPedidosEnum.PREPARING);
      case EstadosPedidosEnum.PREPARING:
        return cambiarEstadoPedido(pedido, EstadosPedidosEnum.READY);
    }
  };

  const pausar = (pedido: Pedido) => {
    if (pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.PREPARING) {
      return cambiarEstadoPedido(pedido, EstadosPedidosEnum.STANDBY);
    }
  };

  // Función para abrir el modal con el detalle del pedido
  const abrirDetallePedido = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
  };

  useEffect(() => {
    let filtrado: Pedido[] = pedidos;

    // Filtrar por estado
    if (filtroEstado !== "TODOS") {
      filtrado = filtrado.filter(
        (pedido) => pedido.estadoPedido.nombreEstado === filtroEstado
      );
    }

    // Filtrar por búsqueda de número de orden o nombre de cliente
    if (buscador) {
      filtrado = filtrado.filter(
        (pedido) =>
          pedido.id?.toString().includes(buscador) ||
          pedido.usuario.nombre
            .toLowerCase()
            .includes(buscador.toLowerCase()) ||
          pedido.usuario.apellido.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setPedidosMostrados(filtrado);
  }, [pedidos, buscador, filtroEstado]);

  // Funcion para pasar de ingles a español
  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "INCOMING":
        return "Entrante";
      case "READY":
        return "Listo";
      case "STANDBY":
        return "En Espera";
      case "PREPARING":
        return "Preparando";
      case "REJECTED":
        return "Rechazado";
      default:
        return estado;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "PREPARING":
        return "#D93F21"; // Color activo/fuego para preparando
      case "STANDBY":
        return "#878787"; // Gris para espera
      default:
        return "#878787";
    }
  };

  // Funcion para pasar de ingles a español
  const getTipoEnvioTexto = (tipoEnvio: string) => {
    return tipoEnvio === "DELIVERY" ? "Delivery" : "Retiro";
  };

  return (
    <>
      <div className="bg-[#333333] w-full h-full py-10 font-['Lato']">
        {/**Tabla */}
        <div className="bg-white w-11/12 m-auto rounded-2xl">
          {/**Titulo, filtros y buscador */}
          <div className="flex justify-between p-6 h-2/12">
            <h1 className="pl-18 pt-2 text-4xl font-lato">Cocina</h1>

            <div className="flex gap-5 pr-[2%] text-2xl items-center">
              {/**Filtros por estado como botones */}
              <div className="flex gap-2 items-center font-lato pr-10">
                <button
                  onClick={() => setFiltroEstado("TODOS")}
                  className={`px-4 py-2 rounded-4xl transition-colors ${
                    filtroEstado === "TODOS"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroEstado("STANDBY")}
                  className={`px-4 py-2 rounded-4xl transition-colors ${
                    filtroEstado === "STANDBY"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white"
                  }`}
                >
                  En Espera
                </button>
                <button
                  onClick={() => setFiltroEstado("PREPARING")}
                  className={`px-4 py-2 rounded-4xl transition-colors ${
                    filtroEstado === "PREPARING"
                      ? "bg-[#D93F21] text-white"
                      : "bg-[#878787] text-white"
                  }`}
                >
                  Preparando
                </button>
              </div>

              {/**Buscador con icono */}
              <div className="relative">
                <input
                  onChange={(e) => setBuscador(e.target.value)}
                  className="bg-[#878787] text-white pl-12 pr-5 py-2 rounded-4xl font-lato"
                  placeholder="Buscar..."
                  type="text"
                />
                <img
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  src="/svg/LupaBuscador.svg"
                  alt="Buscar"
                />
              </div>
            </div>
          </div>

          {/**Tabla CRUD pedidos */}
          <div className="w-full pb-10">
            {/**Cabecera */}
            <div className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center font-lato">
              <h1>Orden N°</h1>
              <h1>Cliente</h1>
              <h1>Envío</h1>
              <h1>Tiempo Est.</h1>
              <h1>Estado y Acciones</h1>
            </div>

            {/**Pedidos */}
            {pedidosMostrados.length > 0 &&
              pedidosMostrados.map((pedido, index) => {
                if (
                  index < paginaSeleccionada * cantidadPorPagina &&
                  index >= cantidadPorPagina * (paginaSeleccionada - 1)
                ) {
                  return (
                    <div
                      key={pedido.id}
                      className="text-3xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center font-lato"
                    >
                      <div>
                        <h3 className="font-normal text-gray-800">
                          {pedido.id}
                        </h3>
                      </div>
                      <div>
                        <h3>
                          {pedido.usuario.nombre} {pedido.usuario.apellido}
                        </h3>
                      </div>
                      <div>
                        <h3>
                          {getTipoEnvioTexto(pedido.tipoEnvio.tipoDelivery)}
                        </h3>
                      </div>
                      <div>
                        <h3>{pedido.tiempoEstimado} min</h3>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <div
                          className="text-white px-3 py-3 rounded-4xl text-2xl flex items-center justify-center"
                          style={{
                            width: "150px",
                            height: "50px",
                            backgroundColor: getColorEstado(
                              pedido.estadoPedido.nombreEstado
                            ),
                          }}
                        >
                          {getEstadoTexto(pedido.estadoPedido.nombreEstado)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirDetallePedido(pedido)}
                            className="hover:opacity-80 transition-opacity"
                            title="Ver detalles"
                          >
                            <img
                              className="h-10 w-10"
                              src="/svg/DetallePreparacion.svg"
                              alt="Ver detalles"
                            />
                          </button>
                          
                          {pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.PREPARING && (
                            <button
                              onClick={() => pausar(pedido)}
                              className="hover:opacity-80 transition-opacity"
                              title="Pausar"
                            >
                               <img
                                className="h-10 w-10"
                                src="/img/EstadoEspera.png" 
                                alt="Pausar"
                              />
                            </button>
                          )}

                          <button
                            onClick={() => avanzar(pedido)}
                            className="hover:opacity-80 transition-opacity"
                            title="Avanzar"
                          >
                            <img
                              className="h-10 w-10"
                              src="/svg/EstadoPositivo.svg"
                              alt="Avanzar"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

            {/**Mensaje cuando no hay pedidos */}
            {pedidosMostrados.length === 0 && (
              <div className="text-3xl text-center py-10 text-gray-500 font-lato">
                No se encontraron pedidos con los filtros aplicados
              </div>
            )}

            {/**Paginacion */}
            {pedidosMostrados.length > 0 && (
              <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10 font-lato">
                {/**Informacion pedidos mostrados y totales */}
                <div className="h-10 flex items-center">
                  <h4>
                    {paginaSeleccionada * cantidadPorPagina -
                      cantidadPorPagina +
                      1}
                    -
                    {paginaSeleccionada * cantidadPorPagina <
                    pedidosMostrados.length
                      ? paginaSeleccionada * cantidadPorPagina
                      : pedidosMostrados.length}{" "}
                    de {pedidosMostrados.length}
                  </h4>
                </div>

                {/**Control de paginado a traves de botones */}
                <button onClick={() => setPaginaSeleccionada(1)}>
                  <img className="h-10" src="/svg/PrimeraPagina.svg" alt="" />
                </button>
                <button
                  onClick={() =>
                    setPaginaSeleccionada((prev) => {
                      if (paginaSeleccionada > 1) {
                        return prev - 1;
                      }
                      return prev;
                    })
                  }
                >
                  <img className="h-10" src="/svg/AnteriorPagina.svg" alt="" />
                </button>

                <button
                  onClick={() =>
                    setPaginaSeleccionada((prev) => {
                      if (
                        paginaSeleccionada <
                        Math.ceil(pedidosMostrados.length / cantidadPorPagina)
                      ) {
                        return prev + 1;
                      }
                      return prev;
                    })
                  }
                >
                  <img className="h-10" src="/svg/SiguientePagina.svg" alt="" />
                </button>

                <button
                  onClick={() =>
                    setPaginaSeleccionada(
                      Math.ceil(pedidosMostrados.length / cantidadPorPagina)
                    )
                  }
                >
                  <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalle del Pedido */}
      {pedidoSeleccionado && (
        <DetalleCocinero
          pedido={pedidoSeleccionado}
          isOpen={modalAbierto}
          onClose={cerrarModal}
        />
      )}
    </>
  );
}
