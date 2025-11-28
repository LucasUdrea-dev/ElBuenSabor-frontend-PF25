import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";  // ✅ IMPORTANTE PARA QUE SE VEA EL MAPA

export default function CajeroRecibido({ pedido, onClose }: any) {
  const [activeTab, setActiveTab] = useState<"detalles" | "productos" | "factura">("detalles");

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

  // ---------------------------------------------------
  // 🗺️ GEOCODIFICAR DIRECCIÓN → OBTENER LAT/LON
  // ---------------------------------------------------
  useEffect(() => {
    if (!pedido?.sucursal?.direccion) return;

    const direccion = `${pedido.sucursal.direccion.nombreCalle} ${pedido.sucursal.direccion.numeracion}, Mendoza`;

    const encoded = encodeURIComponent(direccion);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) return;

        const { lat, lon } = data[0];

        // Si el mapa aún no está creado → crearlo
        if (mapRef.current && !leafletMapRef.current) {
          leafletMapRef.current = L.map(mapRef.current).setView([lat, lon], 16);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
          }).addTo(leafletMapRef.current);

          // Marker
          L.marker([lat, lon]).addTo(leafletMapRef.current)
            .bindPopup(direccion)
            .openPopup();
        }
      })
      .catch(() => console.log("No se pudo geocodificar la dirección"));
  }, [pedido]);
  

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
          <h2 className="text-xl font-semibold tracking-wide">
            Orden {pedido.id.toLocaleString("es-AR")}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 px-6 bg-white font-lato">
          {["detalles"].map((tab) => (
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
                <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm space-y-3">

                  <p>
                    <strong>Dirección:</strong>{" "}
                    {pedido.sucursal?.direccion
                      ? `${pedido.sucursal.direccion.nombreCalle} ${pedido.sucursal.direccion.numeracion}, Mendoza`
                      : "Sin dirección"}
                  </p>

                  {/* 🗺️ Mapa Leaflet */}
                  <div
                    ref={mapRef}
                    className="w-full h-56 rounded-lg shadow border border-gray-300"
                  ></div>

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










            </div>
          )}

          {/* TAB Productos */}
          {/*activeTab === "productos" && (
            <div className="space-y-4 font-lato">
              { ... tus productos ... }
            </div>
          )*/}

        </div>
      </div>
    </div>
  );
}
