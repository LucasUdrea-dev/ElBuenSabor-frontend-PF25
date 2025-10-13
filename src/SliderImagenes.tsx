import { useState } from "react"
import {obtenerImagen} from "../ts/Imagen.ts"

interface Props{
    data: any[]
}

export default function SliderImagenes({data}: Props) {
    
    const [indexActual, setIndexActual] = useState(0)

    const siguenteImagen = ()=>{
        if (indexActual == (data.length - 1)) {
            setIndexActual(0)
        }else{
            setIndexActual(indexActual + 1)
        }
    }

    const anteriorImagen = ()=>{
        if (indexActual == 0) {
            setIndexActual(data.length - 1)
        } else {
            setIndexActual(indexActual - 1)
        }
    }

    return(

        <>
        <div className="relative w-1/1 h-full flex items-center">

            <button className="absolute left-0 text-5xl h-full w-1/7 hover:bg-black/70 transition duration-500 rounded-l-4xl" onClick={anteriorImagen} type="button">{"<"}</button>
            {data.length > 0 ? (
                
                <img className="h-full m-auto w-full top-1/2 object-cover rounded-4xl" src={obtenerImagen(data[indexActual].imagen)} alt="No se pudo recuperar la imagen" />
                
            ) : (
                <p>Cargando imagenes...</p>
            )}
            <button className="absolute right-0 text-5xl h-full w-1/7 hover:bg-black/70 transition duration-500 rounded-r-4xl" onClick={siguenteImagen} type="button">{">"}</button>

        </div>
        </>

    )

}