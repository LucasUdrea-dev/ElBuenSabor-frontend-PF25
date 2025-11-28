import React from 'react';

// Interfaces reutilizadas del componente principal
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

interface DetalleFacturaProps {
    factura: Factura;
    isOpen: boolean;
    onClose: () => void;
}

const DetalleFactura: React.FC<DetalleFacturaProps> = ({ factura, isOpen, onClose }) => {
    // Si el modal no está abierto, no renderizar nada
    if (!isOpen) return null;

    // Función para formatear fecha y hora
    const formatearFechaHora = (fecha: Date) => {
        return fecha.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3/$2/$1 $4:$5:$6');
    };

    // Función para formatear monto
    const formatearMonto = (monto: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(monto);
    };

    // Calcular subtotal de productos
    const calcularSubtotal = () => {
        return factura.productos.reduce((total, producto) => total + producto.subtotal, 0);
    };

    // Calcular descuento por retirar en sucursal (ejemplo: 10% si el método de pago es efectivo)
    const calcularDescuento = () => {
        // Lógica de ejemplo para el descuento
        if (factura.metodoPago === 'EFECTIVO') {
            return calcularSubtotal() * 0.10; // 10% de descuento
        }
        return 48; // Descuento fijo de ejemplo
    };

    // Función para manejar el clic en el overlay
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };



    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-lato"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header del Modal */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Orden {factura.numeroOrden}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Contenido del Modal - Con scroll interno */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    
                    {/* Fecha y Datos del Cliente */}
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="mb-3">
                            <span className="text-gray-600 font-medium">
                                {formatearFechaHora(factura.fecha)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-700">
                            <p><strong>FACTURA {factura.numeroFactura}</strong></p>
                            <p>{factura.cliente.nombre}</p>
                            <p>San Martín 54, Mendoza, Mendoza - {factura.cliente.telefono}</p>
                            <p>{factura.cliente.email}</p>
                        </div>
                    </div>

                    {/* Datos del Local */}
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                        <div className="mr-4">
                            <img 
                                src="/public/svg/LogoElBuenSabor.svg" 
                                alt="Logo El Buen Sabor" 
                                className="w-16 h-16"
                            />
                        </div>
                        <div className="text-sm text-gray-700">
                            <p><strong>EL BUEN SABOR</strong></p>
                            <p>San Martín 54, Mendoza, Mendoza. 5500</p>
                            <p>+54-9 2614587434</p>
                            <p>www.elbuensabor.com</p>
                        </div>
                    </div>

                    {/* Tabla de Productos */}
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-left font-semibold text-gray-700">Producto</th>
                                    <th className="p-3 text-center font-semibold text-gray-700">Precio</th>
                                    <th className="p-3 text-center font-semibold text-gray-700">Cantidad</th>
                                    <th className="p-3 text-right font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {factura.productos.map((producto) => (
                                    <tr key={producto.id} className="hover:bg-gray-50">
                                        <td className="p-3 text-gray-800">{producto.denominacion}</td>
                                        <td className="p-3 text-center text-gray-700">
                                            {formatearMonto(producto.precioUnitario)}
                                        </td>
                                        <td className="p-3 text-center text-gray-700">{producto.cantidad}</td>
                                        <td className="p-3 text-right text-gray-800 font-medium">
                                            {formatearMonto(producto.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totales */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Subtotal</span>
                            <span className="font-medium">{formatearMonto(calcularSubtotal())}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 text-red-600">
                            <span>Descuento por retirar en sucursal</span>
                            <span>-{formatearMonto(calcularDescuento())}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                            <span>TOTAL</span>
                            <span>{formatearMonto(factura.monto)}</span>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Método de pago:</strong> {factura.metodoPago}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Tipo de factura:</strong> {factura.tipoFactura}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Observaciones:</strong> {factura.observaciones}
                        </p>
                    </div>

                    {/* Mensaje de agradecimiento */}
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Gracias por su compra</strong>
                        </p>
                        <p className="text-xs text-gray-600">
                            Esta factura es válida como comprobante de compra. 
                            Ante cualquier duda o error, comuníquese con atención al cliente dentro de las 24 horas. 
                            Gracias por confiar en nosotros.
                        </p>
                    </div>

                  
                </div>
            </div>
        </div>
    );
};

export default DetalleFactura;