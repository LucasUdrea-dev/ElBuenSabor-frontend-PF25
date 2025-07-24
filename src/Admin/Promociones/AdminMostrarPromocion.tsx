
import { Promocion } from "../../../ts/Clases";
import { obtenerImagen } from "../../../ts/Imagen";


interface Props{
    promocion: Promocion | null;
    cerrarMostrar: () => void
    abrirEditar: (promocion: Promocion | null)=>void
}

export default function AdminMostrarManufacturado({promocion, cerrarMostrar, abrirEditar}: Props) {
    
    const calcularCostoTotal = ()=>{
        let total = 0

        promocion?.promocionArticuloList?.map((detallePromo)=>{

            if (("precioCompra" in detallePromo.articulo!)) {
                total += (detallePromo.articulo?.precioCompra * detallePromo.cantidad)
            }else if ("detalleInsumos" in detallePromo.articulo!){
                
                detallePromo.articulo?.detalleInsumos.map((detalle)=>{
                    total += (detalle.articuloInsumo.precioCompra * detalle.cantidad)
                })

            }
        })

        return total

    }

    const calcularPrecioRegular = ()=>{
        let total = 0

        promocion?.promocionArticuloList?.map((detallePromo)=>{

            if (detallePromo.articulo) {
                total += (detallePromo.articulo.precio * detallePromo.cantidad)
            }

        })

        return total;

    }

    if (!promocion) return null

    return(
        <>
        
            <div className="bg-white rounded-4xl w-2/3 m-auto">
                
                {/**Titulo */}
                <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-gray-200 shadow-md shadow-gray-500">
                    <h1>Detalle Producto</h1>
                    <button onClick={()=>cerrarMostrar()} className="bg-[#D93F21] p-2 rounded-xl">

                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z" fill="white"/>
                        </svg>

                    </button>
                </div>

                <div className="p-[5%] *:mb-10">

                    {/**Cabecera articulo */}
                    <div className="flex justify-between items-center text-2xl">
                        <div className="grid grid-cols-[3fr_1fr]">
                            <div className="flex gap-5 items-center">
                                <img className="h-25 w-25 object-fill rounded-[20rem]" src={obtenerImagen(String(promocion.imagen))} alt="" />
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-3xl font-bold">{promocion.denominacion}</h2>
                                    <div className="flex gap-2">
                                        <h3 className="bg-[#D93F21] text-white rounded-4xl p-1 px-5">Promocion</h3>
                                        <div className="flex items-center gap-2">
                                            <div className={`${promocion?.existe ? "bg-green-600" : "bg-gray-500"} h-10 w-10 m-auto rounded-4xl`}></div>
                                            <h1>{promocion?.existe ? "Disponible" : "No Disponible"}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button onClick={()=>{
                                cerrarMostrar()
                                abrirEditar(promocion)
                            }} className="bg-[#D93F21] text-white p-2 px-5 rounded-4xl">Editar</button>
                        </div>
                    </div>

                    {/**Informacion costo, precio y ganancia */}
                    <div className="*:border-gray-500 *:border *:border-collapse text-gray-500 text-center *:py-2">

                        <div className="grid grid-cols-4 m-auto w-full">
                            <h3>Precio Costo</h3>
                            <h3>Precio Regular</h3>
                            <h3>Precio Venta</h3>
                            <h3>Ganancia</h3>
                        </div>
                        <div className="grid grid-cols-4">

                            <h3>${calcularCostoTotal()}</h3>
                            <h3>${calcularPrecioRegular()}</h3>
                            <h3>${promocion.precioRebajado}</h3>
                            <h3>${Number(promocion.precioRebajado) - calcularCostoTotal()}</h3>

                        </div>

                    </div>

                    {/**Cabecera Preparacion */}
                    <div>
                        <div className="flex items-center">
                            <img src="/svg/DetallePreparacion.svg" alt="" />
                            <h1 className="text-3xl font-bold">Detalle Preparación</h1>
                        </div>
                        <div></div>
                    </div>

                    {/**Preparacion */}
                    <div className="*:border-gray-500 *:border *:border-collapse text-gray-500 text-center *:py-2">
                        <div className="grid grid-cols-4 w-full m-auto">

                            <h3>Cantidad</h3>
                            <h3>Denominación</h3>
                            <h3>Precio Unitario</h3>
                            <h3>Precio Total</h3>

                        </div>

                        {/**Listado de todos los ingredientes */}
                        {Number(promocion.promocionArticuloList?.length) > 0 && promocion.promocionArticuloList?.map((detallePromo, index)=>(

                            <div key={index} className="grid grid-cols-4">
                                
                                <h3>{detallePromo.cantidad}</h3>
                                <h3>{detallePromo.articulo?.nombre}</h3>
                                <h3>${detallePromo.articulo?.precio}</h3>
                                <h3>${detallePromo.cantidad * Number(detallePromo.articulo?.precio)}</h3>

                            </div>
                        ))}

                    </div>

                </div>

            </div>
        
        </>
    )

}