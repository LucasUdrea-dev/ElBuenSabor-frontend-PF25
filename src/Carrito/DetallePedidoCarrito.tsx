import { useContext, useState } from "react";
import { DetallePedido } from "../../ts/Clases";
import { CarritoContext } from "./CarritoContext";

interface Props{
    detallePedido: DetallePedido
}

export default function DetallePedidoCarrito({detallePedido}: Props) {

    const carritoContext = useContext(CarritoContext)
    const [mostrarOpciones, setMostrarOpciones] = useState(false)

    if (carritoContext === undefined) {
        return <p>No se encontro CarritoProvider</p>
    }

    const {agregarArticulo, quitarArticulo, borrarArticulo} = carritoContext
    
    return(
        <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 h-24 shrink-0">
            
            {/* Background Action (Delete) - Fixed behind the card */}
            <div className="absolute inset-y-0 right-0 w-[60px] bg-red-500 flex items-center justify-center z-0 rounded-r-xl">
                <button 
                    className="w-full h-full flex items-center justify-center text-white active:bg-red-600"
                    onClick={()=>borrarArticulo(detallePedido.articulo!)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Main Content Card - Slides to reveal delete */}
            <div className={`relative z-10 h-full bg-white flex items-center p-3 gap-3 transition-transform duration-300 ease-out ${mostrarOpciones ? "-translate-x-[60px]" : "translate-x-0"}`}>
                
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0">
                    <img 
                        className="w-full h-full object-cover rounded-lg border border-gray-100" 
                        src={detallePedido.articulo?.imagenArticulo} 
                        alt={detallePedido.articulo?.nombre}
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-gray-800 truncate pr-1">
                        {detallePedido.articulo?.nombre}
                    </h3>
                    <p className="text-[#D93F21] font-bold text-sm mt-0.5">
                        ${(detallePedido.cantidad * detallePedido.articulo!.precio).toFixed(2)}
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8 shrink-0">
                    <button 
                        onClick={() => detallePedido.cantidad > 1 ? quitarArticulo(detallePedido.articulo!) : borrarArticulo(detallePedido.articulo!)}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#D93F21] active:scale-90 transition-transform"
                    >
                        {detallePedido.cantidad > 1 ? (
                            <span className="text-lg font-bold leading-none mb-0.5">-</span>
                        ) : (
                            <img src="/svg/eliminarCarrito.svg" className="w-3.5 h-3.5 opacity-70" alt="Del" />
                        )}
                    </button>
                    
                    <span className="w-6 text-center text-sm font-medium text-gray-700">
                        {detallePedido.cantidad}
                    </span>

                    <button 
                        onClick={() => agregarArticulo(detallePedido.articulo!, 1)}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-green-600 active:scale-90 transition-transform"
                    >
                        <span className="text-lg font-bold leading-none mb-0.5">+</span>
                    </button>
                </div>

                {/* Toggle Slide Button */}
                <button 
                    onClick={() => setMostrarOpciones(!mostrarOpciones)}
                    className="h-full px-1 text-gray-400 hover:text-gray-600 flex items-center"
                >
                    <svg className={`w-5 h-5 transition-transform duration-300 ${mostrarOpciones ? 'rotate-180' : 'rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )

}