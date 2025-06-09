import { useContext } from "react";
import { Link } from "react-router-dom";
import { CarritoContext } from "./CarritoContext";
import DetallePromocionCarrito from "./DetallePromocionCarrito";

interface Props{
    mostrarCarrito: boolean;
}

export default function Carrito({mostrarCarrito}: Props) {

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>CartProvider no encontrado.</p>
    }

    const {pedido} = carritoContext;
    
    return(
        <>
        
        <div className={`text-black bg-white mt-0 rounded-bl-2xl h-20/2 shadow-black shadow-2xl
            absolute top-0 right-0
            overflow-hidden
            transition-all
            ease-in-out
            duration-500
            ${mostrarCarrito ? "w-80" : "w-0"} z-50`
            }>
        
            <div className={`w-80 flex flex-col h-full`}>
                <div className="text-center text-2xl mt-2">
                    <h1>MI ORDEN</h1>
                    <button onClick={()=>localStorage.removeItem("carrito")}>Resetear</button>
                </div>
                <div className="p-5 h-full">
                    {(pedido.detallePedidoList.length < 1 && pedido.detallePromocionList.length < 1) ? (
                        <div className="m-auto text-center w-2/3 flex flex-col justify-center h-full">
                            <h3>Tu orden esta vacia</h3>
                            <Link className="bg-[#D93F21] text-white p-1" to={"/catalogo"}>
                                ¡Empeza a comprar!
                            </Link>
                        </div>
                    ):(
                        <div className="flex flex-col gap-2">
                            {pedido.detallePromocionList.map((detalle)=> (
                                <DetallePromocionCarrito detallePromocion={detalle}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
        
        </>
    )

}