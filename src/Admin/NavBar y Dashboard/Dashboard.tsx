interface DashboardProps {
  onSeleccionar: (seccion: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Dashboard({ 
  onSeleccionar, 
  isCollapsed = false, 
  onToggleCollapse 
}: DashboardProps) {
  const opciones = [
    { 
      nombre: "Administracion", 
      icono: "/svg/IconsDashboard/Administracion.svg",
      descripcion: "Gestión general del sistema",
      categoria: "admin"
    },
    { 
      nombre: "Cocinero", 
      icono: "/svg/IconsDashboard/Cocinero.svg",
      descripcion: "Panel de cocina y pedidos",
      categoria: "operaciones"
    },
    { 
      nombre: "Repartidor", 
      icono: "/svg/IconsDashboard/Repartidor.svg",
      descripcion: "Gestión de entregas",
      categoria: "operaciones"
    },
    { 
      nombre: "Cajero", 
      icono: "/svg/IconsDashboard/Cajero.svg",
      descripcion: "Punto de venta y cobros",
      categoria: "operaciones"
    },
    { 
      nombre: "Clientes Admin", 
      icono: "/svg/IconsDashboard/ClientesAdmin.svg",
      descripcion: "Administrar base de clientes",
      categoria: "admin"
    },
    { 
      nombre: "Facturas", 
      icono: "/svg/IconsDashboard/Facturas.svg",
      descripcion: "Facturación y reportes",
      categoria: "finanzas"
    },
    { 
      nombre: "Empleados", 
      icono: "/svg/IconsDashboard/Empleados.svg",
      descripcion: "Gestión de personal",
      categoria: "rrhh"
    },
    { 
      nombre: "Catálogo", 
      icono: "/svg/IconsDashboard/Catálogo.svg",
      descripcion: "Productos y menú",
      categoria: "inventario"
    },
    { 
      nombre: "Productos Semielaborados", 
      icono: "/svg/IconsDashboard/Semielaborados.svg",
      descripcion: "Control de preparaciones",
      categoria: "inventario"
    },
    { 
      nombre: "Insumos", 
      icono: "/svg/IconsDashboard/Insumos.svg",
      descripcion: "Materias primas y stock",
      categoria: "inventario"
    },
    { 
      nombre: "Categorías", 
      icono: "/svg/IconsDashboard/Categorías.svg",
      descripcion: "Organización de productos",
      categoria: "inventario"
    },
  ];

  const getCategoryColor = (categoria: string) => {
    const colors = {
      admin: "text-blue-400",
      operaciones: "text-green-400",
      finanzas: "text-yellow-400",
      rrhh: "text-purple-400",
      inventario: "text-orange-400"
    };
    return colors[categoria as keyof typeof colors] || "text-gray-400";
  };

  const getCategoryBg = (categoria: string) => {
    const backgrounds = {
     admin: "bg-[#959595]/20 hover:bg-[#959595]/30 border-l-[#959595]",
      operaciones: "bg-[#959595]/20 hover:bg-[#959595]/30 border-l-[#959595]",
      finanzas: "bg-[#959595]/20 hover:bg-[#959595]/30 border-l-[#959595]",
      rrhh: "bg-[#959595]/20 hover:bg-[#959595]/30 border-l-[#959595]",
      inventario:"bg-[#959595]/20 hover:bg-[#959595]/30 border-l-[#959595]",
    };
    return backgrounds[categoria as keyof typeof backgrounds] || "bg-gray-500/20 hover:bg-gray-500/30 border-l-gray-400";
  };

  // Agrupar opciones por categoría
  const opcionesPorCategoria = opciones.reduce((acc, opcion) => {
    if (!acc[opcion.categoria]) {
      acc[opcion.categoria] = [];
    }
    acc[opcion.categoria].push(opcion);
    return acc;
  }, {} as Record<string, typeof opciones>);

  const categoriaLabels = {
    admin: "Administración",
    operaciones: "Operaciones",
    finanzas: "Finanzas",
    rrhh: "Recursos Humanos",
    inventario: "Inventario"
  };

  return (
    <div className={`
      fixed left-0 top-0 h-full z-50
      ${isCollapsed ? 'w-16' : 'w-80'}
      bg-[#333333]/50 backdrop-blur-sm
      border-r border-[#333333]/20
      transition-all duration-300 ease-in-out
      flex flex-col
      font-['Lato',sans-serif]
    `}>
      {/* Header */}
      <div className="p-4 border-b border-[#333333]/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-white drop-shadow-lg">
                Panel de Control
              </h2>
              <p className="text-gray-200 text-xs drop-shadow">
                Sistema de gestión
              </p>
            </div>
          )}
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-[#333333]/40 text-gray-200 hover:text-white transition-colors"
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
      <div 
        className="flex-1 overflow-y-auto py-4"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitScrollbar: 'none'
        } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `
        }} />
        <nav className="space-y-1 px-3">
          {Object.entries(opcionesPorCategoria).map(([categoria, opciones]) => (
            <div key={categoria} className="mb-6">
              {/* Título de categoría */}
              {!isCollapsed && (
                <div className="px-3 py-2 mb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                    {categoriaLabels[categoria as keyof typeof categoriaLabels]}
                  </h3>
                </div>
              )}
              
              {/* Opciones de la categoría */}
              <div className="space-y-1">
                {opciones.map(({ nombre, icono, descripcion, categoria }) => (
                  <button
                    key={nombre}
                    onClick={() => onSeleccionar(nombre)}
                    className={`
                      group relative w-full
                      flex items-center gap-3 px-3 py-3
                      rounded-lg border-l-2 border-transparent
                      ${getCategoryBg(categoria)}
                      hover:border-l-2
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-400/50
                      text-left
                    `}
                    title={isCollapsed ? `${nombre} - ${descripcion}` : undefined}
                  >
                    {/* Icono */}
                    <div className="flex-shrink-0">
                      <img
                        src={icono}
                        alt={nombre}
                        className={`
                          h-7 w-7 filter brightness-90 group-hover:brightness-110 
                          ${getCategoryColor(categoria)}
                          transition-all duration-200
                        `}
                        draggable={false}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden h-5 w-5 bg-[#333333] rounded flex items-center justify-center">
                        <span className="text-gray-200 text-xs font-semibold">
                          {nombre.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Texto */}
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white group-hover:text-white transition-colors drop-shadow">
                          {nombre}
                        </div>
                        <div className="text-xs text-gray-200 mt-0.5 leading-relaxed">
                          {descripcion}
                        </div>
                      </div>
                    )}

                    {/* Indicador de hover para modo colapsado */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-[#333333]/90 backdrop-blur-md text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-[#333333]/40 drop-shadow-lg">
                        <div className="font-semibold">{nombre}</div>
                        <div className="text-xs text-gray-200 mt-1">{descripcion}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      
    </div>
  );
}