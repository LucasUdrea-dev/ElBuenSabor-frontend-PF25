import { useContext, useState } from "react";
import { Promocion } from "../../ts/Clases";
import { obtenerImagen } from "../../ts/Imagen";
import { CarritoContext } from "../Carrito/CarritoContext";

interface Props{
    promocion: Promocion | null;
    onClose: ()=> void
}

export default function DetallePromocion({promocion, onClose}: Props) {

    const [cantidad, setCantidad] = useState(1)
    
    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>CartProvider no encontrado</p>
    }

    const {agregarPromocion} = carritoContext

    const cerrarDetalle = ()=>{
        setCantidad(1)
        onClose()
    }

    if (!promocion) return null
    
    return(
        <>
            {/**Fondo oscurecido */}
            <div onClick={()=>{cerrarDetalle()}} 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                {/**Modal */}
                <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-2xl grid grid-rows-[3fr_1fr] w-full max-w-lg">
                    
                    {/**Imagen y tiempo */}
                    <div className="relative">
                        <img className="h-full object-cover rounded-t-2xl" src={obtenerImagen(promocion.imagen)} alt="No se encontro la imagen" />
                    </div>
                    
                    <div className="w-11/12 m-auto text-black flex flex-col gap-2">
                        
                        {/**Nombre y precio */}
                        <div className="flex justify-between text-xl">
                            <h2>{promocion.denominacion}</h2>
                            <h2>${promocion.precioRebajado}</h2> 
                        </div>
                        
                        {/**Categoria e ingredientes */}
                        <div className="">
                            <h2>Promocion</h2>
                            {/**Si tiene insumos se muestran los ingredientes
                             * Si no tiene insumos se muestra la descripcion
                             */}
                            <p>Descripcion: {promocion.descripcion}</p>
                        </div>
                        <div className="pb-2 flex justify-between">
                            <div className="flex gap-1">
                                <h2>Cantidad: </h2>
                                <select className="shadow-sm shadow-gray-400" defaultValue={1} onChange={(e)=> {setCantidad(Number(e.target.value))}}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                </select>
                            </div>
                            <button onClick={()=>{
                                agregarPromocion(promocion, cantidad)
                                cerrarDetalle()
                                }} className="bg-[#D93F21] text-white px-2 rounded-lg">Agregar a mi orden (${promocion.precioRebajado*cantidad})</button>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )

}