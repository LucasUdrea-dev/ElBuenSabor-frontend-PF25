import { useContext } from "react"
import { CarritoContext } from "./CarritoContext"
import { useNavigate } from "react-router-dom"
import MercadoPago from "../MercadoPago/MercadoPago"

interface Props{
    isOpen: boolean
    cerrarModal: ()=>void
    cerrarCarrito: ()=>void
}

export default function DetallePagoCarrito({isOpen, cerrarModal, cerrarCarrito}: Props) {
    
    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>CarritoProvider no encontrado</p>
    }

    const {pedido, calcularPrecioTotal, cambiarMetodoPago} = carritoContext

    const navigate = useNavigate()

    if (!isOpen) {
        return null
    }

    return(

        <>
        
            {/**Fondo oscurecido */}
            <div onClick={()=>{
                cerrarModal()
                }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                {/**Modal */}
                <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-2xl w-1/2 max-w-lg">
                    
                    <div className="flex flex-col gap-5 p-10">
                        
                        <div className="text-2xl font-bold">
                            <h1>Detalles de facturacion</h1>
                        </div>
                        <div>
                            <h3>{pedido.tipoEnvio.tipoDelivery == "DELIVERY" ?
                            `Delivery - ${pedido.direccionPedido.direccion.nombreCalle} ${pedido.direccionPedido.direccion.numeracion}, ${pedido.direccionPedido.direccion.ciudad?.nombre}`
                            :
                            `Retiro En Local - ${pedido.sucursal.direccion?.nombreCalle} ${pedido.sucursal.direccion?.numeracion}, ${pedido.sucursal.direccion?.ciudad?.nombre}`
                            }</h3>
                        </div>

                        <div className="border-b-1 pb-5">
                            <div className="text-xl font-bold">
                                <h2>Su orden</h2>
                            </div>
                            <div>
                                {pedido.detallePromocionList.map((detalle)=>(
                                    <div className="flex justify-between">
                                        <h1>{detalle.cantidad} x {detalle.promocion.denominacion}</h1>
                                        <h1>${detalle.promocion.precioRebajado * detalle.cantidad}</h1>
                                    </div>
                                ))}
                                {pedido.detallePedidoList.map((detalle)=>(
                                    <div className="flex justify-between">
                                        <h1>{detalle.cantidad} x {detalle.articulo.nombre}</h1>
                                        <h1>${detalle.articulo.precio * detalle.cantidad}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-b-1 py-5">
                                    
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

                        <div>

                            <div>
                                <input onChange={(e)=>cambiarMetodoPago(e.target.value)} name="medioPago" value={"MERCADOPAGO"} checked={pedido.tipoPago.tipoPago === "MERCADOPAGO"} type="radio" /> <span>Pago con Mercado Pago</span>
                            </div>

                            {pedido.tipoEnvio.tipoDelivery === "TAKEAWAY" && (
                                <div>
                                    <input onChange={(e)=>cambiarMetodoPago(e.target.value)} name="medioPago" value={"CASH"} checked={pedido.tipoPago.tipoPago === "CASH"} type="radio" /> <span>Pago con Efectivo</span>
                                </div>
                            )}

                        </div>

                        {/**Este boton deberia cambiar por el de
                         * mercado pago en el caso que ese sea el
                         * tipo de pago del pedido
                         */}
                        <div className="flex justify-center">
                            {pedido.tipoPago.tipoPago === "CASH" ? (
                                <button onClick={()=>{
                                    cerrarModal()
                                    cerrarCarrito()
                                    navigate("/ordenRecibida")
                                }}
                                className="bg-[#D93F21] text-white p-2 w-3/4">Realizar Orden</button>
                            ): (
                                <MercadoPago monto={pedido.tipoEnvio.tipoDelivery === "DELIVERY" ?
                                    (calcularPrecioTotal() + (calcularPrecioTotal() * 10/100)) 
                                    :
                                    (calcularPrecioTotal())
                                }/>
                            )}
                        </div>

                    </div>
                    
                </div>
            </div>

        </>

    )

}