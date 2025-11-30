import { useContext, useState } from "react";
import { DetallePromocion } from "../../ts/Clases";
import { obtenerImagen } from "../../ts/Imagen";
import { CarritoContext } from "./CarritoContext";

interface Props{
    detallePromocion: DetallePromocion
}

export default function DetallePromocionCarrito({detallePromocion}: Props) {

    const carritoContext = useContext(CarritoContext)
    const [mostrarBorrar, setMostrarBorrar] = useState(false)

    if (carritoContext === undefined) {
        return <p>No se encontro CarritoProvider</p>
    }

    const {agregarPromocion, quitarPromocion, borrarPromocion} = carritoContext
    
    return(
        <>
        <div className="relative">

            <div className={`flex w-91
            transition-transform 
            ease-in-out
            duration-500
            ${mostrarBorrar ? "-translate-x-16" : "translate-x-0"}
            `}>

                {/**Muestra los productos agregados al carrito */}
                <div className={`grid grid-cols-[2fr_4fr_2fr_20px] gap-2 items-center `}>
                    <div className={`flex items-center h-15 w-15`}>
                        <img className="h-14 rounded-xl w-14 border-2 border-[#D93F21] object-cover m-auto" 
                        src={detallePromocion.promocion.imagen} alt="" />
                    </div>
                    <div className="flex flex-col text-xl">
                        <div>
                            <h1>{detallePromocion.promocion.denominacion.slice(0, 10)}{detallePromocion.promocion.denominacion.length > 10 && "..."}</h1>
                        </div>
                        <div>
                            <h1>${detallePromocion.cantidad * detallePromocion.promocion.precioRebajado}</h1>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2`}>
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
                    <div className="h-full w-[20px]">
                        <button onClick={()=> setMostrarBorrar((prev)=> !prev)} className="text-gray-400 transition-all ease-in-out duration-500 h-full w-[20px] hover:bg-gray-300">
                            <svg className={`h-4 w-4 transition-transform duration-200 ${mostrarBorrar ? 'rotate-90' : 'rotate-270'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                    
                </div>
                {/**Boton para borrar producto */}
                <div className={`h-15 flex w-15 items-center bg-[#D93F21]
                    transition-all
                    ease-in-out
                    duration-500
                    `}>
                    <button className="w-15 h-full" onClick={()=>borrarPromocion(detallePromocion.promocion)}>
                        <svg className="m-auto" width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.83325 10.2083H29.1666M14.5833 16.0417V24.7917M20.4166 16.0417V24.7917M7.29159 10.2083L8.74992 27.7083C8.74992 28.4819 9.05721 29.2237 9.60419 29.7707C10.1512 30.3177 10.893 30.625 11.6666 30.625H23.3333C24.1068 30.625 24.8487 30.3177 25.3956 29.7707C25.9426 29.2237 26.2499 28.4819 26.2499 27.7083L27.7083 10.2083M13.1249 10.2083V5.83333C13.1249 5.44656 13.2786 5.07563 13.5521 4.80214C13.8255 4.52865 14.1965 4.375 14.5833 4.375H20.4166C20.8034 4.375 21.1743 4.52865 21.4478 4.80214C21.7213 5.07563 21.8749 5.44656 21.8749 5.83333V10.2083" stroke="#FAF8F5" strokeWidth="2.91667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                    </button>
                </div>
            </div>
        </div>
        </>
    )

}