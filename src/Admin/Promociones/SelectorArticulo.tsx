import { useEffect, useState } from "react";
import { ArticuloInsumo, ArticuloManufacturado, host, Promocion, PromocionArticulo } from "../../../ts/Clases";
import axios from "axios";

interface Props{
    abierto: boolean
    setForm: React.Dispatch<React.SetStateAction<Promocion>>
    cerrar: ()=>void
}

export default function SelectorArticulo({abierto, cerrar, setForm}: Props) {
    
    const [listaArticulos, setListaArticulos] = useState<(ArticuloInsumo | ArticuloManufacturado)[]>([])
    const [listaArticulosBuscador, setListaArticulosBuscador] = useState<(ArticuloInsumo | ArticuloManufacturado)[]>([])
    const [buscadorArticulo, setBuscadorArticulo] = useState("")

    useEffect(()=>{
        
        traerArticulos()

    },[])

    const axiosConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

    const traerArticulos = async ()=>{
        const URL = host+"/api/articulo/promos"

        try {
            
            const response = await axios.get(URL, axiosConfig)
            
            setListaArticulos(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        let filtrado: (ArticuloInsumo | ArticuloManufacturado)[] = listaArticulos

        filtrado = filtrado.filter((insumo)=> insumo.nombre.toLowerCase().includes(buscadorArticulo.toLowerCase()))

        setListaArticulosBuscador(filtrado)

    },[buscadorArticulo, abierto])

    const cerrarModal = ()=>{
        setBuscadorArticulo("")
        cerrar()
    }

    if (!abierto) return null

    return(
        <>
            <div onClick={cerrarModal} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                <div onClick={(e)=> e.stopPropagation()} className="bg-white w-4/5 rounded-4xl text-black">

                    {/**Cabecera */}
                    <div className="text-3xl flex justify-between rounded-t-4xl p-5 items-center bg-gray-200 shadow-md shadow-gray-500">
                        <h1>Seleccione el articulo</h1>
                        <button onClick={cerrarModal}>
                            <img src="/svg/CerrarVentana.svg"/>
                        </button>
                    </div>

                    {/**Cuerpo */}
                    <div className="p-5">
                        
                        <div className="w-1/2">
                            <input onChange={(e)=>setBuscadorArticulo(e.target.value)} className="bg-[#878787] text-white pl-5 rounded-4xl w-1/2" placeholder="Buscar..." type="text" />
                        </div>

                        <div className="flex flex-col py-2 [&_h5]:text-sm max-h-[60vh] overflow-y-auto">
                            
                            {/**Cabecera de tabla */}
                            <div className="grid grid-cols-4 text-4xl w-full *:border-2 *:border-gray-500 *:w-full *:py-5 *:border-collapse text-center">

                                <div className="flex items-center justify-center px-2">
                                    <h5>Imagen</h5>
                                </div>
                                <div className="flex items-center justify-center">
                                    <h5>Nombre</h5>
                                </div>
                                <div className="flex items-center justify-center">
                                    <h5>Precio</h5>
                                </div>
                                <div className="flex items-center justify-center">
                                    <h5>Agregar</h5>
                                </div>

                            </div>

                            {listaArticulosBuscador.length > 0 && listaArticulosBuscador.map((articulo)=>(
                                <div key={articulo.id} className="text-4xl w-full grid grid-cols-4 *:border-2 *:border-gray-500 *:w-full *:py-1 *:border-collapse text-center">

                                    <div className="bg-cover bg-no-repeat bg-center" style={{backgroundImage: `url('${articulo.imagenArticulo}')`}}></div>

                                    <div className="flex items-center justify-center">
                                        <h5>{articulo.nombre}</h5>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <h5>${articulo.precio}</h5>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button onClick={()=>{
                                            setForm((prev)=>{
                                                let encontrado = prev.promocionArticuloList.find((detalle)=> detalle.articulo?.id == articulo.id)

                                                if (encontrado) {
                                                    cerrarModal()
                                                    alert(`El ingrediente ${articulo.nombre} ya se encuentra en el producto`)
                                                    return prev
                                                }else{
                                                    let detalleNuevo: PromocionArticulo = new PromocionArticulo()
                                                    detalleNuevo.articulo = articulo
                                                    
                                                    cerrarModal()
                                                    return {...prev, promocionArticuloList: [...prev.promocionArticuloList, detalleNuevo]}
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