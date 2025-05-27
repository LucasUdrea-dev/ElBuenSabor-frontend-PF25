import { useEffect, useState } from "react";
import { ArticuloManufacturado } from "../ts/Clases"
import { obtenerImagen } from "../ts/Imagen";

interface Props{
    articulo: ArticuloManufacturado | null;
    cerrarEditar: ()=> void;
}

export default function AdminFormManufacturado({articulo, cerrarEditar}: Props) {

    const [form, setForm] = useState<ArticuloManufacturado >(new ArticuloManufacturado())
    const [seccionActiva, setSeccionActiva] = useState(1)

    useEffect(()=>{
        if (articulo) {
            setForm(articulo)
        }
    },[articulo])
    
    useEffect(()=>{
        console.log(form)
    },[form])



    const siguienteSeccion = ()=>{
        setSeccionActiva((prev)=> prev + 1)
    }

    const anteriorSeccion = ()=>{
        setSeccionActiva((prev)=> prev - 1)
    }

    if (!form) return null;
    
    return(
        <>
        
            <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">

                {/**Cabecera formulario */}
                <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
                    <h1>Detalle Producto</h1>
                    <button onClick={()=>{
                        cerrarEditar()
                        setSeccionActiva(1)
                        }} className="p-2 rounded-xl">

                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z" fill="black"/>
                        </svg>

                    </button>
                </div>

                {/**Formulario */}
                <div className="p-10 grid grid-cols-1 text-white [&_input]:focus:outline-none [&_input]:border-b [&_input]:py-2 [&_input]:w-full">
                    
                    {/**Informacion basica */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">1</h1>
                            </div>
                            <div className=" text-3xl">
                                <h2>Información Básica</h2>
                            </div>
                        </div>

                        {/**Contenido */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="h-full min-h-5 w-7">
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 1 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Nombre:</h3>
                                    <input value={form?.nombre} onChange={(e)=>setForm((prev)=> ({...prev, nombre: e.target.value}))} className="w-full" type="text" />
                                </div>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="flex flex-col">
                                        <h3>Precio de venta:</h3>
                                        <input value={form.precio ? form.precio : ""} onChange={(e)=>setForm((prev)=> ({...prev, precio: Number(e.target.value)}))} type="number" />
                                    </div>
                                    <div>
                                        <h3>Tiempo estimado{"(en minutos)"}:</h3>
                                        <input value={form.tiempoEstimado.split(" ")[0]} onChange={(e)=>setForm((prev)=> ({...prev, tiempoEstimado: e.target.value}))} type="number" />
                                    </div>
                                </div>
                                <div>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21] p-2 rounded-4xl">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/**Agrega una imagen */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">2</h1>
                            </div>
                            <div className=" text-3xl">
                                <h2>Agrega una imagen</h2>
                            </div>
                        </div>

                        {/**Contenido */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="h-full min-h-5 w-7">
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            {/**Cargar imagen y vista previa */}
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 2 ? "max-h-screen" : "max-h-0"}`}>
                                
                                <div className="grid grid-cols-2 gap-5 items-center">
                                    <div className="bg-[#D9D9D9] h-50 rounded-4xl">
                                        <img className="h-full w-full object-cover rounded-4xl" src={obtenerImagen("pizza.jpg")} alt="" />
                                    </div>
                                    <div>
                                        <h3>Agregar imagen:</h3>
                                        <input type="file" />
                                    </div>
                                </div>
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21]">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/**Selecciona las categorias */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">3</h1>
                            </div>
                            <div className=" text-3xl">
                                <h2>Selecciona las categorias</h2>
                            </div>
                        </div>

                        {/**Contenido */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="h-full min-h-5 w-7">
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 3 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Nombre:</h3>
                                    <input className="w-full" type="text" />
                                </div>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="flex flex-col">
                                        <h3>Precio de venta:</h3>
                                        <input type="number" />
                                    </div>
                                    <div>
                                        <h3>Tiempo estimado{"(min)"}:</h3>
                                        <input type="number" />
                                    </div>
                                </div>
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21]">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/**Especifica los ingredientes */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">4</h1>
                            </div>
                            <div className=" text-3xl">
                                <h2>Especifica los ingredientes</h2>
                            </div>
                        </div>

                        {/**Contenido */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="h-full min-h-5 w-7">
                                <div className="text-center m-auto bg-white h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 4 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Nombre:</h3>
                                    <input className="w-full" type="text" />
                                </div>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="flex flex-col">
                                        <h3>Precio de venta:</h3>
                                        <input type="number" />
                                    </div>
                                    <div>
                                        <h3>Tiempo estimado{"(min)"}:</h3>
                                        <input type="number" />
                                    </div>
                                </div>
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21]">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/**Confirmar */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">5</h1>
                            </div>
                            <div className=" text-3xl">
                                <h2>Confirmar</h2>
                            </div>
                        </div>

                        {/**Contenido */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="h-full w-7">
                                <div className="text-center m-auto h-full w-1 rounded-4xl text-2xl">
                                </div>
                            </div>
                            <div className={`text-2xl *:py-5 
                                overflow-hidden
                                transition-all duration-1000 ease-in-out ${seccionActiva == 5 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Nombre:</h3>
                                    <input className="w-full" type="text" />
                                </div>
                                <div className="grid grid-cols-2 gap-20">
                                    <div className="flex flex-col">
                                        <h3>Precio de venta:</h3>
                                        <input type="number" />
                                    </div>
                                    <div>
                                        <h3>Tiempo estimado{"(min)"}:</h3>
                                        <input type="number" />
                                    </div>
                                </div>
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={siguienteSeccion} className="bg-[#D93F21]">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </>
    )

}