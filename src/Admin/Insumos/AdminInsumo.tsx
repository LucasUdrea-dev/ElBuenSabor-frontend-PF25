import { useEffect, useState } from "react";
import { ArticuloInsumo, host } from "../../../ts/Clases.ts"; // Adjust the path as needed
import axios from "axios";
import AdminFormInsumo from "./AdminFormInsumo.tsx";
// import { obtenerImagen } from "../../../ts/Imagen.ts";
import ModificarStock from "./ModificarStock.tsx";
import AdminMostrarInsumo from "./AdminMostrarInsumo.tsx";

interface ModificarStock {
  articulo: ArticuloInsumo;
  operacion: string;
}

export default function AdminInsumo() {
  const [articulosInsumos, setArticulosInsumos] = useState<ArticuloInsumo[]>(
    []
  );
  const [articulosInsumosMostrados, setArticulosInsumosMostrados] = useState<
    ArticuloInsumo[]
  >([]);
  const [mostrarStocks, setMostrarStocks] = useState(false);
  const [modificarStock, setModificarStock] = useState<ModificarStock>({
    articulo: new ArticuloInsumo(),
    operacion: "",
  });
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [mostrarArticulo, setMostrarArticulo] = useState<ArticuloInsumo | null>(
    null
  );
  const [formInsumo, setFormInsumo] = useState<ArticuloInsumo | null>(null);

  const cantidadPorPagina = 10;

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  // Configurar axios con el token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    cargarInsumos();
  }, []);

  const borradoLogico = async (articulo: ArticuloInsumo) => {
    const URL = `${host}/api/insumos/eliminar/${articulo.id}`;

    articulo.existe = !articulo.existe;

    try {
      const response = await axios.put(URL, articulo, axiosConfig);

      console.log("Se borro logicamente el articulo: " + response.status);
      cargarInsumos();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al eliminar el insumo. Por favor, intenta de nuevo.");
      }
    }
  };

  const cerrarDetalle = () => {
    setMostrarArticulo(null);
  };

  const cerrarForm = () => {
    setFormInsumo(null);
  };

  const cargarInsumos = async () => {
    const URL = `${host}/api/insumos/full`;

    try {
      const response = await axios.get(URL, axiosConfig);
      setArticulosInsumos(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al cargar los insumos. Por favor, intenta de nuevo.");
      }
    }
  };

  const cerrarModificarStock = () => {
    setModificarStock({ articulo: new ArticuloInsumo(), operacion: "" });
    cargarInsumos();
  };

  useEffect(() => {
    let filtrado: ArticuloInsumo[] = articulosInsumos;

    if (buscador) {
      filtrado = filtrado.filter((articulo) =>
        articulo.nombre.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setArticulosInsumosMostrados(filtrado);
  }, [articulosInsumos, buscador]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-10">
        {/**Tabla */}
        <div
          className={`bg-white w-11/12 m-auto rounded-2xl ${
            (mostrarArticulo || formInsumo) && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex justify-between p-5 h-2/12">
            <h1 className="pl-5 text-4xl">Insumos</h1>

            <div className="flex gap-5 pr-[2%] text-2xl">
              <button
                onClick={() => setMostrarStocks((prev) => !prev)}
                className="bg-[#D93F21] text-white px-10 rounded-4xl flex items-center gap-2"
              >
                <h2>{mostrarStocks ? "Completo" : "Stocks"}</h2>
              </button>

              <button
                onClick={() => setFormInsumo(new ArticuloInsumo())}
                className="bg-[#D93F21] text-white px-10 rounded-4xl flex items-center gap-2"
              >
                <h2>Agregar</h2>
                <img className="h-5" src="/svg/Agregar.svg" alt="" />
              </button>

              <input
                onChange={(e) => setBuscador(e.target.value)}
                className="bg-[#878787] text-white pl-5 rounded-4xl"
                placeholder="Buscar..."
                type="text"
              />
            </div>
          </div>

          {/**Tabla CRUD catalogo */}
          <div className="w-full pb-10">
            {!mostrarStocks ? (
              <div>
                {/**Cabecera */}
                <div className="text-4xl w-full grid grid-cols-7 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center">
                  <h1>Imagen</h1>
                  <h1>Categoría</h1>
                  <h1>Nombre</h1>
                  <h1>Costo p/U</h1>
                  <h1>Para elaborar</h1>
                  <h1>Publicado</h1>
                  <h1>Acciones</h1>
                </div>

                {/**Articulos */}
                {articulosInsumosMostrados.length > 0 &&
                  articulosInsumosMostrados.map((articulo, index) => {
                    if (
                      index < paginaSeleccionada * cantidadPorPagina &&
                      index >= cantidadPorPagina * (paginaSeleccionada - 1)
                    ) {
                      return (
                        <div
                          key={articulo.id}
                          className="text-4xl w-full grid grid-cols-7 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center"
                        >
                          <div className="flex items-center justify-center">
                            <img
                              className="max-h-24 object-cover rounded"
                              src={String(articulo.imagenArticulo) || ""}
                              alt=""
                            />
                          </div>
                          <div>
                            <h3>
                              {articulo.subcategoria.categoria?.denominacion}
                            </h3>
                          </div>
                          <div>
                            <h3>
                              {articulo.nombre.slice(0, 13)}
                              {articulo.nombre.length > 13 && "..."}
                            </h3>
                          </div>
                          <h3>
                            ${articulo.precioCompra}/
                            {articulo.unidadMedida.unidad.slice(0, 2)}
                          </h3>
                          <div className="flex">
                            <div
                              className={`${
                                articulo.esParaElaborar
                                  ? "bg-green-600"
                                  : "bg-gray-500"
                              } h-10 w-10 m-auto rounded-4xl`}
                            ></div>
                          </div>
                          <div className="flex">
                            <div
                              className={`${
                                articulo.existe ? "bg-green-600" : "bg-gray-500"
                              } h-10 w-10 m-auto rounded-4xl`}
                            ></div>
                          </div>
                          <div className="flex justify-around">
                            <button
                              onClick={() => setMostrarArticulo(articulo)}
                            >
                              <img
                                className="h-15"
                                src="/svg/LogoVer.svg"
                                alt=""
                              />
                            </button>
                            <button onClick={() => setFormInsumo(articulo)}>
                              <img
                                className="h-15"
                                src="/svg/LogoEditar.svg"
                                alt=""
                              />
                            </button>
                            <button
                              onClick={() => {
                                borradoLogico(articulo);
                              }}
                            >
                              <img
                                className="h-15"
                                src={`/svg/${
                                  articulo.existe
                                    ? "LogoBorrar.svg"
                                    : "LogoActivar.svg"
                                }`}
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            ) : (
              <div>
                {/**Cabecera */}
                <div className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center">
                  <h1>Imagen</h1>
                  <h1>Nombre</h1>
                  <h1>Cantidad</h1>
                  <h1>Stock Suficiente</h1>
                  <h1>Modificar Stock</h1>
                </div>

                {/**Articulos */}
                {articulosInsumosMostrados.length > 0 &&
                  articulosInsumosMostrados.map((articulo, index) => {
                    if (
                      index < paginaSeleccionada * cantidadPorPagina &&
                      index >= cantidadPorPagina * (paginaSeleccionada - 1)
                    ) {
                      return (
                        <div
                          key={articulo.id}
                          className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center"
                        >
                          <div className="flex items-center justify-center">
                            <img
                              className="max-h-24 object-cover rounded"
                              src={String(articulo.imagenArticulo) || ""}
                              alt=""
                            />
                          </div>
                          <div>
                            <h3>
                              {articulo.nombre.slice(0, 13)}
                              {articulo.nombre.length > 13 && "..."}
                            </h3>
                          </div>
                          <h3>
                            {articulo.stockArticuloInsumo?.cantidad}{" "}
                            {articulo.unidadMedida?.unidad}
                            {articulo.unidadMedida?.unidad == "unidad" &&
                              articulo.stockArticuloInsumo?.cantidad != 1 &&
                              "es"}
                          </h3>
                          <div className="flex">
                            <div
                              className={`${
                                articulo.stockArticuloInsumo?.cantidad >
                                articulo.stockArticuloInsumo?.minStock
                                  ? "bg-green-600"
                                  : "bg-red-500"
                              } h-10 w-10 m-auto rounded-4xl`}
                            ></div>
                          </div>
                          <div className="flex justify-around">
                            <button
                              title="Quitar stock"
                              onClick={() =>
                                setModificarStock({
                                  articulo: articulo,
                                  operacion: "quitar",
                                })
                              }
                            >
                              <img
                                className="max-h-15"
                                src="/img/simboloMenos.png"
                                alt=""
                              />
                            </button>
                            <button
                              title="Modificar cantidad minima"
                              onClick={() =>
                                setModificarStock({
                                  articulo: articulo,
                                  operacion: "minimo",
                                })
                              }
                            >
                              <img
                                className="max-h-15"
                                src="/img/stockMin.png"
                                alt=""
                              />
                            </button>
                            <button
                              title="Agregar stock"
                              onClick={() =>
                                setModificarStock({
                                  articulo: articulo,
                                  operacion: "agregar",
                                })
                              }
                            >
                              <img
                                className="max-h-15"
                                src="/img/simboloMas.png"
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            )}

            {/**Paginacion */}
            <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10">
              {/**Informacion articulos mostrados y totales */}
              <div className="h-10 flex items-center">
                <h4>
                  {paginaSeleccionada * cantidadPorPagina -
                    cantidadPorPagina +
                    1}
                  -
                  {paginaSeleccionada * cantidadPorPagina <
                  articulosInsumosMostrados.length
                    ? paginaSeleccionada * cantidadPorPagina
                    : articulosInsumosMostrados.length}{" "}
                  de {articulosInsumosMostrados.length}
                </h4>
              </div>

              {/**Control de paginado a traves de botones */}
              <button onClick={() => setPaginaSeleccionada(1)}>
                <img className="h-10" src="/svg/PrimeraPagina.svg" alt="" />
              </button>
              <button
                onClick={() =>
                  setPaginaSeleccionada((prev) => {
                    if (paginaSeleccionada > 1) {
                      return prev - 1;
                    }
                    return prev;
                  })
                }
              >
                <img className="h-10" src="/svg/AnteriorPagina.svg" alt="" />
              </button>

              <button
                onClick={() =>
                  setPaginaSeleccionada((prev) => {
                    if (
                      paginaSeleccionada <
                      Math.ceil(
                        articulosInsumosMostrados.length / cantidadPorPagina
                      )
                    ) {
                      return prev + 1;
                    }
                    return prev;
                  })
                }
              >
                <img className="h-10" src="/svg/SiguientePagina.svg" alt="" />
              </button>

              <button
                onClick={() =>
                  setPaginaSeleccionada(
                    Math.ceil(
                      articulosInsumosMostrados.length / cantidadPorPagina
                    )
                  )
                }
              >
                <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
              </button>
            </div>
          </div>
        </div>

        {/**Mostrar Insumo*/}
        <div className={`${!mostrarArticulo && "hidden"}`}>
          <AdminMostrarInsumo
            articulo={mostrarArticulo}
            abrirEditar={setFormInsumo}
            cerrarMostrar={cerrarDetalle}
          />
        </div>

        {/**Editar, crear manufacturado*/}

        <div className={`${!formInsumo && "hidden"}`}>
          <AdminFormInsumo
            articulo={formInsumo}
            cargarAdminInsumo={cargarInsumos}
            cerrarEditar={cerrarForm}
          />
        </div>
        <div className={`${!modificarStock.operacion && "hidden"}`}>
          <ModificarStock
            modificar={modificarStock}
            cerrarModal={cerrarModificarStock}
          />
        </div>
      </div>
    </>
  );
}
