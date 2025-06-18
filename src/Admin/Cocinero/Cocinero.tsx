import { useEffect, useState } from "react"
import DetalleCocinero from "./DetalleCocinero";
// import axios from "axios";

// Interfaces hardcodeadas para los pedidos
interface Producto {
    id: number;
    imagen: string;
    denominacion: string;
    cantidad: number;
}

interface Cliente {
    nombre: string;
    email: string;
    telefono: string;
}

interface EstadoOrden {
    estado: string;
    actualizadoEl: Date;
    actualizadoPor: string;
}

interface Pedido {
    id: number;
    numeroOrden: string;
    cliente: Cliente;
    tipoEnvio: 'DELIVERY' | 'TAKEAWAY';
    tiempoEstimado: number; // en minutos
    estado: 'INCOMING' | 'READY' | 'STANDBY' | 'PREPARING' | 'REJECTED';
    fechaCreacion: Date;
    estadoOrden: EstadoOrden;
    aclaracionesCliente: string;
    productos: Producto[];
}

export default function Cocinero() {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [pedidosMostrados, setPedidosMostrados] = useState<Pedido[]>([])
    const [buscador, setBuscador] = useState("")
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)
    const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'INCOMING' | 'READY' | 'STANDBY'>('TODOS')
    
    // Estados para el modal
    const [modalAbierto, setModalAbierto] = useState(false)
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)

    const cantidadPorPagina = 10;

    // Datos hardcodeados
    const pedidosHardcodeados: Pedido[] = [
        {
            id: 1,
            numeroOrden: "001",
            cliente: {
                nombre: "Juan Pérez",
                email: "juan.perez@email.com",
                telefono: "+54 261 123-4567"
            },
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 25,
            estado: 'INCOMING',
            fechaCreacion: new Date('2024-06-17T10:30:00'),
            estadoOrden: {
                estado: 'INCOMING',
                actualizadoEl: new Date('2024-06-17T10:30:00'),
                actualizadoPor: 'Sistema Automático'
            },
            aclaracionesCliente: 'Sin cebolla en la pizza, extra queso. Entregar en puerta principal, casa color azul.',
            productos: [
                {
                    id: 1,
                    imagen: '../../../public/img/pizza.jpg',
                    denominacion: 'Pizza Margarita Grande',
                    cantidad: 1
                },
                {
                    id: 2,
                    imagen: '../../../public/img/coca-cola.jpg',
                    denominacion: 'Coca Cola 500ml',
                    cantidad: 2
                }
            ]
        },
        {
            id: 2,
            numeroOrden: "002",
            cliente: {
                nombre: "María González",
                email: "maria.gonzalez@email.com",
                telefono: "+54 261 987-6543"
            },
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 15,
            estado: 'READY',
            fechaCreacion: new Date('2024-06-17T10:45:00'),
            estadoOrden: {
                estado: 'READY',
                actualizadoEl: new Date('2024-06-17T11:00:00'),
                actualizadoPor: 'Chef Roberto Martínez'
            },
            aclaracionesCliente: 'Para retirar en el local. Agregar salsa extra.',
            productos: [
                {
                    id: 3,
                    imagen: '../../../public/img/hamburguesa.jpg',
                    denominacion: 'Hamburguesa Completa',
                    cantidad: 2
                },
                {
                    id: 4,
                    imagen: '../../../public/img/recibiTuPedido.jpg',
                    denominacion: 'Papas Fritas Grandes',
                    cantidad: 1
                }
            ]
        },
        {
            id: 3,
            numeroOrden: "003",
            cliente: {
                nombre: "Carlos López",
                email: "carlos.lopez@email.com",
                telefono: "+54 261 555-0123"
            },
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 30,
            estado: 'STANDBY',
            fechaCreacion: new Date('2024-06-17T11:00:00'),
            estadoOrden: {
                estado: 'STANDBY',
                actualizadoEl: new Date('2024-06-17T11:05:00'),
                actualizadoPor: 'Ana Rodríguez'
            },
            aclaracionesCliente: 'Dirección: San Martín 1234. Llamar al llegar, portero eléctrico no funciona.',
            productos: [
                {
                    id: 5,
                    imagen: '../../../public/img/ravioles.jpg',
                    denominacion: 'Pasta Bolognesa',
                    cantidad: 1
                },
                {
                    id: 6,
                    imagen: '../../../public/img/categoriaEnsaladas.jpg',
                    denominacion: 'Coca Cola 500ml',
                    cantidad: 1
                }
            ]
        },
        {
            id: 4,
            numeroOrden: "004",
            cliente: {
                nombre: "Ana Martínez",
                email: "ana.martinez@email.com",
                telefono: "+54 261 444-5678"
            },
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 20,
            estado: 'INCOMING',
            fechaCreacion: new Date('2024-06-17T11:15:00'),
            estadoOrden: {
                estado: 'INCOMING',
                actualizadoEl: new Date('2024-06-17T11:15:00'),
                actualizadoPor: 'Sistema Automático'
            },
            aclaracionesCliente: 'Pago en efectivo. Sin condimentos picantes.',
            productos: [
                {
                    id: 7,
                    imagen: '../../../public/img/recibiTuPedido.jpg',
                    denominacion: 'Empanadas de Carne (x6)',
                    cantidad: 1
                },
                {
                    id: 8,
                    imagen: '../../../public/img/coca-cola.jpg',
                    denominacion: 'Agua Mineral 500ml',
                    cantidad: 1
                }
            ]
        },
        {
            id: 5,
            numeroOrden: "005",
            cliente: {
                nombre: "Luis Rodríguez",
                email: "luis.rodriguez@email.com",
                telefono: "+54 261 333-2222"
            },
            tipoEnvio: 'DELIVERY',
            tiempoEstimado: 35,
            estado: 'READY',
            fechaCreacion: new Date('2024-06-17T11:30:00'),
            estadoOrden: {
                estado: 'READY',
                actualizadoEl: new Date('2024-06-17T12:05:00'),
                actualizadoPor: 'Chef Roberto Martínez'
            },
            aclaracionesCliente: 'Apartamento 4B, segundo piso. Timbre: Rodríguez.',
            productos: [
                {
                    id: 9,
                    imagen: '../../../public/img/recibiTuPedido.jpg',
                    denominacion: 'Milanesa con Papas',
                    cantidad: 1
                },
                {
                    id: 10,
                    imagen: '../../../public/img/recibiTuPedido.jpg',
                    denominacion: 'Flan con Dulce de Leche',
                    cantidad: 2
                }
            ]
        },
        {
            id: 6,
            numeroOrden: "006",
            cliente: {
                nombre: "Elena Torres",
                email: "elena.torres@email.com",
                telefono: "+54 261 777-8888"
            },
            tipoEnvio: 'TAKEAWAY',
            tiempoEstimado: 18,
            estado: 'STANDBY',
            fechaCreacion: new Date('2024-06-17T11:45:00'),
            estadoOrden: {
                estado: 'STANDBY',
                actualizadoEl: new Date('2024-06-17T11:50:00'),
                actualizadoPor: 'María Fernández'
            },
            aclaracionesCliente: 'Vegetariano estricto. Sin productos de origen animal.',
            productos: [
                {
                    id: 11,
                    imagen: '../../../public/img/recibiTuPedido.jpg',
                    denominacion: 'Ensalada Vegana',
                    cantidad: 1
                },
                {
                    id: 12,
                    imagen: '../../../public/img/recibiTuPedido.jpg',
                    denominacion: 'Jugo Natural de Naranja',
                    cantidad: 1
                }
            ]
        }
    ];
    
    useEffect(() => {
        cargarPedidos()
    }, [])

    const cambiarEstadoPedido = async (pedido: Pedido, nuevoEstado: 'REJECTED' | 'READY') => {
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

    // Función para abrir el modal con el detalle del pedido
    const abrirDetallePedido = (pedido: Pedido) => {
        setPedidoSeleccionado(pedido)
        setModalAbierto(true)
    }

    // Función para cerrar el modal
    const cerrarModal = () => {
        setModalAbierto(false)
        setPedidoSeleccionado(null)
    }

    useEffect(() => {
        let filtrado: Pedido[] = pedidos

        // Filtrar por estado
        if (filtroEstado !== 'TODOS') {
            filtrado = filtrado.filter(pedido => pedido.estado === filtroEstado)
        }

        // Filtrar por búsqueda de número de orden o nombre de cliente
        if (buscador) {
            filtrado = filtrado.filter((pedido) =>
                pedido.numeroOrden.toLowerCase().includes(buscador.toLowerCase()) ||
                pedido.cliente.nombre.toLowerCase().includes(buscador.toLowerCase())
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

                        <h1 className="pl-18 pt-2 text-4xl font-lato">Pedidos</h1>

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
                                            <h3>{pedido.cliente.nombre}</h3>
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
                                                    onClick={() => abrirDetallePedido(pedido)}
                                                    className="hover:opacity-80 transition-opacity"
                                                    title="Ver detalles"
                                                >
                                                    <img className="h-10 w-10" src="/svg/DetallePreparacion.svg" alt="Ver detalles" />
                                                </button>
                                                <button 
                                                    onClick={() => cambiarEstadoPedido(pedido, 'REJECTED')}
                                                    disabled={pedido.estado === 'REJECTED'}
                                                    className="disabled:opacity-50"
                                                >
                                                    <img className="h-10 w-10" src="/svg/EstadoNegativo.svg" alt="Rechazar" />
                                                </button>
                                                <button 
                                                    onClick={() => cambiarEstadoPedido(pedido, 'READY')}
                                                    disabled={pedido.estado === 'PREPARING'}
                                                    className="disabled:opacity-50"
                                                >
                                                    <img className="h-10 w-10" src="/svg/EstadoPositivo.svg" alt="Listo" />
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

            {/* Modal de Detalle del Pedido */}
            {pedidoSeleccionado && (
                <DetalleCocinero 
                    pedido={pedidoSeleccionado}
                    isOpen={modalAbierto}
                    onClose={cerrarModal}
                />
            )}

        </>
    )
}