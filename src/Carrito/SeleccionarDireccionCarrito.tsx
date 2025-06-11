import { useContext, useEffect, useState } from "react"
import { Ciudad, Direccion, Pais, Provincia } from "../../ts/Clases"
import { CarritoContext } from "./CarritoContext";
import AgregarDireccion from "../AgregarDireccion";

interface Props{
  isOpen: boolean
  cerrarModal: ()=>void
}

export default function SeleccionarDireccionCarrito({isOpen, cerrarModal}: Props) {
    
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

    const [agregarDireccion, setAgregarDireccion] = useState(false)
    const [direccionSeleccionada, setDireccionSeleccionada] = useState(0)

    //Volver a traer las direcciones del usuario
    useEffect(()=>{

    }, [agregarDireccion])

    const cerrarAgregarDireccion = ()=>{
      setAgregarDireccion(false)
    }

    const guardar = ()=>{
        const nuevaDireccion = direcciones.find((direccion)=> direccion.id == direccionSeleccionada)

        if (nuevaDireccion) {
            cambiarDireccion(nuevaDireccion)
            cerrarModal()
        }else(
          alert("Ocurrio un error al elegir la direccion")
        )

    }

    const carritoContext = useContext(CarritoContext)

    if (carritoContext === undefined) {
        return <p>No se encontro carrito provider</p>
    }

    const {cambiarDireccion} = carritoContext

    if (!isOpen) {
        return null
    }

    return(
        <>
        
            {/**Fondo oscurecido */}
            <div onClick={()=>{
                cerrarModal()
                }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                
                {/**Modal */}
                <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-2xl w-1/2 max-w-lg">
                    
                    <div className="flex flex-col gap-10 items-center px-5 py-10">
                        <div className="text-2xl font-bold text-center py-2">
                            <h1>Cambiar dirección de envio</h1>
                        </div>

                        <div className="opacity-60">
                            <h3>Seleccione una direccion de envio:</h3>
                            <select value={direccionSeleccionada} 
                            onChange={(e)=>setDireccionSeleccionada(Number(e.target.value))}
                            className="bg-gray-300 py-1 px-2 rounded-xl">

                                <option value="0">Seleccionar...</option>
                                {direcciones.map((direccion)=>(
                                    <option value={direccion.id}>{direccion.nombreCalle} {direccion.numeracion}, {direccion.ciudad?.nombre}</option>
                                ))}

                            </select>
                        </div>

                        <div className="w-2/3 m-auto flex flex-col gap-2 items-center justify-center">
                            <button onClick={()=>guardar()} 
                            className="bg-[#0A76E1] text-white w-2/3 py-4 text-xl rounded-4xl">
                              Guardar
                            </button>
                            <div className="flex gap-1">
                                <h3>¿No tenes direccion?</h3>
                                <button onClick={()=>setAgregarDireccion(true)}>Agrega una</button>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>

            <AgregarDireccion isOpen={agregarDireccion} onClose={cerrarAgregarDireccion} />
        
        </>
    )

}