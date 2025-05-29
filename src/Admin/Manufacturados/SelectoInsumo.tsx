import { useEffect, useState } from "react";
import { ArticuloInsumo, ArticuloManufacturado, ArticuloManufacturadoDetalleInsumo } from "../../../ts/Clases";

interface Props{
    abierto: boolean
    setForm: React.Dispatch<React.SetStateAction<ArticuloManufacturado>>
    cerrar: ()=>void
}

export default function SelectorInsumo({abierto, cerrar, setForm}: Props) {
    
    const [listaInsumos, setListaInsumos] = useState<ArticuloInsumo[]>([])
    const [listaInsumosBuscador, setListaInsumosBuscador] = useState<ArticuloInsumo[]>([])
    const [buscadorInsumo, setBuscadorInsumo] = useState("")

    useEffect(()=>{
        
        // Helper function to create an ArticuloInsumo
        const createInsumo = (id: number, nombre: string, precioCompra: number, unidad: string): ArticuloInsumo => {
            const insumo = new ArticuloInsumo();
            insumo.id = id;
            insumo.nombre = nombre;
            insumo.precio = precioCompra * 1.5; // Example: selling price is 1.5 times cost
            insumo.precioCompra = precioCompra;
            insumo.imagen = "no-image.jpg"; // Default for insumos if not specified
            insumo.unidadMedida = { id: id, unidad: unidad };
            insumo.subcategoria = { id: 1, denominacion: "Insumos Varios" }; // Example subcategory
            return insumo;
        };

        const masaPizza = createInsumo(1, "Masa para Pizza", 50, "gr");
        const quesoMuzzarella = createInsumo(2, "Queso Muzzarella", 100, "gr");
        const salsaTomate = createInsumo(3, "Salsa de Tomate", 30, "ml");
        const pepperoni = createInsumo(4, "Pepperoni", 80, "gr");
        const jamon = createInsumo(5, "Jamón Cocido", 70, "gr");
        const morron = createInsumo(6, "Morrón", 20, "gr");
        const champinones = createInsumo(7, "Champiñones", 60, "gr");
        const cebolla = createInsumo(8, "Cebolla", 25, "gr");
        const huevo = createInsumo(9, "Huevo", 15, "unidad");
        const aceitunas = createInsumo(10, "Aceitunas", 10, "gr");
        const harina = createInsumo(11, "Harina 000", 20, "gr");
        const carnePicada = createInsumo(12, "Carne Picada", 150, "gr");
        const panHamburguesa = createInsumo(13, "Pan de Hamburguesa", 40, "unidad");
        const lechuga = createInsumo(14, "Lechuga", 15, "gr");
        const tomate = createInsumo(15, "Tomate", 20, "gr");
        const panceta = createInsumo(16, "Panceta Ahumada", 50, "gr");
        const quesoCheddar = createInsumo(17, "Queso Cheddar", 40, "gr");
        const papasFritas = createInsumo(18, "Papas Fritas", 80, "gr");
        const sal = createInsumo(19, "Sal", 5, "gr");
        const pimienta = createInsumo(20, "Pimienta", 3, "gr");
        const ajo = createInsumo(21, "Ajo", 5, "gr");
        const albahaca = createInsumo(22, "Albahaca", 5, "gr");
        const ricota = createInsumo(23, "Ricota", 100, "gr");
        const espinaca = createInsumo(24, "Espinaca", 50, "gr");
        const masaPasta = createInsumo(25, "Masa para Pasta", 120, "gr");
        const crema = createInsumo(26, "Crema de Leche", 50, "ml");
        const nuezMoscada = createInsumo(27, "Nuez Moscada", 2, "gr");
        const panRallado = createInsumo(28, "Pan Rallado", 10, "gr");
        const aceite = createInsumo(29, "Aceite", 10, "ml");

        const todosInsumos: ArticuloInsumo[] = [
            masaPizza,
            quesoMuzzarella,
            salsaTomate,
            pepperoni,
            jamon,
            morron,
            champinones,
            huevo,
            cebolla,
            aceitunas,
            harina,
            carnePicada,
            panHamburguesa,
            lechuga,
            tomate,
            panceta,
            quesoCheddar,
            papasFritas,
            sal,
            pimienta,
            panRallado,
            aceite,
            ajo,
            albahaca,
            ricota,
            espinaca,
            masaPasta,
            crema,
            nuezMoscada
        ]

        setListaInsumos(todosInsumos)

    },[])

    useEffect(()=>{
        let filtrado: ArticuloInsumo[] = listaInsumos

        filtrado = filtrado.filter((insumo)=> insumo.nombre.toLowerCase().includes(buscadorInsumo.toLowerCase()))

        setListaInsumosBuscador(filtrado)

    },[buscadorInsumo, abierto])

    const cerrarModal = ()=>{
        setBuscadorInsumo("")
        cerrar()
    }

    if (!abierto) return null

    return(
        <>
            <div onClick={cerrarModal} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                <div onClick={(e)=> e.stopPropagation()} className="bg-white w-4/5 rounded-4xl text-black">

                    {/**Cabecera */}
                    <div className="text-3xl flex justify-between rounded-t-4xl p-5 items-center bg-gray-200 shadow-md shadow-gray-500">
                        <h1>Seleccione el insumo</h1>
                        <button onClick={cerrarModal}>
                            <img src="/svg/CerrarVentana.svg"/>
                        </button>
                    </div>

                    {/**Cuerpo */}
                    <div className="p-5">
                        
                        <div className="w-1/2">
                            <input onChange={(e)=>setBuscadorInsumo(e.target.value)} className="bg-[#878787] text-white pl-5 rounded-4xl w-1/2" placeholder="Buscar..." type="text" />
                        </div>

                        <div className="flex flex-col py-2 [&_h5]:text-sm max-h-[60vh] overflow-y-auto">
                            
                            {/**Cabecera de tabla */}
                            <div className="text-4xl w-full flex *:border-2 *:border-gray-500 *:w-full *:py-5 *:border-collapse text-center">

                                <div className="flex items-center justify-center">
                                    <h5>Nombre</h5>
                                </div>
                                <div className="flex items-center justify-center">
                                    <h5>Costo</h5>
                                </div>
                                <div className="flex items-center justify-center px-2">
                                    <h5>Unidad de medida</h5>
                                </div>
                                <div className="flex items-center justify-center">
                                    <h5>Agregar</h5>
                                </div>

                            </div>

                            {listaInsumosBuscador.length > 0 && listaInsumosBuscador.map((insumo)=>(
                                <div key={insumo.id} className="text-4xl w-full flex *:border-2 *:border-gray-500 *:w-full *:py-1 *:border-collapse text-center">

                                    <div className="flex items-center justify-center">
                                        <h5>{insumo.nombre}</h5>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <h5>${insumo.precioCompra}</h5>
                                    </div>
                                    <div className="flex items-center justify-center px-2">
                                        <h5>{insumo.unidadMedida?.unidad}</h5>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button onClick={()=>{
                                            setForm((prev)=>{
                                                let encontrado = prev.detalleInsumos.find((detalle)=> detalle.articuloInsumo.id == insumo.id)

                                                if (encontrado) {
                                                    cerrarModal()
                                                    alert(`El ingrediente ${insumo.nombre} ya se encuentra en el producto`)
                                                    return prev
                                                }else{
                                                    let detalleNuevo: ArticuloManufacturadoDetalleInsumo = new ArticuloManufacturadoDetalleInsumo()
                                                    detalleNuevo.articuloInsumo = insumo
                                                    
                                                    cerrarModal()
                                                    return {...prev, detalleInsumos: [...prev.detalleInsumos, detalleNuevo]}
                                                }
                                            })

                                        }} className="bg-[#D93F21] text-white px-2 rounded-4xl">
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
    )

}