import { useEffect, useState } from "react"
import {Promocion} from "../../ts/Clases.ts"
import { obtenerImagen } from "../../ts/Imagen.ts"
import DetallePromocion from "./DetallePromocion.tsx"

interface Props{
    promos: Promocion[]
}

export default function SliderPromociones({promos}: Props) {

    const [indexActual, setIndexActual] = useState(0)
    const [detallePromocion, setDetallePromocion] = useState<Promocion | null>(null)

    useEffect(()=>{
        if (promos.length === 0) {
            return;
        }

        const intervalId = setInterval(()=>{
            setIndexActual(prev => (prev + 1) % promos.length)
        }, 5000)

        return ()=> {
            clearInterval(intervalId)
        }

    }, [promos.length, promos, indexActual])

    const cerrarDetalle = ()=>{
        setDetallePromocion(null)
    }
    
    return(
        <>
        
        <div className="bg-[#444444] rounded-4xl relative w-1/1 h-[300px] flex items-center">
        
            {promos.length > 0 ? (
                <div className="grid grid-cols-[2fr_3fr] w-1/1">
                    <div className="p-10 flex flex-col gap-10">
                        <h1 className="text-6xl">{promos[indexActual].denominacion}</h1>
                        <h2 className="text-4xl text-center">{promos[indexActual].descripcion}</h2>
                    </div>
                    
                    <button onClick={()=>setDetallePromocion(promos[indexActual])}>
                        <img className="m-auto h-[300px] w-full top-1/2 
                        object-cover rounded-r-4xl" 
                        src={obtenerImagen(promos[indexActual].imagen)} 
                        alt="No se pudo recuperar la imagen" />
                    </button>
                    
                </div>
                
            ) : (
                <p>Cargando imagenes...</p>
            )}
            <div className="absolute flex justify-center gap-5 bottom-2 text-xl h-1/10 w-2/5 rounded-r-4xl">
                {/**Se crean los botones para cambiar de promocion */}
                {promos.length > 0 && promos.map((_, index) => (
                    <button key={index} className={`${indexActual == index ? "bg-[#D93F21] border-black" : "bg-black"} rounded-4xl w-7 h-7 border-2`} onClick={()=>{
                        setIndexActual(index)
                    }}></button>
                ))}
            </div>
        
        </div>

        <DetallePromocion promocion={detallePromocion} onClose={cerrarDetalle}/>
        
        </>
    )

}