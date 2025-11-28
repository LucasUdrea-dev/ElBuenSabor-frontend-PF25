import axios from "axios";
import { useEffect, useState } from "react";
import CajeroRecibido from "./CajeroRecibido";

export default function EntregaRepartidor() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);

  const getPedidos = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:8080/api/pedidos/all",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setPedidos(response.data);
    console.log(response);
    
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  }
};

  useEffect(() => {
    getPedidos();
  }, []);

  // 🔹 Función para actualizar el estado del pedido enviando todo el objeto completo
  const actualizarEstadoPedido = async (idPedido: number, nuevoEstadoId: number) => {
    try {
      // 1️⃣ Traemos el pedido completo
      const token = localStorage.getItem("token");

const pedidoResponse = await axios.get(
  `http://localhost:8080/api/pedidos/${idPedido}`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
      const pedidoCompleto = pedidoResponse.data;

      // 2️⃣ Cambiamos solo el estado
      pedidoCompleto.estadoPedido = { id: nuevoEstadoId };

      // 3️⃣ Enviamos el pedido completo actualizado
     

const response = await axios.put(
  `http://localhost:8080/api/pedidos/${idPedido}`,
  pedidoCompleto,
  {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  }
);

      console.log("✅ Pedido actualizado:", response.data);

      // 4️⃣ Actualizamos la lista local
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          p.id === idPedido ? { ...p, estadoPedido: { id: nuevoEstadoId } } : p
        )
      );

      alert("✅ Pedido actualizado correctamente");
    } catch (error: any) {
      console.error("❌ Error al actualizar el pedido:", error);
      if (error.response) {
        console.error("Detalle del error:", error.response.data);
        alert(`❌ Error del servidor: ${error.response.data.error}`);
      } else {
        alert("❌ No se pudo actualizar el pedido");
      }
    }
  };

  return (
    <div className="bg-[#2e2e2e] min-h-screen w-full text-white p-8 shadow-xl font-lato">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white tracking-wide">Entregas</h2>
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-2 rounded-full bg-[#f1f1f1] text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 w-56 font-lato"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-md font-lato">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-700 border-b border-gray-300 uppercase text-xs tracking-wide">
            <tr>
              <th className="py-3 px-5 text-left font-semibold">Orden N°</th>
              <th className="py-3 px-5 text-left font-semibold">Dirección de Entrega</th>
              <th className="py-3 px-5 text-left font-semibold">Hora de Entrega</th>
              <th className="py-3 px-5 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-500 italic font-lato"
                >
                  No hay pedidos disponibles
                </td>
              </tr>
            ) : (
              pedidos.map((pedido) => (
                <tr
                  key={pedido.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors font-lato"
                >
                  <td className="py-3 px-5 font-medium">
                    {pedido.id.toString().padStart(6, "0")}
                  </td>
                  <td className="py-3 px-5">
                    {pedido.sucursal?.direccion
                      ? `${pedido.sucursal.direccion.nombreCalle} ${pedido.sucursal.direccion.numeracion}, Mendoza`
                      : "Sin dirección"}
                  </td>
                  <td className="py-3 px-5">
                    <h3>
                      {pedido.tiempoEstimado
                        ? pedido.tiempoEstimado.split(":").slice(0, 2).join(":") + " min"
                        : "Sin tiempo"}
                    </h3>
                  </td>
                  <td className="py-3 px-5 flex gap-3 items-center">
                    {/* Estado visual */}
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        pedido.estadoPedido?.nombreEstado === "Pendiente"
                          ? "bg-yellow-500"
                          : pedido.estadoPedido?.nombreEstado === "En proceso"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      } font-lato`}
                    >
                      {pedido.estadoPedido?.nombreEstado || "Sin estado"}
                    </span>

                    {/* Advertencia */}
                    <img
                      src="/svg/icono_cancelar_pedido.svg"
                      alt="Advertencia"
                      title="Advertencia"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => actualizarEstadoPedido(pedido.id, 4)} // cambia a estado 4
                    />

                    {/* Repartidor detalle */}
                    <img
                      src="/svg/LogoVer.svg"
                      alt="Repartir"
                      title="Repartir"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => setPedidoSeleccionado(pedido)}
                    />

                    {/* Entregado */}
                    <img
                      src="/svg/icono_pedido_positivo.svg"
                      alt="Entregado"
                      title="Entregado"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => actualizarEstadoPedido(pedido.id, 6)} // cambia a estado 6
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center text-gray-300 text-xs mt-3 font-lato">
        <span>1–10 de {pedidos.length}</span>
      </div>

      {/* Modal */}
      {pedidoSeleccionado && (
        <CajeroRecibido
          pedido={pedidoSeleccionado}
          onClose={() => setPedidoSeleccionado(null)}
        />
      )}
    </div>
  );
}
