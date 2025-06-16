import { useContext, useState } from "react";
import { ArticuloVentaDTO } from "../../ts/Clases";
import { obtenerImagen } from "../../ts/Imagen";
import { CarritoContext } from "../Carrito/CarritoContext";

interface Props{
    articulo: ArticuloVentaDTO;
    isOpen: boolean
    onClose: ()=> void
}

export default function DetalleArticulo({articulo, isOpen, onClose}: Props) {

    const [cantidad, setCantidad] = useState(1)

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>No se encontro CarritoProvider</p>
    }

    const {agregarArticulo} = carritoContext

    const cerrarDetalle = ()=>{
        setCantidad(1)
        onClose()
    }

    if (!isOpen) return null
    
    return(
        <>
            {/**Fondo oscurecido */}
            <div onClick={()=>{
                cerrarDetalle()
                }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                {/**Modal */}
                <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-2xl grid grid-rows-[3fr_1fr] w-full max-w-lg">
                    
                    {/**Imagen y tiempo */}
                    <div className="relative">
                        <img className="h-full object-cover rounded-t-2xl" src={obtenerImagen(articulo.imagenArticulo)} alt="No se encontro la imagen" />
                        {articulo.tiempoEstimado && (
                            <div className="absolute bottom-0 bg-[#D93F21] m-auto text-center p-5 px-15 rounded-tr-2xl ">
                                <h1 className="text-xl">{`${articulo.tiempoEstimado.split(" ")[0]}-${Number(articulo.tiempoEstimado.split(" ")[0]) + 5}`} min</h1>
                            </div>
                        )}
                    </div>
                    
                    <div className="w-11/12 m-auto text-black flex flex-col gap-2">
                        
                        {/**Nombre y precio */}
                        <div className="flex justify-between text-xl">
                            <h2>{articulo.nombre}</h2>
                            <h2>${articulo.precio}</h2> 
                        </div>
                        
                        {/**Categoria e ingredientes */}
                        <div className="">
                            <h2>{articulo.subcategoria.categoria?.denominacion} - {articulo.subcategoria.denominacion}</h2>
                            {/**Si tiene insumos se muestran los ingredientes
                             * Si no tiene insumos se muestra la descripcion
                             */}
                            {articulo.detalleInsumos?.length > 0 ? 
                                <p>Ingredientes:
                                    {articulo.detalleInsumos.map((detalle, index, insumos)=>{
                                        if (index === insumos.length - 1) {
                                            return ` ${detalle.articuloInsumo.nombre}.`
                                        }else if(index === insumos.length - 2){
                                            return ` ${detalle.articuloInsumo.nombre} y`
                                        }
                                        return ` ${detalle.articuloInsumo.nombre},`
                                    })}
                                </p>
                            
                            : <p>Descripcion: {articulo.descripcion}</p>}
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
                                agregarArticulo(articulo, cantidad)
                                cerrarDetalle()
                            }} className="bg-[#D93F21] text-white px-2 rounded-lg">Agregar a mi orden (${articulo.precio*cantidad})</button>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )

}