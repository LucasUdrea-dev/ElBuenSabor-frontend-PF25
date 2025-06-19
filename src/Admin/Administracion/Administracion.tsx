import { useState } from "react";

// Interfaces para los datos
interface InsumoStock {
    id: number;
    nombre: string;
    nivelActual: number;
    nivelMinimo: number;
    nivelMaximo: number;
    unidad: string;
}

interface ProductoVendido {
    nombre: string;
    ventasDiarias: number[];
    ventasSemanales: number[];
    ventasMensuales: number[];
}

interface IngresoData {
    periodo: string;
    ordenes: number;
    ganancias: number;
}

type FiltroTiempo = 'Diario' | 'Semanal' | 'Mensual' | 'Anual';

export default function Administracion() {
    const [insumoSeleccionado, setInsumoSeleccionado] = useState(0);
    const [filtroVendidos, setFiltroVendidos] = useState<FiltroTiempo>('Diario');
    const [filtroIngresos, setFiltroIngresos] = useState<FiltroTiempo>('Diario');

    // Datos hardcodeados para insumos y stock
    const insumosStock: InsumoStock[] = [
        { id: 1, nombre: "Harina", nivelActual: 85, nivelMinimo: 20, nivelMaximo: 100, unidad: "kg" },
        { id: 2, nombre: "Tomate", nivelActual: 45, nivelMinimo: 15, nivelMaximo: 100, unidad: "kg" },
        { id: 3, nombre: "Queso", nivelActual: 72, nivelMinimo: 25, nivelMaximo: 100, unidad: "kg" },
        { id: 4, nombre: "Carne", nivelActual: 38, nivelMinimo: 30, nivelMaximo: 100, unidad: "kg" },
        { id: 5, nombre: "Aceite", nivelActual: 90, nivelMinimo: 10, nivelMaximo: 100, unidad: "L" }
    ];

    // Datos hardcodeados para productos más vendidos
    const productosVendidos: ProductoVendido[] = [
        {
            nombre: "Pizza Margarita",
            ventasDiarias: [12, 8, 15, 10, 18, 22, 16, 11, 14, 19, 13, 17, 20, 9, 25, 14, 16, 18, 12, 21, 15, 13, 17, 19],
            ventasSemanales: [65, 78, 82, 71, 89, 76, 83, 74, 91, 68, 85, 79],
            ventasMensuales: [320, 340, 315, 368, 382, 356, 375, 391, 358, 372, 388, 395]
        },
        {
            nombre: "Hamburguesa",
            ventasDiarias: [8, 12, 10, 14, 16, 9, 11, 15, 13, 17, 10, 12, 14, 18, 11, 16, 13, 15, 19, 12, 14, 17, 13, 16],
            ventasSemanales: [45, 52, 48, 61, 58, 44, 53, 56, 49, 62, 47, 54],
            ventasMensuales: [210, 235, 198, 242, 258, 201, 228, 246, 215, 239, 223, 251]
        },
        {
            nombre: "Pasta",
            ventasDiarias: [5, 7, 9, 6, 8, 11, 7, 9, 12, 8, 6, 10, 9, 7, 13, 8, 11, 9, 6, 12, 8, 10, 7, 9],
            ventasSemanales: [32, 38, 35, 41, 44, 31, 36, 39, 33, 42, 34, 37],
            ventasMensuales: [156, 168, 142, 178, 185, 149, 164, 171, 158, 176, 161, 182]
        }
    ];

    // Datos hardcodeados para ingresos
    const ingresosDiarios: IngresoData[] = [
        { periodo: "Lun", ordenes: 12, ganancias: 3420 },
        { periodo: "Mar", ordenes: 15, ganancias: 4250 },
        { periodo: "Mié", ordenes: 18, ganancias: 5180 },
        { periodo: "Jue", ordenes: 14, ganancias: 4020 },
        { periodo: "Vie", ordenes: 22, ganancias: 6380 },
        { periodo: "Sáb", ordenes: 28, ganancias: 8150 },
        { periodo: "Dom", ordenes: 25, ganancias: 7200 }
    ];

    const ingresosSemanales: IngresoData[] = [
        { periodo: "Sem 1", ordenes: 89, ganancias: 25420 },
        { periodo: "Sem 2", ordenes: 95, ganancias: 27180 },
        { periodo: "Sem 3", ordenes: 102, ganancias: 29350 },
        { periodo: "Sem 4", ordenes: 88, ganancias: 24890 }
    ];

    const ingresosMensuales: IngresoData[] = [
        { periodo: "Ene", ordenes: 342, ganancias: 98750 },
        { periodo: "Feb", ordenes: 318, ganancias: 89420 },
        { periodo: "Mar", ordenes: 387, ganancias: 112380 },
        { periodo: "Abr", ordenes: 365, ganancias: 105670 },
        { periodo: "May", ordenes: 398, ganancias: 118920 },
        { periodo: "Jun", ordenes: 412, ganancias: 124580 }
    ];

    const ingresosAnuales: IngresoData[] = [
        { periodo: "2021", ordenes: 3420, ganancias: 980750 },
        { periodo: "2022", ordenes: 3890, ganancias: 1120380 },
        { periodo: "2023", ordenes: 4250, ganancias: 1285670 },
        { periodo: "2024", ordenes: 4680, ganancias: 1456920 }
    ];

    const obtenerDatosIngresos = () => {
        switch (filtroIngresos) {
            case 'Diario': return ingresosDiarios;
            case 'Semanal': return ingresosSemanales;
            case 'Mensual': return ingresosMensuales;
            case 'Anual': return ingresosAnuales;
            default: return ingresosDiarios;
        }
    };

    const obtenerDatosVendidos = () => {
        switch (filtroVendidos) {
            case 'Diario': return productosVendidos.map(p => ({ nombre: p.nombre, ventas: p.ventasDiarias }));
            case 'Semanal': return productosVendidos.map(p => ({ nombre: p.nombre, ventas: p.ventasSemanales }));
            case 'Mensual': return productosVendidos.map(p => ({ nombre: p.nombre, ventas: p.ventasMensuales }));
            case 'Anual': return productosVendidos.map(p => ({ nombre: p.nombre, ventas: p.ventasMensuales.slice(0, 4) }));
            default: return productosVendidos.map(p => ({ nombre: p.nombre, ventas: p.ventasDiarias }));
        }
    };

    const datosIngresos = obtenerDatosIngresos();
    const totalOrdenes = datosIngresos.reduce((sum, item) => sum + item.ordenes, 0);
    const totalGanancias = datosIngresos.reduce((sum, item) => sum + item.ganancias, 0);

    const StockChart = ({ insumo }: { insumo: InsumoStock }) => {
        const chartHeight = 200;
        const chartWidth = 800;
        const maxValue = Math.max(insumo.nivelMaximo, 100);
        
        // Simular datos históricos de stock
        const stockHistorico = [65, 72, 68, 78, 82, 75, 88, 85, 79, 82, 76, 80, 84, 78, 86, 83, 87, 85, 88, 85, 82, 79, 81, insumo.nivelActual];
        
        const points = stockHistorico.map((value, index) => {
            const x = (index / (stockHistorico.length - 1)) * (chartWidth - 40) + 20;
            const y = chartHeight - ((value / maxValue) * (chartHeight - 40)) - 20;
            return { x, y, value };
        });

        const pathData = points.map((point, index) => 
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ');

        return (
            <div className="rounded-lg p-4" style={{ backgroundColor: '#444444' }}>
                <svg width={chartWidth} height={chartHeight} className="w-full">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(value => {
                        const y = chartHeight - ((value / maxValue) * (chartHeight - 40)) - 20;
                        return (
                            <g key={value}>
                                <line x1="20" y1={y} x2={chartWidth - 20} y2={y} stroke="#4a5568" strokeWidth="1" opacity="0.3" />
                                <text x="10" y={y + 4} fill="#a0aec0" fontSize="12" fontFamily="Lato">{value}</text>
                            </g>
                        );
                    })}
                    
                    {/* Stock line */}
                    <path d={pathData} fill="none" stroke="#81c784" strokeWidth="3" />
                    
                    {/* Data points */}
                    {points.map((point, index) => (
                        <circle key={index} cx={point.x} cy={point.y} r="4" fill="#81c784" />
                    ))}
                    
                    {/* Minimum level line */}
                    <line 
                        x1="20" 
                        y1={chartHeight - ((insumo.nivelMinimo / maxValue) * (chartHeight - 40)) - 20} 
                        x2={chartWidth - 20} 
                        y2={chartHeight - ((insumo.nivelMinimo / maxValue) * (chartHeight - 40)) - 20} 
                        stroke="#f56565" 
                        strokeWidth="2" 
                        strokeDasharray="5,5" 
                    />
                </svg>
            </div>
        );
    };

    const SalesChart = () => {
        const chartHeight = 200;
        const chartWidth = 400;
        const datosVendidos = obtenerDatosVendidos();
        const maxValue = Math.max(...datosVendidos.flatMap(p => p.ventas));
        
        const colors = ['#81c784', '#64b5f6', '#ffb74d'];
        
        return (
            <div className="rounded-lg p-4" style={{ backgroundColor: '#444444' }}>
                <svg width={chartWidth} height={chartHeight} className="w-full">
                    {datosVendidos.map((producto, productIndex) => {
                        const points = producto.ventas.slice(0, 12).map((value, index) => {
                            const x = (index / 11) * (chartWidth - 40) + 20;
                            const y = chartHeight - ((value / maxValue) * (chartHeight - 40)) - 20;
                            return { x, y };
                        });

                        const pathData = points.map((point, index) => 
                            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                        ).join(' ');

                        return (
                            <g key={productIndex}>
                                <path 
                                    d={pathData} 
                                    fill="none" 
                                    stroke={colors[productIndex]} 
                                    strokeWidth="2" 
                                />
                                {points.map((point, index) => (
                                    <circle 
                                        key={index} 
                                        cx={point.x} 
                                        cy={point.y} 
                                        r="3" 
                                        fill={colors[productIndex]} 
                                    />
                                ))}
                            </g>
                        );
                    })}
                    
                    {/* Legend */}
                    {datosVendidos.map((producto, index) => (
                        <g key={`legend-${index}`}>
                            <circle cx={20 + index * 100} cy={chartHeight - 5} r="4" fill={colors[index]} />
                            <text x={30 + index * 100} y={chartHeight} fill="#a0aec0" fontSize="10" fontFamily="Lato">
                                {producto.nombre}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-800 text-white p-6" style={{ fontFamily: 'Lato, sans-serif' , backgroundColor: '#333333'}}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Administración</h1>
                    
                </div>

                {/* Stock Chart Section */}
                <div className="rounded-lg mb-8 overflow-hidden" style={{ backgroundColor: '#444444' }}>
                    <div className="p-4 border-b" style={{ borderColor: '#3D3D3D', backgroundColor: '#3D3D3D' }}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Nivel de Stock</h2>
                            <select 
                                value={insumoSeleccionado}
                                onChange={(e) => setInsumoSeleccionado(Number(e.target.value))}
                                className="text-white px-3 py-2 rounded-md border focus:outline-none"
                                style={{ backgroundColor: '#444444', borderColor: '#555555' }}
                            >
                                {insumosStock.map((insumo, index) => (
                                    <option key={insumo.id} value={index}>
                                        {insumo.nombre} ({insumo.nivelActual}{insumo.unidad})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <StockChart insumo={insumosStock[insumoSeleccionado]} />
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Most Sold Products */}
                    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#444444' }}>
                        <div className="p-4 border-b" style={{ borderColor: '#3D3D3D', backgroundColor: '#3D3D3D' }}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Más vendidos</h2>
                                <div className="flex space-x-2">
                                    <select 
                                        value={filtroVendidos}
                                        onChange={(e) => setFiltroVendidos(e.target.value as FiltroTiempo)}
                                        className="text-white px-3 py-1 rounded text-sm border focus:outline-none"
                                        style={{ backgroundColor: '#444444', borderColor: '#555555' }}
                                    >
                                        <option value="Diario">Diario</option>
                                        <option value="Semanal">Semanal</option>
                                        <option value="Mensual">Mensual</option>
                                        <option value="Anual">Anual</option>
                                    </select>
                                    
                                </div>
                            </div>
                        </div>
                        <SalesChart />
                    </div>

                    {/* Revenue Section */}
                    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#444444' }}>
                        <div className="p-4 border-b" style={{ borderColor: '#3D3D3D', backgroundColor: '#3D3D3D' }}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Ingresos</h2>
                                <div className="flex space-x-2">
                                    <select 
                                        value={filtroIngresos}
                                        onChange={(e) => setFiltroIngresos(e.target.value as FiltroTiempo)}
                                        className="text-white px-3 py-1 rounded text-sm border focus:outline-none"
                                        style={{ backgroundColor: '#444444', borderColor: '#555555' }}
                                    >
                                        <option value="Diario">Diario</option>
                                        <option value="Semanal">Semanal</option>
                                        <option value="Mensual">Mensual</option>
                                        <option value="Anual">Anual</option>
                                    </select>
                                    <button className="text-gray-300 hover:text-white">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 0 110-4 2 2 0 010 4zM10 12a2 0 110-4 2 2 0 010 4zM10 18a2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 flex flex-col items-center justify-center h-64">
                            <div className="flex items-center justify-center w-32 h-32 rounded-full mb-4" style={{ backgroundColor: '#3D3D3D' }}>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{totalOrdenes}</div>
                                    <div className="text-sm text-gray-300">Ordenes</div>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-2xl font-bold">${totalGanancias.toLocaleString()}</div>
                                <div className="text-gray-300">Ganancias</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}