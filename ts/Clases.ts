export class Promocion {
    id?: number | null = null;
    denominacion: string = "";
    descripcion: string = "";
    precioRebajado: number = 0;
    tipoPromocion?: any;
    existe?: boolean;
    sucursal?: any;
    promocionArticuloList?: any[];
    imagen: string = "";
}

export class Pedido {
    id?: number | null = null;
    tiempoEstimado: string = ""
    existe: boolean = true
    fecha: string = new Date().toLocaleString()
    detallePedidoList: DetallePedido[] = []
    detallePromocionList: DetallePromocion[] = []
    estadoPedido: EstadoPedido = {id: 5, nombreEstado: "INCOMING"}
    sucursal: Sucursal = new Sucursal()
    tipoEnvio: TipoEnvio = tiposEnvioEnum[1]
    tipoPago: TipoPago = tiposPagoEnum[1]
    usuario: Usuario = new Usuario()
    direccionPedido: DireccionPedido = new DireccionPedido()
}

export class DireccionPedido{
    id?: number | null = null;
    direccion: Direccion = new Direccion()
}

export class DetallePromocion{
    id?: number | null = null
    promocion: Promocion = new Promocion()
    cantidad: number = 0
}

export class TipoPago{
    id?: number | null = null
    tipoPago: string = ""
}


export const tiposPagoEnum: TipoPago[] = [
    {id: 1, tipoPago: "CASH"},
    {id: 2, tipoPago: "MERCADOPAGO"}
]


export class TipoEnvio{
    id?: number | null = null
    tipoDelivery: string = ""
}

export const tiposEnvioEnum: TipoEnvio[] = [
    {id: 1, tipoDelivery: "DELIVERY"},
    {id: 2, tipoDelivery: "TAKEAWAY"}
]

export class DetallePedido{
    id?: number | null = null
    articulo: ArticuloVentaDTO = new ArticuloVentaDTO()
    cantidad: number = 0
}

export class EstadoPedido{
    id?: number | null = null
    nombreEstado: string = "INCOMING"
}


export class Categoria {
    id?: number | null = null;
    denominacion: string = "";
    imagen: string = "";
    subcategorias?: Subcategoria[] = [];
}

export class Subcategoria {
    id?: number | null = null ;
    denominacion: string = "";
    categoria?: Categoria = new Categoria;
}

export class Articulo{
    id?: number | null = null;
    nombre: string = "";
    descripcion: string = "";
    precio: number = 0;
    existe?: boolean = false;
    esParaElaborar?: boolean = false;
    imagenArticulo: string = "";
    subcategoria: Subcategoria = new Subcategoria();
    unidadMedida?: UnidadMedida = new UnidadMedida();
}

export class UnidadMedida{
    id?: number | null = null;
    unidad: string = ""
}

export class ArticuloVentaDTO {
    id?: number;
    nombre: string = "";
    descripcion: string = "";
    precio: number = 0;
    imagen: string = "";
    subcategoria: Subcategoria = new Subcategoria();
    insumos: ArticuloInsumo[] = [];//Si es insumo que traiga array vacio
    tiempoEstimado: string = "";
    //Filtrar por existe, esParaElaborar y stock(sucursal)
}

export class ArticuloInsumo extends Articulo{
    precioCompra: number = 0;
    
}

export class ArticuloManufacturado extends Articulo{
    tiempoEstimado: string = "";
    preparacion: string = "";
    sucursal?: Sucursal = new Sucursal();
    detalleInsumos: ArticuloManufacturadoDetalleInsumo[] = []
}

export class ArticuloManufacturadoDetalleInsumo{
    id?: number | null = null
    articuloInsumo: ArticuloInsumo = new ArticuloInsumo()
    cantidad: number = 0
}

export class Sucursal{
    id?: number | null = null
    nombre?: string = ""
    horaApertura?: string = ""
    horaCierre?: string = ""
    existe?: boolean = false
    direccion?: Direccion = new Direccion()
}

export const sucursalMendoza: Sucursal = {
  id: 1,
  nombre: "Sucursal Central Mendoza",
  horaApertura: "09:00",
  horaCierre: "18:00",
  existe: true,
  direccion: {
    id: 101,
    existe: true,
    nombreCalle: "Av. San Martín",
    numeracion: "1100",
    latitud: -32.890692, // Latitud aproximada para Av. San Martín 1100, Mendoza
    longitud: -68.847145, // Longitud aproximada para Av. San Martín 1100, Mendoza
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
          provincias: [], // Dejamos vacío para evitar referencias circulares
        },
        ciudadList: [], // Dejamos vacío para evitar referencias circulares
      },
    },
  },
};

export class Usuario{
    id?: number;
    nombre: string = "";
    apellido: string = "";
    email: string = "";
    contrasena: string = "";
    repetirContrasena: string = "";
    telefono: string = "";
    existe?: boolean;
    imagenUsuario?: string;
    
}

export class Direccion{
    id?: number;
    existe?: boolean;
    nombreCalle: string = "";
    numeracion: string = "";
    latitud: number = 0;
    longitud: number = 0;
    alias: string = "";
    descripcionEntrega: string ="";
    ciudad: Ciudad = new Ciudad();
}


export class Ciudad {
    id?: number; 
    nombre: string = "";
    provincia: Provincia = new Provincia();
}

export class Provincia {
    id?: number; 
    nombre: string = "";
    pais: Pais = new Pais(); 
    ciudadList?: Ciudad[] = []; 
}

export class Pais {
    id?: number; 
    nombre: string = "";
    provincias: Provincia[] = [];
}

