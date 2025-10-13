import { useEffect, useState } from "react";
import SliderPromociones from "./SliderPromociones";
import { ArticuloInsumo, ArticuloManufacturado, Categoria, host, Promocion } from "../../ts/Clases";
import { obtenerImagen } from "../../ts/Imagen";
import ArticuloCardCatalogo from "./ArticuloCardCatalogo";
import axios from "axios";

export default function Catalogo() {

    const [buscador, setBuscador] = useState("")
    const [promos, setPromos] = useState<Promocion[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("")
    const [todosArticulos, setTodosArticulos] = useState<(ArticuloInsumo | ArticuloManufacturado)[]>([])
    const [articulosFiltrados, setArticulosFiltrados] = useState<(ArticuloInsumo | ArticuloManufacturado)[]>([])
    const [ordenamiento, setOrdenamiento] = useState("");
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)

    const articulosPorPagina = 9;

    
    useEffect(()=>{
        cargarCategorias()
        cargarArticulos()
        cargarPromos()
    }, [])

    useEffect(()=>{
        console.log(promos)
    }, [promos])

    //Obtener categorias
    const cargarCategorias = async()=>{

        const URL = host+"/api/Categoria/ventas"
        try {
            const response = await axios.get(URL)
            
            const categoriasObtenidas: Categoria[] = response.data

            setCategorias(categoriasObtenidas)
            
        } catch (error) {
            console.error(error)
        }

    }

    //Funcion para obtener promociones
    const cargarPromos = async()=>{

        const URL = host+"/api/promociones/venta"

        try {
            
            const response = await axios.get(URL)

            const promocionesObtenidas: Promocion [] = response.data

            setPromos(promocionesObtenidas)

        } catch (error) {
            console.error(error)
        }

    }

    //Obtener articulos para venta
    const cargarArticulos = async()=>{

        const URL = host+"/api/articulo/venta"

        try {
            const response = await axios.get(URL)

            const articulosObtenidos: (ArticuloInsumo | ArticuloManufacturado)[] = response.data

            setTodosArticulos(articulosObtenidos)
            
        } catch (error) {
            console.error(error)
        }

    }

    //Filtrar los articulos que se van a mostrar
    useEffect(()=>{
        let datosFiltrados: (ArticuloInsumo | ArticuloManufacturado)[] = todosArticulos;

        //Filtro por nombre
        if (buscador) {
            datosFiltrados = datosFiltrados.filter((articulo)=>
                articulo.nombre.toLowerCase().includes(buscador.toLowerCase())
            );
        }

        //Filtro por categoria
        if (categoriaSeleccionada) {
            datosFiltrados = datosFiltrados.filter((articulo)=>
                articulo.subcategoria.categoria?.id === categorias[Number(categoriaSeleccionada)].id
            )
        }
        
        //Filtro por subcategoria
        if (subcategoriaSeleccionada) {
            datosFiltrados = datosFiltrados.filter((articulo)=>
                articulo.subcategoria.id === categorias[Number(categoriaSeleccionada)]?.subcategorias?.[Number(subcategoriaSeleccionada)]?.id
            )
        }

        //Ordenamiento
        switch (ordenamiento) {
            case "precioMenorMayor":
                console.log("Entro precio menor")
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=> 
                    anterior.precio - siguiente.precio)
                break;
                
            case "precioMayorMenor":
                console.log("Entro precio mayor")
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=> 
                    siguiente.precio - anterior.precio)
                break;

            case "nombreAZ":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                    anterior.nombre.localeCompare(siguiente.nombre))
                break;

            case "nombreZA":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                    siguiente.nombre.localeCompare(anterior.nombre))
                break;

            case "tiempoMenorMayor":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                Number(anterior.tiempoEstimado ? anterior.tiempoEstimado.split(" ")[0] : 0) - Number(siguiente.tiempoEstimado ? siguiente.tiempoEstimado?.split(" ")[0] : 0))
                break;

            case "tiempoMayorMenor":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                Number(siguiente.tiempoEstimado ? siguiente.tiempoEstimado.split(" ")[0] : 0) - Number(anterior.tiempoEstimado ? anterior.tiempoEstimado.split(" ")[0] : 0))
                break;

            default:
                datosFiltrados = datosFiltrados
                break;
        }

        setArticulosFiltrados(datosFiltrados)

        setPaginaSeleccionada(1)
    }, [todosArticulos, categoriaSeleccionada, subcategoriaSeleccionada, buscador, ordenamiento])
    
    return(
        <>
        
        <div className="bg-[#333333] h-full w-full text-white font-[Lato]">

            {/**Primera seccion */}
            <div className="p-[3%] flex flex-col gap-5">

                <h1 className="text-6xl max-md:text-4xl">Los platillos mas ricos de<br className="max-md:hidden"/> Argentina</h1>

                <h3 className="text-3xl max-md:text-2xl">Lista de los mejores platos, postres, desayunos, bebidas...</h3>

                <div className="flex gap-5">
                    <input defaultValue={buscador} onChange={(event)=>{setBuscador(event.target.value)}} className="bg-[#D9D9D98C] w-1/2 max-md:w-4/5 rounded-2xl px-5 py-1 text-2xl" placeholder="Por ejemplo, pizza, hamburguesa..." type="text"/>
                </div>
            </div>

            {/**Promociones */}
            <div className="px-[3%] m-auto">
                <SliderPromociones promos={promos}/>
            </div>

            {/**Categorias */}
            <div className="p-[3%]">
                <div className="flex justify-between">
                    <h1 className="text-4xl">Categorias</h1>
                    {/**Ordenar por */}
                    <select defaultValue={""} onChange={(e)=>{setOrdenamiento(e.target.value)}} className="bg-white text-black rounded-xl text-xl">
                        <option value="" disabled>Ordenar por</option>
                        <option value="precioMenorMayor">Precio mas bajo</option>
                        <option value="precioMayorMenor">Precio mas alto</option>
                        <option value="nombreAZ">A - Z</option>
                        <option value="nombreZA">Z - A</option>
                        <option value="tiempoMenorMayor">Menor tiempo</option>
                        <option value="tiempoMayorMenor">Mayor tiempo</option>
                    </select>
                </div>

                {/**Se muestran las categorias existentes + Todos */}
                <div className="mt-10 w-full flex max-md:flex-wrap gap-3">
                    <button onClick={()=>{
                        setCategoriaSeleccionada("")
                        setSubcategoriaSeleccionada("")
                        }} 
                        className={`${ categoriaSeleccionada === "" && "bg-[#D93F21]"} px-1 pt-1 pb-5 rounded-[20rem] flex flex-col gap-1`}>
                        <img className="rounded-full object-cover h-25 m-auto" src="./img/categoriaTodos.jpg" alt="No se encontro la imagen" />
                        <h3 className="m-auto">Todos</h3>
                    </button>
                    {categorias.map((categoria, index)=>(
                        <button key={index} onClick={()=>{
                            setCategoriaSeleccionada(String(index))
                            setSubcategoriaSeleccionada("")
                            }} 
                            className={`${ String(index) === categoriaSeleccionada && "bg-[#D93F21]"} px-1 pt-1 pb-5 text-center rounded-[20rem] flex flex-col gap-1`}>
                            <img className="rounded-full h-25 object-cover m-auto" src={obtenerImagen(categoria.imagen)} alt="No se encontro la imagen" />
                            <h3 className="m-auto">{categoria.denominacion}</h3>
                        </button>
                    ))}
                </div>
                
                {/**Se muestran las subcategorias de la categoria seleccionada + Todos*/}
                <div className="mt-10 flex gap-5 text-xl">
                    
                    <button onClick={()=> setSubcategoriaSeleccionada("")} className={`${subcategoriaSeleccionada === "" ? "bg-[#D93F21]" : "bg-white text-black"} px-5 rounded-2xl uppercase`}>Todos</button>
                    
                    {(categorias.length > 0 && categoriaSeleccionada != "") && categorias[Number(categoriaSeleccionada)]?.subcategorias?.map((subcat, index) => (
                        <button key={index} onClick={()=> setSubcategoriaSeleccionada(String(index))} className={`${String(index) === subcategoriaSeleccionada ? "bg-[#D93F21]" : "bg-white text-black"} px-5 rounded-2xl uppercase`}>{subcat.denominacion}</button>
                    ))}
                </div>

            </div>
            
            {/**Productos */}            
            <div className="px-[1%] pb-5 max-lg:px-5">
                {/**Se muestran los productos segun los filtros */}
                <div className={`mt-10 grid ${articulosFiltrados.length > 0 ? ("grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1") : ""} gap-x-10 gap-y-5`}>
                    {articulosFiltrados.length > 0 ? articulosFiltrados.map((articulo, index)=>{
                        //La posicion del articulo debe ser menor a la cantidad
                        //que falta por mostrar 
                        //Y 
                        //Mayor o igual a la cantidad de articulos ya mostrados
                        //en paginas anteriores
                        if (index < articulosPorPagina*paginaSeleccionada && index >= articulosPorPagina*(paginaSeleccionada-1)) {
                            
                            return (
                                <ArticuloCardCatalogo key={articulo.id} articulo={articulo}/>
                            )
                        }

                    }
                    ) : (
                        <h1 className="text-2xl text-center">No se encuentran productos</h1>
                    )}
                </div>

            </div>

            {/**Paginador */}
            <div className="p-[3%] m-auto flex justify-center">
                {articulosFiltrados.length > 0 && [...Array(Math.ceil(articulosFiltrados.length / articulosPorPagina))].map((_,index)=>{
                    const numeroPagina = index + 1;
                    return (
                        <button key={numeroPagina} onClick={()=>{setPaginaSeleccionada(numeroPagina)}} className={`p-5 ${numeroPagina === paginaSeleccionada ? "bg-[#D93F21] text-white " : "bg-white text-black border-1"}`}>
                            {numeroPagina}
                        </button>
                    )
                })}
            </div>

        </div>
        
        </>
    )

}