import { useContext, useEffect, useState } from "react"
import { CarritoContext } from "./CarritoContext"
import { host, Pedido } from "../../ts/Clases"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"

export default function OrdenRecibida() {

    const [params] = useSearchParams()

    const status = params.get("status")

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>CarritoProvider no encontrado</p>
    }

    const {pedido, vaciarPedido} = carritoContext

    let pedidoTerminado: Pedido = pedido
    const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido>(new Pedido())
    const [guardado, setGuardado] = useState(false)
    const navigate = useNavigate()

    let pedidoGuardado: boolean = false

    {/**Funcion que se tiene que activar
        una vez que se confirma el guardado del pedido */}
    const reiniciarCarrito = ()=>{
        vaciarPedido()
    }

    useEffect(()=>{
        console.log()
    }, [pedidoConfirmado])

    const guardarPedido = async()=>{

        const URL = host+"/api/pedidos"

        sacarDireccionPedido()

        try {
            
            const response = await axios.post(URL, pedidoTerminado)

            console.log("RESPONSE.DATA: " + response.data)
            await obtenerPedidoGuardado(response.data)
            setGuardado(true)
            pedidoGuardado = true
            reiniciarCarrito()

        } catch (error) {
            console.error(error)
        }

    }

    const obtenerPedidoGuardado = async(id: number)=>{
        const URL = host+`/api/pedidos/${id}`

        try {
            
            const response = await axios.get(URL);

            setPedidoConfirmado(response.data)

        } catch (error) {
            console.error(error)
        }

    }

    const sacarDireccionPedido = ()=>{

        pedidoTerminado.fecha = new Date().toISOString()

        if (pedidoTerminado.tipoEnvio.tipoDelivery != "DELIVERY") {
            delete pedidoTerminado.direccionPedido;
        }
    }

    const verificarPagoYGuardar = async()=>{
        if (pedidoTerminado.tipoPago.tipoPago == "MERCADOPAGO") {
            if (status == "approved") {
                await guardarPedido()
            }
        }else{
            await guardarPedido()
        }
    }

    useEffect(()=>{
        if (!pedidoGuardado) {
            verificarPagoYGuardar()
        }
    }, [])

    const calcularPrecioTotalPedidoConfirmado = ()=>{

        let precioTotal = 0

        for (const detalle of pedidoConfirmado.detallePedidoList) {
            precioTotal = precioTotal + ((detalle.articulo ? detalle.articulo.precio : 0) * detalle.cantidad)
        }

        for (const detalle of pedidoConfirmado.detallePromocionList) {
            precioTotal = precioTotal + (detalle.promocion.precioRebajado * detalle.cantidad)
        }

        return precioTotal

    }

    if (!guardado) {
        return(
            <div className="bg-[#333333] h-screen w-full"></div>
        )
    }
    
    return(
        <>
        
        <div className="bg-[#333333] h-full w-full py-40">

            <div className="bg-white rounded-2xl m-auto w-2/3 max-w-2xl">
                    
                <div className="flex flex-col gap-5 p-10">
                    
                    <div className="text-2xl font-bold">
                        <h1>Orden Recibida</h1>
                    </div>

                    {/**Detalles de entrega */}
                    <div>
                        <h2 className="text-xl font-bold">Detalles de entrega:</h2>
                        <h3>Su pedido {pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY" 
                        ? "llegara" : "estara listo"} aproximadamente a las {new Date(new Date().getTime() + (Number(pedidoConfirmado.tiempoEstimado) * 60 * 1000) ).toLocaleTimeString().slice(0, 5)}
                        </h3>
                        <h3>{pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY" ?
                            `Envio a domicilio: ${pedidoConfirmado.direccionPedido?.direccion.nombreCalle} ${pedidoConfirmado.direccionPedido?.direccion.numeracion}, ${pedidoConfirmado.direccionPedido?.direccion.ciudad.nombre}`
                            :
                            `Retiro en local: ${pedidoConfirmado.sucursal.direccion?.nombreCalle} ${pedidoConfirmado.sucursal.direccion?.numeracion}, ${pedidoConfirmado.sucursal.direccion?.ciudad.nombre}`}
                        </h3>
                    </div>

                    <div className="opacity-40">
                        <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                            <h1>Fecha</h1>
                            <h1>Total</h1>
                            <h1>Forma de pago</h1>
                        </div>
                        <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                            <h1>{pedidoConfirmado.fecha}</h1>
                            <h1>${calcularPrecioTotalPedidoConfirmado() + 
                                (pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY" ? 
                                (calcularPrecioTotalPedidoConfirmado()*10/100) 
                                : (0))}
                            </h1>
                            <h1>
                                {pedidoConfirmado.tipoPago.tipoPago == "CASH" ?
                                "Efectivo"
                                : 
                                "Mercado Pago"}
                            </h1>
                        </div>
                    </div>
                    
                    {/**Detalles de la orden */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-xl font-bold">Detalles de la orden</h2>
                        </div>
                        <div className="opacity-40">
                            <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                                <h1>Denominacion</h1>
                                <h1 className="text-center">Cantidad</h1>
                                <h1 className="text-center">Total</h1>
                            </div>

                            {pedidoConfirmado.detallePedidoList.map((detalle)=>(
                                <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                                    <h1>{detalle.articulo?.nombre}</h1>
                                    <h1 className="text-center">{detalle.cantidad}</h1>
                                    <h1 className="text-center">{detalle.cantidad * (detalle.articulo ? detalle.articulo.precio : 0)}</h1>
                                </div>
                            ))}
                            {pedidoConfirmado.detallePromocionList.map((detalle)=>(
                                <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                                    <h1>{detalle.promocion.denominacion}</h1>
                                    <h1 className="text-center">{detalle.cantidad}</h1>
                                    <h1 className="text-center">${detalle.cantidad * detalle.promocion.precioRebajado}</h1>
                                </div>
                            ))}

                            {/**Se muestra el costo del envio
                             * si el pedido es delivery
                             */}
                            {pedidoConfirmado.tipoEnvio.tipoDelivery == "DELIVERY" && (
                                <div className="grid grid-cols-3 items-center border-1 py-2 px-5">
                                    <h1>10% Delivery</h1>
                                    <h1></h1>
                                    <h1 className="text-center">${calcularPrecioTotalPedidoConfirmado() * 10/100}</h1>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button onClick={()=>{
                            if (guardado) {
                                navigate("/catalogo")
                            }

                        }}
                        className="bg-[#D93F21] text-white p-2 w-1/3">Cerrar</button>
                        
                    </div>

                </div>
                
            </div>

        </div>

        </>
    )

}