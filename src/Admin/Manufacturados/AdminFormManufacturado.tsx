import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  ArticuloManufacturado,
  ArticuloManufacturadoDetalleInsumo,
  Categoria,
  host,
  Subcategoria,
  Sucursal,
  UnidadMedida,
} from "../../../ts/Clases";
import { useCloudinary } from "../../useCloudinary";
import SelectorInsumo from "./SelectorInsumo";
import axios from "axios";

interface Props {
  articulo: ArticuloManufacturado | null;
  cerrarEditar: () => void;
  cargarAdminCatalogo: () => void;
}

export default function AdminFormManufacturado({
  articulo,
  cerrarEditar,
  cargarAdminCatalogo,
}: Props) {
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaSubcategorias, setListaSubcategorias] = useState<Subcategoria[]>(
    []
  );
  const [sucursalActual, setSucursalActual] = useState<Sucursal>();
  const [form, setForm] = useState<ArticuloManufacturado>(
    new ArticuloManufacturado()
  );
  const [indexCategoria, setIndexCategoria] = useState<number | null>(null);
  const [seleccionarArticulo, setSeleccionarArticulo] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState(1);

  const {
    image,
    loading: subiendoImagen,
    uploadImage,
    setImage,
  } = useCloudinary();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener token del localStorage
  const getToken = () => localStorage.getItem("token");

  // Configurar axios con el token usando useMemo
  const axiosConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }),
    []
  );

  const traerCategorias = useCallback(async () => {
    const URLCategorias = `${host}/api/categoria/full`;

    try {
      const response = await axios.get(URLCategorias, axiosConfig);
      setListaCategorias(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert("Error al cargar las categorías. Por favor, intenta de nuevo.");
      }
    }
  }, [axiosConfig]);

  const traerSubcategorias = useCallback(
    async (categoriaNombre: string) => {
      const URLSubcategorias = `${host}/api/subcategoria/nombreCategoria?nombre=${encodeURIComponent(
        categoriaNombre
      )}`;

      try {
        const response = await axios.get(URLSubcategorias, axiosConfig);
        setListaSubcategorias(response.data);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        } else {
          alert(
            "Error al cargar las subcategorías. Por favor, intenta de nuevo."
          );
        }
      }
    },
    [axiosConfig]
  );

  const traerSucursal = useCallback(async () => {
    const URLSucursal = `${host}/api/sucursales/1`;

    try {
      const response = await axios.get(URLSucursal, axiosConfig);
      setSucursalActual(response.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert("Error al cargar la sucursal. Por favor, intenta de nuevo.");
      }
    }
  }, [axiosConfig]);

  //Carga de categorias
  useEffect(() => {
    traerSucursal();
    traerCategorias();
  }, [traerSucursal, traerCategorias]);

  // Load subcategories when category changes
  useEffect(() => {
    if (indexCategoria && listaCategorias.length > 0) {
      const categoriaSeleccionada = listaCategorias.find(
        (cat) => cat.id === indexCategoria
      );
      if (categoriaSeleccionada?.denominacion) {
        traerSubcategorias(categoriaSeleccionada.denominacion);
      }
    }
  }, [indexCategoria, listaCategorias, traerSubcategorias]);

  useEffect(() => {
    if (articulo) {
      setForm(articulo);
      if (articulo.imagenArticulo) {
        setImage(articulo.imagenArticulo);
      }
      //Si el articulo es para editar, se asigna la categoria del articulo al select
      if (articulo.subcategoria.id && articulo.subcategoria.categoria) {
        setIndexCategoria(Number(articulo.subcategoria.categoria.id));
        // Load subcategories for the article's category
        if (articulo.subcategoria.categoria.denominacion) {
          traerSubcategorias(articulo.subcategoria.categoria.denominacion);
        }
        //Si es un articulo nuevo, se asigna la primera categoria en la lista de categorias
      } else {
        setIndexCategoria(null);
      }
    }
  }, [articulo, listaCategorias, setImage, traerSubcategorias]);

  const cerrarFormulario = () => {
    cargarAdminCatalogo();
    cerrarEditar();
    setSeccionActiva(1);
    setImage("");
    setIndexCategoria(1);
  };

  const handleSubmit = async () => {
    try {
      let unidadMedidaManufacturado = new UnidadMedida();
      unidadMedidaManufacturado = {
        id: 1,
        unidad: "unidad",
      };

      let formFinal = { ...form };
      formFinal = { ...formFinal, unidadMedida: unidadMedidaManufacturado };

      // Clean up subcategorias to avoid circular references
      delete formFinal.subcategoria.categoria?.subcategorias;

      if (image) {
        formFinal = { ...formFinal, imagenArticulo: image };
      }

      setForm(formFinal);

      const guardadoExitoso = await guardarArticuloManufacturado(formFinal);

      if (guardadoExitoso) {
        console.log("Se guardo el articulo");
        cerrarFormulario();
      } else {
        console.error("Error al guardar el articulo");
        alert("Error al guardar el articulo. Operacion cancelada");
      }
    } catch (error) {
      console.error("Ocurrio un error en handleSubmit:", error);
      alert("Ocurrio un error inesperado. Intente de nuevo.");
    }
  };

  const guardarArticuloManufacturado = async (form: ArticuloManufacturado) => {
    const URL = form.id
      ? `${host}/api/articuloManufacturado/actualizar/${form.id}`
      : `${host}/api/articuloManufacturado/crear`;

    // Transform data to match API structure
    const dataToSend = {
      id: form.id || null,
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: form.precio,
      existe: form.existe,
      esParaElaborar: form.esParaElaborar,
      imagenArticulo: form.imagenArticulo,
      subcategoria: {
        id: form.subcategoria.id,
        categoria: form.subcategoria.categoria?.id
          ? { id: Number(form.subcategoria.categoria.id) }
          : undefined,
      },
      unidadMedida: {
        id: form.unidadMedida.id,
      },
      tiempoEstimado: form.tiempoEstimado,
      preparacion: form.preparacion,
      sucursalId: sucursalActual?.id ?? 1,
      insumos: form.detalleInsumos.map((detalle) => ({
        articuloInsumo: { id: Number(detalle.articuloInsumo.id) },
        cantidad: detalle.cantidad,
      })),
    };

    console.log("Datos a enviar al API:", JSON.stringify(dataToSend, null, 2));

    try {
      if (form.id) {
        const response = await axios.put(URL, dataToSend, axiosConfig);

        console.log("Se actualizo el articulo: ", response.status);
        return true;
      } else {
        const response = await axios.post(URL, dataToSend, axiosConfig);

        console.log("Se guardo el articulo", response.status);
        return true;
      }
    } catch (error) {
      console.error("ERROR", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        alert(
          "Error al guardar el manufacturado. Por favor, intenta de nuevo."
        );
      }
      return false;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImage(e);
    if (imageUrl) {
      setForm((prev) => {
        const newFormData = new ArticuloManufacturado();
        Object.assign(newFormData, prev);
        newFormData.imagenArticulo = imageUrl;
        return newFormData;
      });
    }
  };

  const siguienteSeccion = () => {
    setSeccionActiva((prev) => (prev < 5 ? prev + 1 : 5));
  };

  const anteriorSeccion = () => {
    setSeccionActiva((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const cerrarSeleccionarArticulo = () => {
    setSeleccionarArticulo(false);
  };

  if (!form) return null;

  return (
    <>
      <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">
        {/**Cabecera formulario */}
        <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
          <h1 className="text-white">Detalle Producto</h1>
          <button onClick={cerrarFormulario} className="p-2 rounded-xl">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z"
                fill="black"
              />
            </svg>
          </button>
        </div>

        {/**Formulario */}
        <div
          className="p-10 grid grid-cols-1 text-white 
                    [&_input]:focus:outline-none [&_input]:border-b [&_input]:py-2 [&_input]:w-full 
                    [&_h4]:text-red-400 [&_h4]:text-xl 
                    [&_select]:focus:outline-none [&_select]:border-b [&_select]:py-5 [&_select]:w-full 
                    [&_option]:text-black"
        >
          {/**Informacion basica */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">1</h1>
              </div>
              <div className=" text-3xl">
                <h2>Información Básica</h2>
              </div>
            </div>

            {/**Contenido */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="h-full min-h-5 w-7">
                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl"></div>
              </div>
              <div
                className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-500 ease-in-out ${
                                  seccionActiva == 1
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div>
                  <h3>Nombre:</h3>
                  <input
                    value={form?.nombre}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                    className="w-full"
                    type="text"
                  />
                  {!form.nombre && <h4>Campo incompleto</h4>}
                </div>
                <div className="grid grid-cols-2 gap-20">
                  <div className="flex flex-col">
                    <h3>Precio de venta:</h3>
                    <input
                      value={form.precio ? form.precio : ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          precio: Number(e.target.value),
                        }))
                      }
                      type="number"
                    />
                    {!form.precio && <h4>Campo incompleto</h4>}
                  </div>
                  <div>
                    <h3>Tiempo estimado{"(en minutos)"}:</h3>
                    <input
                      value={form.tiempoEstimado.split(" ")[0]}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          tiempoEstimado: e.target.value,
                        }))
                      }
                      type="number"
                    />
                    {!form.tiempoEstimado && <h4>Campo incompleto</h4>}
                  </div>
                </div>
                <div>
                  <h3>Descripcion:</h3>
                  <textarea
                    className="focus:outline-none border-b py-2 w-full"
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        descripcion: e.target.value,
                      }))
                    }
                  />
                  {!form.descripcion && <h4>Campo incompleto</h4>}
                </div>
                <div>
                  <button
                    onClick={() => {
                      if (
                        form.nombre &&
                        form.precio &&
                        form.tiempoEstimado &&
                        form.descripcion
                      ) {
                        siguienteSeccion();
                      } else {
                        return "<h2>Debe llenar todos los campos</h2>";
                      }
                    }}
                    className="bg-[#D93F21] p-2 rounded-4xl"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/**Agrega una imagen */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">2</h1>
              </div>
              <div className=" text-3xl">
                <h2>Agrega una imagen</h2>
              </div>
            </div>

            {/**Contenido */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="h-full min-h-5 w-7">
                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl"></div>
              </div>
              {/**Cargar imagen y vista previa */}
              <div
                className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-500 ease-in-out ${
                                  seccionActiva == 2
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div className="grid grid-cols-2 gap-5 items-center">
                  <div className="bg-[#D9D9D9] h-50 rounded-4xl">
                    {image ? (
                      <img
                        className="h-full w-full object-cover rounded-4xl"
                        src={image}
                        alt=""
                      />
                    ) : null}
                  </div>
                  <div>
                    <h3>Agregar imagen:</h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={subiendoImagen}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {subiendoImagen ? "Subiendo..." : "Seleccionar imagen"}
                    </button>
                  </div>
                </div>
                {!image && <h4>Debe cargar una imagen</h4>}
                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                  <button
                    onClick={anteriorSeccion}
                    className="bg-white text-black"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={image ? siguienteSeccion : () => {}}
                    className="bg-[#D93F21]"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/**Selecciona las categorias */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">3</h1>
              </div>
              <div className=" text-3xl">
                <h2>Selecciona las categorias</h2>
              </div>
            </div>

            {/**Contenido */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="h-full min-h-5 w-7">
                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl"></div>
              </div>
              <div
                className={`text-2xl *:py-5 
                                overflow-y-auto
                                transition-all duration-500 ease-in-out 
                                ${
                                  seccionActiva == 3
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div>
                  <h3>Preparacion:</h3>
                  <textarea
                    value={form.preparacion}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        preparacion: e.target.value,
                      }))
                    }
                    className="focus:outline-none border-b py-2 w-full"
                    name="preparacion"
                  ></textarea>
                </div>
                <div>
                  <h3>Categoria:</h3>
                  <select
                    value={indexCategoria ?? ""}
                    onChange={(e) => setIndexCategoria(Number(e.target.value))}
                    name="categoria"
                  >
                    <option value="" disabled>
                      Seleccionar...
                    </option>
                    {listaCategorias.length > 0 &&
                      listaCategorias.map((categoria) => (
                        <option key={categoria.id} value={Number(categoria.id)}>
                          {categoria.denominacion}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <h3>Subcategoria:</h3>
                  {/**Value se establece en "" para que siempre muestre seleccionar,
                   * pero el onChange sigue asignando la subcategoria correctamente
                   */}
                  <select
                    value={""}
                    onChange={(e) => {
                      const buscarSubcat: Subcategoria | undefined =
                        listaSubcategorias.find(
                          (subcat) => subcat.id === Number(e.target.value)
                        );

                      if (buscarSubcat) {
                        // Clean up to avoid circular references
                        const subcatLimpia = { ...buscarSubcat };
                        if (subcatLimpia.categoria) {
                          subcatLimpia.categoria.subcategorias = [];
                        }

                        setForm((prev) => ({
                          ...prev,
                          subcategoria: subcatLimpia,
                        }));
                      }
                    }}
                    name="subcategoria"
                  >
                    <option value="" disabled>
                      Seleccionar...
                    </option>

                    {listaSubcategorias.length > 0 &&
                      listaSubcategorias.map((subcategoria) => {
                        return (
                          <option
                            key={subcategoria.id}
                            value={Number(subcategoria.id)}
                          >
                            {subcategoria.denominacion}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div>
                  <label className="">
                    Categorias seleccionadas:{" "}
                    {form.subcategoria.id
                      ? `${form.subcategoria.categoria?.denominacion} - ${form.subcategoria.denominacion}`
                      : "Ninguna"}
                  </label>
                </div>

                <div>
                  {!form.subcategoria.id && (
                    <h4>Debe seleccionar las categorias para continuar</h4>
                  )}
                </div>
                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                  <button
                    onClick={anteriorSeccion}
                    className="bg-white text-black"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={form.subcategoria.id ? siguienteSeccion : () => {}}
                    className="bg-[#D93F21]"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/**Especifica los ingredientes */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">4</h1>
              </div>
              <div className=" text-3xl">
                <h2>Especifica los ingredientes</h2>
              </div>
            </div>

            {/**Contenido */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="h-full min-h-5 w-7">
                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl"></div>
              </div>
              <div
                className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-500 ease-in-out ${
                                  seccionActiva == 4
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div>
                  <div className="grid grid-cols-[2fr_2fr_1fr_1fr] py-5">
                    <h3>Insumo:</h3>
                    <h3>Cantidad:</h3>
                  </div>
                  {/**Se listan los ingredientes y se modifica
                   * la cantidad utilizando el input
                   * Luego unidad de medida y boton para borrar ingrediente
                   */}
                  {form.detalleInsumos.length > 0 &&
                    form.detalleInsumos.map((detalle, index) => {
                      const insumo = detalle?.articuloInsumo;
                      const insumoId = insumo?.id ?? index;
                      const nombreInsumo = insumo?.nombre ?? "";
                      const unidadInsumo = insumo?.unidadMedida?.unidad ?? "";

                      return (
                        <div
                          key={insumoId}
                          className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center"
                        >
                          <h3>{nombreInsumo}</h3>
                          <input
                            value={detalle.cantidad ? detalle.cantidad : ""}
                            onChange={(e) => {
                              setForm((prev) => {
                                const nuevosDetalles: ArticuloManufacturadoDetalleInsumo[] =
                                  prev.detalleInsumos.map((det) => {
                                    const detInsumoId =
                                      det?.articuloInsumo?.id ?? -1;
                                    return detInsumoId === (insumo?.id ?? -1)
                                      ? {
                                          ...det,
                                          cantidad: Number(e.target.value),
                                        }
                                      : det;
                                  });

                                return {
                                  ...prev,
                                  detalleInsumos: nuevosDetalles,
                                };
                              });
                            }}
                            type="number"
                          />
                          <h3>{unidadInsumo}</h3>
                          {/**Borra el detalle correspondiente del array
                           * detallesInsumos
                           */}
                          <button
                            onClick={() => {
                              setForm((prev) => {
                                return {
                                  ...prev,
                                  detalleInsumos: prev.detalleInsumos.filter(
                                    (det) =>
                                      (det?.articuloInsumo?.id ?? -1) !==
                                      (insumo?.id ?? -2)
                                  ),
                                };
                              });
                            }}
                          >
                            <img src="/svg/BorrarDetalle.svg" alt="" />
                          </button>
                        </div>
                      );
                    })}
                </div>

                <div>
                  <button
                    onClick={() => setSeleccionarArticulo(true)}
                    className="bg-white px-2 text-[#D93F21]"
                  >
                    Agregar ingrediente
                  </button>
                </div>

                <SelectorInsumo
                  abierto={seleccionarArticulo}
                  cerrar={cerrarSeleccionarArticulo}
                  setForm={setForm}
                />

                {form.detalleInsumos.length < 2 && (
                  <h4>Debe ingresar por lo menos 2 ingredientes</h4>
                )}

                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                  <button
                    onClick={anteriorSeccion}
                    className="bg-white text-black"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={
                      form.detalleInsumos.length >= 2
                        ? siguienteSeccion
                        : () => {}
                    }
                    className="bg-[#D93F21]"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/**Confirmar */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">5</h1>
              </div>
              <div className=" text-3xl">
                <h2>Confirmar</h2>
              </div>
            </div>

            {/**Contenido */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="h-full w-7">
                <div className="text-center m-auto h-full w-1 rounded-4xl text-2xl"></div>
              </div>
              <div
                className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-500 ease-in-out ${
                                  seccionActiva == 5
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div className="w-2/4">
                  <div className="bg-[#99999959] w-full rounded-2xl flex flex-col gap-1">
                    {/**Imagen y tiempo */}
                    <div className="relative">
                      {image || form.imagenArticulo ? (
                        <img
                          className=" w-10/12 mt-2 mb-0 m-auto rounded-2xl"
                          src={image || String(form.imagenArticulo)}
                          alt="No se encontro la imagen"
                        />
                      ) : null}
                      {form.tiempoEstimado && (
                        <div className="absolute bottom-0 left-1/12 bg-white m-auto text-center text-black p-1 rounded-bl-2xl rounded-tr-2xl ">
                          <h1 className="text-xl">
                            {`${form.tiempoEstimado.split(" ")[0]}-${
                              Number(form.tiempoEstimado.split(" ")[0]) + 5
                            }`}{" "}
                            min
                          </h1>
                        </div>
                      )}
                    </div>
                    {/**Nombre, precio, categoria */}
                    <div className="w-10/12 m-auto">
                      <h1 className="text-3xl">{form.nombre}</h1>
                      <div className="flex gap-5">
                        <h2>${form.precio}</h2>
                        <h2>
                          {form.subcategoria.categoria?.denominacion} -{" "}
                          {form.subcategoria.denominacion}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="grid grid-cols-[1fr_10fr] justify-center items-center">
                    <input
                      checked={form.existe}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          existe: e.target.checked,
                        }))
                      }
                      className="h-5"
                      type="checkbox"
                    />
                    <label>¿Desea publicarlo en el catálogo?</label>
                  </div>
                  <div className="flex justify-center gap-5 *:p-2 *:rounded-4xl">
                    <button
                      onClick={anteriorSeccion}
                      className="bg-white text-black"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() =>
                        form.nombre && form.descripcion && image
                          ? handleSubmit()
                          : () => {}
                      }
                      className="bg-[#D93F21]"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
