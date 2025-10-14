import { useState } from "react";

export default function CajeroRecibido({ pedido, onClose }: any) {
  const [activeTab, setActiveTab] = useState<"detalles" | "productos" | "factura">("detalles");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 font-lato">
      <div className="bg-[#f9f9f9] rounded-2xl w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl relative text-gray-800 font-lato">
        
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-gray-400 hover:text-gray-600 text-2xl font-lato"
        >
          ×
        </button>

        {/* Encabezado */}
        <div className="bg-[#f3f3f3] rounded-t-2xl px-6 py-3 border-b border-gray-300 font-lato">
          <h2 className="text-xl font-semibold tracking-wide">Orden {pedido.id.toLocaleString("es-AR")}</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 px-6 bg-white font-lato">
          {["detalles", "productos", "factura"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 px-6 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              } font-lato`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="p-6 text-sm font-lato">
          {activeTab === "detalles" && (
            <div className="space-y-5 font-lato">
              {/* Cliente */}
              <div>
                <h3 className="font-semibold text-base mb-2">Cliente</h3>
                <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm">
                  <p><strong>Nombre:</strong> {pedido.usuario?.nombre} {pedido.usuario?.apellido}</p>
                  <p><strong>Email:</strong> {pedido.usuario?.email}</p>
                  <p><strong>Teléfono:</strong> +54 (no disponible)</p>
                </div>
              </div>

              {/* Envío */}
              <div>
                <h3 className="font-semibold text-base mb-2">Envío</h3>
                <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm space-y-2">
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {pedido.sucursal?.direccion
                      ? `${pedido.sucursal.direccion.nombreCalle} ${pedido.sucursal.direccion.numeracion}, Mendoza`
                      : "Sin dirección"}
                  </p>

                  {/* Mapa simulado */}
                  <div className="w-full h-48 bg-[#1e1e1e] rounded-lg flex items-center justify-center text-gray-300 text-xs italic font-lato">
                    Mapa de ubicación
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div>
                <h3 className="font-semibold text-base mb-2">Estado de la orden</h3>
                <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        pedido.estadoPedido?.nombreEstado === "Pendiente"
                          ? "bg-yellow-500"
                          : pedido.estadoPedido?.nombreEstado === "En proceso"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      } font-lato`}
                    >
                      {pedido.estadoPedido?.nombreEstado}
                    </span>
                    <span className="text-gray-500 text-xs font-lato">{pedido.fecha}</span>
                  </div>
                </div>
              </div>

              {/* Pago */}
              <div>
                <h3 className="font-semibold text-base mb-2">Pago</h3>
                <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm">
                  <p><strong>Método de pago:</strong> {pedido.tipoPago?.tipoPago}</p>
                  <p>
                    <strong>Monto:</strong> $
                    {pedido.detallePedidoList
                      ?.reduce(
                        (acc: number, d: any) => acc + d.cantidad * d.articulo.precio,
                        0
                      )
                      .toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "productos" && (
            <div className="space-y-4 font-lato">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base mb-3">Aclaraciones del Cliente</h3>
                <input
                  type="text"
                  disabled
                  value="Este pedido no tiene aclaraciones..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600 text-sm font-lato"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-base px-4 py-3 border-b border-gray-200 font-lato">
                  Detalle
                </h3>
                <table className="w-full text-sm text-left font-lato">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Imagen</th>
                      <th className="p-3">Denominación</th>
                      <th className="p-3">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.detallePedidoList?.map((item: any) => (
                      <tr key={item.id} className="border-t font-lato">
                        <td className="p-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                            <img
                              src={`/${item.articulo.imagenArticulo}`}
                              alt={item.articulo.nombre}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </td>
                        <td className="p-3">{item.articulo.nombre}</td>
                        <td className="p-3">{item.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "factura" && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 font-lato">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500">{pedido.fecha}</p>
                  <p className="font-semibold">
                    FACTURA {pedido.id} – {pedido.usuario?.nombre} {pedido.usuario?.apellido}
                  </p>
                  <p>{pedido.usuario?.email}</p>
                </div>
                <div className="text-right text-gray-500 text-xs">
                  <p>EL BUEN SABOR</p>
                  <p>Mendoza, Argentina</p>
                  <p>+54 261 458 7434</p>
                  <p>elbuen.sabor@correo.com</p>
                </div>
              </div>

              <table className="w-full text-sm text-left border-t border-b border-gray-300 font-lato">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Producto</th>
                    <th className="p-3 text-right">Precio</th>
                    <th className="p-3 text-center">Cantidad</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.detallePedidoList?.map((item: any) => (
                    <tr key={item.id} className="border-t font-lato">
                      <td className="p-3">{item.articulo.nombre}</td>
                      <td className="p-3 text-right">
                        ${item.articulo.precio.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">{item.cantidad}</td>
                      <td className="p-3 text-right">
                        ${(item.cantidad * item.articulo.precio).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right text-sm space-y-1 font-lato">
                <p>Subtotal: <strong>$480</strong></p>
                <p>Descuento por retirar en sucursal: <strong className="text-red-500">-$48</strong></p>
                <p className="text-base font-semibold">TOTAL: $432</p>
              </div>

              <p className="text-xs text-gray-500 mt-4 border-t pt-3 font-lato">
                Gracias por su compra. Esta factura es válida como comprobante de compra.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
