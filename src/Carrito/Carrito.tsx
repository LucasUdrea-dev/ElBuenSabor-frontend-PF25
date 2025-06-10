import { useContext } from "react";
import { Link } from "react-router-dom";
import { CarritoContext } from "./CarritoContext";
import DetallePromocionCarrito from "./DetallePromocionCarrito";
import DetallePedidoCarrito from "./DetallePedidoCarrito";

interface Props{
    mostrarCarrito: boolean;
}

export default function Carrito({mostrarCarrito}: Props) {

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>CartProvider no encontrado.</p>
    }

    const {pedido, paraDelivery, paraRetirar} = carritoContext;

    const fecha = new Date()
    
    return(
        <>
        
        <div className={`text-black bg-white mt-0 rounded-bl-2xl shadow-black shadow-2xl
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
                <div className="py-5 px-2">
                    {(pedido.detallePedidoList.length < 1 && pedido.detallePromocionList.length < 1) ? (
                        <div className="m-auto text-center w-2/3 flex flex-col justify-center h-90">
                            <h3>Tu orden esta vacia</h3>
                            <Link className="bg-[#D93F21] text-white p-1" to={"/catalogo"}>
                                ¡Empeza a comprar!
                            </Link>
                        </div>
                    ):(
                        <div>
                            {/**Se muestran promociones y productos individuales
                             * en el carrito
                             */}
                            <div className="flex flex-col gap-2 overflow-hidden border-b-1 border-gray-300">
                                {pedido.detallePromocionList.map((detalle)=> (
                                    <DetallePromocionCarrito key={detalle.promocion.id} detallePromocion={detalle}/>
                                ))}
                                {pedido.detallePedidoList.map((detalle)=> (
                                    <DetallePedidoCarrito key={detalle.articulo.id} detallePedido={detalle}/>
                                ))}
                            </div>

                            <div>
                                <div className="text-xl text-center">
                                    <h1>Entrega</h1>
                                </div>
                                <div className="flex justify-between">
                                    <button onClick={()=>paraRetirar()} className={`flex items-center border rounded-2xl px-2 ${pedido.tipoEnvio.tipoDelivery == "TAKEAWAY" ? "opacity-100" : "opacity-40"}`}>
                                        <img src="./svg/enTienda.svg" alt="" />
                                        <h1>En Tienda</h1>
                                    </button>
                                    <button onClick={()=>paraDelivery()} className={`flex items-center border rounded-2xl px-2 ${pedido.tipoEnvio.tipoDelivery == "DELIVERY" ? "opacity-100" : "opacity-40"}`}>
                                        <img src="./svg/delivery.svg" alt="" />
                                        <h1>Delivery</h1>
                                    </button>
                                </div>
                                <div className="py-2 flex items-center gap-2">
                                    <img src="./svg/relojCarrito.svg" alt="" />
                                    <div className="text-xl h-full">
                                        <h1>
                                            {new Date(new Date().getTime() + (Number(pedido.tiempoEstimado) * 60 * 1000)).toLocaleTimeString().slice(0, 5)}
                                        </h1>
                                    </div>
                                </div>
                                <div>
                                    <h1>${}</h1>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

        </div>
        
        </>
    )

}