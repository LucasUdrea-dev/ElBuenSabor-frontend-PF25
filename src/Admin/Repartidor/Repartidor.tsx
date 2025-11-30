import { useEffect, useState } from "react";
import {
  axiosConfig,
  EstadosPedidosEnum,
  host,
  Pedido,
} from "../../../ts/Clases";
import axios from "axios";
import { usePedidosSocket } from "../../services/websocket/usePedidosSocket";
import DetalleRepartidor from "./DetalleRepartidor";

const ESTADOS_REPARTIDOR = [EstadosPedidosEnum.DELIVERING];

export default function Repartidor() {
  const { pedidos, setPedidos } = usePedidosSocket(
    "/topic/dashboard/delivery",
    ESTADOS_REPARTIDOR
  );

  const [pedidosMostrados, setPedidosMostrados] = useState<Pedido[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);

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
          ESTADOS_REPARTIDOR.includes(pedido.estadoPedido.nombreEstado)
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

      // Si el nuevo estado no está en la lista de observados, lo removemos localmente
      if (!ESTADOS_REPARTIDOR.includes(nuevoEstado)) {
        setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
      }
    } catch (error) {
      alert("Error al cambiar el estado del pedido");
    }
  };

  const avanzar = (pedido: Pedido) => {
    if (pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERING) {
      return cambiarEstadoPedido(pedido, EstadosPedidosEnum.DELIVERED);
    }
  };

  const enEspera = (pedido: Pedido) => {
    if (pedido.estadoPedido.nombreEstado === EstadosPedidosEnum.DELIVERING) {
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
  }, [pedidos, buscador]);

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "DELIVERING":
        return "En Camino";
      case "DELIVERED":
        return "Entregado";
      default:
        return estado;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "DELIVERING":
        return "#D93F21";
      default:
        return "#878787";
    }
  };

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-4 md:py-10 font-['Lato']">
        {/**Contenedor Principal */}
        <div className="bg-white w-11/12 md:w-11/12 m-auto rounded-2xl overflow-hidden">
          {/**Titulo y buscador */}
          <div className="flex flex-col md:flex-row justify-between p-4 md:p-6 gap-4 items-center border-b border-gray-200 md:border-none">
            <h1 className="text-2xl md:text-4xl font-lato font-bold text-gray-800">
              Repartidor
            </h1>

            <div className="w-full md:w-auto flex justify-center md:justify-end">
              {/**Buscador con icono */}
              <div className="relative w-full md:w-auto max-w-xs">
                <input
                  onChange={(e) => setBuscador(e.target.value)}
                  className="bg-[#878787] text-white pl-10 pr-4 py-2 rounded-full font-lato w-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Buscar cliente..."
                  type="text"
                />
                <img
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  src="/svg/LupaBuscador.svg"
                  alt="Buscar"
                />
              </div>
            </div>
          </div>

          {/**Lista de Pedidos */}
          <div className="w-full pb-10 px-4 md:px-0">
            {/**Cabecera (Solo visible en Desktop) */}
            <div className="hidden md:grid grid-cols-5 gap-4 p-5 border-b border-gray-200 text-center font-bold text-lg text-gray-700">
              <div>Orden N°</div>
              <div>Cliente</div>
              <div>Dirección</div>
              <div>Teléfono</div>
              <div>Acciones</div>
            </div>

            {/**Pedidos */}
            <div className="flex flex-col gap-4 md:gap-0">
              {pedidosMostrados.length > 0 ? (
                pedidosMostrados.map((pedido, index) => {
                  if (
                    index < paginaSeleccionada * cantidadPorPagina &&
                    index >= cantidadPorPagina * (paginaSeleccionada - 1)
                  ) {
                    return (
                      <div
                        key={pedido.id}
                        className="
                          flex flex-col md:grid md:grid-cols-5 md:gap-4 
                          bg-gray-50 md:bg-white p-4 md:p-5 
                          rounded-xl md:rounded-none shadow-sm md:shadow-none
                          border border-gray-200 md:border-b md:border-x-0 md:border-t-0
                          items-center text-center md:text-center
                        "
                      >
                        {/* Móvil: Encabezado de tarjeta */}
                        <div className="md:hidden w-full flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-600">Orden #{pedido.id}</span>
                          <span 
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: getColorEstado(pedido.estadoPedido.nombreEstado) }}
                          >
                            {getEstadoTexto(pedido.estadoPedido.nombreEstado)}
                          </span>
                        </div>

                        {/* Desktop: ID */}
                        <div className="hidden md:flex items-center justify-center">
                          <h3 className="font-normal text-gray-800 text-lg">{pedido.id}</h3>
                        </div>

                        {/* Cliente */}
                        <div className="w-full md:w-auto flex md:items-center md:justify-center mb-2 md:mb-0">
                          <div className="md:hidden font-semibold mr-2">Cliente:</div>
                          <h3 className="text-base md:text-lg truncate">
                            {pedido.usuario.nombre} {pedido.usuario.apellido}
                          </h3>
                        </div>

                        {/* Dirección */}
                        <div className="w-full md:w-auto flex md:items-center md:justify-center mb-2 md:mb-0">
                           <div className="md:hidden font-semibold mr-2">Dirección:</div>
                          <h3 className="text-base md:text-lg truncate">
                            {pedido.direccionPedido?.direccion.nombreCalle} {pedido.direccionPedido?.direccion.numeracion}
                          </h3>
                        </div>

                         {/* Teléfono */}
                         <div className="w-full md:w-auto flex md:items-center md:justify-center mb-4 md:mb-0">
                           <div className="md:hidden font-semibold mr-2">Teléfono:</div>
                           <h3 className="text-base md:text-lg">
                              {pedido.usuario.telefonoList?.[0]?.numero || "-"}
                           </h3>
                        </div>

                        {/* Estado (Desktop) y Acciones */}
                        <div className="w-full md:w-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
                          {/* Estado Badge (Solo Desktop) */}
                          <div
                            className={`hidden md:flex text-white px-4 py-1 rounded-full text-base items-center justify-center`}
                            style={{
                              minWidth: "100px",
                              backgroundColor: getColorEstado(pedido.estadoPedido.nombreEstado),
                            }}
                          >
                            {getEstadoTexto(pedido.estadoPedido.nombreEstado)}
                          </div>

                          {/* Botones de Acción */}
                          <div className="flex gap-4 md:gap-2 w-full md:w-auto justify-around md:justify-center mt-2 md:mt-0">
                            <button
                              onClick={() => abrirDetallePedido(pedido)}
                              className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                              title="Ver detalles y mapa"
                            >
                              <img
                                className="h-6 w-6 md:h-8 md:w-8"
                                src="/svg/DetallePreparacion.svg"
                                alt="Ver detalles"
                              />
                            </button>

                            <button
                              onClick={() => enEspera(pedido)}
                              className="p-2 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors"
                              title="Poner en espera"
                            >
                              <img
                                className="h-6 w-6 md:h-8 md:w-8"
                                src="/img/EstadoEspera.png"
                                alt="En Espera"
                              />
                            </button>

                            <button
                              onClick={() => avanzar(pedido)}
                              className="p-2 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                              title="Marcar como Entregado"
                            >
                              <img
                                className="h-6 w-6 md:h-8 md:w-8"
                                src="/svg/EstadoPositivo.svg"
                                alt="Entregado"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="text-xl text-center py-10 text-gray-500 font-lato">
                  No hay pedidos en camino
                </div>
              )}
            </div>

            {/**Paginacion */}
            {pedidosMostrados.length > 0 && (
              <div className="text-gray-500 flex flex-col md:flex-row items-center pt-6 md:pt-10 md:pr-20 justify-center md:justify-end gap-4 text-lg font-lato">
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

                <div className="flex gap-2">
                  <button 
                    onClick={() => setPaginaSeleccionada(1)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img className="h-8" src="/svg/PrimeraPagina.svg" alt="Inicio" />
                  </button>
                  <button
                    onClick={() =>
                      setPaginaSeleccionada((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img className="h-8" src="/svg/AnteriorPagina.svg" alt="Anterior" />
                  </button>
                  <button
                    onClick={() =>
                      setPaginaSeleccionada((prev) =>
                        prev < Math.ceil(pedidosMostrados.length / cantidadPorPagina)
                          ? prev + 1
                          : prev
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img className="h-8" src="/svg/SiguientePagina.svg" alt="Siguiente" />
                  </button>
                  <button
                    onClick={() =>
                      setPaginaSeleccionada(
                        Math.ceil(pedidosMostrados.length / cantidadPorPagina)
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img className="h-8" src="/svg/UltimaPagina.svg" alt="Fin" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalle del Pedido */}
      {pedidoSeleccionado && (
        <DetalleRepartidor
          pedido={pedidoSeleccionado}
          isOpen={modalAbierto}
          onClose={cerrarModal}
        />
      )}
    </>
  );
}
