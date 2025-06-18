import { useEffect, useState } from "react";
import { ArticuloInsumo, ArticuloManufacturado, ArticuloManufacturadoDetalleInsumo, host } from "../../../ts/Clases";
import axios from "axios";

interface Props{
    abierto: boolean
    setForm: React.Dispatch<React.SetStateAction<ArticuloManufacturado>>
    cerrar: ()=>void
}

export default function SelectorInsumo({abierto, cerrar, setForm}: Props) {
    
    const [listaInsumos, setListaInsumos] = useState<ArticuloInsumo[]>([])
    const [listaInsumosBuscador, setListaInsumosBuscador] = useState<ArticuloInsumo[]>([])
    const [buscadorInsumo, setBuscadorInsumo] = useState("")

    useEffect(()=>{
        
        traerInsumos()

    },[])

    const traerInsumos = async ()=>{
        const URL = host+"/api/insumos/paraElaborar"

        try {
            
            const response = await axios.get(URL)
            
            setListaInsumos(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        let filtrado: ArticuloInsumo[] = listaInsumos

        filtrado = filtrado.filter((insumo)=> insumo.nombre.toLowerCase().includes(buscadorInsumo.toLowerCase()))

        setListaInsumosBuscador(filtrado)

    },[buscadorInsumo, abierto])

    const cerrarModal = ()=>{
        setBuscadorInsumo("")
        cerrar()
    }

    if (!abierto) return null

    return(
        <>
            <div onClick={cerrarModal} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                <div onClick={(e)=> e.stopPropagation()} className="bg-white w-4/5 rounded-4xl text-black">

                    {/**Cabecera */}
                    <div className="text-3xl flex justify-between rounded-t-4xl p-5 items-center bg-gray-200 shadow-md shadow-gray-500">
                        <h1>Seleccione el insumo</h1>
                        <button onClick={cerrarModal}>
                            <img src="/svg/CerrarVentana.svg"/>
                        </button>
                    </div>

                    {/**Cuerpo */}
                    <div className="p-5">
                        
                        <div className="w-1/2">
                            <input onChange={(e)=>setBuscadorInsumo(e.target.value)} className="bg-[#878787] text-white pl-5 rounded-4xl w-1/2" placeholder="Buscar..." type="text" />
                        </div>

                        <div className="flex flex-col py-2 [&_h5]:text-sm max-h-[60vh] overflow-y-auto">
                            
                            {/**Cabecera de tabla */}
                            <div className="text-4xl w-full flex *:border-2 *:border-gray-500 *:w-full *:py-5 *:border-collapse text-center">

                                <div className="flex items-center justify-center">
                                    <h5>Nombre</h5>
                                </div>
                                <div className="flex items-center justify-center">
                                    <h5>Costo</h5>
                                </div>
                                <div className="flex items-center justify-center px-2">
                                    <h5>Unidad de medida</h5>
                                </div>
                                <div className="flex items-center justify-center">
                                    <h5>Agregar</h5>
                                </div>

                            </div>

                            {listaInsumosBuscador.length > 0 && listaInsumosBuscador.map((insumo)=>(
                                <div key={insumo.id} className="text-4xl w-full flex *:border-2 *:border-gray-500 *:w-full *:py-1 *:border-collapse text-center">

                                    <div className="flex items-center justify-center">
                                        <h5>{insumo.nombre}</h5>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <h5>${insumo.precioCompra}</h5>
                                    </div>
                                    <div className="flex items-center justify-center px-2">
                                        <h5>{insumo.unidadMedida?.unidad}</h5>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button onClick={()=>{
                                            setForm((prev)=>{
                                                let encontrado = prev.detalleInsumos.find((detalle)=> detalle.articuloInsumo.id == insumo.id)

                                                if (encontrado) {
                                                    cerrarModal()
                                                    alert(`El ingrediente ${insumo.nombre} ya se encuentra en el producto`)
                                                    return prev
                                                }else{
                                                    let detalleNuevo: ArticuloManufacturadoDetalleInsumo = new ArticuloManufacturadoDetalleInsumo()
                                                    detalleNuevo.articuloInsumo = insumo
                                                    
                                                    cerrarModal()
                                                    return {...prev, detalleInsumos: [...prev.detalleInsumos, detalleNuevo]}
                                                }
                                            })

                                        }} className="bg-[#D93F21] text-white px-2 rounded-4xl">
                                            <h5>Agregar</h5>
                                        </button>
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>
        
        </>
    )

}