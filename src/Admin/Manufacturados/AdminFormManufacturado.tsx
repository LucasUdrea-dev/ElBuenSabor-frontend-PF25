import { useEffect, useState } from "react";
import { ArticuloManufacturado, Categoria, Subcategoria } from "../../../ts/Clases"
import { obtenerImagen } from "../../../ts/Imagen";

interface Props{
    articulo: ArticuloManufacturado | null;
    cerrarEditar: ()=> void;
}

export default function AdminFormManufacturado({articulo, cerrarEditar}: Props) {

    const [listaCategorias, setListaCategorias] = useState<Categoria[]>([])
    const [form, setForm] = useState<ArticuloManufacturado >(new ArticuloManufacturado())
    const [imagen, setImagen] = useState<File | null>(null)
    const [previewImagen, setPreviewImagen] = useState<string | null>(null)
    const [indexCategoria, setIndexCategoria] = useState(0)
    const [seccionActiva, setSeccionActiva] = useState(1)

    //Carga de categorias
    useEffect(()=>{
        // Definición de las categorías y subcategorías
        // Función auxiliar para crear subcategorías (simplificada para este contexto)
        const createSubcategoria = (id: number, denominacion: string, categoria: Categoria): Subcategoria => ({
            id,
            denominacion,
            categoria,
        });

        // Array principal que contendrá todas las categorías
        const categorias: Categoria[] = [];

        // --- Categorías Existentes ---

        // Categoria: Comida Italiana
        const comidaItaliana: Categoria = {
            id: 1,
            denominacion: "Comida Italiana",
            imagen: "comida-italiana.jpg", // Asumo un nombre de imagen para la categoría
            subcategorias: []
        };
        comidaItaliana.subcategorias.push(
            createSubcategoria(1, "Pizzas", comidaItaliana),
            createSubcategoria(2, "Pastas", comidaItaliana)
        );
        categorias.push(comidaItaliana);

        // Categoria: Fast Food
        const fastFood: Categoria = {
            id: 2,
            denominacion: "Fast Food",
            imagen: "fast-food.jpg", // Asumo un nombre de imagen
            subcategorias: []
        };
        fastFood.subcategorias.push(
            createSubcategoria(3, "Hamburguesas", fastFood)
        );
        categorias.push(fastFood);

        // Para la "Subcategoria Insumos Varios", si se necesita una categoría padre
        // Podríamos crear una categoría general "Insumos" o "Materia Prima"
        const insumos: Categoria = {
            id: 3, // Nuevo ID para esta categoría
            denominacion: "Insumos",
            imagen: "insumos.jpg",
            subcategorias: []
        };
        insumos.subcategorias.push(
            createSubcategoria(4, "Insumos Varios", insumos) // Reutilizamos el concepto de subcategoría
        );
        categorias.push(insumos);

        // --- Nuevas Categorías ---

        // Categoria: Bebidas
        const bebidas: Categoria = {
            id: 4, // Nuevo ID
            denominacion: "Bebidas",
            imagen: "bebidas.jpg",
            subcategorias: []
        };
        bebidas.subcategorias.push(
            createSubcategoria(5, "Gaseosas", bebidas),
            createSubcategoria(6, "Jugos Naturales", bebidas),
            createSubcategoria(7, "Cervezas", bebidas)
        );
        categorias.push(bebidas);

        // Categoria: Postres
        const postres: Categoria = {
            id: 5, // Nuevo ID
            denominacion: "Postres",
            imagen: "postres.jpg",
            subcategorias: []
        };
        postres.subcategorias.push(
            createSubcategoria(8, "Helados", postres),
            createSubcategoria(9, "Tortas y Tartas", postres),
            createSubcategoria(10, "Panadería Dulce", postres)
        );
        categorias.push(postres);

        // Categoria: Ensaladas
        const ensaladas: Categoria = {
            id: 6, // Nuevo ID
            denominacion: "Ensaladas",
            imagen: "ensaladas.jpg",
            subcategorias: []
        };
        ensaladas.subcategorias.push(
            createSubcategoria(11, "Ensaladas Clásicas", ensaladas),
            createSubcategoria(12, "Ensaladas Gourmet", ensaladas),
            createSubcategoria(13, "Wraps y Bowls", ensaladas)
        );
        categorias.push(ensaladas);

        setListaCategorias(categorias)

    }, [])

    useEffect(()=>{
        if (articulo) {
            setIndexCategoria(Number(articulo.subcategoria.categoria?.id))
            setForm(articulo)
            setPreviewImagen(obtenerImagen(articulo.imagen))
        }
    },[articulo])

    const cerrarFormulario = ()=>{
        cerrarEditar()
        setSeccionActiva(1)
        setImagen(null)
        setPreviewImagen(null)
    }

    const handleImagen = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files ? e.target.files[0] : null;
        setImagen(file)

        if (file) {
            const lector = new FileReader()
            lector.onloadend = ()=>{
                setPreviewImagen(lector.result as string)
            }
            lector.readAsDataURL(file)
        }else{
            setPreviewImagen(obtenerImagen(String(articulo?.imagen)))
        }
    }

    const siguienteSeccion = ()=>{
        setSeccionActiva((prev)=> prev + 1)
    }

    const anteriorSeccion = ()=>{
        setSeccionActiva((prev)=> prev - 1)
    }

    useEffect(()=>{
        console.log(form)
    }, [form])

    if (!form) return null;
    
    return(
        <>
        
            <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">

                {/**Cabecera formulario */}
                <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
                    <h1>Detalle Producto</h1>
                    <button onClick={cerrarFormulario} className="p-2 rounded-xl">

                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z" fill="black"/>
                        </svg>

                    </button>
                </div>

                {/**Formulario */}
                <div className="p-10 grid grid-cols-1 text-white 
                    [&_input]:focus:outline-none [&_input]:border-b [&_input]:py-2 [&_input]:w-full 
                    [&_h4]:text-red-400 [&_h4]:text-xl 
                    [&_select]:focus:outline-none [&_select]:border-b [&_select]:py-5 [&_select]:w-full 
                    [&_option]:text-black">
                    
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
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 1 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Nombre:</h3>
                                    <input value={form?.nombre} onChange={(e)=>setForm((prev)=> ({...prev, nombre: e.target.value}))} className="w-full" type="text" />
                                    {!form.nombre && (
                                        <h4>Campo incompleto</h4>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="flex flex-col">
                                        <h3>Precio de venta:</h3>
                                        <input value={form.precio ? form.precio : ""} onChange={(e)=>setForm((prev)=> ({...prev, precio: Number(e.target.value)}))} type="number" />
                                        {!form.precio && (
                                            <h4>Campo incompleto</h4>
                                        )}
                                    </div>
                                    <div>
                                        <h3>Tiempo estimado{"(en minutos)"}:</h3>
                                        <input value={form.tiempoEstimado.split(" ")[0]} onChange={(e)=>setForm((prev)=> ({...prev, tiempoEstimado: e.target.value}))} type="number" />
                                        {!form.tiempoEstimado && (
                                            <h4>Campo incompleto</h4>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3>Descripcion:</h3>
                                    <textarea className="focus:outline-none border-b py-2 w-full" value={form.descripcion} onChange={(e)=>setForm((prev)=>({...prev, descripcion: e.target.value}))} />
                                    {!form.descripcion && (
                                        <h4>Campo incompleto</h4>
                                    )}
                                </div>
                                <div>
                                    <button onClick={()=>{
                                        if(form.nombre && form.precio && form.tiempoEstimado && form.descripcion) {
                                            siguienteSeccion()
                                        }else{
                                            return "<h2>Debe llenar todos los campos</h2>"
                                        }
                                        }} className="bg-[#D93F21] p-2 rounded-4xl">Siguiente</button>
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
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            {/**Cargar imagen y vista previa */}
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 2 ? "max-h-screen" : "max-h-0"}`}>
                                
                                <div className="grid grid-cols-2 gap-5 items-center">
                                    <div className="bg-[#D9D9D9] h-50 rounded-4xl">
                                        {(articulo?.imagen || imagen) && (
                                            <img className="h-full w-full object-cover rounded-4xl" src={String(previewImagen)} alt="" />
                                        )}
                                    </div>
                                    <div>
                                        <h3>Agregar imagen:</h3>
                                        <input onChange={handleImagen} accept="image/*" type="file" />
                                    </div>
                                </div>
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={(imagen || articulo?.imagen) ? siguienteSeccion : ()=>{}} className="bg-[#D93F21]">Siguiente</button>
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
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out 
                                ${seccionActiva == 3 ? "max-h-screen" : "max-h-0"}`}>
                                
                                <div>
                                    <h3>Categoria:</h3>
                                    <select value={indexCategoria} onChange={(e)=>setIndexCategoria(Number(e.target.value))} name="categoria">
                                        {listaCategorias.length > 0 && listaCategorias.map((categoria)=>(
                                            <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                                        ))}
                                    </select>
                                </div>

                                {/**ME QUEDE ACA, NO LOGRO QUE MUESTRE LA SUBCATEGORIA DEL ARTICULO CUANDO ES PARA EDITAR */}
                                <div>
                                    <h3>Subcategoria:</h3>
                                    <select value={form.subcategoria.id} onChange={(e)=>{
                                        const buscarSubcat: Subcategoria | undefined = listaCategorias.find((categoria)=> categoria.id === indexCategoria)?.subcategorias.find((subcat)=> subcat.id === Number(e.target.value))
                                        
                                        if (buscarSubcat) {
                                            
                                            setForm((prev)=>({
                                                ...prev,
                                                subcategoria: buscarSubcat
                                            }))
                                        }
                                    }} name="subcategoria">

                                        {(listaCategorias.length > 0 && indexCategoria) && (
                                        listaCategorias.find((categoria)=> categoria.id == indexCategoria)?.subcategorias.map((subcategoria)=>{
                                            if (subcategoria.id == form.subcategoria.id) {
                                                return <option key={subcategoria.id} value={subcategoria.id} selected>{subcategoria.denominacion}</option>    
                                            }else{
                                                return <option key={subcategoria.id} value={subcategoria.id}>{subcategoria.denominacion}</option>
                                            }
                                        }))}

                                    </select>

                                    <label htmlFor="">{form.subcategoria.id} {form.subcategoria.denominacion}</label>
                                </div>

                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21]">Siguiente</button>
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
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 4 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Nombre:</h3>
                                    <input className="w-full" type="text" />
                                </div>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="flex flex-col">
                                        <h3>Precio de venta:</h3>
                                        <input type="number" />
                                    </div>
                                    <div>
                                        <h3>Tiempo estimado{"(min)"}:</h3>
                                        <input type="number" />
                                    </div>
                                </div>
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21]">Siguiente</button>
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
                                <div className="text-center m-auto h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 5 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Nombre:</h3>
                                    <input className="w-full" type="text" />
                                </div>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="flex flex-col">
                                        <h3>Precio de venta:</h3>
                                        <input type="number" />
                                    </div>
                                    <div>
                                        <h3>Tiempo estimado{"(min)"}:</h3>
                                        <input type="number" />
                                    </div>
                                </div>
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21]">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </>
    )

}