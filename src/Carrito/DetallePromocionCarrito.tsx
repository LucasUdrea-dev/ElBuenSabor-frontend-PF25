import { useContext } from "react";
import { DetallePromocion } from "../../ts/Clases";
import { obtenerImagen } from "../../ts/Imagen";
import { CarritoContext } from "./CarritoContext";

interface Props{
    detallePromocion: DetallePromocion
}

export default function DetallePromocionCarrito({detallePromocion}: Props) {

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>No se encontro CarritoProvider</p>
    }

    const {agregarPromocion, quitarPromocion, borrarPromocion} = carritoContext
    
    return(
        <>
        {/**Muestra las promociones agregadas al carrito */}
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-2 items-center">
            <div className="flex items-center h-15">
                <img className="h-14 rounded-xl w-14 border-2 border-[#D93F21] object-cover m-auto" src={obtenerImagen(detallePromocion.promocion.imagen)} alt="" />
            </div>
            <div className="flex flex-col text-xl">
                <div>
                    <h1>{detallePromocion.promocion.denominacion.slice(0, 10)}{detallePromocion.promocion.denominacion.length > 10 && "..."}</h1>
                </div>
                <div>
                    <h1>${detallePromocion.cantidad * detallePromocion.promocion.precioRebajado}</h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={()=>{detallePromocion.cantidad > 1 ? 
                    quitarPromocion(detallePromocion.promocion) 
                    : borrarPromocion(detallePromocion.promocion)}}>

                    {detallePromocion.cantidad > 1 ? (
                    <img src="./svg/restarCarrito.svg" alt="" />
                    ) : (
                    <img src="./svg/eliminarCarrito.svg" alt="" />
                    )}

                </button>
                <div className="text-xl">
                    <h1>{detallePromocion.cantidad}</h1>
                </div>
                <button onClick={()=>agregarPromocion(detallePromocion.promocion, 1)}>
                    <img src="./svg/sumarCarrito.svg" alt="" />
                </button>
            </div>
        </div>
        </>
    )

}