import { useState } from "react";
import { ArticuloInsumo, ArticuloManufacturado } from "../../ts/Clases";
import DetalleArticulo from "./DetalleArticulo";
import { obtenerImagen } from "../../ts/Imagen";

interface Props {
    articulo: ArticuloManufacturado | ArticuloInsumo;
}

export default function ArticuloCardCatalogo({articulo}: Props) {

    const [detalleAbierto, setDetalleAbierto] = useState(false)

    const cerrarModalDetalle = ()=>{
        setDetalleAbierto(false)
    }
    
    return(
        <>
            <button onClick={()=>{setDetalleAbierto(true)}} className="text-left">
                <div className="bg-[#99999959] w-full rounded-2xl py-2 flex flex-col gap-1">
                    {/**Imagen y tiempo */}
                    <div className="relative">
                        <img className=" w-10/12 h-70 max-md:h-35 object-cover mt-2 mb-0 m-auto rounded-2xl" src={obtenerImagen(articulo.imagenArticulo)} alt="No se encontro la imagen" />
                        {articulo.tiempoEstimado && (
                            <div className="absolute bottom-0 left-1/12 bg-white m-auto text-center text-black p-1 rounded-bl-2xl rounded-tr-2xl ">
                                <h1 className="text-xl">{`${articulo.tiempoEstimado.split(" ")[0]}-${Number(articulo.tiempoEstimado.split(" ")[0]) + 5}`} min</h1>
                            </div>
                        )}
                    </div>
                    {/**Nombre, precio, categoria */}
                    <div className="w-10/12 m-auto">
                        <h2>{articulo.nombre}</h2>
                        <div className="flex gap-4">
                            <h2>${articulo.precio}</h2>
                            <h2>{articulo.subcategoria.categoria?.denominacion} - {articulo.subcategoria.denominacion}</h2>
                        </div>
                    </div>
                </div>
            </button>

            <DetalleArticulo isOpen={detalleAbierto} onClose={cerrarModalDetalle} articulo={articulo}/>

        </>
    )

}