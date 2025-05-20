import { useEffect, useState } from "react";
import SliderPromociones from "./SliderPromociones";
import { Categoria, Promocion } from "../ts/Clases";
import { obtenerImagen } from "../ts/Imagen";

export default function Catalogo() {

    const [promos, setPromos] = useState<Promocion[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([{denominacion: "Todos", imagen: "categoriaTodos.jpg", subcategorias: []}]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0)
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(0)
    const [ordenamiento, setOrdenamiento] = useState("");

    //Funcion para obtener promociones
    useEffect(()=>{
        let data: Promocion[] = [];
        let promocion1: Promocion = {
            denominacion: "Promo 1",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "pizza.jpg"
        }
        let promocion2: Promocion = {
            denominacion: "Promo 2",
            descripcion: "2 hamburguesas + 2 CocaCola 500ml + 2 papas grandes",
            precioRebajado: 500,
            imagen: "hamburguesa.jpg"
        }
        let promocion3: Promocion = {
            denominacion: "Promo 3",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "pizza.jpg"
        }
        let promocion4: Promocion = {
            denominacion: "Promo 4",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "hamburguesa.jpg"
        }
        let promocion5: Promocion = {
            denominacion: "Promo 5",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "pizza.jpg"
        }
        data.push(promocion1)
        data.push(promocion2)
        data.push(promocion3)
        data.push(promocion4)
        data.push(promocion5)
        setPromos(data)
    }, [])

    useEffect(()=>{
        let data: Categoria[] = []
        let categoria1:Categoria = {
            denominacion: "Pizza",
            imagen: "categoriaTodos.jpg",
            subcategorias: [
                {denominacion: "Carne"},
                {denominacion: "Vegetariana"},
                {denominacion: "Celiaco"}
            ]
        }
        let categoria2:Categoria = {
            denominacion: "Burguer",
            imagen: "categoriaTodos.jpg",
            subcategorias: [
                {denominacion: "Carne"},
                {denominacion: "Vegetariana"},
                {denominacion: "Celiaco"}
            ]
        }
        let categoria3:Categoria = {
            denominacion: "Empanadas",
            imagen: "categoriaTodos.jpg",
            subcategorias: [
                {denominacion: "Carne"},
                {denominacion: "Vegetariana"},
                {denominacion: "Celiaco"}
            ]
        }

        data.push(categoria1)
        data.push(categoria2)
        data.push(categoria3)
        setCategorias((prev)=> {
            const arrayConTodos = prev.find(cat => cat.denominacion === "Todos")

            const nuevoArray = arrayConTodos ? [arrayConTodos, ...data] : [...data]

            return nuevoArray;
        })
    }, [])
    
    return(
        <>
        
        <div className="bg-[#333333] h-full w-1/1 text-white font-[Playfair_Display]">
            {/**Primera seccion */}
            <div className="p-[3%] flex flex-col gap-5">

                <h1 className="text-6xl">Los platillos mas ricos de<br/>Argentina</h1>

                <h3 className="text-3xl">Lista de los mejores platos, postres, desayunos, bebidas...</h3>

                <div className="flex gap-5">
                    <input className="bg-[#D9D9D98C] w-1/2 rounded-2xl px-5 py-1 text-2xl" placeholder="Por ejemplo, pizza, hamburguesa..." type="text"/>
                    <button className="bg-[#D93F21] py-1 w-1/8 rounded-xl text-2xl">Buscar</button>
                </div>
            </div>

            {/**Promociones */}
            <div className="p-[3%]">
                <SliderPromociones promos={promos}/>
            </div>

            {/**Categorias */}
            <div className="p-[3%]">
                <div className="flex justify-between">
                    <h1 className="text-4xl">Categorias</h1>
                    {/**Ordenar por */}
                    <select onChange={(e)=>{setOrdenamiento(e.target.value)}} className="bg-white text-black rounded-xl text-xl">
                        <option value="" disabled selected>Ordenar por</option>
                        <option value="precioAscendente">Precio mas bajo</option>
                        <option value="precioDescendente">Precio mas alto</option>
                        <option value="nombreAscendente">A - Z</option>
                        <option value="nombreDescendente">Z - A</option>
                        <option value="tiempoAscendente">Menor tiempo</option>
                        <option value="tiempoDescendente">Mayor tiempo</option>
                    </select>
                </div>

                {/**Se muestran las categorias existentes + Todos */}
                <div className="mt-10 text-center flex gap-3">
                    {categorias.map((categoria, index)=>(
                        <button onClick={()=>{
                            setCategoriaSeleccionada(index)
                            setSubcategoriaSeleccionada(0)
                            }} 
                            className={`${ index === categoriaSeleccionada && "bg-[#D93F21]"} px-1 pt-1 pb-5 rounded-[20rem] flex flex-col gap-1`}>
                            <img className="rounded-[20rem] object-cover h-20" src={obtenerImagen(categoria.imagen)} alt="No se encontro la imagen" />
                            <h3>{categoria.denominacion}</h3>
                        </button>
                    ))}
                </div>

                {/**Se muestran las subcategorias de la categoria seleccionada */}
                <div className="mt-10 flex gap-5 text-xl">
                    {categorias[categoriaSeleccionada].subcategorias.map((subcat, index) => (
                        <button onClick={()=> setSubcategoriaSeleccionada(index)} className={`${index === subcategoriaSeleccionada ? "bg-[#D93F21]" : "bg-white text-black"} px-5 rounded-2xl uppercase`}>{subcat.denominacion}</button>
                    ))}
                </div>
                <div></div>
            </div>

        </div>
        
        </>
    )

}