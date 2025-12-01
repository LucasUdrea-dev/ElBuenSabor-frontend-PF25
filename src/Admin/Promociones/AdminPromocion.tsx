import { useEffect, useState } from "react";
import { axiosConfig, host, Promocion } from "../../../ts/Clases.ts"; // Adjust the path as needed

import axios from "axios";
import AdminMostrarPromocion from "./AdminMostrarPromocion.tsx";
import AdminFormPromocion from "./AdminFormPromocion.tsx";

export default function AdminPromocion() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [promocionesMostradas, setPromocionesMostradas] = useState<Promocion[]>(
    []
  );
  const [buscador, setBuscador] = useState("");
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(1);
  const [mostrarPromocion, setMostrarPromocion] = useState<Promocion | null>(
    null
  );
  const [formPromocion, setFormPromocion] = useState<Promocion | null>(null);

  const cantidadPorPagina = 10;

  useEffect(() => {
    cargarPromociones();
  }, []);

  const borradoLogico = async (promocion: Promocion) => {
    const URL = host + `/api/promociones/${promocion.id}`;

    promocion.existe = !promocion.existe;

    try {
      const response = await axios.put(URL, promocion, axiosConfig);

      console.log("Se borro logicamente el articulo: " + response.status);
      cargarPromociones();
    } catch (error) {
      console.error(error);
    }
  };

  const cerrarDetalle = () => {
    setMostrarPromocion(null);
  };

  const cerrarForm = () => {
    setFormPromocion(null);
  };

  const cargarPromociones = async () => {
    const URL = host + "/api/promociones";

    try {
      const response = await axios.get(URL);
      setPromociones(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let filtrado: Promocion[] = promociones;

    if (buscador) {
      filtrado = filtrado.filter((promocion) =>
        promocion.denominacion.toLowerCase().includes(buscador.toLowerCase())
      );
    }

    setPaginaSeleccionada(1);
    setPromocionesMostradas(filtrado);
  }, [promociones, buscador]);

  return (
    <>
      <div className="bg-[#333333] w-full min-h-screen py-10">
        {/**Tabla */}
        <div
          className={`bg-white w-11/12 m-auto rounded-2xl ${
            (mostrarPromocion || formPromocion) && "hidden"
          }`}
        >
          {/**Titulo, agregar y buscador */}
          <div className="flex justify-between p-5 h-2/12">
            <h1 className="pl-5 text-4xl">Catálogo</h1>

            <div className="flex gap-5 pr-[2%] text-2xl">
              <button
                onClick={() => setFormPromocion(new Promocion())}
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
              <h1>Imagen</h1>
              <h1>Nombre</h1>
              <h1>Precio</h1>
              <h1>Publicado</h1>
              <h1>Acciones</h1>
            </div>

            {/**Articulos */}
            {promocionesMostradas.length > 0 &&
              promocionesMostradas.map((promocion, index) => {
                if (
                  index < paginaSeleccionada * cantidadPorPagina &&
                  index >= cantidadPorPagina * (paginaSeleccionada - 1)
                ) {
                  return (
                    <div
                      key={promocion.id}
                      className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center"
                    >
                      <div
                        className="bg-cover bg-no-repeat bg-center"
                        style={{
                          backgroundImage: `url('${promocion.imagen}')`,
                        }}
                      ></div>

                      <div>
                        <h3>{promocion.denominacion}</h3>
                      </div>

                      <h3>${promocion.precioRebajado}</h3>

                      <div className="flex">
                        <div
                          className={`${
                            promocion.existe ? "bg-green-600" : "bg-gray-500"
                          } h-10 w-10 m-auto rounded-4xl`}
                        ></div>
                      </div>

                      <div className="flex justify-around">
                        <button onClick={() => setMostrarPromocion(promocion)}>
                          <img className="h-15" src="/svg/LogoVer.svg" alt="" />
                        </button>
                        <button onClick={() => setFormPromocion(promocion)}>
                          <img
                            className="h-15"
                            src="/svg/LogoEditar.svg"
                            alt=""
                          />
                        </button>
                        <button
                          onClick={() => {
                            borradoLogico(promocion);
                          }}
                        >
                          <img
                            className="h-15"
                            src={`/svg/${
                              promocion.existe
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
                  promocionesMostradas.length
                    ? paginaSeleccionada * cantidadPorPagina
                    : promocionesMostradas.length}{" "}
                  de {promocionesMostradas.length}
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
                      Math.ceil(promocionesMostradas.length / cantidadPorPagina)
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
                    Math.ceil(promocionesMostradas.length / cantidadPorPagina)
                  )
                }
              >
                <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
              </button>
            </div>
          </div>
        </div>

        {/**MostrarManufacturado */}
        <div className={`${!mostrarPromocion && "hidden"}`}>
          <AdminMostrarPromocion
            promocion={mostrarPromocion}
            abrirEditar={setFormPromocion}
            cerrarMostrar={cerrarDetalle}
          />
        </div>

        {/**Editar, crear manufacturado */}
        <div className={`${!formPromocion && "hidden"}`}>
          <AdminFormPromocion
            promocion={formPromocion}
            cargarAdminCatalogo={cargarPromociones}
            cerrarEditar={cerrarForm}
          />
        </div>
      </div>
    </>
  );
}
