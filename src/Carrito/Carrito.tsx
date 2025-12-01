import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CarritoContext } from "./CarritoContext";
import DetallePromocionCarrito from "./DetallePromocionCarrito";
import DetallePedidoCarrito from "./DetallePedidoCarrito";
import SeleccionarDireccionCarrito from "./SeleccionarDireccionCarrito";
import DetallePagoCarrito from "./DetallePagoCarrito";

interface Props {
  mostrarCarrito: boolean;
  cerrarCarrito: () => void;
}

export default function Carrito({ mostrarCarrito, cerrarCarrito }: Props) {
  const [mostrarSeleccionarDireccion, setMostrarSeleccionarDireccion] =
    useState(false);
  const [detallePago, setDetallePago] = useState(false);

  const carritoContext = useContext(CarritoContext);

  if (carritoContext === undefined) {
    return <p>CartProvider no encontrado.</p>;
  }

  const {
    pedido,
    paraDelivery,
    paraRetirar,
    calcularPrecioTotal,
    vaciarPedido,
  } = carritoContext;

  const cerrarSeleccionarDireccion = () => {
    setMostrarSeleccionarDireccion(false);
  };

  const cerrarDetallePago = () => {
    setDetallePago(false);
  };

  const botonContinuar = () => {
    if (pedido.tipoEnvio.tipoDelivery == "DELIVERY") {
      if (pedido.direccionPedido?.direccion.id) {
        setDetallePago(true);
      }
    } else {
      setDetallePago(true);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mostrarCarrito ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={cerrarCarrito}
      />

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
                ${mostrarCarrito ? "translate-x-0" : "translate-x-full"}
                w-full md:w-[400px] flex flex-col`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
          <button
            onClick={cerrarCarrito}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img
              className="w-6 h-6"
              src="/svg/AnteriorPagina.svg"
              alt="Volver"
            />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Mi Pedido</h1>
          <div className="w-10"></div>
        </div>

        {/* Productos y promociones*/}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {pedido.detallePedidoList?.length < 1 &&
          pedido.detallePromocionList.length < 1 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <img
                  src="/svg/relojCarrito.svg"
                  className="w-12 h-12 opacity-50"
                  alt="Empty"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-600">
                Tu carrito está vacío
              </h3>
              <Link
                className="px-6 py-2 bg-[#D93F21] text-white rounded-full hover:bg-[#b9331b] transition-colors shadow-md font-semibold"
                to={"/catalogo"}
                onClick={cerrarCarrito}
              >
                Ir al catálogo
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pedido.detallePromocionList?.map((detalle) => (
                <DetallePromocionCarrito
                  key={detalle.promocion.id}
                  detallePromocion={detalle}
                />
              ))}
              {pedido.detallePedidoList?.map((detalle) => (
                <DetallePedidoCarrito
                  key={detalle.articulo?.id}
                  detallePedido={detalle}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer de carrito*/}
        {(pedido.detallePedidoList?.length > 0 ||
          pedido.detallePromocionList?.length > 0) && (
          <div className="p-4 border-t border-gray-200 bg-white shrink-0 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {/* Delivery / Takeaway Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => paraRetirar()}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pedido.tipoEnvio?.tipoDelivery == "TAKEAWAY"
                    ? "bg-white text-[#D93F21] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <img
                  src="/svg/enTienda.svg"
                  className={`w-5 h-5 ${
                    pedido.tipoEnvio?.tipoDelivery == "TAKEAWAY"
                      ? ""
                      : "grayscale opacity-70"
                  }`}
                  alt=""
                />
                <span>Retiro</span>
              </button>
              <button
                onClick={() => paraDelivery()}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pedido.tipoEnvio?.tipoDelivery == "DELIVERY"
                    ? "bg-white text-[#D93F21] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <img
                  src="/svg/delivery.svg"
                  className={`w-5 h-5 ${
                    pedido.tipoEnvio?.tipoDelivery == "DELIVERY"
                      ? ""
                      : "grayscale opacity-70"
                  }`}
                  alt=""
                />
                <span>Delivery</span>
              </button>
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              {/* Time */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <img src="/svg/relojCarrito.svg" className="w-5 h-5" alt="" />
                  <span>Tiempo estimado</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {new Date(
                    new Date().getTime() +
                      Number(pedido.tiempoEstimado) * 60 * 1000
                  )
                    .toLocaleTimeString()
                    .slice(0, 5)}{" "}
                  hs
                </span>
              </div>

              {/* Address (Only for Delivery) */}
              {pedido.tipoEnvio?.tipoDelivery == "DELIVERY" && (
                <div className="flex items-start justify-between text-sm gap-2">
                  <div className="flex items-start gap-2 text-gray-600 overflow-hidden">
                    <img
                      src="/svg/logoUbicacionCarrito.svg"
                      className="w-5 h-5 mt-0.5"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span className="truncate leading-tight">
                        {pedido.direccionPedido?.direccion.id ? (
                          `${pedido.direccionPedido.direccion.nombreCalle} ${pedido.direccionPedido.direccion.numeracion}, ${pedido.direccionPedido.direccion.ciudad?.nombre}`
                        ) : (
                          <span className="text-red-500 font-medium">
                            Selecciona una dirección
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMostrarSeleccionarDireccion(true)}
                    className="text-[#D93F21] font-medium text-xs whitespace-nowrap hover:underline"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 pt-3 space-y-1">
              {pedido.tipoEnvio?.tipoDelivery == "DELIVERY" && (
                <>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>${calcularPrecioTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Envío (10%)</span>
                    <span>${(calcularPrecioTotal() * 0.1).toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center text-xl font-bold text-gray-800 pt-1">
                <span>Total</span>
                <span>
                  $
                  {pedido.tipoEnvio?.tipoDelivery == "DELIVERY"
                    ? (calcularPrecioTotal() * 1.1).toFixed(2)
                    : calcularPrecioTotal()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => vaciarPedido()}
                className="py-2.5 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => botonContinuar()}
                disabled={
                  pedido.tipoEnvio?.tipoDelivery === "DELIVERY" &&
                  !pedido.direccionPedido?.direccion.id
                }
                className={`py-2.5 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-200 ${
                  pedido.tipoEnvio?.tipoDelivery === "DELIVERY" &&
                  !pedido.direccionPedido?.direccion.id
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#D93F21] hover:bg-[#b9331b]"
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>

      <SeleccionarDireccionCarrito
        isOpen={mostrarSeleccionarDireccion}
        cerrarModal={cerrarSeleccionarDireccion}
      />
      <DetallePagoCarrito
        isOpen={detallePago}
        cerrarModal={cerrarDetallePago}
        cerrarCarrito={cerrarCarrito}
      />
    </>
  );
}
