import { Pedido } from "../../../ts/Clases";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix para los iconos de Leaflet en React
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  pedido: Pedido;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetalleRepartidor({ pedido, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const direccion = pedido.direccionPedido?.direccion;
  const hasCoordinates =
    direccion?.latitud !== undefined &&
    direccion?.longitud !== undefined &&
    direccion.latitud !== 0 &&
    direccion.longitud !== 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4 font-lato">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] md:h-auto md:max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Encabezado */}
        <div className="bg-[#333333] p-4 md:p-6 flex justify-between items-center sticky top-0 z-20 shadow-md">
          <h2 className="text-lg md:text-2xl font-bold text-white truncate pr-4">
            Pedido #{pedido.id}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors shrink-0"
          >
            <img
              src="/svg/CerrarVentana.svg"
              alt="Cerrar"
              className="w-6 h-6 md:w-8 md:h-8"
            />
          </button>
        </div>

        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 flex-grow">
          {/* Columna Izquierda: Información del Cliente y Pedido */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold text-[#333333] mb-3 md:mb-4 flex items-center gap-2">
                <img
                  src="/svg/IconsDashboard/ClientesAdmin.svg"
                  className="w-5 h-5 md:w-6 md:h-6 filter brightness-0"
                  alt=""
                />
                Datos del Cliente
              </h3>
              <div className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
                <p>
                  <span className="font-semibold">Nombre:</span>{" "}
                  {pedido.usuario.nombre} {pedido.usuario.apellido}
                </p>
                <p>
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {pedido.usuario.telefonoList?.[0]?.numero || "No registrado"}
                </p>
                <p className="break-all">
                  <span className="font-semibold">Email:</span>{" "}
                  {pedido.usuario.email}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold text-[#333333] mb-3 md:mb-4 flex items-center gap-2">
                <img
                  src="/svg/logoUbicacionCarrito.svg"
                  className="w-5 h-5 md:w-6 md:h-6"
                  alt=""
                />
                Dirección de Entrega
              </h3>
              <div className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
                <p>
                  <span className="font-semibold">Calle:</span>{" "}
                  {direccion?.nombreCalle} {direccion?.numeracion}
                </p>
                <p>
                  <span className="font-semibold">Localidad:</span>{" "}
                  {direccion?.ciudad?.nombre},{" "}
                  {direccion?.ciudad?.provincia?.nombre}
                </p>
                <p>
                  <span className="font-semibold">Referencia:</span>{" "}
                  {direccion?.descripcionEntrega || "Sin referencias"}
                </p>
                <p>
                  <span className="font-semibold">Alias:</span>{" "}
                  {direccion?.alias}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold text-[#333333] mb-2 md:mb-4">
                Total a Cobrar
              </h3>
              <div className="text-2xl md:text-3xl font-bold text-[#D93F21]">
                $
                {pedido.detallePedidoList.reduce(
                  (acc, det) =>
                    acc + det.cantidad * (det.articulo?.precio || 0),
                  0
                ) +
                  pedido.detallePromocionList.reduce(
                    (acc, det) =>
                      acc + det.cantidad * (det.promocion.precioRebajado || 0),
                    0
                  )}
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Forma de Pago: {pedido.tipoPago.tipoPago}
              </p>
            </div>
          </div>

          {/* Columna Derecha: Mapa */}
          <div className="h-[300px] md:h-full min-h-[300px] rounded-xl overflow-hidden border border-gray-300 shadow-inner relative z-0">
            {hasCoordinates ? (
              <MapContainer
                center={[direccion!.latitud, direccion!.longitud]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[direccion!.latitud, direccion!.longitud]} />
              </MapContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                <img
                  src="/svg/maps.svg"
                  alt="No map"
                  className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-50"
                />
                <p className="text-sm md:text-base">Ubicación no disponible en el mapa</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white rounded-b-xl md:rounded-b-2xl z-10">
          <button
            onClick={onClose}
            className="bg-[#333333] text-white px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-black transition-colors font-bold text-sm md:text-base w-full md:w-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
