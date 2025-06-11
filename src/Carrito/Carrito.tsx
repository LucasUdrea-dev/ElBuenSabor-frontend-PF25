import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CarritoContext } from "./CarritoContext";
import DetallePromocionCarrito from "./DetallePromocionCarrito";
import DetallePedidoCarrito from "./DetallePedidoCarrito";
import SeleccionarDireccionCarrito from "./SeleccionarDireccionCarrito";
import DetallePagoCarrito from "./DetallePagoCarrito";

interface Props{
    mostrarCarrito: boolean;
    cerrarCarrito: ()=>void
}

export default function Carrito({mostrarCarrito, cerrarCarrito}: Props) {

    const [mostrarSeleccionarDireccion, setMostrarSeleccionarDireccion] = useState(false)
    const [detallePago, setDetallePago] = useState(false)

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>CartProvider no encontrado.</p>
    }

    const {pedido, paraDelivery, paraRetirar, calcularPrecioTotal, vaciarPedido} = carritoContext;

    const cerrarSeleccionarDireccion = ()=>{
        setMostrarSeleccionarDireccion(false)
    }

    const cerrarDetallePago = ()=>{
        setDetallePago(false)
    }

    const botonContinuar = ()=>{
        if(pedido.tipoEnvio.tipoDelivery == "DELIVERY"){
            if (pedido.direccionPedido.direccion.id) {
                setDetallePago(true)
            }
        }else{
            setDetallePago(true)
        }
    }
    
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

                            <div className="px-2">
                                <div className="text-xl text-center">
                                    <h1>Entrega</h1>
                                </div>

                                {/**Seleccionar Delivery o Retirar*/}
                                <div className="flex justify-between">
                                    <button onClick={()=>paraRetirar()} className={`flex items-center border rounded-2xl px-2 ${pedido.tipoEnvio.tipoDelivery == "TAKEAWAY" ? "opacity-100" : "opacity-40"}`}>
                                        <img src="./svg/enTienda.svg" alt="" />
                                        <h1>En Local</h1>
                                    </button>
                                    <button onClick={()=>paraDelivery()} className={`flex items-center border rounded-2xl px-2 ${pedido.tipoEnvio.tipoDelivery == "DELIVERY" ? "opacity-100" : "opacity-40"}`}>
                                        <img src="./svg/delivery.svg" alt="" />
                                        <h1>Delivery</h1>
                                    </button>
                                </div>

                                {/**Hora estimada y direccion */}
                                <div className="py-2 flex flex-col gap-2">
                                    <div className="text-xl flex items-center gap-2 h-full">
                                        <img src="./svg/relojCarrito.svg" alt="" />
                                        <h1>
                                            {new Date(new Date().getTime() + (Number(pedido.tiempoEstimado) * 60 * 1000)).toLocaleTimeString().slice(0, 5)}
                                        </h1>
                                    </div>
                                    <div>
                                        {pedido.tipoEnvio.tipoDelivery == "DELIVERY" && (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <img src="./svg/logoUbicacionCarrito.svg" alt="" />
                                                    <div className="grid grid-cols-[3fr_1fr] w-full items-center">
                                                        <h1>{pedido.direccionPedido?.direccion.id ? 
                                                        `${pedido.direccionPedido.direccion.nombreCalle} ${pedido.direccionPedido.direccion.numeracion}, ${pedido.direccionPedido.direccion.ciudad?.nombre}` 
                                                        : `Seleccione una direccion`}
                                                        </h1>
                                                        <button onClick={()=>setMostrarSeleccionarDireccion(true)}>
                                                            <img className="h-5 m-auto" src="./svg/seleccionarDireccionCarrito.svg" alt="" />
                                                        </button>
                                                    </div>    
                                                </div>
                                                <div className="text-red-400 text-center">
                                                    {!pedido.direccionPedido.direccion.id && (
                                                        <h1>Seleccione una direccion</h1>
                                                    )}
                                                </div>

                                            </div>

                                        )}
                                    </div>
                                </div>

                                {/**Precios */}
                                <div>
                                    
                                    {pedido.tipoEnvio.tipoDelivery == "DELIVERY" && (
                                        <div>
                                            <div className="flex justify-between opacity-70">
                                                <h1>Subtotal:</h1>
                                                <h1>${calcularPrecioTotal()}</h1>
                                            </div>
                                            <div className="flex justify-between opacity-50 text-sm">
                                                <h2>10% Delivery</h2>
                                                <h2>${calcularPrecioTotal() * 10/100}</h2>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <h1>TOTAL:</h1>
                                        <h1>${pedido.tipoEnvio.tipoDelivery == "DELIVERY" ? `${calcularPrecioTotal() + (calcularPrecioTotal()*10/100)}` : `${calcularPrecioTotal()}`}</h1>
                                    </div>

                                </div>

                                {/**Botones Cancelar o Confirmar */}
                                <div className="grid grid-cols-2 gap-5 mt-5">
                                    <button onClick={()=>vaciarPedido()}
                                        className="border p-1 rounded-2xl">
                                        Cancelar Orden
                                    </button>
                                    <button
                                        onClick={()=>botonContinuar()}
                                        className="p-1 rounded-2xl bg-[#D93F21] text-white">
                                        Continuar
                                    </button>
                                </div>

                            </div>

                        </div>
                    )}
                </div>
            </div>

        </div>

        <SeleccionarDireccionCarrito isOpen={mostrarSeleccionarDireccion} cerrarModal={cerrarSeleccionarDireccion}/>
        <DetallePagoCarrito isOpen={detallePago} cerrarModal={cerrarDetallePago} cerrarCarrito={cerrarCarrito}/>

        </>
    )

}