import { useEffect, useState } from "react";
import { host, Promocion, PromocionArticulo, Sucursal } from "../../../ts/Clases"
import { borrarImagen, obtenerImagen, subirImagen } from "../../../ts/Imagen";
import axios from "axios";
import SelectorArticulo from "./SelectorArticulo";
import SliderPromocionesForm from "./SliderPromocionesForm";

interface Props{
    promocion: Promocion | null;
    cerrarEditar: ()=> void;
    cargarAdminCatalogo: ()=>void
}

export default function AdminFormPromocion({promocion, cerrarEditar, cargarAdminCatalogo}: Props) {

    const [sucursalActual, setSucursalActual] = useState<Sucursal>()
    const [form, setForm] = useState<Promocion>(new Promocion())
    const [imagen, setImagen] = useState<File | null>(null)
    const [previewImagen, setPreviewImagen] = useState<string | null>(null)
    const [seleccionarArticulo, setSeleccionarArticulo] = useState(false)
    const [seccionActiva, setSeccionActiva] = useState(1)

    //Carga de categorias
    useEffect(()=>{
        
        traerSucursal()

    }, [])

    const traerSucursal = async ()=>{
        const URLSucursal = "http://localhost:8080/api/sucursales/1"

        try {
            
            const response = await axios.get(URLSucursal)
            
            setSucursalActual(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{

        if (promocion) {
            setForm(promocion)
            setPreviewImagen(obtenerImagen(promocion.imagen))
        }
    },[promocion])

    const cerrarFormulario = ()=>{
        cargarAdminCatalogo()
        cerrarEditar()
        setSeccionActiva(1)
        setImagen(null)
        setPreviewImagen(null)
    }

    const calcularPrecioRegular = ()=>{
        let total = 0

        form?.promocionArticuloList?.map((detallePromo)=>{

            if (detallePromo.articulo) {
                total += (detallePromo.articulo.precio * detallePromo.cantidad)
            }

        })

        return total;

    }

    const handleSubmit = async ()=>{

        try {

            const sucursalFinal = {...sucursalActual}

            let formFinal = {...form}
            formFinal = {...formFinal, sucursal: sucursalFinal}

            if (imagen) {

                formFinal = {...formFinal, imagen: imagen.name}

                if (promocion?.imagen){
                    const borradoExitoso = await borrarImagen(promocion.imagen)
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
            }else if (!imagen && promocion?.imagen){

                formFinal = {...formFinal, imagen: promocion.imagen}

            }

            setForm(formFinal)

            const guardadoExitoso = await guardarPromocion(formFinal)

            if (guardadoExitoso) {
                console.log("Se guardo la promocion")
                cerrarFormulario()
            }else{
                console.error("Error al guardar la promocion")
                alert("Error al guardar la promocion. Operacion cancelada")
            }

        } catch (error) {
            console.error("Ocurrio un error en handleSubmit:", error)
            alert("Ocurrio un error inesperado. Intente de nuevo.")
        }

        

    }
    
    const guardarPromocion = async (form: Promocion)=>{
        let URL = form.id ? host+`/api/promociones/${form.id}`
        : host+`/api/promociones`;
        
        try {

            if (form.id) {
                
                const response = await axios.put(URL, form)

                console.log("Se actualizo la promocion: ", response.status)
                return true
            }else{
                const response = await axios.post(URL, form)
    
                console.log("Se guardo la promocion", response.status)
                return true
            }
        } catch (error) {
            console.error("ERROR", error)
            return false
        }

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
            setPreviewImagen(obtenerImagen(String(promocion?.imagen)))
        }
    }

    const siguienteSeccion = ()=>{
        setSeccionActiva((prev)=> prev + 1)
    }

    const anteriorSeccion = ()=>{
        setSeccionActiva((prev)=> prev - 1)
    }

    const cerrarSeleccionarArticulo = ()=>{
        setSeleccionarArticulo(false)
    }

    if (!form) return null;
    
    return(
        <>
        
            <div className="bg-[#444444] rounded-4xl w-3/4 m-auto">

                {/**Cabecera formulario */}
                <div className="flex justify-between text-4xl p-5 rounded-t-4xl items-center bg-[#D9D9D98C]">
                    <h1 className="text-white">Detalle Promocion</h1>
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

                    {/**Especifica los ingredientes */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">1</h1>
                            </div>
                            <div className=" text-3xl">
                                <h2>Especifica los articulos</h2>
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
                                transition-all duration-500 ease-in-out ${seccionActiva == 1 ? "max-h-screen" : "max-h-0"}`
                                }>
                                
                                <div>
                                    <div className="grid grid-cols-[2fr_1fr_1fr] py-5">
                                        <h3>Articulo:</h3>
                                        <h3>Cantidad:</h3>
                                    </div>
                                    {/**Se listan los ingredientes y se modifica
                                     * la cantidad utilizando el input
                                     * Luego unidad de medida y boton para borrar ingrediente
                                     */}
                                    {form.promocionArticuloList.length > 0 && form.promocionArticuloList.map((detallePromo)=>(
                                        <div key={detallePromo.articulo?.id} className="grid grid-cols-[2fr_1fr_1fr] items-center">
                                            <h3>{detallePromo.articulo?.nombre}</h3>
                                            <input value={detallePromo.cantidad ? detallePromo.cantidad : ""} onChange={(e)=>{
                                                setForm((prev)=>{
                                                    let nuevosDetalles: PromocionArticulo[] = []

                                                    //Se crea un nuevo array de detalles
                                                    //en el que se modifica la cantidad unicamente del detalle
                                                    //correspondiente al input y luego se asigna el array nuevo
                                                    //con la modificacion hecha, al objeto form(ArticuloManufacturado)
                                                    nuevosDetalles = prev.promocionArticuloList.map((det)=>
                                                    det.articulo?.id == detallePromo.articulo?.id  ?
                                                    {...det, cantidad: Number(e.target.value)} 
                                                    : det
                                                    )

                                                    return {...prev, promocionArticuloList: nuevosDetalles}

                                                })
                                            }} type="number" />
                                            {/**Borra el detalle correspondiente del array 
                                             * detallesInsumos
                                             */}
                                            <button onClick={()=>{
                                                setForm((prev)=>{
                                                    return {...prev, promocionArticuloList: prev.promocionArticuloList.filter((det)=> det.id != detallePromo.id)}
                                                })
                                            }}>
                                                <img src="/svg/BorrarDetalle.svg" alt="" />
                                            </button>
                                        </div>
                                    ))}   
                                </div>

                                <div>
                                    <button onClick={()=>setSeleccionarArticulo(true)} className="bg-white px-2 text-[#D93F21]">Agregar ingrediente</button>
                                </div>

                                <SelectorArticulo abierto={seleccionarArticulo} cerrar={cerrarSeleccionarArticulo} setForm={setForm}/>
                                
                                {form.promocionArticuloList.length < 2 && (
                                    <h4>Debe ingresar por lo menos 2 articulos diferentes</h4>
                                )}

                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={form.promocionArticuloList.length >= 2 ? siguienteSeccion : ()=>{}} className="bg-[#D93F21]">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/**Informacion basica */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">2</h1>
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
                                transition-all duration-500 ease-in-out ${seccionActiva == 2 ? "max-h-screen" : "max-h-0"}`}>
                                <div>
                                    <h3>Denominacion:</h3>
                                    <input value={form?.denominacion} onChange={(e)=>setForm((prev)=> ({...prev, denominacion: e.target.value}))} className="w-full" type="text" />
                                    {!form.denominacion && (
                                        <h4>Campo incompleto</h4>
                                    )}
                                </div>
                                <div className="flex flex-col gap-5">
                                    <div className="flex">
                                        <h3>Precio de venta regular: ${calcularPrecioRegular()}</h3>
                                    </div>
                                    <div>
                                        <h3>Precio de venta:</h3>
                                        <input value={form.precioRebajado ? form.precioRebajado : ""} onChange={(e)=>setForm((prev)=> ({...prev, precioRebajado: Number(e.target.value)}))} type="number" />
                                        {!form.precioRebajado && (
                                            <h4>Campo incompleto</h4>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3>Descripcion:</h3>
                                    <textarea className="focus:outline-none border-b py-2 w-full" value={form.descripcion} onChange={(e)=>setForm((prev)=>({...prev, descripcion: e.target.value}))} />
                                    {!form.descripcion && (
                                        <h4>Campo incompleto</h4>
                                    )}
                                </div>
                                <div>
                                    <button onClick={()=>{
                                        if(form.denominacion && form.precioRebajado && form.descripcion) {
                                            siguienteSeccion()
                                        }else{
                                            return "<h2>Debe llenar todos los campos</h2>"
                                        }
                                        }} className="bg-[#D93F21] p-2 rounded-4xl">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/**Agrega una imagen */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">3</h1>
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
                                transition-all duration-500 ease-in-out ${seccionActiva == 3 ? "max-h-screen" : "max-h-0"}`}>
                                
                                <div className="grid grid-cols-2 gap-5 items-center">
                                    <div className="bg-[#D9D9D9] h-50 rounded-4xl">
                                        {(promocion?.imagen || imagen) && (
                                            <img className="h-full w-full object-cover rounded-4xl" src={String(previewImagen)} alt="" />
                                        )}
                                    </div>
                                    <div>
                                        <h3>Agregar imagen:</h3>
                                        <input onChange={handleImagen} accept="image/*" type="file" />
                                    </div>
                                </div>
                                {(!imagen && !promocion?.imagen) && (
                                    <h4>Debe cargar una imagen</h4>
                                )}
                                <div className="flex gap-5 *:p-2 *:rounded-4xl">
                                    <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                    <button onClick={(imagen || promocion?.imagen) ? siguienteSeccion : ()=>{}} className="bg-[#D93F21]">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/**Confirmar */}
                    <div>
                        {/**Titulo seccion */}
                        <div className="grid grid-cols-[1fr_50fr] gap-2 items-center">
                            <div className="text-center m-auto bg-white h-7 w-7 rounded-4xl text-2xl">
                                <h1 className="m-auto h-7 text-black">4</h1>
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
                                transition-all duration-500 ease-in-out ${seccionActiva == 4 ? "max-h-screen" : "max-h-0"}`}>
                                
                                {seccionActiva == 4 ? (

                                    <div className="w-full border-black border-5 p-5 my-10 bg-white">
                                        
                                        <SliderPromocionesForm promos={[{...form, imagen: String(previewImagen)}]}/>

                                    </div>

                                ) : null}


                                <div className="flex justify-between">
                                    <div className="grid grid-cols-[1fr_10fr] justify-center items-center">
                                        <input checked={form.existe} onChange={(e)=>setForm((prev)=> ({...prev, existe: e.target.checked}))} className="h-5" type="checkbox" /><label>¿Desea publicarlo en el catálogo?</label>
                                    </div>
                                    <div className="flex justify-center gap-5 *:p-2 *:rounded-4xl">
                                        <button onClick={anteriorSeccion} className="bg-white text-black">Anterior</button>
                                        <button onClick={handleSubmit} className="bg-[#D93F21]">Guardar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </>
    )

}