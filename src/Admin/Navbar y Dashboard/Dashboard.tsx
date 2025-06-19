import { Link } from "react-router-dom";

interface DashboardProps {
  onSeleccionar?: (seccion: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Dashboard({ onSeleccionar, isCollapsed = false, onToggleCollapse }: DashboardProps) {
  
  
    const opciones = [
    { 
      nombre: "Administración", 
      icono: "/svg/IconsDashboard/Administracion.svg",
      descripcion: "Gestión general del sistema",
      ruta: '/admin/administracion'
    },
    { 
      nombre: "Cocinero", 
      icono: "/svg/IconsDashboard/Cocinero.svg",
      descripcion: "Panel de cocina y pedidos",
      ruta: '/admin/adminCocinero'
    },
    { 
      nombre: "Repartidor", 
      icono: "/svg/IconsDashboard/Repartidor.svg",
      descripcion: "Gestión de entregas",
      ruta: "/entregas"
    },
    { 
      nombre: "Cajero", 
      icono: "/svg/IconsDashboard/Cajero.svg",
      descripcion: "Punto de venta y cobros",
      ruta: '/admin/adminCajero'
    },
    { 
      nombre: "Clientes", 
      icono: "/svg/IconsDashboard/ClientesAdmin.svg",
      descripcion: "Administrar base de clientes",
      ruta: "/clientes"
    },
    { 
      nombre: "Facturas", 
      icono: "/svg/IconsDashboard/Facturas.svg",
      descripcion: "Facturación y reportes",
      ruta: "/facturas"
    },
    { 
      nombre: "Empleados", 
      icono: "/svg/IconsDashboard/Empleados.svg",
      descripcion: "Gestión de personal",
      ruta: "/empleados"
    },
    { 
      nombre: "Catálogo", 
      icono: "/svg/IconsDashboard/Catálogo.svg",
      descripcion: "Productos y menú",
      ruta: "/admin/adminCatalogo"
    },
    { 
      nombre: "Promociones", 
      icono: "/svg/IconsDashboard/Semielaborados.svg",
      descripcion: "Combo de productos y ofertas",
      ruta: "/promociones"
    },
    { 
      nombre: "Insumos", 
      icono: "/svg/IconsDashboard/Insumos.svg",
      descripcion: "Materias primas y stock",
      ruta: "/insumos"
    },
    { 
      nombre: "Categorías", 
      icono: "/svg/IconsDashboard/Categorías.svg",
      descripcion: "Organización de productos",
      ruta: "/categorias"
    },
    { 
      nombre: "Subcategorias", 
      icono: "/svg/IconsDashboard/subcategoria.svg",
      descripcion: "Organización de Subcategorias",
      ruta: "/subcategorias"
    },
  ];

  const handleItemClick = (nombre: string) => {
    if (onSeleccionar) {
      onSeleccionar(nombre);
    }
  };

  return (
    
    <aside  className={`
        fixed left-0 top-0 h-full
        bg-[#333333]
        transition-transform
        duration-300
        ease-in-out
        transform
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        w-72
        border-r border-gray-800
        flex flex-col
        font-['Inter',sans-serif]
        shadow-xl
        z-40
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-900 bg-[#2a2a2a]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-white">
                Panel de Control
              </h2>
              
            </div>
          )}
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-black-900 text-gray-300 hover:text-white transition-colors"
              title={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4" 
           style={{
             scrollbarWidth: 'none', /* Firefox */
             msOverflowStyle: 'none'  /* IE/Edge */
           }}>
        
        <nav className="space-y-2 px-3">
          {opciones.map((opcion, index) => (
            <Link
              key={opcion.nombre}
              to={opcion.ruta}
              onClick={() => handleItemClick(opcion.nombre)}
              className={`
                group relative w-full
                flex items-center gap-3 px-3 py-3
                rounded-lg
                bg-[#404040] hover:bg-[#4a4a4a]
                border border-gray-800 hover:border-gray-500
                transition-all duration-200 ease-out
                hover:scale-[1.01]
                focus:outline-none focus:ring-2 focus:ring-blue-400/30
                text-left no-underline
                animate-slideIn
              `}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
              title={isCollapsed ? `${opcion.nombre} - ${opcion.descripcion}` : undefined}
            >
              {/* Icono */}
              <div className="flex-shrink-0">
                <img
                  src={opcion.icono}
                  alt={opcion.nombre}
                  className="h-6 w-6 filter brightness-0 invert opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden h-6 w-6 bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {opcion.nombre.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Texto */}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-gray-100 transition-colors">
                    {opcion.nombre}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {opcion.descripcion}
                  </div>
                </div>
              )}

              {/* Indicador de hover para modo colapsado */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-600">
                  <div className="font-medium">{opcion.nombre}</div>
                  <div className="text-xs text-gray-300 mt-1">{opcion.descripcion}</div>
                  {/* Flecha del tooltip */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-600"></div>
                </div>
              )}

              {/* Indicador visual de navegación */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer opcional */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800 bg-[#2a2a2a]">
          <div className="text-xs text-gray-400 text-center animate-fadeIn">
            v1.0.0 - Sistema de Gestión Buen Sabor 2025
          </div>
        </div>
      )}
    </aside>
  );
}