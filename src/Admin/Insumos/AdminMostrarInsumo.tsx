import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArticuloInsumo,
  HistoricoStockArticuloInsumo,
  host,
} from "../../../ts/Clases";
import axios from "axios";

interface Props {
  articulo: ArticuloInsumo | null;
  cerrarMostrar: () => void;
  abrirEditar: (articulo: ArticuloInsumo | null) => void;
}

export default function AdminMostrarManufacturado({
  articulo,
  cerrarMostrar,
  abrirEditar,
}: Props) {
  const [historicos, setHistoricos] = useState<HistoricoStockArticuloInsumo[]>(
    []
  );

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  // Configurar axios con el token
  const axiosConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }),
    []
  );

  const cargarHistoricos = useCallback(
    async (stockId: number) => {
      const URL = `${host}/api/historico/stock-insumo/${stockId}`;

      try {
        const response = await axios.get(URL, axiosConfig);
        setHistoricos(response.data);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
          // Opcional: redirigir al login
          // window.location.href = "/login";
        } else {
          alert("Error al cargar el historial. Por favor, intenta de nuevo.");
        }
      }
    },
    [axiosConfig]
  );

  useEffect(() => {
    const stockId = articulo?.stockArticuloInsumo?.id;
    if (stockId) {
      cargarHistoricos(stockId);
    }
  }, [articulo?.stockArticuloInsumo?.id, cargarHistoricos]);

  if (!articulo) return null;

  return (
    <>
      <div className="bg-white rounded-4xl w-2/3 m-auto">
        {/**Titulo */}
        <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-gray-200 shadow-md shadow-gray-500">
          <h1>Detalle Insumo</h1>
          <button
            onClick={() => cerrarMostrar()}
            className="bg-[#D93F21] p-2 rounded-xl"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div className="p-[5%] *:mb-10">
          {/**Cabecera articulo */}
          <div className="flex justify-between items-center text-2xl">
            <div className="grid grid-cols-[3fr_1fr]">
              <div className="flex gap-5 items-center">
                <img
                  className="h-25 w-25 object-fill rounded-[20rem]"
                  src={String(articulo?.imagenArticulo) || ""}
                  alt=""
                />
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold">{articulo?.nombre}</h2>
                  <div className="flex gap-2">
                    <h3 className="bg-[#D93F21] text-white rounded-4xl p-1 px-5">
                      {articulo?.subcategoria.categoria?.denominacion}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`${
                          articulo.stockArticuloInsumo.cantidad >
                          articulo.stockArticuloInsumo.minStock
                            ? "bg-green-600"
                            : "bg-red-500"
                        } h-10 w-10 m-auto rounded-4xl`}
                      ></div>
                      <h1>
                        {articulo?.existe
                          ? "Stock Suficiente"
                          : "Stock Insuficiente"}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  cerrarMostrar();
                  abrirEditar(articulo);
                }}
                className="bg-[#D93F21] text-white p-2 px-5 rounded-4xl"
              >
                Editar
              </button>
            </div>
          </div>

          {/**Informacion costo, precio y ganancia */}
          <div className="*:border-gray-500 *:border *:border-collapse text-gray-500 text-center *:py-2">
            <div className="grid grid-cols-3 m-auto w-full">
              <h3>Stock Minimo</h3>
              <h3>Stock Actual</h3>
              <h3>Precio Costo Total</h3>
            </div>
            <div className="grid grid-cols-3">
              <h3>
                {articulo.stockArticuloInsumo.minStock}{" "}
                {articulo.unidadMedida.unidad}
              </h3>
              <h3>
                {articulo.stockArticuloInsumo.cantidad}{" "}
                {articulo.unidadMedida.unidad}
              </h3>
              <h3>
                ${articulo.precioCompra * articulo.stockArticuloInsumo.cantidad}
              </h3>
            </div>
          </div>

          {/**Cabecera Preparacion */}
          <div>
            <div className="flex items-center">
              <img src="/svg/DetallePreparacion.svg" alt="" />
              <h1 className="text-3xl font-bold">Existencias</h1>
            </div>
            <div></div>
          </div>

          {/**Preparacion */}
          <div className="*:border-gray-500 *:border *:border-collapse text-gray-500 text-center *:py-2">
            <div className="grid grid-cols-3 w-full m-auto">
              <h3>Fecha y hora</h3>
              <h3>Cantidad</h3>
              <h3>Costo Actualizado</h3>
            </div>

            {/**Listado de todos los ingredientes */}
            {Number(historicos.length) > 0 &&
              historicos.map((historico, index) => (
                <div key={index} className="grid grid-cols-3">
                  <h3>
                    {new Date(
                      historico.fechaActualizacion
                    ).toLocaleDateString()}{" "}
                    {new Date(
                      historico.fechaActualizacion
                    ).toLocaleTimeString()}
                  </h3>
                  <h3>
                    {historico.cantidad} {articulo.unidadMedida.unidad}
                  </h3>
                  <h3>${articulo.precioCompra * historico.cantidad}</h3>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
