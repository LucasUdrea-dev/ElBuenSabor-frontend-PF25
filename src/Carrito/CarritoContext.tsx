import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { ArticuloInsumo, ArticuloManufacturado, DetallePedido, DetallePromocion, Direccion, DireccionPedido, host, Pedido, Promocion, Sucursal, tiposEnvioEnum, tiposPagoEnum, Usuario } from "../../ts/Clases";
import axios from "axios";

interface CarritoContextType{
    pedido: Pedido
    paraDelivery: ()=>void
    paraRetirar: ()=>void
    calcularPrecioTotal: ()=>number
    cambiarDireccion: (direccion: Direccion)=>void
    cambiarMetodoPago: (metodo: string)=>void
    agregarArticulo: (articulo: ArticuloManufacturado | ArticuloInsumo, cantidad: number)=>void
    quitarArticulo: (articulo: ArticuloManufacturado | ArticuloInsumo)=>void
    borrarArticulo: (articulo: ArticuloManufacturado | ArticuloInsumo)=>void
    agregarPromocion: (promocion: Promocion, cantidad: number)=>void
    quitarPromocion: (promocion: Promocion)=>void
    borrarPromocion: (promocion: Promocion)=>void
    vaciarPedido: ()=>void
}

export const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

export default function CarritoProvider({children}: PropsWithChildren) {

    const inicializarPedido = async()=>{
        let pedidoNuevo = new Pedido()

        const datosSucursal: Sucursal = await obtenerSucursal()
        const datosUsuario: Usuario = await obtenerUsuario()

        pedidoNuevo = {...pedidoNuevo, sucursal: datosSucursal, usuario: datosUsuario}

        return pedidoNuevo

    }

    const obtenerSucursal = async()=>{
        const URL = host+`/api/sucursales/${1}`

        try {
            
            const response = await axios.get(URL)

            const sucursal: Sucursal = response.data

            return sucursal;

        } catch (error) {
            console.error(error)
            return new Sucursal()
        }

    }

    const obtenerUsuario = async()=>{
        const URL = host+`/api/usuarios/${2}`

        try {
            const response = await axios.get(URL)

            const usuario: Usuario = response.data

            return usuario;

        } catch (error) {
            console.error(error)
            return new Usuario()
        }

    }

    const [pedido, setPedido] = useState<Pedido>(()=>{
        const carritoGuardado = localStorage.getItem("carrito")
        return carritoGuardado ? JSON.parse(carritoGuardado) : new Pedido()
    })

    useEffect(()=>{
        const cargarCarrito = async()=>{
            
            try {
                const carritoGuardado = localStorage.getItem("carrito")
                if (carritoGuardado) {
                    
                    setPedido(JSON.parse(carritoGuardado))
                }else{
                    const pedidoInicial = await inicializarPedido()
                    setPedido(pedidoInicial)
                }
                
            } catch (error) {
                console.error("Error al leer el carrito guardado: ", error)
                const pedidoInicial = await inicializarPedido()
                setPedido(pedidoInicial)
            }
        }

        cargarCarrito()
    }, [])

    useEffect(()=>{

        console.log(pedido)
        if (pedido.sucursal.id || pedido.usuario.id) {
            try {
                localStorage.setItem("carrito", JSON.stringify(pedido))
            } catch (error) {
                console.error("Error al guardar el carrito en localstorage: ", error)
            }
        }
    }, [pedido])

    useEffect(()=>{
        calcularTiempoEstimado()
    }, [pedido.detallePedidoList, pedido.detallePromocionList])

    useEffect(()=>{
        cambiarMetodoPago("MERCADOPAGO")
    }, [pedido.tipoEnvio])

    const calcularPrecioTotal = ()=>{

        let precioTotal = 0

        for (const detalle of pedido?.detallePedidoList) {
            if (detalle.articulo) {
                precioTotal = precioTotal + (detalle.articulo.precio * detalle.cantidad)
            }
        }

        for (const detalle of pedido.detallePromocionList) {
            precioTotal = precioTotal + (detalle.promocion.precioRebajado * detalle.cantidad)
        }

        return precioTotal

    }

    const vaciarPedido = async()=>{

        localStorage.removeItem("carrito")
        setPedido(await inicializarPedido())

    }

    const calcularTiempoEstimado = ()=>{

        setPedido((prev)=>{
            
            let mayorTiempo = 0

            if (prev.detallePromocionList?.length > 0) {
                return {...prev, tiempoEstimado: "30"}
            }

            prev.detallePedidoList?.map((detalle)=> {
                if (Number(detalle.articulo?.tiempoEstimado?.split(" ")[0]) > mayorTiempo) {
                    mayorTiempo = Number(detalle.articulo?.tiempoEstimado?.split(" ")[0])
                }
            })

            return {...prev, tiempoEstimado: String(mayorTiempo)}

        })

    }

    const paraDelivery = ()=>{
        setPedido((prev)=>{
            return {...prev, tipoEnvio: tiposEnvioEnum[0]}
        })
    }

    const paraRetirar = ()=>{
        setPedido((prev)=>{
            return {...prev, tipoEnvio: tiposEnvioEnum[1]}
        })
    }

    const cambiarMetodoPago = (metodo: string)=>{
        setPedido((prev)=>{

            const metodoSeleccionado = tiposPagoEnum.find((tipo)=>tipo.tipoPago == metodo)

            if (metodoSeleccionado) {
                return {...prev, tipoPago: metodoSeleccionado}
            }

            return prev

        })
    }

    const agregarArticulo = (articulo: ArticuloManufacturado | ArticuloInsumo, cantidad: number)=>{

        setPedido((prev)=>{

            const encontrado = prev.detallePedidoList.find((detalle)=> detalle.articulo?.id == articulo.id)
            let nuevoDetallePedido: DetallePedido[];

            if (encontrado) {
                nuevoDetallePedido = prev.detallePedidoList.map(detalle =>
                    detalle.articulo?.id == articulo.id ? 
                    {...detalle, cantidad: detalle.cantidad + (cantidad ? cantidad : 1)}
                    :
                    detalle
                )
            }else{
                nuevoDetallePedido = [...prev.detallePedidoList, {cantidad: (cantidad ? cantidad : 1), articulo: articulo}]
            }

            return {...prev, detallePedidoList: nuevoDetallePedido}

        })

    }

    const quitarArticulo = (articulo: ArticuloInsumo | ArticuloManufacturado)=>{
        setPedido((prev)=>{
            let nuevoDetallePedido: DetallePedido[];

            nuevoDetallePedido = prev.detallePedidoList.map((detalle)=>
            detalle.articulo?.id == articulo.id ?
            {...detalle, cantidad: detalle.cantidad - 1}
            :
            detalle
            )

            return {...prev, detallePedidoList: nuevoDetallePedido}
        })
    }

    const borrarArticulo = (articulo: ArticuloInsumo | ArticuloManufacturado)=>{
        setPedido((prev)=>{

            const nuevoDetallePedido = prev.detallePedidoList.filter((detalle)=> detalle.articulo?.id != articulo.id)

            return {...prev, detallePedidoList: nuevoDetallePedido}

        })
    }

    const agregarPromocion = (promocion: Promocion, cantidad: number)=>{

        setPedido((prev)=>{

            const encontrado = prev.detallePromocionList.find((detalle)=> detalle.promocion.id == promocion.id)
            let nuevoDetallePromocion: DetallePromocion[];

            if (encontrado) {
                
                nuevoDetallePromocion = prev.detallePromocionList.map((detalle)=>
                detalle.promocion.id == promocion.id ?
                {...detalle, cantidad: detalle.cantidad + (cantidad ? cantidad : 1)}
                :
                detalle
                )

            } else {
                nuevoDetallePromocion = [...prev.detallePromocionList, {promocion: promocion, cantidad: (cantidad ? cantidad : 1)}]
            }

            return {...prev, detallePromocionList: nuevoDetallePromocion}

        })

    }

    const quitarPromocion = (promocion: Promocion)=>{
        setPedido((prev)=>{
            let nuevoDetallePromocion: DetallePromocion[]

            nuevoDetallePromocion = prev.detallePromocionList.map((detalle)=>
            detalle.promocion.id == promocion.id ?
            {...detalle, cantidad: detalle.cantidad - 1}
            :
            detalle
            )

            return {...prev, detallePromocionList: nuevoDetallePromocion}
        })
    }

    const borrarPromocion = (promocion: Promocion)=>{
        setPedido((prev)=>{

            const nuevoDetallePromocion = prev.detallePromocionList.filter((detalle)=> detalle.promocion.id != promocion.id)

            return {...prev, detallePromocionList: nuevoDetallePromocion}

        })
    }

    const cambiarDireccion = (direccion: Direccion)=>{
        setPedido((prev)=>{

            const nuevoDireccionPedido: DireccionPedido = new DireccionPedido()

            nuevoDireccionPedido.direccion = direccion

            return {...prev, direccionPedido: nuevoDireccionPedido}

        })
    }
    
    return(
        <CarritoContext.Provider value={{pedido, vaciarPedido, paraDelivery, paraRetirar, cambiarDireccion, cambiarMetodoPago, calcularPrecioTotal, agregarArticulo, agregarPromocion, quitarArticulo, quitarPromocion, borrarArticulo, borrarPromocion}}>
            {children}
        </CarritoContext.Provider>
    )

}