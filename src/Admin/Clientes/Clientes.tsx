import { useEffect, useState } from "react"
import DetalleClienteAdmin from "./DetalleClienteAdmin";
// import axios from "axios";

// Interfaces para los clientes
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ordenes: number;
    fechaRegistro: Date;
    activo: boolean;
}

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [clientesMostrados, setClientesMostrados] = useState<Cliente[]>([])
    const [buscador, setBuscador] = useState("")
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)
    const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVOS' | 'INACTIVOS'>('TODOS')
    
    // Estados para el modal (para futura implementación)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)

    const cantidadPorPagina = 10;

    // Datos hardcodeados
    const clientesHardcodeados: Cliente[] = [
        {
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            email: "juan.perez@email.com",
            telefono: "+54 261 123-4567",
            ordenes: 18,
            fechaRegistro: new Date('2024-01-15T10:30:00'),
            activo: true
        },
        {
            id: 2,
            nombre: "María",
            apellido: "González",
            email: "maria.gonzalez@email.com",
            telefono: "+54 261 987-6543",
            ordenes: 12,
            fechaRegistro: new Date('2024-02-20T14:45:00'),
            activo: true
        },
        {
            id: 3,
            nombre: "Carlos",
            apellido: "López",
            email: "carlos.lopez@email.com",
            telefono: "+54 261 555-0123",
            ordenes: 25,
            fechaRegistro: new Date('2024-01-10T09:15:00'),
            activo: true
        },
        {
            id: 4,
            nombre: "Ana",
            apellido: "Martínez",
            email: "ana.martinez@email.com",
            telefono: "+54 261 444-5678",
            ordenes: 8,
            fechaRegistro: new Date('2024-03-05T16:20:00'),
            activo: false
        },
        {
            id: 5,
            nombre: "Luis",
            apellido: "Rodríguez",
            email: "luis.rodriguez@email.com",
            telefono: "+54 261 333-2222",
            ordenes: 32,
            fechaRegistro: new Date('2024-01-02T11:00:00'),
            activo: true
        },
        {
            id: 6,
            nombre: "Elena",
            apellido: "Torres",
            email: "elena.torres@email.com",
            telefono: "+54 261 777-8888",
            ordenes: 6,
            fechaRegistro: new Date('2024-04-12T13:30:00'),
            activo: true
        },
        {
            id: 7,
            nombre: "Roberto",
            apellido: "Silva",
            email: "roberto.silva@email.com",
            telefono: "+54 261 666-9999",
            ordenes: 15,
            fechaRegistro: new Date('2024-02-28T08:45:00'),
            activo: false
        },
        {
            id: 8,
            nombre: "Patricia",
            apellido: "Morales",
            email: "patricia.morales@email.com",
            telefono: "+54 261 111-4444",
            ordenes: 22,
            fechaRegistro: new Date('2024-01-25T15:10:00'),
            activo: true
        },
        {
            id: 9,
            nombre: "Diego",
            apellido: "Herrera",
            email: "diego.herrera@email.com",
            telefono: "+54 261 222-5555",
            ordenes: 9,
            fechaRegistro: new Date('2024-03-18T12:00:00'),
            activo: true
        },
        {
            id: 10,
            nombre: "Carmen",
            apellido: "Vega",
            email: "carmen.vega@email.com",
            telefono: "+54 261 888-3333",
            ordenes: 14,
            fechaRegistro: new Date('2024-02-14T17:25:00'),
            activo: false
        },
        {
            id: 11,
            nombre: "Fernando",
            apellido: "Castro",
            email: "fernando.castro@email.com",
            telefono: "+54 261 999-7777",
            ordenes: 27,
            fechaRegistro: new Date('2024-01-08T10:15:00'),
            activo: true
        },
        {
            id: 12,
            nombre: "Sofía",
            apellido: "Mendoza",
            email: "sofia.mendoza@email.com",
            telefono: "+54 261 444-8888",
            ordenes: 11,
            fechaRegistro: new Date('2024-03-22T14:50:00'),
            activo: true
        }
    ];
    
    useEffect(() => {
        cargarClientes()
    }, [])

    const borradoLogicoCliente = async (cliente: Cliente) => {
    // Alternamos el estado
    const nuevoEstado = !cliente.activo;
    const clienteActualizado = { ...cliente, activo: nuevoEstado };

    try {
        // Si usás API:
        // await axios.put(`http://localhost:8080/api/cliente/${cliente.id}`, clienteActualizado);

        // Simulación local
        setClientes(prevClientes =>
            prevClientes.map(c =>
                c.id === cliente.id ? clienteActualizado : c
            )
        );

        console.log(`Cliente ${nuevoEstado ? 'activado' : 'desactivado'}: ${cliente.nombre} ${cliente.apellido}`);
    } catch (error) {
        console.error("Error en borrado lógico:", error);
    }
};


    const cargarClientes = async () => {
        // const URL = "http://localhost:8080/api/Cliente"

        try {
            // const response = await axios.get(URL)
            // setClientes(response.data)
            
            // Usar datos hardcodeados 
            setClientes(clientesHardcodeados)
        } catch (error) {
            console.error(error)
        }
    }

    // Función para abrir el modal con el detalle
    const abrirDetalleCliente = (cliente: Cliente) => {
        setClienteSeleccionado(cliente)
        setModalAbierto(true)
        console.log("Abriendo detalle del cliente:", cliente.nombre, cliente.apellido)
    }

    // Función para cerrar el modal
    const cerrarModal = () => {
        setModalAbierto(false)
        setClienteSeleccionado(null)
    }

    useEffect(() => {
        let filtrado: Cliente[] = clientes

        // Filtrar por estado
        if (filtroEstado !== 'TODOS') {
            filtrado = filtrado.filter(cliente => 
                filtroEstado === 'ACTIVOS' ? cliente.activo : !cliente.activo
            )
        }

        // Filtrar por búsqueda de nombre, apellido o email
        if (buscador) {
            filtrado = filtrado.filter((cliente) =>
                cliente.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
                cliente.apellido.toLowerCase().includes(buscador.toLowerCase()) ||
                cliente.email.toLowerCase().includes(buscador.toLowerCase())
            )
        }

        setPaginaSeleccionada(1)
        setClientesMostrados(filtrado)

    }, [clientes, buscador, filtroEstado])

    // Función para obtener el texto del estado
    const getEstadoTexto = (activo: boolean) => {
        return activo ? 'Activo' : 'Inactivo'
    }
    
    return (
        <>
            <div className="bg-[#333333] w-full h-full py-10 font-['Lato']">

                {/**Tabla */}
                <div className="bg-white w-11/12 m-auto rounded-2xl">

                    {/**Titulo, filtros y buscador */}
                    <div className="flex justify-between p-6 h-2/12">

                        <h1 className="pl-18 pt-2 text-4xl font-lato">Clientes</h1>

                        <div className="flex gap-5 pr-[2%] text-2xl items-center">
                            
                            {/**Filtros por estado como botones */}
                            <div className="flex gap-2 items-center font-lato pr-10">
                                <span className="text-black font-medium font-lato pr-5">Filtrar por:</span>
                                <button 
                                    onClick={() => setFiltroEstado('TODOS')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'TODOS' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Todos
                                </button>
                                <button 
                                    onClick={() => setFiltroEstado('ACTIVOS')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'ACTIVOS' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Activos
                                </button>
                                <button 
                                    onClick={() => setFiltroEstado('INACTIVOS')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'INACTIVOS' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Inactivos
                                </button>
                            </div>

                            {/**Buscador con icono */}
                            <div className="relative">
                                <input 
                                    onChange={(e) => setBuscador(e.target.value)} 
                                    className="bg-[#878787] text-white pl-12 pr-5 py-2 rounded-4xl font-lato" 
                                    placeholder="Buscar..." 
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

                    {/**Tabla CRUD clientes */}
                    <div className="w-full pb-10">

                        {/**Cabecera */}
                        <div className="text-4xl w-full grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center font-lato">

                            <h1>Cliente</h1>
                            <h1>Email</h1>
                            <h1>Teléfono</h1>
                            <h1>Ordenes</h1>
                            <h1>Acciones</h1>

                        </div>

                        {/**Clientes */}
                        {clientesMostrados.length > 0 && clientesMostrados.map((cliente, index) => {
                            
                            if (index < (paginaSeleccionada * cantidadPorPagina) && index >= (cantidadPorPagina * (paginaSeleccionada - 1))) {

                                return (
                                    
                                    <div key={cliente.id} className={`text-3xl w-full grid grid-cols-[1fr_1.5fr_1fr_0.7fr_1fr] *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center font-lato  ${!cliente.activo ? 'opacity-40' : ''}`}>
                                        
                                        <div>
                                            <h3 className="font-normal text-gray-800">
                                                {cliente.nombre} {cliente.apellido}
                                            </h3>
                                        </div>
                                        <div>
                                            <h3>{cliente.email}</h3>
                                        </div>
                                        <div>
                                            <h3>{cliente.telefono}</h3>
                                        </div>
                                        <div>
                                            <h3>{cliente.ordenes}</h3>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className={`text-white px-3 py-3 rounded-4xl text-2xl ${
                                                cliente.activo ? 'bg-[#28a745]' : 'bg-[#878787]'
                                            }`} style={{ width: '120px', height: '50px' }}>
                                                {getEstadoTexto(cliente.activo)}
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => abrirDetalleCliente(cliente)}
                                                    className="hover:opacity-80 transition-opacity"
                                                    title="Ver detalles"
                                                >
                                                    <img className="h-10 w-10" src="/svg/DetallePreparacion.svg" alt="Ver detalles" />
                                                </button>
                                                <button 
                                                onClick={() => borradoLogicoCliente(cliente)}
                                                className="hover:opacity-80 transition-opacity"
                                                title={cliente.activo ? "Desactivar" : "Activar"}
                                                >
                                                <img 
                                                    className="h-10 w-10" 
                                                    src={`/svg/${cliente.activo ? "LogoBorrar.svg" : "LogoActivar.svg"}`} 
                                                    alt={cliente.activo ? "Desactivar" : "Activar"} 
                                                />
                                                </button>


                                            </div>
                                        </div>
    
                                    </div>
                                )
                                
                            }

                        })}

                        {/**Mensaje cuando no hay clientes */}
                        {clientesMostrados.length === 0 && (
                            <div className="text-3xl text-center py-10 text-gray-500 font-lato">
                                No se encontraron clientes con los filtros aplicados
                            </div>
                        )}

                        {/**Paginacion */}
                        {clientesMostrados.length > 0 && (
                            <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10 font-lato">

                                {/**Informacion clientes mostrados y totales */}
                                <div className="h-10 flex items-center">
                                    <h4>{(paginaSeleccionada * cantidadPorPagina) - cantidadPorPagina + 1}-{paginaSeleccionada * cantidadPorPagina < clientesMostrados.length ? (paginaSeleccionada * cantidadPorPagina) : clientesMostrados.length} de {clientesMostrados.length}</h4>
                                </div>

                                {/**Control de paginado a traves de botones */}
                                <button onClick={() => setPaginaSeleccionada(1)}>
                                    <img className="h-10" src="/svg/PrimeraPagina.svg" alt="" />
                                </button>
                                <button onClick={() => setPaginaSeleccionada(prev => {
                                    if (paginaSeleccionada > 1) {
                                        return prev - 1
                                    }
                                    return prev;
                                })}>
                                    <img className="h-10" src="/svg/AnteriorPagina.svg" alt="" />
                                </button>

                                <button onClick={() => setPaginaSeleccionada(prev => {
                                    if (paginaSeleccionada < Math.ceil(clientesMostrados.length / cantidadPorPagina)) {
                                        return prev + 1
                                    }
                                    return prev;
                                })}>
                                    <img className="h-10" src="/svg/SiguientePagina.svg" alt="" />
                                </button>
                                
                                <button onClick={() => setPaginaSeleccionada(Math.ceil(clientesMostrados.length / cantidadPorPagina))}>
                                    <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>

            {clienteSeleccionado && (
                <DetalleClienteAdmin 
                    cliente={clienteSeleccionado}
                    isOpen={modalAbierto}
                    onClose={cerrarModal}
                />
            )} 

        </>
    )
}