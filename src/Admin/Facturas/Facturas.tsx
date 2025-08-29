import { useEffect, useState } from "react"
import DetalleFactura from "./DetalleFactura";
// import axios from "axios";

// Interfaces para las facturas
interface ProductoFactura {
    id: number;
    denominacion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
}

interface Factura {
    id: number;
    numeroFactura: string;
    fecha: Date;
    monto: number;
    numeroOrden: string;
    cliente: Cliente;
    estado: 'ACTIVA' | 'ANULADA';
    tipoFactura: 'A' | 'B' | 'C';
    productos: ProductoFactura[];
    observaciones: string;
    metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'MERCADOPAGO';
    fechaCreacion: Date;
    fechaModificacion?: Date;
}

export default function Facturas() {
    const [facturas, setFacturas] = useState<Factura[]>([])
    const [facturasMostradas, setFacturasMostradas] = useState<Factura[]>([])
    const [buscador, setBuscador] = useState("")
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)
    const [filtroEstado, setFiltroEstado] = useState<'TODAS' | 'ACTIVA' | 'ANULADA'>('TODAS')
    
    // Estados para el modal
    const [modalAbierto, setModalAbierto] = useState(false)
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null)

    const cantidadPorPagina = 10;

    // Datos hardcodeados para desarrollo
    const facturasHardcodeadas: Factura[] = [
        {
            id: 1,
            numeroFactura: "FC-0001",
            fecha: new Date('2024-06-17T10:30:00'),
            monto: 2850.00,
            numeroOrden: "001",
            cliente: {
                id: 1,
                nombre: "Juan Pérez",
                email: "juan.perez@email.com",
                telefono: "+54 261 123-4567"
            },
            estado: 'ACTIVA',
            tipoFactura: 'B',
            productos: [
                {
                    id: 1,
                    denominacion: 'Pizza Margarita Grande',
                    cantidad: 1,
                    precioUnitario: 2350.00,
                    subtotal: 2350.00
                },
                {
                    id: 2,
                    denominacion: 'Coca Cola 500ml',
                    cantidad: 2,
                    precioUnitario: 250.00,
                    subtotal: 500.00
                }
            ],
            observaciones: 'Factura generada automáticamente',
            metodoPago: 'EFECTIVO',
            fechaCreacion: new Date('2024-06-17T10:30:00')
        },
        {
            id: 2,
            numeroFactura: "FC-0002",
            fecha: new Date('2024-06-17T10:45:00'),
            monto: 3200.00,
            numeroOrden: "002",
            cliente: {
                id: 2,
                nombre: "María González",
                email: "maria.gonzalez@email.com",
                telefono: "+54 261 987-6543"
            },
            estado: 'ACTIVA',
            tipoFactura: 'B',
            productos: [
                {
                    id: 3,
                    denominacion: 'Hamburguesa Completa',
                    cantidad: 2,
                    precioUnitario: 1200.00,
                    subtotal: 2400.00
                },
                {
                    id: 4,
                    denominacion: 'Papas Fritas Grandes',
                    cantidad: 1,
                    precioUnitario: 800.00,
                    subtotal: 800.00
                }
            ],
            observaciones: 'Cliente frecuente',
            metodoPago: 'TARJETA',
            fechaCreacion: new Date('2024-06-17T10:45:00')
        },
        {
            id: 3,
            numeroFactura: "FC-0003",
            fecha: new Date('2024-06-17T11:00:00'),
            monto: 1950.00,
            numeroOrden: "003",
            cliente: {
                id: 3,
                nombre: "Carlos López",
                email: "carlos.lopez@email.com",
                telefono: "+54 261 555-0123"
            },
            estado: 'ANULADA',
            tipoFactura: 'B',
            productos: [
                {
                    id: 5,
                    denominacion: 'Pasta Bolognesa',
                    cantidad: 1,
                    precioUnitario: 1700.00,
                    subtotal: 1700.00
                },
                {
                    id: 6,
                    denominacion: 'Coca Cola 500ml',
                    cantidad: 1,
                    precioUnitario: 250.00,
                    subtotal: 250.00
                }
            ],
            observaciones: 'Factura anulada por devolución',
            metodoPago: 'MERCADOPAGO',
            fechaCreacion: new Date('2024-06-17T11:00:00'),
            fechaModificacion: new Date('2024-06-17T11:30:00')
        },
        {
            id: 4,
            numeroFactura: "FC-0004",
            fecha: new Date('2024-06-17T11:15:00'),
            monto: 1400.00,
            numeroOrden: "004",
            cliente: {
                id: 4,
                nombre: "Ana Martínez",
                email: "ana.martinez@email.com",
                telefono: "+54 261 444-5678"
            },
            estado: 'ACTIVA',
            tipoFactura: 'B',
            productos: [
                {
                    id: 7,
                    denominacion: 'Empanadas de Carne (x6)',
                    cantidad: 1,
                    precioUnitario: 1200.00,
                    subtotal: 1200.00
                },
                {
                    id: 8,
                    denominacion: 'Agua Mineral 500ml',
                    cantidad: 1,
                    precioUnitario: 200.00,
                    subtotal: 200.00
                }
            ],
            observaciones: 'Pago en efectivo',
            metodoPago: 'EFECTIVO',
            fechaCreacion: new Date('2024-06-17T11:15:00')
        },
        {
            id: 5,
            numeroFactura: "FC-0005",
            fecha: new Date('2024-06-17T11:30:00'),
            monto: 4100.00,
            numeroOrden: "005",
            cliente: {
                id: 5,
                nombre: "Luis Rodríguez",
                email: "luis.rodriguez@email.com",
                telefono: "+54 261 333-2222"
            },
            estado: 'ACTIVA',
            tipoFactura: 'B',
            productos: [
                {
                    id: 9,
                    denominacion: 'Milanesa con Papas',
                    cantidad: 1,
                    precioUnitario: 2800.00,
                    subtotal: 2800.00
                },
                {
                    id: 10,
                    denominacion: 'Flan con Dulce de Leche',
                    cantidad: 2,
                    precioUnitario: 650.00,
                    subtotal: 1300.00
                }
            ],
            observaciones: 'Entrega a domicilio',
            metodoPago: 'TRANSFERENCIA',
            fechaCreacion: new Date('2024-06-17T11:30:00')
        },
        {
            id: 6,
            numeroFactura: "FC-0006",
            fecha: new Date('2024-06-17T11:45:00'),
            monto: 1850.00,
            numeroOrden: "006",
            cliente: {
                id: 6,
                nombre: "Elena Torres",
                email: "elena.torres@email.com",
                telefono: "+54 261 777-8888"
            },
            estado: 'ACTIVA',
            tipoFactura: 'B',
            productos: [
                {
                    id: 11,
                    denominacion: 'Ensalada Vegana',
                    cantidad: 1,
                    precioUnitario: 1500.00,
                    subtotal: 1500.00
                },
                {
                    id: 12,
                    denominacion: 'Jugo Natural de Naranja',
                    cantidad: 1,
                    precioUnitario: 350.00,
                    subtotal: 350.00
                }
            ],
            observaciones: 'Cliente vegetariano',
            metodoPago: 'MERCADOPAGO',
            fechaCreacion: new Date('2024-06-17T11:45:00')
        }
    ];
    
    useEffect(() => {
        cargarFacturas()
    }, [])

    // Función para realizar baja lógica de factura
    const anularFactura = async (factura: Factura) => {
        // const URL = `http://localhost:8080/api/Factura/${factura.id}/anular`
        
        const facturaActualizada = { 
            ...factura, 
            estado: 'ANULADA' as const,
            fechaModificacion: new Date(),
            observaciones: factura.observaciones + ' - Factura anulada'
        };

        try {
            // const response = await axios.put(URL, { estado: 'ANULADA' })
            // console.log("Factura anulada: " + response.status)
            
            // Actualizar estado local
            setFacturas(prevFacturas => 
                prevFacturas.map(f => f.id === factura.id ? facturaActualizada : f)
            );
            
            console.log(`Factura ${factura.numeroFactura} anulada exitosamente`)
        } catch (error) {
            console.error('Error al anular factura:', error)
        }
    }

    // Función para cargar facturas desde el backend
    const cargarFacturas = async () => {
        // const URL = "http://localhost:8080/api/Factura"

        try {
            // const response = await axios.get(URL)
            // setFacturas(response.data)
            
            // Usar datos hardcodeados por ahora
            setFacturas(facturasHardcodeadas)
        } catch (error) {
            console.error('Error al cargar facturas:', error)
        }
    }

    // Función para abrir el modal con el detalle de la factura
    const abrirDetalleFactura = (factura: Factura) => {
        setFacturaSeleccionada(factura)
        setModalAbierto(true)
    }

    // Función para cerrar el modal
    const cerrarModal = () => {
        setModalAbierto(false)
        setFacturaSeleccionada(null)
    }


    useEffect(() => {
        let filtrado: Factura[] = facturas

        // Filtrar por estado
        if (filtroEstado !== 'TODAS') {
            filtrado = filtrado.filter(factura => factura.estado === filtroEstado)
        }

        // Filtrar por búsqueda (número de factura, orden o nombre de cliente)
        if (buscador) {
            filtrado = filtrado.filter((factura) =>
                factura.numeroFactura.toLowerCase().includes(buscador.toLowerCase()) ||
                factura.numeroOrden.toLowerCase().includes(buscador.toLowerCase()) ||
                factura.cliente.nombre.toLowerCase().includes(buscador.toLowerCase())
            )
        }

        setPaginaSeleccionada(1)
        setFacturasMostradas(filtrado)

    }, [facturas, buscador, filtroEstado])

    // Función para formatear fecha
    const formatearFecha = (fecha: Date) => {
        return fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Función para formatear monto
    const formatearMonto = (monto: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(monto)
    }

    return (
        <>
            <div className="bg-[#333333] w-full h-full py-10 font-['Lato']">

                {/**Tabla */}
                <div className="bg-white w-11/12 m-auto rounded-2xl">

                    {/**Título, filtros y buscador */}
                    <div className="flex justify-between p-6 h-2/12">

                        <div className="flex items-center gap-4">
                            <h1 className="pl-5 pt-2 text-4xl font-lato">Facturas</h1>
                            
                        </div>

                        <div className="flex gap-5 pr-[2%] text-2xl items-center">
                            
                            {/**Filtros por estado como botones */}
                            <div className="flex gap-2 items-center font-lato pr-10">
                                <span className="text-black font-medium font-lato pr-5">Filtrar por:</span>
                                <button 
                                    onClick={() => setFiltroEstado('TODAS')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'TODAS' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Todas
                                </button>
                                <button 
                                    onClick={() => setFiltroEstado('ACTIVA')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'ACTIVA' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Activas
                                </button>
                                <button 
                                    onClick={() => setFiltroEstado('ANULADA')}
                                    className={`px-4 py-2 rounded-4xl transition-colors ${
                                        filtroEstado === 'ANULADA' ? 'bg-[#D93F21] text-white' : 'bg-[#878787] text-white'
                                    }`}
                                >
                                    Anuladas
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

                    {/**Tabla CRUD facturas */}
                    <div className="w-full pb-10">

                        {/**Cabecera */}
                        <div className="text-4xl w-full grid grid-cols-6 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center font-lato">

                            <h1>Nro. Factura</h1>
                            <h1>Fecha</h1>
                            <h1>Monto</h1>
                            <h1>Nro. Orden</h1>
                            <h1>Cliente</h1>
                            <h1>Acciones</h1>

                        </div>

                        {/**Facturas */}
                        {facturasMostradas.length > 0 && facturasMostradas.map((factura, index) => {
                            
                            if (index < (paginaSeleccionada * cantidadPorPagina) && index >= (cantidadPorPagina * (paginaSeleccionada - 1))) {

                                return (
                                    
                                    <div key={factura.id} className="text-3xl w-full grid grid-cols-6 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center font-lato">
                                        
                                        <div>
                                            <h3 className="font-normal text-gray-800">{factura.numeroFactura}</h3>
                                        </div>
                                        <div>
                                            <h3>{formatearFecha(factura.fecha)}</h3>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-emerald-600">{formatearMonto(factura.monto)}</h3>
                                        </div>
                                        <div>
                                            <h3>{factura.numeroOrden}</h3>
                                        </div>
                                        <div>
                                            <h3>{factura.cliente.nombre}</h3>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className={`text-white px-3 py-3 rounded-4xl text-2xl ${
                                                factura.estado === 'ACTIVA' ? 'bg-emerald-500' : 'bg-red-500'
                                            }`} style={{ width: '120px', height: '50px' }}>
                                                {factura.estado === 'ACTIVA' ? 'Activa' : 'Anulada'}
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => abrirDetalleFactura(factura)}
                                                    className="hover:opacity-80 transition-opacity"
                                                    title="Ver detalles"
                                                >
                                                    <img className="h-10 w-10" src="/public/svg/DetallePreparacion.svg" alt="Ver detalles" />
                                                </button>
                                                <button 
                                                    onClick={() => anularFactura(factura)}
                                                    disabled={factura.estado === 'ANULADA'}
                                                    className="disabled:opacity-50 hover:opacity-80 transition-opacity"
                                                    title="Anular factura"
                                                >
                                                    <img className="h-10 w-10" src="/svg/EstadoNegativo.svg" alt="Anular" />
                                                </button>
                                            </div>
                                        </div>
    
                                    </div>
                                )
                                
                            }

                        })}

                        {/**Mensaje cuando no hay facturas */}
                        {facturasMostradas.length === 0 && (
                            <div className="text-3xl text-center py-10 text-gray-500 font-lato">
                                No se encontraron facturas con los filtros aplicados
                            </div>
                        )}

                        {/**Paginación */}
                        {facturasMostradas.length > 0 && (
                            <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10 font-lato">

                                {/**Información facturas mostradas y totales */}
                                <div className="h-10 flex items-center">
                                    <h4>{(paginaSeleccionada * cantidadPorPagina) - cantidadPorPagina + 1}-{paginaSeleccionada * cantidadPorPagina < facturasMostradas.length ? (paginaSeleccionada * cantidadPorPagina) : facturasMostradas.length} de {facturasMostradas.length}</h4>
                                </div>

                                {/**Control de paginado a través de botones */}
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
                                    if (paginaSeleccionada < Math.ceil(facturasMostradas.length / cantidadPorPagina)) {
                                        return prev + 1
                                    }
                                    return prev;
                                })}>
                                    <img className="h-10" src="/svg/SiguientePagina.svg" alt="" />
                                </button>
                                
                                <button onClick={() => setPaginaSeleccionada(Math.ceil(facturasMostradas.length / cantidadPorPagina))}>
                                    <img className="h-10" src="/svg/UltimaPagina.svg" alt="" />
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>

            {/* Modal de Detalle de la Factura */}
            {facturaSeleccionada && (
                <DetalleFactura 
                    factura={facturaSeleccionada}
                    isOpen={modalAbierto}
                    onClose={cerrarModal}
                />
            )}

        </>
    )
}