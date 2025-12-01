import { useEffect, useState } from "react";
import { ArticuloManufacturado, host } from "../../../ts/Clases.ts"; // Adjust the path as needed

import AdminFormManufacturado from "./AdminFormManufacturado.tsx";
import AdminMostrarManufacturado from "./AdminMostrarManufacturado.tsx";
import axios from "axios";

export default function AdminCatalogo() {
  const [articulosManufacturados, setArticulosManufacturados] = useState<
    ArticuloManufacturado[]
  >([]);
  const [
    articulosManufacturadosMostrados,
    setArticulosManufacturadosMostrados,
  ] = useState<ArticuloManufacturado[]>([]);
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [mostrarArticulo, setMostrarArticulo] =
    useState<ArticuloManufacturado | null>(null);
  const [formManufacturado, setFormManufacturado] =
    useState<ArticuloManufacturado | null>(null);

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
    cargarManufacturados();
  }, []);

  const borradoLogico = async (articulo: ArticuloManufacturado) => {
    const URL = `${host}/api/articuloManufacturado/actualizar/${articulo.id}`;

    articulo.existe = !articulo.existe;

    const dataToSend = {
      id: articulo.id || null,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      precio: articulo.precio,
      existe: articulo.existe,
      esParaElaborar: articulo.esParaElaborar,
      imagenArticulo: articulo.imagenArticulo,
      subcategoria: {
        id: articulo.subcategoria.id,
        categoria: articulo.subcategoria.categoria?.id
          ? { id: Number(articulo.subcategoria.categoria.id) }
          : undefined,
      },
      unidadMedida: {
        id: articulo.unidadMedida.id,
      },
      tiempoEstimado: articulo.tiempoEstimado,
      preparacion: articulo.preparacion,
      sucursalId: 1,
      insumos: articulo.detalleInsumos.map((detalle) => ({
        articuloInsumo: { id: Number(detalle.articuloInsumo.id) },
        cantidad: detalle.cantidad,
      })),
    };

    try {
      const response = await axios.put(URL, dataToSend, axiosConfig);

      console.log("Se borro logicamente el articulo: " + response.status);
      cargarManufacturados();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert(
          "Error al eliminar el manufacturado. Por favor, intenta de nuevo."
        );
      }
    }
  };

  const cerrarDetalle = () => {
    setMostrarArticulo(null);
  };

  const cerrarForm = () => {
    setFormManufacturado(null);
  };

  const cargarManufacturados = async () => {
    const URL = `${host}/api/articuloManufacturado/full`;

    try {
      const response = await axios.get(URL, axiosConfig);
      setArticulosManufacturados(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert(
          "Error al cargar los manufacturados. Por favor, intenta de nuevo."
        );
      }
    }
  };

  useEffect(() => {
    let filtrado: ArticuloManufacturado[] = articulosManufacturados;

    if (buscador) {
      filtrado = filtrado.filter((articulo) =>
        articulo.nombre.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setArticulosManufacturadosMostrados(filtrado);
  }, [articulosManufacturados, buscador]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-10">
        {/**Tabla */}
        <div
          className={`bg-white w-11/12 m-auto rounded-2xl ${
            (mostrarArticulo || formManufacturado) && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex justify-between p-5 h-2/12">
            <h1 className="pl-5 text-4xl">Catálogo</h1>

            <div className="flex gap-5 pr-[2%] text-2xl">
              <button
                onClick={() =>
                  setFormManufacturado(new ArticuloManufacturado())
                }
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
            {/**Cabecera */}
            <div className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center">
              <h1>Categoría</h1>
              <h1>Nombre</h1>
              <h1>Precio</h1>
              <h1>Publicado</h1>
              <h1>Acciones</h1>
            </div>

            {/**Articulos */}
            {articulosManufacturadosMostrados.length > 0 &&
              articulosManufacturadosMostrados.map((articulo, index) => {
                if (
                  index < paginaSeleccionada * cantidadPorPagina &&
                  index >= cantidadPorPagina * (paginaSeleccionada - 1)
                ) {
                  return (
                    <div
                      key={articulo.id}
                      className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center"
                    >
                      <div>
                        <h3>{articulo.subcategoria.categoria?.denominacion}</h3>
                      </div>
                      <div>
                        <h3>{articulo.nombre}</h3>
                      </div>
                      <h3>${articulo.precio}</h3>
                      <div className="flex">
                        <div
                          className={`${
                            articulo.existe ? "bg-green-600" : "bg-gray-500"
                          } h-10 w-10 m-auto rounded-4xl`}
                        ></div>
                      </div>
                      <div className="flex justify-around">
                        <button onClick={() => setMostrarArticulo(articulo)}>
                          <img className="h-15" src="/svg/LogoVer.svg" alt="" />
                        </button>
                        <button onClick={() => setFormManufacturado(articulo)}>
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
                  articulosManufacturadosMostrados.length
                    ? paginaSeleccionada * cantidadPorPagina
                    : articulosManufacturadosMostrados.length}{" "}
                  de {articulosManufacturadosMostrados.length}
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
                        articulosManufacturadosMostrados.length /
                          cantidadPorPagina
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
                      articulosManufacturadosMostrados.length /
                        cantidadPorPagina
                    )
                  )
                }
              >
                <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
              </button>
            </div>
          </div>
        </div>

        {/**MostrarManufacturado */}
        <div className={`${!mostrarArticulo && "hidden"}`}>
          <AdminMostrarManufacturado
            articulo={mostrarArticulo}
            abrirEditar={setFormManufacturado}
            cerrarMostrar={cerrarDetalle}
          />
        </div>

        {/**Editar, crear manufacturado */}
        <div className={`${!formManufacturado && "hidden"}`}>
          <AdminFormManufacturado
            articulo={formManufacturado}
            cargarAdminCatalogo={cargarManufacturados}
            cerrarEditar={cerrarForm}
          />
        </div>
      </div>
    </>
  );
}
