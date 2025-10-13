import axios from "axios";
import { useEffect, useState } from "react";
import CajeroRecibido from "./CajeroRecibido";

export default function EntregaRepartidor() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);

  const getPedidos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/pedidos/all");
      setPedidos(response.data);
      console.log(response)
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  useEffect(() => {
    getPedidos();
  }, []);

  return (
    <div className="bg-[#2e2e2e] text-black rounded-2xl p-5 w-[90%] mx-auto mt-6 shadow-xl">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Entregas</h2>
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-1.5 rounded-full bg-[#f1f1f1] text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 w-52"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-[#f9f9f9] rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-[#f3f3f3] text-gray-700 border-b border-gray-300">
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
                  className="text-center py-6 text-gray-500 italic"
                >
                  No hay pedidos disponibles
                </td>
              </tr>
            ) : (
              pedidos.map((pedido: any) => (
                <tr
                  key={pedido.id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
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
                    {pedido.horaCierre?.substring(0, 5) || "Sin hora"}
                  </td>
                  <td className="py-3 px-5 flex gap-3 text-lg">
                    <span
                      title="Advertencia"
                      className="cursor-pointer text-red-500 hover:scale-110 transition-transform"
                    >
                      ⚠️
                    </span>
                    <span
                      title="Repartir"
                      className="cursor-pointer text-yellow-500 hover:scale-110 transition-transform"
                      onClick={() => setPedidoSeleccionado(pedido)}
                    >
                      🚚
                    </span>
                    <span
                      title="Entregado"
                      className="cursor-pointer text-green-500 hover:scale-110 transition-transform"
                    >
                      ✅
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center text-gray-300 text-xs mt-3">
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

