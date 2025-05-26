import { useEffect } from "react";
import { ArticuloManufacturado } from "../ts/Clases"

interface Props{
    articulo: ArticuloManufacturado | null;
    cerrarEditar: ()=> void;
}

export default function AdminFormManufacturado({articulo, cerrarEditar}: Props) {

    useEffect(()=>{
        console.log(articulo)
    },[articulo])
    
    return(
        <>
        
            <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">

                {/**Cabecera formulario */}
                <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
                    <h1>Detalle Producto</h1>
                    <button onClick={()=>cerrarEditar()} className="p-2 rounded-xl">

                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z" fill="black"/>
                        </svg>

                    </button>
                </div>

                <div className="p-10 grid grid-cols-1 grid-rows-10 text-white">

                    <div className="flex gap-2 items-center">
                        <div className="text-center flex items-center bg-white h-7 w-7 rounded-4xl text-2xl">
                            <h1 className=" m-auto text-black">1</h1>
                        </div>
                        <div className="text-3xl">
                            <h2>Información Básica</h2>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="text-center flex items-center bg-white h-7 w-1 rounded-4xl text-2xl">
                            <h1 className=" m-auto text-black border"></h1>
                        </div>
                        <div className="text-3xl">
                            <h2>Información Básica</h2>
                        </div>
                    </div>

                </div>

            </div>

        </>
    )

}