import { useEffect, useState } from "react";
import { axiosConfig, host } from "../../../ts/Clases";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Interfaces para los datos
interface InsumoStock {
  id: number;
  nombre: string;
  nivelActual: number;
  nivelMinimo: number;
  nivelMaximo: number;
  stockHistorico: number[];
  unidad: string;
}

interface ProductoVendido {
  nombre: string;
  ventasDiarias: number[];
  ventasSemanales: number[];
  ventasMensuales: number[];
}

interface IngresoData {
  periodo: string;
  ordenes: number;
  ganancias: number;
}

type FiltroTiempo = "Diario" | "Semanal" | "Mensual" | "Anual";

export default function Administracion() {
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(0);
  const [filtroVendidos, setFiltroVendidos] = useState<FiltroTiempo>("Diario");
  const [filtroIngresos, setFiltroIngresos] = useState<FiltroTiempo>("Diario");
  const [insumosStock, setInsumosStock] = useState<InsumoStock[]>([]);
  const [productosVendidos, setProductosVendidos] = useState<ProductoVendido[]>(
    []
  );
  const [ingresosDiarios, setIngresosDiarios] = useState<IngresoData[]>([]);
  const [ingresosSemanales, setIngresosSemanales] = useState<IngresoData[]>([]);
  const [ingresosMensuales, setIngresosMensuales] = useState<IngresoData[]>([]);
  const [ingresosAnuales, setIngresosAnuales] = useState<IngresoData[]>([]);

  const obtenerInsumosStock = async () => {
    const URL = host + "/api/estadisticas/insumos-stock";
    try {
      const response = await axios.get(URL, axiosConfig);
      setInsumosStock(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenterProductosVendidos = async () => {
    const URL = host + "/api/estadisticas/productos-mas-vendidos";
    try {
      const response = await axios.get(URL, axiosConfig);
      setProductosVendidos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerIngresosDiarios = async () => {
    const URL = host + "/api/estadisticas/ingresos/diarios";
    try {
      const response = await axios.get(URL, axiosConfig);
      setIngresosDiarios(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerIngresosSemanales = async () => {
    const URL = host + "/api/estadisticas/ingresos/semanales";
    try {
      const response = await axios.get(URL, axiosConfig);
      setIngresosSemanales(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerIngresosMensuales = async () => {
    const URL = host + "/api/estadisticas/ingresos/mensuales";
    try {
      const response = await axios.get(URL, axiosConfig);
      setIngresosMensuales(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerIngresosAnuales = async () => {
    const URL = host + "/api/estadisticas/ingresos/anuales";
    try {
      const response = await axios.get(URL, axiosConfig);
      setIngresosAnuales(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerInsumosStock();
    obtenterProductosVendidos();
    obtenerIngresosDiarios();
    obtenerIngresosSemanales();
    obtenerIngresosMensuales();
    obtenerIngresosAnuales();
  }, []);

  const obtenerDatosIngresos = () => {
    switch (filtroIngresos) {
      case "Diario":
        return ingresosDiarios;
      case "Semanal":
        return ingresosSemanales;
      case "Mensual":
        return ingresosMensuales;
      case "Anual":
        return ingresosAnuales;
      default:
        return ingresosDiarios;
    }
  };

  const obtenerDatosVendidos = () => {
    const data = productosVendidos.map((p) => {
      let ventas;
      switch (filtroVendidos) {
        case "Diario":
          ventas = p.ventasDiarias;
          break;
        case "Semanal":
          ventas = p.ventasSemanales;
          break;
        case "Mensual":
          ventas = p.ventasMensuales;
          break;
        default:
          ventas = p.ventasDiarias;
      }
      return { nombre: p.nombre, ventas: ventas };
    });

    if (data.length === 0 || data[0].ventas.length === 0) return [];

    return data[0].ventas.map((_, index) => {
      const entry: { [key: string]: any } = { name: `Día ${index + 1}` };
      data.forEach((p) => {
        entry[p.nombre] = p.ventas[index];
      });
      return entry;
    });
  };

  const datosIngresos = obtenerDatosIngresos();
  const datosVendidos = obtenerDatosVendidos();
  const stockHistoricoData =
    insumosStock.length > 0 && insumosStock[insumoSeleccionado].stockHistorico
      ? insumosStock[insumoSeleccionado].stockHistorico.map((value, index) => ({
          name: index + 1,
          stock: value,
          min: insumosStock[insumoSeleccionado].nivelMinimo,
          max: insumosStock[insumoSeleccionado].nivelMaximo,
        }))
      : [];
  return (
    <div
      className="min-h-screen bg-gray-800 text-white p-6"
      style={{ fontFamily: "Lato, sans-serif", backgroundColor: "#333333" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administración</h1>
        </div>

        {/* Stock Chart Section */}
        <div
          className="rounded-lg mb-8 overflow-hidden"
          style={{ backgroundColor: "#444444" }}
        >
          <div
            className="p-4 border-b"
            style={{ borderColor: "#3D3D3D", backgroundColor: "#3D3D3D" }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Nivel de Stock</h2>
              <select
                value={insumoSeleccionado}
                onChange={(e) => setInsumoSeleccionado(Number(e.target.value))}
                className="text-white px-3 py-2 rounded-md border focus:outline-none"
                style={{ backgroundColor: "#444444", borderColor: "#555555" }}
              >
                {insumosStock.map((insumo, index) => (
                  <option key={insumo.id} value={index}>
                    {insumo.nombre} ({insumo.nivelActual}
                    {insumo.unidad})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockHistoricoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "1px solid #555",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="stock"
                  stroke="#8884d8"
                  name="Stock Actual"
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="#db4437"
                  name="Stock Mínimo"
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#f4b400"
                  name="Stock Máximo"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Sold Products */}
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: "#444444" }}
          >
            <div
              className="p-4 border-b"
              style={{ borderColor: "#3D3D3D", backgroundColor: "#3D3D3D" }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Más vendidos</h2>
                <div className="flex space-x-2">
                  <select
                    value={filtroVendidos}
                    onChange={(e) =>
                      setFiltroVendidos(e.target.value as FiltroTiempo)
                    }
                    className="text-white px-3 py-1 rounded text-sm border focus:outline-none"
                    style={{
                      backgroundColor: "#444444",
                      borderColor: "#555555",
                    }}
                  >
                    <option value="Diario">Diario</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensual">Mensual</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosVendidos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "1px solid #555",
                    }}
                  />
                  <Legend />
                  {productosVendidos.map((p, i) => (
                    <Line
                      key={p.nombre}
                      type="monotone"
                      dataKey={p.nombre}
                      stroke={["#8884d8", "#82ca9d", "#ffc658"][i % 3]}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Section */}
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: "#444444" }}
          >
            <div
              className="p-4 border-b"
              style={{ borderColor: "#3D3D3D", backgroundColor: "#3D3D3D" }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Ingresos</h2>
                <div className="flex space-x-2">
                  <select
                    value={filtroIngresos}
                    onChange={(e) =>
                      setFiltroIngresos(e.target.value as FiltroTiempo)
                    }
                    className="text-white px-3 py-1 rounded text-sm border focus:outline-none"
                    style={{
                      backgroundColor: "#444444",
                      borderColor: "#555555",
                    }}
                  >
                    <option value="Diario">Diario</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosIngresos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="periodo" stroke="#ccc" />
                  <YAxis yAxisId="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "1px solid #555",
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="ganancias" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="ordenes" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
