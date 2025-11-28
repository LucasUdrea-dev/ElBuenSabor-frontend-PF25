import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  ArticuloInsumo,
  Categoria,
  host,
  StockArticuloInsumo,
  Subcategoria,
  Sucursal,
  tiposUnidadMedida,
} from "../../../ts/Clases";
import { useCloudinary } from "../../useCloudinary";
import axios from "axios";

interface Props {
  articulo: ArticuloInsumo | null;
  cerrarEditar: () => void;
  cargarAdminInsumo: () => void;
}

export default function AdminFormInsumo({
  articulo,
  cerrarEditar,
  cargarAdminInsumo,
}: Props) {
  const [sucursalActual, setSucursalActual] = useState<Sucursal>(
    new Sucursal()
  );
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaSubcategorias, setListaSubcategorias] = useState<Subcategoria[]>(
    []
  );
  const [form, setForm] = useState<ArticuloInsumo>(new ArticuloInsumo());
  const [indexCategoria, setIndexCategoria] = useState(1);
  const [seccionActiva, setSeccionActiva] = useState(1);

  const {
    image,
    loading: subiendoImagen,
    uploadImage,
    setImage,
  } = useCloudinary();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const guardandoRef = useRef(false);
  const [estaGuardando, setEstaGuardando] = useState(false);

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
    const URLCategorias = `${host}/api/Categoria/full`;

    try {
      const response = await axios.get(URLCategorias, axiosConfig);

      // Filter only categories that are "esParaElaborar" (for manufacturing/insumos)
      const categoriasParaElaborar = response.data.filter(
        (cat: Categoria) => cat.esParaElaborar === true
      );
      setListaCategorias(categoriasParaElaborar);
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
          // Opcional: redirigir al login
          // window.location.href = "/login";
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
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al cargar la sucursal. Por favor, intenta de nuevo.");
      }
    }
  }, [axiosConfig]);

  //Carga de categorias
  useEffect(() => {
    traerCategorias();
    traerSucursal();
  }, [traerCategorias, traerSucursal]);

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
      } else if (listaCategorias.length > 0) {
        setIndexCategoria(Number(listaCategorias[0].id));
      }
    }
  }, [articulo, listaCategorias, setImage, traerSubcategorias]);

  const cerrarFormulario = () => {
    cargarAdminInsumo();
    cerrarEditar();
    setSeccionActiva(1);
    setImage("");
    setIndexCategoria(1);
  };

  const handleSubmit = async () => {
    if (guardandoRef.current) return; // evitar doble envío
    guardandoRef.current = true;
    setEstaGuardando(true);
    try {
      let formFinal = { ...form };

      const sucursalFinal = { ...sucursalActual };

      if (!formFinal.stockArticuloInsumo) {
        formFinal.stockArticuloInsumo = new StockArticuloInsumo();
      }

      // Set the sucursal object (backend might need it)
      formFinal.stockArticuloInsumo.sucursal = sucursalFinal;

      // Clean up subcategorias to avoid circular references
      delete formFinal.subcategoria.categoria?.subcategorias;

      if (image) {
        formFinal = { ...formFinal, imagenArticulo: image };
      }

      setForm(formFinal);

      const guardadoExitoso = await guardarArticuloInsumo(formFinal);

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
    } finally {
      guardandoRef.current = false;
      setEstaGuardando(false);
    }
  };

  const guardarArticuloInsumo = async (form: ArticuloInsumo) => {
    const URL = form.id
      ? `${host}/api/insumos/actualizar/${form.id}`
      : `${host}/api/insumos/crear`;

    const esCreacion = !form.id;
    const cantidadDefault = 100; // default when creating
    const minStockDefault = 10; // default when creating

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
        denominacion: form.subcategoria.denominacion || "",
        categoria: form.subcategoria.categoria
          ? {
              id: form.subcategoria.categoria.id,
              denominacion: form.subcategoria.categoria.denominacion || "",
              esParaElaborar:
                form.subcategoria.categoria.esParaElaborar || false,
              imagen: form.subcategoria.categoria.imagen || "",
            }
          : null,
      },
      unidadMedida: {
        id: form.unidadMedida.id,
        unidad: form.unidadMedida.unidad || "",
      },
      precioCompra: form.precioCompra,
      stockArticuloInsumo: {
        id: form.stockArticuloInsumo.id || null,
        minStock: esCreacion
          ? minStockDefault
          : form.stockArticuloInsumo.minStock,
        cantidad: esCreacion
          ? cantidadDefault
          : form.stockArticuloInsumo.cantidad,
        sucursalId:
          form.stockArticuloInsumo.sucursal?.id || sucursalActual.id || 1,
      },
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
        // Opcional: redirigir al login
        // window.location.href = "/login";
      } else {
        alert("Error al guardar el insumo. Por favor, intenta de nuevo.");
      }
      return false;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImage(e);
    if (imageUrl) {
      setForm((prev) => {
        const newFormData = new ArticuloInsumo();
        Object.assign(newFormData, prev);
        newFormData.imagenArticulo = imageUrl;
        return newFormData;
      });
    }
  };

  const siguienteSeccion = () => {
    setSeccionActiva((prev) => prev + 1);
  };

  const anteriorSeccion = () => {
    setSeccionActiva((prev) => prev - 1);
  };

  if (!form) return null;

  return (
    <>
      <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">
        {/**Cabecera formulario */}
        <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
          <h1 className="text-white">Detalle Insumo</h1>
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
                    <h3>Precio de compra{"(p/U)"}:</h3>
                    <input
                      value={form.precioCompra ? form.precioCompra : ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          precioCompra: Number(e.target.value),
                        }))
                      }
                      type="number"
                    />
                    {!form.precioCompra && <h4>Campo incompleto</h4>}
                  </div>
                </div>
                <div>
                  <h3>Unidad de medida: {form.unidadMedida.unidad}</h3>
                  <select
                    value={form.unidadMedida.id ? form.unidadMedida.id : 0}
                    onChange={(e) =>
                      setForm((prev) => {
                        const unidadEncontrada = tiposUnidadMedida.find(
                          (unidad) => unidad.id == Number(e.target.value)
                        );
                        if (unidadEncontrada) {
                          return { ...prev, unidadMedida: unidadEncontrada };
                        }

                        return prev;
                      })
                    }
                  >
                    <option value={0}>Seleccionar...</option>
                    {tiposUnidadMedida.map((unidadMedida) => (
                      <option
                        key={unidadMedida.id}
                        value={Number(unidadMedida.id)}
                      >
                        {unidadMedida.unidad}
                      </option>
                    ))}
                  </select>
                  {!form.unidadMedida.id && <h4>Campo sin seleccionar</h4>}
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
                        form.precioCompra &&
                        form.descripcion &&
                        form.unidadMedida.id
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

          {/**Selecciona las categorias */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">2</h1>
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
                                  seccionActiva == 2
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div>
                  <h3>Categoria:</h3>
                  <select
                    value={indexCategoria}
                    onChange={(e) => setIndexCategoria(Number(e.target.value))}
                    name="categoria"
                  >
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

          {/**Agrega una imagen */}
          <div>
            {/**Titulo seccion */}
            <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
              <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                <h1 className="m-auto h-7 text-black">3</h1>
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
                                  seccionActiva == 3
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div className="grid grid-cols-2 gap-5 items-center">
                  <div className="bg-[#D9D9D9] h-50 rounded-4xl">
                    {image && (
                      <img
                        className="h-full w-full object-cover rounded-4xl"
                        src={image}
                        alt=""
                      />
                    )}
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
                    onClick={
                      image || articulo?.imagenArticulo
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
                <h1 className="m-auto h-7 text-black">4</h1>
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
                                  seccionActiva == 4
                                    ? "max-h-screen"
                                    : "max-h-0"
                                }`}
              >
                <div className="w-2/4">
                  <div className="bg-[#99999959] w-full rounded-2xl flex flex-col gap-1">
                    {/**Imagen y tiempo */}
                    <div className="relative">
                      {image && (
                        <img
                          className=" w-10/12 mt-2 mb-0 m-auto rounded-2xl"
                          src={image}
                          alt="No se encontro la imagen"
                        />
                      )}
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
                    <label>¿Desea que esté disponible?</label>
                    <input
                      checked={form.esParaElaborar}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          esParaElaborar: e.target.checked,
                        }))
                      }
                      className="h-5"
                      type="checkbox"
                    />
                    <label>¿Es para elaborar?</label>
                  </div>
                  <div className="flex justify-center gap-5 *:p-2 *:rounded-4xl">
                    <button
                      onClick={anteriorSeccion}
                      className="bg-white text-black"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        form.nombre && form.descripcion && image
                          ? handleSubmit()
                          : () => {}
                      }
                      disabled={estaGuardando}
                      className={`bg-[#D93F21] ${
                        estaGuardando ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {estaGuardando ? "Guardando..." : "Guardar"}
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
