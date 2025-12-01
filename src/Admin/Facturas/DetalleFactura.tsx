import React, { useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import {
  DetallePedido,
  DetallePromocion,
  EstadosPedidosEnum,
  Pedido,
} from "../../../ts/Clases";

interface DetalleFacturaProps {
  pedido: Pedido;
  isOpen: boolean;
  onClose: () => void;
}

const DetalleFactura: React.FC<DetalleFacturaProps> = ({
  pedido,
  isOpen,
  onClose,
}) => {
  const facturaRef = useRef<HTMLDivElement>(null);

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Función para formatear fecha y hora
  const formatearFechaHora = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha
      .toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(
        /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/,
        "$3/$2/$1 $4:$5:$6"
      );
  };

  // Función para formatear monto
  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(monto);
  };

  const calcularSubtotal = () => {
    let total = 0;

    // Sumar artículos
    if (pedido.detallePedidoList) {
      total += pedido.detallePedidoList.reduce((acc, detalle) => {
        return acc + (detalle.articulo?.precio || 0) * detalle.cantidad;
      }, 0);
    }

    // Sumar promociones
    if (pedido.detallePromocionList) {
      total += pedido.detallePromocionList.reduce((acc, detalle) => {
        return acc + (detalle.promocion.precioRebajado || 0) * detalle.cantidad;
      }, 0);
    }

    return total;
  };

  // Calcula el ajuste de precio según el tipo de envío (monto absoluto)
  const obtenerAjustePorEnvio = () => {
    const subtotal = calcularSubtotal();
    if (pedido.tipoEnvio.tipoDelivery === "DELIVERY") {
      return subtotal * 0.1; // 10% de aumento por delivery
    }
    return 0; // No hay descuento ni aumento para TAKEAWAY
  };

  const calcularTotal = () => {
    let total = calcularSubtotal();
    const ajuste = obtenerAjustePorEnvio();

    total += ajuste;
    return total;
  };

  const handleDownloadPDF = async () => {
    if (!facturaRef.current) return;

    try {
      const dataUrl = await toPng(facturaRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProperties = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = imgProperties.width;
      const imgHeight = imgProperties.height;

      // Calcular la altura proporcional para que la imagen ocupe el ancho del PDF
      const ratio = pdfWidth / imgWidth;
      const imgHeightInPdf = imgHeight * ratio;

      let heightLeft = imgHeightInPdf;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, imgHeightInPdf);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeightInPdf;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, imgHeightInPdf);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Factura-${pedido.id}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  // Función para manejar el clic en el overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-lato"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Orden #{pedido.id}
          </h2>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors text-sm font-bold mr-2"
            >
              Descargar PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold ml-4"
            >
              X
            </button>
          </div>
        </div>

        {/* Contenido del Modal - Con scroll interno */}
        <div
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]"
          ref={facturaRef}
        >
          {/* Fecha y Datos del Cliente */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="mb-3">
              <span className="text-gray-600 font-medium">
                {formatearFechaHora(pedido.fecha)}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <p>
                <strong>FACTURA #{pedido.id}</strong>
              </p>{" "}
              {/* Usamos ID pedido como nro factura provisional */}
              <p>
                {pedido.usuario.nombre} {pedido.usuario.apellido}
              </p>
              <p>{pedido.usuario.email}</p>
              {/* Mostrar teléfono si está disponible */}
              {pedido.usuario.telefonoList &&
                pedido.usuario.telefonoList.length > 0 && (
                  <p>{pedido.usuario.telefonoList[0].numero}</p>
                )}
            </div>
          </div>

          {/* Datos del Local */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
            <div className="mr-4">
              <img
                src="/svg/LogoElBuenSabor.svg"
                alt="Logo El Buen Sabor"
                className="w-16 h-16"
              />
            </div>
            <div className="text-sm text-gray-700">
              <p>
                <strong>EL BUEN SABOR</strong>
              </p>
              <p>San Martín 54, Mendoza, Mendoza. 5500</p>
              <p>+54-9 2614587434</p>
              <p>www.elbuensabor.com</p>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Producto
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-700">
                    Precio
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-700">
                    Cantidad
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Artículos */}
                {pedido.detallePedidoList &&
                  pedido.detallePedidoList.map(
                    (detalle: DetallePedido, index: number) => (
                      <tr key={`art-${index}`} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-800">
                          {detalle.articulo?.nombre}
                        </td>
                        <td className="p-3 text-center text-gray-700">
                          {formatearMonto(detalle.articulo?.precio || 0)}
                        </td>
                        <td className="p-3 text-center text-gray-700">
                          {detalle.cantidad}
                        </td>
                        <td className="p-3 text-right text-gray-800 font-medium">
                          {formatearMonto(
                            (detalle.articulo?.precio || 0) * detalle.cantidad
                          )}
                        </td>
                      </tr>
                    )
                  )}

                {/* Promociones */}
                {pedido.detallePromocionList &&
                  pedido.detallePromocionList.map(
                    (detalle: DetallePromocion, index: number) => (
                      <tr key={`prom-${index}`} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-800">
                          {detalle.promocion.denominacion} (Promo)
                        </td>
                        <td className="p-3 text-center text-gray-700">
                          {formatearMonto(detalle.promocion.precioRebajado)}
                        </td>
                        <td className="p-3 text-center text-gray-700">
                          {detalle.cantidad}
                        </td>
                        <td className="p-3 text-right text-gray-800 font-medium">
                          {formatearMonto(
                            detalle.promocion.precioRebajado * detalle.cantidad
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium">
                {formatearMonto(calcularSubtotal())}
              </span>
            </div>
            {obtenerAjustePorEnvio() > 0 && ( // Solo mostrar si hay un ajuste (es decir, para DELIVERY)
              <div className="flex justify-between items-center mb-2 text-green-600">
                {" "}
                {/* Siempre verde para un cargo positivo */}
                <span>Cargo por Delivery</span>
                <span>+{formatearMonto(obtenerAjustePorEnvio())}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>TOTAL</span>
              <span>{formatearMonto(calcularTotal())}</span>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Método de pago:</strong>{" "}
              {pedido.tipoPago.tipoPago == "CASH" ? "Efectivo" : "Mercado Pago"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Tipo de envío:</strong>{" "}
              {pedido.tipoEnvio.tipoDelivery == "TAKEAWAY"
                ? "Retiro en sucursal"
                : "Delivery"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Estado:</strong>{" "}
              {pedido.estadoPedido.nombreEstado == EstadosPedidosEnum.DELIVERED
                ? "Completada"
                : "Anulado"}
            </p>
          </div>

          {/* Mensaje de agradecimiento */}
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Gracias por su compra</strong>
            </p>
            <p className="text-xs text-gray-600">
              Esta factura es válida como comprobante de compra. Ante cualquier
              duda o error, comuníquese con atención al cliente dentro de las 24
              horas. Gracias por confiar en nosotros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleFactura;