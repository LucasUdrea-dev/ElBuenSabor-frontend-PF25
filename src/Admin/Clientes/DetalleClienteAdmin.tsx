import React, { useEffect, useState } from "react";
import axios from "axios";
import { host, Usuario, Telefono, Direccion, Pedido } from "../../../ts/Clases";
import LogoUser from "../../../public/svg/LogoUser.svg";
import LogoDetalle from "../../../public/svg/LogoDetalle.svg";
import LogoFactura from "../../../public/svg/LogoFactura.svg";

interface Props {
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

  useEffect(() => {
    if (isOpen && cliente?.id) {
      cargarDetallesCliente(cliente.id);
    } else {
      setTelefonos([]);
      setDirecciones([]);
      setPedidos([]);
    }
  }, [isOpen, cliente?.id]);

  const cargarDetallesCliente = async (clienteId: number) => {
    setCargando(true);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    try {
      // 🔹 Teléfonos
      const telRes = await axios.get(`${API_BASE_URL}/telefonos/usuario/${clienteId}`, { headers });
      setTelefonos(Array.isArray(telRes.data) ? telRes.data : []);

      // 🔹 Direcciones
      const dirRes = await axios.get(`${API_BASE_URL}/direccion/usuario/${clienteId}`, { headers });
      console.log("📦 Direcciones recibidas:", dirRes.data);
      setDirecciones(Array.isArray(dirRes.data) ? dirRes.data : []);

      // 🔹 Pedidos
      const pedidosRes = await axios.get(`${API_BASE_URL}/pedidos/usuario/${clienteId}`, { headers });
      setPedidos(Array.isArray(pedidosRes.data) ? pedidosRes.data : []);
    } catch (error: any) {
      console.error("❌ Error al cargar detalles del cliente:", error);
      if (error.response?.status === 403) {
        alert("No tienes permisos para acceder a estos datos.");
      }
      setTelefonos([]);
      setDirecciones([]);
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 font-lato">
      <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#E9E9E9] rounded-t-2xl px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {cliente.nombre} {cliente.apellido}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {cargando ? (
            <div className="text-center py-8 text-gray-500">
              Cargando información del cliente...
            </div>
          ) : (
            <>
              {/* Info del cliente */}
              <div className="bg-gray-50 p-6 border border-gray-300 mt-4">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <img src={LogoUser} alt="Cliente" className="mr-5 w-6 h-6" />
                  Cliente
                </h3>
                <p><strong>Email:</strong> {cliente.email}</p>
                <p>
                    <strong>Teléfonos:</strong>{" "}
                    {telefonos.length > 0
                      ? telefonos.map((t) => t.numero).join(", ")
                      : cliente.telefonoList.length > 0
                      ? cliente.telefonoList.map((t) => t.numero).join(", ")
                      : "Sin teléfonos"}
                  </p>

                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      cliente.existe ? "bg-green-600" : "bg-gray-500"
                    }`}
                  >
                    {cliente.existe ? "Activo" : "Inactivo"}
                  </span>
                </p>
              </div>

              {/* Direcciones */}
              <div className="bg-gray-50 p-6 border border-gray-300">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <img src={LogoDetalle} alt="Direcciones" className="mr-5 w-6 h-6" />
                    Direcciones
                  </h3>
                  {direcciones.length > 0 ? (
                    <ul className="space-y-2">
                      {direcciones.map((d) => (
                        <li key={d.id} className="border-b pb-2">
                          <strong>{d.alias || "Sin alias"}:</strong>{" "}
                          {d.nombreCalle} {d.numeracion} —{" "}
                          {d.descripcionEntrega || "Sin descripción"} —{" "}
                          {d.ciudad?.nombre || "Sin ciudad"}, {d.ciudad?.provincia?.nombre || "Sin provincia"}, {d.ciudad?.provincia?.pais?.nombre || "Sin país"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay direcciones registradas.</p>
                  )}
                </div>


              {/* Órdenes */}
              <div className="bg-gray-50 p-6 border border-gray-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <img src={LogoFactura} alt="Órdenes" className="mr-5 w-6 h-6" />
                  Órdenes
                </h3>
                <p>Total de órdenes: {pedidos.length}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleClienteAdmin;
