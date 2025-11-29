import { useEffect, useState, useCallback } from "react";
import { Categoria, host, Subcategoria } from "../../../ts/Clases";
import axios from "axios";

interface Props {
  abierto: boolean;
  setForm: React.Dispatch<React.SetStateAction<Subcategoria>>;
  cerrar: () => void;
}

export default function SelectorCategoria({ abierto, cerrar, setForm }: Props) {
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaCategoriasBuscador, setListaCategoriasBuscador] = useState<
    Categoria[]
  >([]);
  const [buscadorCategoria, setBuscadorCategoria] = useState("");
  const [filtroParaElaborar, setFiltroParaElaborar] = useState("");

  const traerCategorias = useCallback(async () => {
    const getToken = () => localStorage.getItem("token");
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    };

    const URL = `${host}/api/categoria/full`;

    try {
      const response = await axios.get(URL, axiosConfig);

      setListaCategorias(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al cargar las categorías. Por favor, intenta de nuevo.");
      }
    }
  }, []);

  useEffect(() => {
    traerCategorias();
  }, [traerCategorias]);

  useEffect(() => {
    let filtrado: Categoria[] = listaCategorias;

    if (filtroParaElaborar) {
      if (filtroParaElaborar == "elaborar") {
        filtrado = filtrado.filter((categoria) => categoria.esParaElaborar);
      } else if (filtroParaElaborar == "vender") {
        filtrado = filtrado.filter((categoria) => !categoria.esParaElaborar);
      }
    }

    if (buscadorCategoria) {
      filtrado = filtrado.filter((categoria) =>
        categoria.denominacion
          .toLowerCase()
          .includes(buscadorCategoria.toLowerCase())
      );
    }

    setListaCategoriasBuscador(filtrado);
  }, [buscadorCategoria, abierto, filtroParaElaborar, listaCategorias]);

  const cerrarModal = () => {
    setBuscadorCategoria("");
    setFiltroParaElaborar("");
    cerrar();
  };

  if (!abierto) return null;

  return (
    <>
      <div
        onClick={cerrarModal}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-4/5 rounded-4xl text-black"
        >
          {/**Cabecera */}
          <div className="text-3xl flex justify-between rounded-t-4xl p-5 items-center bg-gray-200 shadow-md shadow-gray-500">
            <h1>Seleccione la categoria</h1>
            <button onClick={cerrarModal}>
              <img src="/svg/CerrarVentana.svg" />
            </button>
          </div>

          {/**Cuerpo */}
          <div className="p-5">
            <div className="w-1/2 flex gap-5">
              <input
                onChange={(e) => setBuscadorCategoria(e.target.value)}
                className="bg-[#878787] text-white pl-5 rounded-4xl w-1/2"
                placeholder="Buscar..."
                type="text"
              />
              <select
                value={filtroParaElaborar}
                onChange={(e) => setFiltroParaElaborar(e.target.value)}
                className="bg-gray-300 rounded-2xl px-2"
              >
                <option value="">Todas</option>
                <option value="elaborar">Para elaborar</option>
                <option value="vender">Para vender</option>
              </select>
            </div>

            <div className="flex flex-col py-2 [&_h5]:text-sm max-h-[60vh] overflow-y-auto">
              {/**Cabecera de tabla */}
              <div className="text-4xl w-full flex *:border-2 *:border-gray-500 *:w-full *:py-5 *:border-collapse text-center">
                <div className="flex items-center justify-center">
                  <h5>Nombre</h5>
                </div>
                <div className="flex items-center justify-center">
                  <h5>Para elaborar</h5>
                </div>
                <div className="flex items-center justify-center">
                  <h5>Agregar</h5>
                </div>
              </div>

              {listaCategoriasBuscador.length > 0 &&
                listaCategoriasBuscador.map((categoria) => (
                  <div
                    key={categoria.id}
                    className="text-4xl w-full flex *:border-2 *:border-gray-500 *:w-full *:py-1 *:border-collapse text-center"
                  >
                    <div className="flex items-center justify-center">
                      <h5>{categoria.denominacion}</h5>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className={`${
                          categoria.esParaElaborar
                            ? "bg-green-600"
                            : "bg-gray-500"
                        } h-5 w-5 m-auto rounded-4xl`}
                      ></div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => {
                          setForm((prev) => {
                            return { ...prev, categoria: categoria };
                          });
                          cerrarModal();
                        }}
                        className="bg-[#D93F21] text-white px-2 rounded-4xl"
                      >
                        <h5>Agregar</h5>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
