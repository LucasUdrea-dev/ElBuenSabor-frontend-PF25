import { useEffect, useState } from "react"
import { Empleado, Sucursal } from '../../../ts/Clases.ts';
import AgregarEmpleado from "./AgregarEmpleados.tsx";
import EditarEmpleado from "./EditarEmpleado.tsx";

export default function Empleados() {
    const [empleados, setEmpleados] = useState<Empleado[]>([])
    const [empleadosMostrados, setEmpleadosMostrados] = useState<Empleado[]>([])
    const [buscador, setBuscador] = useState("")
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)
    const [mostrarEmpleado] = useState<Empleado | null>(null)
    
    // Estados para los modales
    const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false)
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false)
    const [empleadoAEditar, setEmpleadoAEditar] = useState<Empleado | null>(null)

    const cantidadPorPagina = 10;

    // Datos hardcodeados
     const sucursalMendoza: Sucursal = {
        id: 1,
        nombre: "Sucursal Central Mendoza",
        horaApertura: "09:00",
        horaCierre: "18:00",
        existe: true,
        direccion: {
            id: 101,
            nombreCalle: "Av. San Martín",
            numeracion: "1100",
            latitud: -32.890692,
            longitud: -68.847145,
            alias: "Oficina Principal",
            descripcionEntrega: "Frente a la Plaza San Martín, edificio color crema.",
            ciudad: {
            id: 1,
            nombre: "Ciudad de Mendoza",
            provincia: {
                id: 1,
                nombre: "Mendoza",
                pais: {
                id: 1,
                nombre: "Argentina",
                provincias: [],
                },
                ciudadList: [],
            },
            },
        },
        };

        //Hardcodeo de empleados
        const empleadosHardcodeados: Empleado[] = [
        {
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            email: "juan.perez@email.com",
            existe: true,
            imagenUsuario: "",
            telefonoList: [
            { id: 1, numero: 2614567890 },
            { id: 2, numero: 2615551234 },
            ],
            rol: {
            id: null,
            fechaAlta: new Date("2020-03-10").toISOString(),
            tipoRol: { id: null, rol: 3 },
            },
            direccionList: [
            {
                id: 201,
                nombreCalle: "9 de Julio",
                numeracion: "750",
                latitud: -32.8902,
                longitud: -68.8421,
                alias: "Casa",
                descripcionEntrega: "Casa color verde, portón gris.",
                ciudad: sucursalMendoza.direccion!.ciudad,
            },
            ],
            sueldo: 75000,
            fechaAlta: "2020-03-15",
            idSucursal: sucursalMendoza,
        },
        {
            id: 2,
            nombre: "María",
            apellido: "Gómez",
            email: "maria.gomez@email.com",
            existe: true,
            imagenUsuario: "",
            telefonoList: [{ id: 3, numero: 2614789000 }],
            rol: {
            id: null,
            fechaAlta: new Date("2021-05-01").toISOString(),
            tipoRol: { id: null, rol: 3 },
            },
            direccionList: [
            {
                id: 202,
                nombreCalle: "San Juan",
                numeracion: "450",
                latitud: -32.8921,
                longitud: -68.8456,
                alias: "Departamento",
                descripcionEntrega: "Piso 3, dpto B.",
                ciudad: sucursalMendoza.direccion!.ciudad,
            },
            ],
            sueldo: 95000,
            fechaAlta: "2021-05-10",
            idSucursal: sucursalMendoza,
        },
        ];
    
    useEffect(() => {
        cargarEmpleados()
    }, [])



    const borradoLogico = async (empleado: Empleado) => {
        // const URL = `http://localhost:8080/api/empleado/${empleado.id}`
        
        empleado.existe = !empleado.existe

        try {
            // const response = await axios.put(URL, empleado)
            // console.log("Se modificó el estado del empleado: " + response.status)
            
            // Simulación para datos hardcodeados
            setEmpleados(prev => prev.map(emp => 
                emp.id === empleado.id ? { ...emp, existe: empleado.existe } : emp
            ))
            
            console.log(`Empleado ${empleado.existe ? 'activado' : 'desactivado'}: ${empleado.nombre} ${empleado.apellido}`)
            
        } catch (error) {
            console.error(error)
        }
    }

   

    const cargarEmpleados = async () => {
        // const URL = "http://localhost:8080/api/empleado"

        try {
            // const response = await axios.get(URL)
            // setEmpleados(response.data)
            
            // Usando datos hardcodeados por ahora
            setEmpleados(empleadosHardcodeados)
            
        } catch (error) {
            console.error("Error al cargar empleados:", error)
        }
    }

    // Callback para cuando se agrega un nuevo empleado
    const handleEmpleadoAgregado = (nuevoEmpleado: Empleado) => {
        setEmpleados(prev => [...prev, nuevoEmpleado])
    }

    // Callback para cuando se actualiza un empleado
    const handleEmpleadoActualizado = (empleadoActualizado: Empleado) => {
        setEmpleados(prev => prev.map(emp => 
            emp.id === empleadoActualizado.id ? empleadoActualizado : emp
        ))
    }

    // Apertur y cierre de modales
    const abrirModalEditar = (empleado: Empleado) => {
        setEmpleadoAEditar(empleado)
        setMostrarModalEditar(true)
    }

    const cerrarModalEditar = () => {
        setMostrarModalEditar(false)
        setEmpleadoAEditar(null)
    }

    const abrirModalAgregar = () => {
        setMostrarModalAgregar(true)
    }

    const cerrarModalAgregar = () => {
        setMostrarModalAgregar(false)
    }

    // Filtrado y búsqueda por nombre y apellido
    useEffect(() => {
        let filtrado: Empleado[] = empleados

        if (buscador) {
            filtrado = filtrado.filter((empleado) =>
                `${empleado.nombre} ${empleado.apellido}`.toLowerCase().includes(buscador.toLowerCase()) ||
                empleado.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
                empleado.apellido.toLowerCase().includes(buscador.toLowerCase())
            )
        }

        setPaginaSeleccionada(1)
        setEmpleadosMostrados(filtrado)

    }, [empleados, buscador])
    
    return (
        <>
            <div className="bg-[#333333] w-full h-full py-10 font-['Lato']">

                {/**Tabla */}
                <div className={`bg-white w-11/12 m-auto rounded-2xl ${mostrarEmpleado && "hidden"}`}>

                    {/**Titulo, agregar y buscador */}
                    <div className="flex justify-between p-6 h-2/12">

                        <h1 className="pl-14 pt-2 text-4xl font-lato">Empleados</h1>

                        <div className="flex gap-5 pr-[2%] text-2xl items-center">

                            {/**Botón para agregar nuevo empleado */}
                            <button 
                                onClick={abrirModalAgregar} 
                                className="bg-[#D93F21] text-white px-5 py-2 rounded-4xl flex items-center gap-2 font-lato"
                            >
                                <h2>Nuevo empleado</h2>
                                <img className="h-5" src="/svg/Agregar.svg" alt="" />
                            </button>

                            {/**Buscador */} 
                            <div className="relative">
                            <input 
                                onChange={(e) => setBuscador(e.target.value)} 
                                className="bg-[#878787] text-white pl-12 pr-5 py-2 rounded-4xl font-lato" 
                                placeholder="Buscar por nombre..." 
                                type="text" 
                            />
                             
                                <img 
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                                    src="/svg/LupaBuscador.svg" 
                                    alt="Buscar" 
                                />
                            
                            </div>
                        </div>

                    </div>

                    {/**Tabla CRUD empleados */}
                    <div className="w-full pb-10">

                        {/**Cabecera */}
                        <div className="text-4xl w-full grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center font-lato">
                            <h1>Nombre</h1>
                            <h1>Email</h1>
                            <h1>Teléfono</h1>
                            <h1>Cargo</h1>
                            <h1>Acciones</h1>
                        </div>

                        {/**Empleados */}
                        {empleadosMostrados.length > 0 && empleadosMostrados.map((empleado, index) => {
                            
                            if (index < (paginaSeleccionada * cantidadPorPagina) && index >= (cantidadPorPagina * (paginaSeleccionada - 1))) {

                                return (
                                    <div 
                                        key={empleado.id} className={`text-3xl w-full grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center font-lato ${!empleado.existe ? 'opacity-40' : ''}`}
                                    >
                                        
                                        <div>
                                            <h3 className="font-normal text-gray-800"></h3>
                                            <h3>{`${empleado.nombre} ${empleado.apellido}`}</h3>
                                        </div>
                                        <div>
                                            <h3 className="truncate max-w-[350px]" title={empleado.email}> {empleado.email} </h3>
                                        </div>
                                        <div>
                                            <h3>{empleado.telefonoList.map(t => t.numero).join(", ")}</h3>
                                        </div>
                                        <div>
                                            <h3>{empleado.rol ? [empleado.rol.tipoRol.rol] : "Sin rol"}</h3>
                                        </div>
                                        <div className="flex justify-around">
                            
                                            {/*<button onClick={() => setMostrarEmpleado(empleado)}>
                                                <img className="h-11 mr-2" src="/svg/LogoVer.svg" alt="Ver detalles" />
                                            </button>*/}
                                            
                                            {/* Modal de edición - Permite modificar datos del empleado */}
                                            <button onClick={() => abrirModalEditar(empleado)}>
                                                <img className="h-11 mr-2" src="/svg/LogoEditar.svg" alt="Editar" />
                                            </button>
                                            
                                            {/* Baja/Alta lógica */}
                                            <button onClick={() => { borradoLogico(empleado) }}>
                                                <img 
                                                    className="h-11 mr-2"
                                                    src={`/svg/${empleado.existe ? "LogoBorrar.svg" : "LogoActivar.svg"}`} 
                                                    alt={empleado.existe ? "Desactivar" : "Activar"} 
                                                />
                                            </button>
                                        </div>
    
                                    </div>
                                )
                            }
                        })}

                        {/**Paginación */}
                        <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10 font-lato">

                            {/**Información empleados mostrados y totales */}
                            <div className="h-10 flex items-center">
                                <h4>
                                    {(paginaSeleccionada * cantidadPorPagina) - cantidadPorPagina + 1}-
                                    {paginaSeleccionada * cantidadPorPagina < empleadosMostrados.length ? 
                                        (paginaSeleccionada * cantidadPorPagina) : 
                                        empleadosMostrados.length
                                    } de {empleadosMostrados.length}
                                </h4>
                            </div>

                            {/**Control de paginado a través de botones */}
                            <button onClick={() => setPaginaSeleccionada(1)}>
                                <img className="h-10" src="/svg/PrimeraPagina.svg" alt="Primera página" />
                            </button>
                            
                            <button onClick={() => setPaginaSeleccionada(prev => {
                                if (paginaSeleccionada > 1) {
                                    return prev - 1
                                }
                                return prev;
                            })}>
                                <img className="h-10" src="/svg/AnteriorPagina.svg" alt="Página anterior" />
                            </button>

                            <button onClick={() => setPaginaSeleccionada(prev => {
                                if (paginaSeleccionada < Math.ceil(empleadosMostrados.length / cantidadPorPagina)) {
                                    return prev + 1
                                }
                                return prev;
                            })}>
                                <img className="h-10" src="/svg/SiguientePagina.svg" alt="Página siguiente" />
                            </button>
                            
                            <button onClick={() => setPaginaSeleccionada(Math.ceil(empleadosMostrados.length / cantidadPorPagina))}>
                                <img className="h-10" src="/svg/UltimaPagina.svg" alt="Última página" />
                            </button>

                        </div>                        

                    </div>

                </div>

                {/* Modales */}
                <AgregarEmpleado
                    isOpen={mostrarModalAgregar}
                    onClose={cerrarModalAgregar}
                    onEmpleadoAgregado={handleEmpleadoAgregado}
                />

                <EditarEmpleado
                    isOpen={mostrarModalEditar}
                    empleado={empleadoAEditar}
                    onClose={cerrarModalEditar}
                    onEmpleadoActualizado={handleEmpleadoActualizado}
                />
                
            </div>
        </>
    )
}