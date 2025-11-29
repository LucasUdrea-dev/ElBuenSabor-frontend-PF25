import { useContext, useEffect, useState, useRef } from "react";
import { CarritoContext } from "./CarritoContext";
import { axiosConfig, host, Pedido } from "../../ts/Clases";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function OrdenRecibida() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const carritoContext = useContext(CarritoContext);
  const navigate = useNavigate();

  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pedidoGuardadoRef = useRef(false);

  if (carritoContext === undefined) {
    return <p>CarritoProvider no encontrado</p>;
  }

  const { pedido, vaciarPedido } = carritoContext;

  const reiniciarCarrito = () => {
    vaciarPedido();
  };

  useEffect(() => {
    const procesarYGuardarPedido = async () => {
      if (pedidoGuardadoRef.current) {
        console.log("El pedido ya fue procesado.");
        return;
      }

      if (!pedido || !pedido.sucursal.id || !pedido.usuario.id) {
        console.log(
          "Datos del pedido incompletos. No se puede guardar.",
          pedido
        );
        setError(
          "Los datos del pedido están incompletos. Por favor, intente de nuevo."
        );
        return;
      }

      const esMercadoPago = pedido.tipoPago.tipoPago === "MERCADOPAGO";
      const esAprobado = status === "approved";

      if (esMercadoPago && !esAprobado) {
        console.log(`Pago con MercadoPago no aprobado. Estado: ${status}`);
        setError(`El pago con MercadoPago no fue aprobado. Estado: ${status}`);
        return;
      }

      try {
        const pedidoParaGuardar = { ...pedido };
        pedidoParaGuardar.fecha = new Date().toISOString();

        if (pedidoParaGuardar.tipoEnvio.tipoDelivery !== "DELIVERY") {
          delete pedidoParaGuardar.direccionPedido;
        }

        const urlPost = `${host}/api/pedidos`;
        const response = await axios.post(
          urlPost,
          pedidoParaGuardar,
          axiosConfig
        );
        const pedidoGuardado = response.data;

        pedidoGuardadoRef.current = true;

        const urlGet = `${host}/api/pedidos/${pedidoGuardado.id}`;
        const responsePedidoConfirmado = await axios.get(urlGet, axiosConfig);

        setPedidoConfirmado(responsePedidoConfirmado.data);
        setGuardado(true);
        reiniciarCarrito();
      } catch (err: any) {
        console.error("Hubo un error al guardar el pedido:", err);
        const apiError = err.response?.data?.error;
        setError(
          apiError ||
            "No se pudo procesar su orden. Por favor, contacte a soporte."
        );
      }
    };

    procesarYGuardarPedido();
  }, [pedido, status, navigate, vaciarPedido]);

  const calcularPrecioTotalPedidoConfirmado = () => {
    let precioTotal = 0;

    if (!pedidoConfirmado) return 0;

    for (const detalle of pedidoConfirmado.detallePedidoList) {
      precioTotal =
        precioTotal +
        (detalle.articulo ? detalle.articulo.precio : 0) * detalle.cantidad;
    }

    for (const detalle of pedidoConfirmado.detallePromocionList) {
      precioTotal =
        precioTotal + detalle.promocion.precioRebajado * detalle.cantidad;
    }

    return precioTotal;
  };

  if (!guardado) {
    if (error) {
      return (
        <div className="bg-[#333333] h-screen w-full flex items-center justify-center">
          <div className="bg-white p-10 rounded-xl text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error en la Orden
            </h1>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => navigate("/catalogo")}
              className="mt-6 bg-[#D93F21] text-white p-2 w-1/2 rounded"
            >
              Volver al Catálogo
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-[#333333] h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!pedidoConfirmado) {
    return (
      <div className="bg-[#333333] h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#333333] h-full w-full py-40">
        <div className="bg-white rounded-2xl m-auto w-2/3 max-w-2xl">
          <div className="flex flex-col gap-5 p-10">
            <div className="text-2xl font-bold">
              <h1>Orden Recibida</h1>
            </div>

            {/**Detalles de entrega */}
            <div>
              <h2 className="text-xl font-bold">Detalles de entrega:</h2>
              <h3>
                Su pedido{" "}
                {pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY"
                  ? "llegara"
                  : "estara listo"}{" "}
                aproximadamente a las{" "}
                {new Date(
                  new Date().getTime() +
                    Number(pedidoConfirmado.tiempoEstimado) * 60 * 1000
                )
                  .toLocaleTimeString()
                  .slice(0, 5)}
              </h3>
              <h3>
                {pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY"
                  ? `Envio a domicilio: ${pedidoConfirmado.direccionPedido?.direccion.nombreCalle} ${pedidoConfirmado.direccionPedido?.direccion.numeracion}, ${pedidoConfirmado.direccionPedido?.direccion.ciudad.nombre}`
                  : `Retiro en local: ${pedidoConfirmado.sucursal.direccion?.nombreCalle} ${pedidoConfirmado.sucursal.direccion?.numeracion}, ${pedidoConfirmado.sucursal.direccion?.ciudad.nombre}`}
              </h3>
            </div>

            <div className="opacity-40">
              <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                <h1>Fecha</h1>
                <h1>Total</h1>
                <h1>Forma de pago</h1>
              </div>
              <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                <h1>{pedidoConfirmado.fecha}</h1>
                <h1>
                  $
                  {calcularPrecioTotalPedidoConfirmado() +
                    (pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY"
                      ? (calcularPrecioTotalPedidoConfirmado() * 10) / 100
                      : 0)}
                </h1>
                <h1>
                  {pedidoConfirmado.tipoPago.tipoPago == "CASH"
                    ? "Efectivo"
                    : "Mercado Pago"}
                </h1>
              </div>
            </div>

            {/**Detalles de la orden */}
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold">Detalles de la orden</h2>
              </div>
              <div className="opacity-40">
                <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                  <h1>Denominacion</h1>
                  <h1 className="text-center">Cantidad</h1>
                  <h1 className="text-center">Total</h1>
                </div>

                {pedidoConfirmado.detallePedidoList.map((detalle) => (
                  <div
                    key={detalle.articulo?.id}
                    className="grid grid-cols-3 items-center border-1 py-2 px-5"
                  >
                    <h1>{detalle.articulo?.nombre}</h1>
                    <h1 className="text-center">{detalle.cantidad}</h1>
                    <h1 className="text-center">
                      {detalle.cantidad *
                        (detalle.articulo ? detalle.articulo.precio : 0)}
                    </h1>
                  </div>
                ))}
                {pedidoConfirmado.detallePromocionList.map((detalle) => (
                  <div
                    key={detalle.promocion.id}
                    className="grid grid-cols-3 items-center border-1 py-2 px-5"
                  >
                    <h1>{detalle.promocion.denominacion}</h1>
                    <h1 className="text-center">{detalle.cantidad}</h1>
                    <h1 className="text-center">
                      ${detalle.cantidad * detalle.promocion.precioRebajado}
                    </h1>
                  </div>
                ))}

                {/**Se muestra el costo del envio
                 * si el pedido es delivery
                 */}
                {pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY" && (
                  <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                    <h1>10% Delivery</h1>
                    <h1></h1>
                    <h1 className="text-center">
                      ${(calcularPrecioTotalPedidoConfirmado() * 10) / 100}
                    </h1>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (guardado) {
                    navigate("/catalogo");
                  }
                }}
                className="bg-[#D93F21] text-white p-2 w-1/3"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
