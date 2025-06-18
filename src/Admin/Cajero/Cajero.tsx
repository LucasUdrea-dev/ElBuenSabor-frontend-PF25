import { useEffect, useState } from "react"
// import axios from "axios";

// Interfaces hardcodeadas para los pedidos
interface Pedido {
    id: number;
    numeroOrden: string;
    cliente: string;
    tipoEnvio: 'DELIVERY' | 'TAKEAWAY';
    tiempoEstimado: number; // en minutos
    estado: 'INCOMING' | 'READY' | 'STANDBY' | 'PREPARING' | 'REJECTED';
    fechaCreacion: Date;
}

export default function Cajero() {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [pedidosMostrados, setPedidosMostrados] = useState<Pedido[]>([])
    const [buscador, setBuscador] = useState("")
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)
    const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'INCOMING' | 'READY' | 'STANDBY'>('TODOS')

    const cantidadPorPagina = 10;

    // Datos hardcodeados
    const pedidosHardcodeados: Pedido[] = [
        {
            id: 1,
            numeroOrden: "001",
            cliente: "Juan Pérez",
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 25,
            estado: 'INCOMING',
            fechaCreacion: new Date('2024-06-17T10:30:00')
        },
        {
            id: 2,
            numeroOrden: "002",
            cliente: "María González",
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 15,
            estado: 'READY',
            fechaCreacion: new Date('2024-06-17T10:45:00')
        },
        {
            id: 3,
            numeroOrden: "003",
            cliente: "Carlos López",
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 30,
            estado: 'STANDBY',
            fechaCreacion: new Date('2024-06-17T11:00:00')
        },
        {
            id: 4,
            numeroOrden: "004",
            cliente: "Ana Martínez",
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 20,
            estado: 'INCOMING',
            fechaCreacion: new Date('2024-06-17T11:15:00')
        },
        {
            id: 5,
            numeroOrden: "005",
            cliente: "Luis Rodríguez",
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 35,
            estado: 'READY',
            fechaCreacion: new Date('2024-06-17T11:30:00')
        },
        {
            id: 6,
            numeroOrden: "006",
            cliente: "Elena Torres",
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 18,
            estado: 'STANDBY',
            fechaCreacion: new Date('2024-06-17T11:45:00')
        },
        {
            id: 7,
            numeroOrden: "007",
            cliente: "Pedro Sánchez",
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 28,
            estado: 'INCOMING',
            fechaCreacion: new Date('2024-06-17T12:00:00')
        },
        {
            id: 8,
            numeroOrden: "008",
            cliente: "Rosa Fernández",
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 22,
            estado: 'READY',
            fechaCreacion: new Date('2024-06-17T12:15:00')
        },
        {
            id: 9,
            numeroOrden: "009",
            cliente: "Miguel Castro",
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 32,
            estado: 'STANDBY',
            fechaCreacion: new Date('2024-06-17T12:30:00')
        },
        {
            id: 10,
            numeroOrden: "010",
            cliente: "Sofía Ruiz",
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 16,
            estado: 'INCOMING',
            fechaCreacion: new Date('2024-06-17T12:45:00')
        },
        {
            id: 11,
            numeroOrden: "011",
            cliente: "Francisco Morales",
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 27,
            estado: 'READY',
            fechaCreacion: new Date('2024-06-17T13:00:00')
        },
        {
            id: 12,
            numeroOrden: "012",
            cliente: "Carmen Jiménez",
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 19,
            estado: 'STANDBY',
            fechaCreacion: new Date('2024-06-17T13:15:00')
        }
    ];
    
    useEffect(() => {
        cargarPedidos()
    }, [])

    const cambiarEstadoPedido = async (pedido: Pedido, nuevoEstado: 'REJECTED' | 'PREPARING') => {
        // const URL = `http://localhost:8080/api/Pedido/${pedido.id}/estado`
        
        const pedidoActualizado = { ...pedido, estado: nuevoEstado };

        try {
            // const response = await axios.put(URL, { estado: nuevoEstado })
            // console.log("Estado del pedido actualizado: " + response.status)
            
            // Actualizar estado local
            setPedidos(prevPedidos => 
                prevPedidos.map(p => p.id === pedido.id ? pedidoActualizado : p)
            );
            
            console.log(`Pedido ${pedido.numeroOrden} cambiado a estado: ${nuevoEstado}`)
        } catch (error) {
            console.error(error)
        }
    }

    const cargarPedidos = async () => {
        // const URL = "http://localhost:8080/api/Pedido"

        try {
            // const response = await axios.get(URL)
            // setPedidos(response.data)
            
            // Usar datos hardcodeados por ahora
            setPedidos(pedidosHardcodeados)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        let filtrado: Pedido[] = pedidos

        // Filtrar por estado
        if (filtroEstado !== 'TODOS') {
            filtrado = filtrado.filter(pedido => pedido.estado === filtroEstado)
        }

        // Filtrar por búsqueda de número de orden
        if (buscador) {
            filtrado = filtrado.filter((pedido) =>
                pedido.numeroOrden.toLowerCase().includes(buscador.toLowerCase())
            )
        }

        setPaginaSeleccionada(1)
        setPedidosMostrados(filtrado)

    }, [pedidos, buscador, filtroEstado])




    // Funcion para pasar de ingles a español
    const getEstadoTexto = (estado: string) => {
        switch (estado) {
            case 'INCOMING':
                return 'Entrante'
            case 'READY':
                return 'Listo'
            case 'STANDBY':
                return 'En Espera'
            case 'PREPARING':
                return 'Preparando'
            case 'REJECTED':
                return 'Rechazado'
            default:
                return estado
        }
    }

    // Funcion para pasar de ingles a español
    const getTipoEnvioTexto = (tipoEnvio: string) => {
        return tipoEnvio === 'DELIVERY' ? 'Delivery' : 'Retiro'
    }
    
    return (
        <>
            <div className="bg-[#333333] w-full h-full py-10 font-['Lato']">

                {/**Tabla */}
                <div className="bg-white w-11/12 m-auto rounded-2xl">

                    {/**Titulo, filtros y buscador */}
                    <div className="flex justify-between p-6 h-2/12">

                        <h1 className="pl-18 pt-2 text-4xl font-lato">Entregas</h1>

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
                                    onClick={() => setFiltroEstado('INCOMING')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'INCOMING' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Entrantes
                                </button>
                                <button 
                                    onClick={() => setFiltroEstado('READY')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'READY' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Listos
                                </button>
                                <button 
                                    onClick={() => setFiltroEstado('STANDBY')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'STANDBY' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    En Espera
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

                    {/**Tabla CRUD pedidos */}
                    <div className="w-full pb-10">

                        {/**Cabecera */}
                        <div className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center font-lato">

                            <h1>Orden N°</h1>
                            <h1>Cliente</h1>
                            <h1>Envío</h1>
                            <h1>Tiempo Est.</h1>
                            <h1>Estado y Acciones</h1>

                        </div>

                        {/**Pedidos */}
                        {pedidosMostrados.length > 0 && pedidosMostrados.map((pedido, index) => {
                            
                            if (index < (paginaSeleccionada * cantidadPorPagina) && index >= (cantidadPorPagina * (paginaSeleccionada - 1))) {

                                return (
                                    
                                    <div key={pedido.id} className="text-3xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center font-lato">
                                        
                                        <div>
                                            <h3 className="font-normal text-gray-800">{pedido.numeroOrden}</h3>
                                        </div>
                                        <div>
                                            <h3>{pedido.cliente}</h3>
                                        </div>
                                        <div>
                                            <h3>{getTipoEnvioTexto(pedido.tipoEnvio)}</h3>
                                        </div>
                                        <div>
                                            <h3>{pedido.tiempoEstimado} min</h3>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="bg-[#878787] text-white px-3 py-3 rounded-4xl text-2xl" style={{ width: '150px', height: '50px' }}>
                                                {getEstadoTexto(pedido.estado)}
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => cambiarEstadoPedido(pedido, 'REJECTED')}
                                                    disabled={pedido.estado === 'REJECTED'}
                                                    className="disabled:opacity-50"
                                                >
                                                    <img className="h-10 w-10" src="/svg/EstadoNegativo.svg" alt="Rechazar" />
                                                </button>
                                                <button 
                                                    onClick={() => cambiarEstadoPedido(pedido, 'PREPARING')}
                                                    disabled={pedido.estado === 'PREPARING'}
                                                    className="disabled:opacity-50"
                                                >
                                                    <img className="h-10 w-10" src="/svg/EstadoPositivo.svg" alt="Preparar" />
                                                </button>
                                            </div>
                                        </div>
    
                                    </div>
                                )
                                
                            }

                        })}

                        {/**Mensaje cuando no hay pedidos */}
                        {pedidosMostrados.length === 0 && (
                            <div className="text-3xl text-center py-10 text-gray-500 font-lato">
                                No se encontraron pedidos con los filtros aplicados
                            </div>
                        )}

                        {/**Paginacion */}
                        {pedidosMostrados.length > 0 && (
                            <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10 font-lato">

                                {/**Informacion pedidos mostrados y totales */}
                                <div className="h-10 flex items-center">
                                    <h4>{(paginaSeleccionada * cantidadPorPagina) - cantidadPorPagina + 1}-{paginaSeleccionada * cantidadPorPagina < pedidosMostrados.length ? (paginaSeleccionada * cantidadPorPagina) : pedidosMostrados.length} de {pedidosMostrados.length}</h4>
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
                                    if (paginaSeleccionada < Math.ceil(pedidosMostrados.length / cantidadPorPagina)) {
                                        return prev + 1
                                    }
                                    return prev;
                                })}>
                                    <img className="h-10" src="/svg/SiguientePagina.svg" alt="" />
                                </button>
                                
                                <button onClick={() => setPaginaSeleccionada(Math.ceil(pedidosMostrados.length / cantidadPorPagina))}>
                                    <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </>
    )
}