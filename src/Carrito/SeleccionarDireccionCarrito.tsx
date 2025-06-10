import { useContext, useState } from "react"
import { Ciudad, Direccion, Pais, Provincia } from "../../ts/Clases"
import { CarritoContext } from "./CarritoContext";

interface Props{
    cerrarModal: ()=>void
}

export default function SeleccionarDireccionCarrito({cerrarModal}: Props) {
    
    const paisArgentina: Pais = { id: 1, nombre: "Argentina", provincias: [] };
    
    const provinciaMendoza: Provincia = {
    id: 1,
    nombre: "Mendoza",
    pais: paisArgentina,
    ciudadList: []
    };

    const ciudadMendoza: Ciudad = {
    id: 1,
    nombre: "Ciudad de Mendoza",
    provincia: provinciaMendoza
    };

    const ciudadLasHeras: Ciudad = {
    id: 2,
    nombre: "Las Heras",
    provincia: provinciaMendoza
    };

    const ciudadGuaymallen: Ciudad = {
    id: 3,
    nombre: "Guaymallén",
    provincia: provinciaMendoza
    };

    const [direcciones, setDirecciones] = useState<Direccion[]>(
      [{
      id: 1,
      nombreCalle: "Calle Falsa",
      numeracion: "123",
      alias: "Casa",
      descripcionEntrega: "Aclaración 1",
      latitud: 12.345678,
      longitud: 123.456789,
      ciudad: ciudadMendoza
    },
    {
      id: 2,
      nombreCalle: "Avenida Siempre Viva",
      numeracion: "742",
      alias: "Oficina",
      descripcionEntrega: "Aclaración 2",
      latitud: 23.456789,
      longitud: -98.765432,
      ciudad: ciudadLasHeras
    },
    {
      id: 3,
      nombreCalle: "Calle de los Héroes",
      numeracion: "456",
      alias: "Departamento",
      descripcionEntrega: "Aclaración 3",
      latitud: 34.56789,
      longitud: 87.654321,
      ciudad: ciudadGuaymallen
    }]
    )

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>No se encontro carrito provider</p>
    }

    const {cambiarDireccion} = carritoContext

    return(
        <>
        
            {/**Fondo oscurecido */}
            <div onClick={()=>{
                cerrarModal()
                }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                {/**Modal */}
                <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-2xl grid grid-rows-[3fr_1fr] w-full max-w-lg">
                    
                    
                    
                </div>
            </div>
        
        </>
    )

}