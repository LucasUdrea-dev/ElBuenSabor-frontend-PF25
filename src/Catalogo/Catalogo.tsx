import { useEffect, useState } from "react";
import SliderPromociones from "./SliderPromociones";
import {
  ArticuloInsumo,
  ArticuloManufacturado,
  Categoria,
  host,
  Promocion,
} from "../../ts/Clases";
import ArticuloCardCatalogo from "./ArticuloCardCatalogo";
import axios from "axios";
import { LoadingTable } from "../components/LoadingTable.tsx";

export default function Catalogo() {
  const [buscador, setBuscador] = useState("");
  const [promos, setPromos] = useState<Promocion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("");
  const [todosArticulos, setTodosArticulos] = useState<
    (ArticuloInsumo | ArticuloManufacturado)[]
  >([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<
    (ArticuloInsumo | ArticuloManufacturado)[]
  >([]);
  const [ordenamiento, setOrdenamiento] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [loadingArticulos, setLoadingArticulos] = useState(false);
  const [loadingPromos, setLoadingPromos] = useState(false);

  const articulosPorPagina = 9;

  useEffect(() => {
    cargarCategorias();
    cargarArticulos();
    cargarPromos();
  }, []);

  useEffect(() => {
    console.log(promos);
  }, [promos]);

  //Obtener categorias
  const cargarCategorias = async () => {
    const URL = `${host}/api/categoria/ventas`;
    try {
      const response = await axios.get(URL);

      const categoriasObtenidas: Categoria[] = response.data;

      setCategorias(categoriasObtenidas);
    } catch (error) {
      console.error(error);
    }
  };

  //Funcion para obtener promociones
  const cargarPromos = async () => {
    const URL = host + "/api/promociones/existente";
    setLoadingPromos(true);
    try {
      const response = await axios.get(URL);

      const promocionesObtenidas: Promocion[] = response.data;

      setPromos(promocionesObtenidas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPromos(false);
    }
  };

  //Obtener articulos para venta
  const cargarArticulos = async () => {
    const URL = host + "/api/articulo/venta";
    setLoadingArticulos(true);
    try {
      const response = await axios.get(URL);

      const articulosObtenidos: (ArticuloInsumo | ArticuloManufacturado)[] =
        response.data;

      setTodosArticulos(articulosObtenidos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingArticulos(false);
    }
  };

  //Filtrar los articulos que se van a mostrar
  useEffect(() => {
    let datosFiltrados: (ArticuloInsumo | ArticuloManufacturado)[] =
      todosArticulos;

    //Filtro por nombre
    if (buscador) {
      datosFiltrados = datosFiltrados.filter((articulo) =>
        articulo.nombre.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    //Filtro por categoria
    if (categoriaSeleccionada) {
      datosFiltrados = datosFiltrados.filter(
        (articulo) =>
          articulo.subcategoria.categoria?.id ===
          categorias[Number(categoriaSeleccionada)].id
      );
    }

    //Filtro por subcategoria
    if (subcategoriaSeleccionada) {
      datosFiltrados = datosFiltrados.filter(
        (articulo) =>
          articulo.subcategoria.id ===
          categorias[Number(categoriaSeleccionada)]?.subcategorias?.[
            Number(subcategoriaSeleccionada)
          ]?.id
      );
    }

    //Ordenamiento
    switch (ordenamiento) {
      case "precioMenorMayor":
        console.log("Entro precio menor");
        datosFiltrados = [...datosFiltrados].sort(
          (anterior, siguiente) => anterior.precio - siguiente.precio
        );
        break;

      case "precioMayorMenor":
        console.log("Entro precio mayor");
        datosFiltrados = [...datosFiltrados].sort(
          (anterior, siguiente) => siguiente.precio - anterior.precio
        );
        break;

      case "nombreAZ":
        datosFiltrados = [...datosFiltrados].sort((anterior, siguiente) =>
          anterior.nombre.localeCompare(siguiente.nombre)
        );
        break;

      case "nombreZA":
        datosFiltrados = [...datosFiltrados].sort((anterior, siguiente) =>
          siguiente.nombre.localeCompare(anterior.nombre)
        );
        break;

      case "tiempoMenorMayor":
        datosFiltrados = [...datosFiltrados].sort(
          (anterior, siguiente) =>
            Number(
              anterior.tiempoEstimado
                ? anterior.tiempoEstimado.split(" ")[0]
                : 0
            ) -
            Number(
              siguiente.tiempoEstimado
                ? siguiente.tiempoEstimado?.split(" ")[0]
                : 0
            )
        );
        break;

      case "tiempoMayorMenor":
        datosFiltrados = [...datosFiltrados].sort(
          (anterior, siguiente) =>
            Number(
              siguiente.tiempoEstimado
                ? siguiente.tiempoEstimado.split(" ")[0]
                : 0
            ) -
            Number(
              anterior.tiempoEstimado
                ? anterior.tiempoEstimado.split(" ")[0]
                : 0
            )
        );
        break;

      default:
        datosFiltrados = datosFiltrados;
        break;
    }

    setArticulosFiltrados(datosFiltrados);

    setPaginaSeleccionada(1);
  }, [
    todosArticulos,
    categoriaSeleccionada,
    subcategoriaSeleccionada,
    buscador,
    ordenamiento,
  ]);

  return (
    <>
      <div className="bg-[#333333] min-h-screen w-full text-white font-[Lato]">
        {/**Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Los platillos más ricos de
              <br className="max-md:hidden" /> Argentina
            </h1>

            <h3 className="text-lg md:text-xl text-gray-300">
              Lista de los mejores platos, postres, desayunos, bebidas...
            </h3>

            <div className="flex gap-5">
              <input
                defaultValue={buscador}
                onChange={(event) => {
                  setBuscador(event.target.value);
                }}
                className="bg-white text-black w-full md:w-1/2 rounded-xl px-5 py-3 text-base md:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D93F21] transition-all shadow-md"
                placeholder="Por ejemplo, pizza, hamburguesa..."
                type="text"
              />
            </div>
          </div>
        </div>

        {/**Promociones */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <SliderPromociones promos={promos} loading={loadingPromos} />
        </div>

        {/**Categorias */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Categorías</h2>
            {/**Ordenar por */}
            <select
              defaultValue={""}
              onChange={(e) => {
                setOrdenamiento(e.target.value);
              }}
              className="bg-white text-black rounded-lg px-4 py-2 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#D93F21] cursor-pointer"
            >
              <option value="" disabled>
                Ordenar por
              </option>
              <option value="precioMenorMayor">Precio más bajo</option>
              <option value="precioMayorMenor">Precio más alto</option>
              <option value="nombreAZ">A - Z</option>
              <option value="nombreZA">Z - A</option>
              <option value="tiempoMenorMayor">Menor tiempo</option>
              <option value="tiempoMayorMenor">Mayor tiempo</option>
            </select>
          </div>

          {/**Category Cards */}
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            <button
              onClick={() => {
                setCategoriaSeleccionada("");
                setSubcategoriaSeleccionada("");
              }}
              className={`${
                categoriaSeleccionada === "" && "bg-[#D93F21]"
              } flex-shrink-0 flex flex-col items-center gap-2 px-3 pt-3 pb-5 rounded-[20rem] transition-colors duration-300`}
            >
              <div className="bg-white rounded-full p-2">
                <img
                  className="object-cover rounded-full h-20 w-20"
                  src="/img/categoriaTodos.jpg"
                  alt="Todos"
                />
              </div>
              <span className="text-sm font-medium">Todos</span>
            </button>
            {categorias.map((categoria, index) => (
              <button
                key={index}
                onClick={() => {
                  setCategoriaSeleccionada(String(index));
                  setSubcategoriaSeleccionada("");
                }}
                className={`${
                  String(index) === categoriaSeleccionada && "bg-[#D93F21]"
                } flex-shrink-0 flex flex-col items-center gap-2 px-3 pt-3 pb-5 rounded-[20rem] transition-colors duration-300`}
              >
                <div className="bg-white rounded-full p-2">
                  <img
                    className="rounded-full h-20 w-20 object-cover"
                    src={categoria.imagen}
                    alt={categoria.denominacion}
                  />
                </div>
                <span className="text-sm font-medium text-center">
                  {categoria.denominacion}
                </span>
              </button>
            ))}
          </div>

          {/**Subcategory Pills */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setSubcategoriaSeleccionada("")}
              className={`${
                subcategoriaSeleccionada === ""
                  ? "bg-[#D93F21] text-white shadow-lg"
                  : "bg-white text-black hover:bg-gray-200"
              } px-5 py-2 rounded-xl text-sm md:text-base font-medium uppercase transition-all duration-300`}
            >
              Todos
            </button>

            {categorias.length > 0 &&
              categoriaSeleccionada != "" &&
              categorias[Number(categoriaSeleccionada)]?.subcategorias?.map(
                (subcat, index) => (
                  <button
                    key={index}
                    onClick={() => setSubcategoriaSeleccionada(String(index))}
                    className={`${
                      String(index) === subcategoriaSeleccionada
                        ? "bg-[#D93F21] text-white shadow-lg"
                        : "bg-white text-black hover:bg-gray-200"
                    } px-5 py-2 rounded-xl text-sm md:text-base font-medium uppercase transition-all duration-300`}
                  >
                    {subcat.denominacion}
                  </button>
                )
              )}
          </div>
        </div>

        {/**Products Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          {loadingArticulos ? (
            <LoadingTable nombre="productos" />
          ) : (
            <div
              className={`grid ${
                articulosFiltrados.length > 0
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : ""
              } gap-6`}
            >
              {articulosFiltrados.length > 0 ? (
                articulosFiltrados.map((articulo, index) => {
                  if (
                    index < articulosPorPagina * paginaSeleccionada &&
                    index >= articulosPorPagina * (paginaSeleccionada - 1)
                  ) {
                    return (
                      <ArticuloCardCatalogo
                        key={articulo.id}
                        articulo={articulo}
                      />
                    );
                  }
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <h2 className="text-xl md:text-2xl text-gray-400">
                    No se encuentran productos
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>

        {/**Pagination */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="flex justify-center gap-2">
            {articulosFiltrados.length > 0 &&
              [
                ...Array(
                  Math.ceil(articulosFiltrados.length / articulosPorPagina)
                ),
              ].map((_, index) => {
                const numeroPagina = index + 1;
                return (
                  <button
                    key={numeroPagina}
                    onClick={() => {
                      setPaginaSeleccionada(numeroPagina);
                    }}
                    className={`min-w-[44px] h-11 rounded-lg font-medium text-base transition-all duration-300 ${
                      numeroPagina === paginaSeleccionada
                        ? "bg-[#D93F21] text-white shadow-lg scale-110"
                        : "bg-white text-black hover:bg-gray-200 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {numeroPagina}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
