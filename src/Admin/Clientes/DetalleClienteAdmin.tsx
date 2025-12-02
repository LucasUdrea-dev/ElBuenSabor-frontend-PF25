import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  host,
  Usuario,
  Telefono,
  Direccion,
  Pedido,
  EstadosPedidosEnum,
} from "../../../ts/Clases";
const LogoUser = "/svg/LogoUser.svg";
const LogoDetalle = "/svg/LogoDetalle.svg";
const LogoFactura = "/svg/DetallePreparacion.svg";

interface Props {
  // Cliente del componente padre
  cliente: Usuario;
  isOpen: boolean;
  onClose: () => void;
}

const DetalleClienteAdmin: React.FC<Props> = ({ cliente, isOpen, onClose }) => {
  const [telefonos, setTelefonos] = useState<Telefono[]>([]);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(false);

  const API_BASE_URL = `${host}/api`;

  // Se ejecuta cuando se abre el modal o cambia el cliente
  // (evita que se muestren datos del cliente anterior)
  useEffect(() => {
    if (isOpen && cliente?.id) {
      setTelefonos([]);
      setDirecciones([]);
      setPedidos([]);
      cargarDetallesCliente(cliente.id);
    }
  }, [isOpen, cliente?.id]);

  // Carga los detalles del cliente: teléfonos, direcciones y pedidos
  const cargarDetallesCliente = async (clienteId: number) => {
    setCargando(true);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    try {
      // Direcciones del cliente
      const dirRes = await axios.get(
        `${API_BASE_URL}/Direccion/usuario/${clienteId}`,
        { headers }
      );
      const direccionesData = Array.isArray(dirRes.data) ? dirRes.data : [];
      console.log("Direcciones recibidas del servidor:", dirRes.data);
      setDirecciones(direccionesData);

      // Pedidos del cliente
      const pedidosRes = await axios.get(
        `${API_BASE_URL}/pedidos/usuario/${clienteId}`,
        { headers }
      );
      const pedidosData = Array.isArray(pedidosRes.data) ? pedidosRes.data : [];
      console.log("Pedidos recibidos del servidor:", pedidosRes.data);
      setPedidos(pedidosData);
    } catch (error: any) {
      console.error("Error al cargar detalles del cliente:", error);

      // Manejo de error de permisos
      if (error.response?.status === 403) {
        alert("No tienes permisos para acceder a estos datos.");
      }

      // En caso de error, resetear los estados
      setTelefonos([]);
      setDirecciones([]);
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  };

  // Formatea fecha
  const formatearFecha = (fecha: string | Date) => {
    if (!fecha) return "Fecha no disponible";
    try {
      const date =
        typeof fecha === "string"
          ? new Date(fecha + "T00:00:00")
          : new Date(fecha);
      return isNaN(date.getTime())
        ? "Fecha no disponible"
        : date.toLocaleDateString("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
    } catch {
      return "Fecha no disponible";
    }
  };

  // Formatea precio a moneda local
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(precio);
  };

  // Calcula el subtotal de un pedido sumando artículos y promociones
  const calcularSubtotal = (pedido: any) => {
    let total = 0;
    // Sumar artículos
    if (pedido.detallePedidoList) {
      total += pedido.detallePedidoList.reduce((acc: number, detalle: any) => {
        //acc = acumulador
        return acc + (detalle.articulo?.precio || 0) * detalle.cantidad;
      }, 0);
    }
    // Sumar promociones
    if (pedido.detallePromocionList) {
      total += pedido.detallePromocionList.reduce(
        (acc: number, detalle: any) => {
          return (
            acc + (detalle.promocion?.precioRebajado || 0) * detalle.cantidad
          );
        },
        0
      );
    }
    return total;
  };

  // Obtiene el ajuste por tipo de envío (10% adicional para DELIVERY)
  const obtenerAjustePorEnvio = (pedido: any) => {
    const subtotal = calcularSubtotal(pedido);
    if (pedido.tipoEnvio?.tipoDelivery === "DELIVERY") {
      return subtotal * 0.1; // 10% de aumento por delivery
    }
    return 0; // No hay aumento para TAKEAWAY
  };

  // Calcula el total del pedido (subtotal + ajuste por envío)
  const calcularTotal = (pedido: any) => {
    let total = calcularSubtotal(pedido);
    const ajuste = obtenerAjustePorEnvio(pedido);
    total += ajuste;
    return total;
  };

  // Traduccion del estado del pedido usando el enum
  const getEstadoTexto = (estado: EstadosPedidosEnum | string) => {
    const textos: Record<EstadosPedidosEnum, string> = {
      [EstadosPedidosEnum.INCOMING]: "Entrante",
      [EstadosPedidosEnum.STANDBY]: "En Espera",
      [EstadosPedidosEnum.PREPARING]: "En Preparación",
      [EstadosPedidosEnum.READY]: "Listo",
      [EstadosPedidosEnum.DELIVERING]: "En Camino",
      [EstadosPedidosEnum.DELIVERED]: "Entregado",
      [EstadosPedidosEnum.CANCELLED]: "Cancelado",
      [EstadosPedidosEnum.REJECTED]: "Rechazado",
    };
    return textos[estado as EstadosPedidosEnum] || estado;
  };

  // No renderizar nada si el modal está cerrado
  if (!isOpen) return null;

  console.log(
    "🔍 Modal renderizando - Direcciones en estado:",
    direcciones.length
  );

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 font-lato">
      <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/*  HEADER DEL MODAL  */}
        <div className="flex justify-between items-center bg-[#E9E9E9] rounded-t-2xl px-6 py-4 font-lato">
          <h2 className="text-3xl font-bold text-gray-800 font-lato">
            {cliente.nombre} {cliente.apellido}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold font-lato"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/*  CONTENIDO DEL MODAL  */}
        <div className="px-6 pb-6 space-y-6">
          {cargando ? (
            // Estado de carga
            <div className="text-center py-8 text-gray-500 font-lato">
              Cargando información del cliente...
            </div>
          ) : (
            <>
              {/*  INFORMACIÓN DEL CLIENTE  */}
              <div className="bg-gray-50 p-6 border border-gray-300 mt-4 font-lato">
                <h3 className="text-xl font-semibold mb-4 flex items-center font-lato">
                  <img src={LogoUser} alt="Cliente" className="mr-5 w-6 h-6" />
                  Cliente
                </h3>
                <p className="font-lato mt-2">
                  <strong>Email:</strong> {cliente.email}
                </p>

                {/* Estado del cliente (Activo/Inactivo) */}
                <p className="font-lato mt-2">
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded text-white font-lato ${
                      cliente.existe ? "bg-green-600" : "bg-gray-500"
                    }`}
                  >
                    {cliente.existe ? "Activo" : "Inactivo"}
                  </span>
                </p>

                {/* Teléfonos: prioriza los cargados dinámicamente, sino usa los del objeto cliente */}
                <p className="font-lato -ml-0.5 mt-2">
                  <strong>Teléfonos:</strong>{" "}
                  {telefonos.length > 0
                    ? telefonos.map((t) => t.numero).join(", ")
                    : cliente.telefonoList.length > 0
                    ? cliente.telefonoList.map((t) => t.numero).join(", ")
                    : "Sin teléfonos"}
                </p>
              </div>

              {/* DIRECCIONES */}
              <div className="bg-gray-50 p-6 border border-gray-300 font-lato">
                <h3 className="text-xl font-semibold mb-4 flex items-center font-lato">
                  <img
                    src={LogoDetalle}
                    alt="Direcciones"
                    className="mr-5 w-6 h-6"
                  />
                  Direcciones ({direcciones.length})
                </h3>
                {direcciones.length > 0 ? (
                  <ul className="space-y-4 font-lato">
                    {direcciones.map((d, index) => {
                      console.log(` Renderizando dirección ${index}:`, d);
                      return (
                        <li
                          key={d.id || index}
                          className="border-b pb-3 last:border-b-0 font-lato"
                        >
                          {/* Alias de la dirección */}
                          <p className="font-bold text-lg font-lato">
                            {d.alias || "Sin alias"}
                          </p>

                          {/* Calle y numeración */}
                          <p className="text-gray-700 font-lato">
                            {d.nombreCalle} {d.numeracion}
                          </p>

                          {/* Descripción de entrega (opcional) */}
                          {d.descripcionEntrega && (
                            <p className="text-gray-600 text-sm italic mt-1 font-lato">
                              {d.descripcionEntrega}
                            </p>
                          )}

                          {/* Ubicación geográfica Ciudad, Provincia, País */}
                          <p className="text-gray-600 text-sm mt-1 font-lato">
                            {d.ciudad?.nombre || "Sin ciudad"}
                            {d.ciudad?.provincia?.nombre &&
                              `, ${d.ciudad.provincia.nombre}`}
                            {d.ciudad?.provincia?.pais?.nombre &&
                              `, ${d.ciudad.provincia.pais.nombre}`}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 font-lato">
                    No hay direcciones registradas.
                  </p>
                )}
              </div>

              {/*  ÓRDENES/PEDIDOS  */}
              <div className="bg-gray-50 p-6 border border-gray-300 font-lato">
                <h3 className="text-xl font-semibold mb-4 flex items-center font-lato">
                  <img
                    src={LogoFactura}
                    alt="Órdenes"
                    className="mr-5 w-6 h-6"
                  />
                  Órdenes ({pedidos.length})
                </h3>

                {pedidos.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto font-lato">
                    {pedidos.map((pedido: any) => (
                      <div
                        key={pedido.id}
                        className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-colors bg-white font-lato"
                      >
                        {/* Encabezado del pedido: ID, fecha y estado */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-lg font-lato">
                              Pedido #{pedido.id}
                            </p>
                            <p className="text-sm text-gray-600 font-lato">
                              {formatearFecha(pedido.fecha)}
                            </p>
                          </div>

                          {/* Badge de estado del pedido */}
                          <span className="px-3 py-1 rounded-full text-white text-sm bg-gray-400 font-lato">
                            {getEstadoTexto(
                              pedido.estadoPedido?.nombreEstado ||
                                EstadosPedidosEnum.STANDBY
                            )}
                          </span>
                        </div>

                        {/* Grid con información del pedido */}
                        <div className="grid grid-cols-2 gap-2 text-sm mt-3 font-lato">
                          <p className="font-lato">
                            <strong>Total:</strong>{" "}
                            {formatearPrecio(calcularTotal(pedido))}
                          </p>
                          <p className="font-lato">
                            <strong>Tipo:</strong>{" "}
                            {pedido.tipoEnvio?.tipoDelivery == "TAKEAWAY"
                              ? "Retiro en local"
                              : "Delivery"}
                          </p>
                          <p className="font-lato">
                            <strong>Pago:</strong>{" "}
                            {pedido.tipoPago?.tipoPago == "CASH"
                              ? "Efectivo"
                              : "Mercado Pago"}
                          </p>
                          <p className="font-lato">
                            <strong>Sucursal:</strong>{" "}
                            {pedido.sucursal?.nombre || "N/A"}
                          </p>
                        </div>

                        {/* Dirección de entrega */}
                        {pedido.direccion?.direccion && (
                          <div className="mt-3 pt-3 border-t border-gray-200 font-lato">
                            <p className="text-sm text-gray-700 font-lato">
                              <strong>Dirección de entrega:</strong>
                            </p>
                            <p className="text-sm text-gray-600 font-lato">
                              {pedido.direccion.direccion.nombreCalle}{" "}
                              {pedido.direccion.direccion.numeracion}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 font-lato">
                    No hay órdenes registradas.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleClienteAdmin;
