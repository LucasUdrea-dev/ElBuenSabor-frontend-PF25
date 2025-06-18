import { useEffect, useState } from "react";
import { Categoria, host } from "../../../ts/Clases"
import { borrarImagen, obtenerImagen, subirImagen } from "../../../ts/Imagen";
import axios from "axios";

interface Props{
    categoria: Categoria | null;
    cerrarEditar: ()=> void;
    cargarAdminCatalogo: ()=>void
}

export default function AdminFormCategoria({categoria, cerrarEditar, cargarAdminCatalogo}: Props) {

    const [form, setForm] = useState<Categoria>(new Categoria())
    const [imagen, setImagen] = useState<File | null>(null)
    const [previewImagen, setPreviewImagen] = useState<string | null>(null)

    useEffect(()=>{

        if (categoria) {
            setForm(categoria)
            setPreviewImagen(obtenerImagen(categoria.imagen))
        }
    },[categoria])

    const cerrarFormulario = ()=>{
        cargarAdminCatalogo()
        cerrarEditar()
        setImagen(null)
        setPreviewImagen(null)
    }

    const handleSubmit = async ()=>{

        try {

            let formFinal = {...form}

            if (imagen) {

                formFinal = {...formFinal, imagen: imagen.name}

                if (categoria?.imagen){
                    const borradoExitoso = await borrarImagen(categoria.imagen)
                    if (!borradoExitoso) {
                        console.log("Error al borrar la imagen previa")
                        return;
                    }
                }

                let imagenNuevaSubida = await subirImagen(imagen)

                if (!imagenNuevaSubida) {
                    console.error("Error al subir la nueva imagen")
                    alert("Error al subir la nueva imagen. Operacion cancelada")
                    return
                }
            }else if (!imagen && categoria?.imagen){

                formFinal = {...formFinal, imagen: categoria.imagen}

            }

            setForm(formFinal)

            const guardadoExitoso = await guardarCategoria(formFinal)

            if (guardadoExitoso) {
                console.log("Se guardo la categoria")
                cerrarFormulario()
            }else{
                console.error("Error al guardar la categoria")
                alert("Error al guardar la categoria. Operacion cancelada")
            }

        } catch (error) {
            console.error("Ocurrio un error en handleSubmit:", error)
            alert("Ocurrio un error inesperado. Intente de nuevo.")
        }

        

    }
    
    const guardarCategoria = async (form: Categoria)=>{
        let URL = form.id ? host+`/api/Categoria/${form.id}`
        : host+`/api/Categoria`;
        
        try {

            if (form.id) {
                
                const response = await axios.put(URL, form)

                console.log("Se actualizo la categoria: ", response.status)

            }else{
                const response = await axios.post(URL, form)

                console.log("Se guardo la categoria: ", response.status)
            }
            
            cerrarFormulario()
        } catch (error) {
            console.error("ERROR", error)
            cerrarFormulario()
        }

        return true
    }

    const handleImagen = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files ? e.target.files[0] : null;
        setImagen(file)

        if (file) {
            const lector = new FileReader()
            lector.onloadend = ()=>{
                setPreviewImagen(lector.result as string)
            }
            lector.readAsDataURL(file)
        }else{
            setPreviewImagen(obtenerImagen(String(categoria?.imagen)))
        }
    }

    if (!form) return null;
    
    return(
        <>
        
            <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">

                {/**Cabecera formulario */}
                <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
                    <h1 className="text-white">Detalle de categoria</h1>
                    <button onClick={cerrarFormulario} className="p-2 rounded-xl">

                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3334 38.1408L11.8584 36.6658L23.5251 24.9991L11.8584 13.3324L13.3334 11.8574L25.0001 23.5241L36.6667 11.8574L38.1417 13.3324L26.4751 24.9991L38.1417 36.6658L36.6667 38.1408L25.0001 26.4741L13.3334 38.1408Z" fill="black"/>
                        </svg>

                    </button>
                </div>

                {/**Formulario */}
                <div className="p-10 grid grid-cols-1 text-white 
                    [&_input]:focus:outline-none [&_input]:border-b [&_input]:py-2 [&_input]:w-full 
                    [&_h4]:text-red-400 [&_h4]:text-xl 
                    [&_select]:focus:outline-none [&_select]:border-b [&_select]:py-5 [&_select]:w-full 
                    [&_option]:text-black">

                    {/**Agrega una imagen */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">1</h1>
                            </div>
                            <div className=" text-3xl">
                                <h2>{form.id ? "Modificar categoria" : "Crear categoria"}</h2>
                            </div>
                        </div>

                        {/**Contenido */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="h-full min-h-5 w-7">
                            </div>
                            {/**Cargar imagen y vista previa */}
                            <div className={`text-2xl *:py-5`}>

                                <div>
                                    <h3>Nombre:</h3>
                                    <input value={form.denominacion} onChange={(e)=>setForm((prev)=>({...prev, denominacion: e.target.value}))} type="text" />
                                </div>
                                {!form.denominacion && (
                                    <h4>Debe agregar un nombre</h4>
                                )}
                                
                                <div className="flex gap-10 items-center">
                                    {(categoria?.imagen || imagen) && (
                                        <div className={`bg-[#D93F21] px-1 pt-1 pb-10 rounded-[20rem] flex text-center flex-col gap-1`}>
                                            <img className="rounded-[20rem] object-cover w-40 m-auto" src={String(previewImagen)} alt="" />
                                            <h3 className="m-auto">{form.denominacion}</h3>
                                        </div>

                                    )}
                                    <div>
                                        <h3>Agregar imagen:</h3>
                                        <input onChange={handleImagen} accept="image/*" type="file" />
                                    </div>
                                </div>
                                {(!imagen && !categoria?.imagen) && (
                                    <h4>Debe cargar una imagen</h4>
                                )}


                                <div className="flex justify-between gap-5 *:p-2 *:rounded-4xl">
                                    <div className="grid grid-cols-[1fr_10fr] justify-center items-center">
                                        <input checked={form.esParaElaborar} onChange={(e)=>setForm((prev)=> ({...prev, esParaElaborar: e.target.checked}))} className="h-5" type="checkbox" /><label>¿La categoria es para elaborar?</label>
                                    </div>
                                    <button onClick={()=>(form.denominacion && (imagen || categoria?.imagen)) ? handleSubmit() : ()=>{}} className="bg-[#D93F21]">Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        
                    </div>

                </div>

            </div>

        </>
    )

}