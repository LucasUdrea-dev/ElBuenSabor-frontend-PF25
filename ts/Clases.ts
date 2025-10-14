export const host: string = "https://elbuensabor-backend-pf25.onrender.com"

export class Promocion {
    id?: number | null = null;
    denominacion: string = "";
    descripcion: string = "";
    precioRebajado: number = 0;
    tipoPromocion?: TipoPromocion = new TipoPromocion();
    existe: boolean = false;
    sucursal?: Sucursal;
    promocionArticuloList: PromocionArticulo[] = [];
    imagen: string = "";
}

export class PromocionArticulo{
    id: number | null = null
    cantidad: number = 0
    articulo?: ArticuloInsumo | ArticuloManufacturado;
}

export class TipoPromocion{
    id: number | null = 1
    tipoPromocion: string = "NORMAL"
}

export class Pedido {
    id?: number | null = null;
    tiempoEstimado: string = ""
    existe: boolean = true
    fecha: string = new Date().toISOString()
    detallePedidoList: DetallePedido[] = []
    detallePromocionList: DetallePromocion[] = []
    estadoPedido: EstadoPedido = {id: 5, nombreEstado: "INCOMING"}
    sucursal: Sucursal = new Sucursal()
    tipoEnvio: TipoEnvio = tiposEnvioEnum[1]
    tipoPago: TipoPago = tiposPagoEnum[1]
    usuario: Usuario = new Usuario()
    direccionPedido?: DireccionPedido = new DireccionPedido()
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
    articulo?: ArticuloInsumo | ArticuloManufacturado
    cantidad: number = 0
}

export class EstadoPedido{
    id?: number | null = null
    nombreEstado: string = "INCOMING"
}

export const tiposEstadoPedido: EstadoPedido[] = [
    {id: 1, nombreEstado: "PREPARING"},
    {id: 2, nombreEstado: "STANDBY"},
    {id: 3, nombreEstado: "CANCELLED"},
    {id: 4, nombreEstado: "REJECTED"},
    {id: 5, nombreEstado: "INCOMING"},
    {id: 6, nombreEstado: "DELIVERED"},
    {id: 7, nombreEstado: "READY"}
]

export class Categoria {
    id?: number | null = null;
    denominacion: string = "";
    imagen: string = "";
    esParaElaborar: boolean = false;
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
    unidadMedida: UnidadMedida = new UnidadMedida();
}

export class UnidadMedida{
    id: number | null = null;
    unidad: string = ""
}

export const tiposUnidadMedida: UnidadMedida[] = [
    {id: 1, unidad: "unidad"},
    {id: 2, unidad: "gr"},
    {id: 3, unidad: "ml"}
]

export class ArticuloVentaDTO {
    id?: number;
    nombre: string = "";
    descripcion: string = "";
    precio: number = 0;
    imagenArticulo: string = "";
    subcategoria: Subcategoria = new Subcategoria();
    detalleInsumos: ArticuloManufacturadoDetalleInsumo[] = [];//Si es insumo que traiga array vacio
    tiempoEstimado: string = "";
    //Filtrar por existe, esParaElaborar y stock(sucursal)
}

export class ArticuloInsumo extends Articulo{
    precioCompra: number = 0;
    tiempoEstimado?: string;
    stockArticuloInsumo: StockArticuloInsumo = new StockArticuloInsumo();
}

export class StockArticuloInsumo {
    id?: number | null = null
    minStock: number = 0
    cantidad: number = 0
    sucursal: Sucursal = new Sucursal()
}

export class HistoricoStockArticuloInsumo{
    id?: number | null = null
    cantidad: number = 0
    fechaActualizacion: string = ""
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
    existe: boolean = true;
    imagenUsuario?: string;
    telefonoList: Telefono[] = []
    rol?: Rol; // Hacer que el rol sea opcional
    direccionList: Direccion[] = []

}

export class userAuthentication{
    id: number | null = null
    password: string = ""
    username: string = ""
}

export class Rol{
    id: number | null = null
    fechaAlta: string = new Date().toISOString()
    tipoRol: TipoRol = new TipoRol()
}

export class TipoRol{
    id: number | null = null
    rol: TypeRol = TypeRol.CUSTOMER
}

export enum TypeRol{
    ADMIN,
    ADMINAREA,
    EMPLOYEE,
    CUSTOMER
}

export class Telefono{
    id: number | null = null
    numero: number = 0
}

export class Direccion{
    id?: number;
    nombreCalle: string = "";
    numeracion: string = "";
    latitud: number = 0;
    longitud: number = 0;
    alias: string = "";
    descripcionEntrega: string ="";
    ciudad: Ciudad = new Ciudad();
}


export class Empleado extends Usuario {
    sueldo: number = 0;
    fechaAlta: string = new Date().toISOString(); 
    idSucursal: Sucursal = new Sucursal();
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

export  interface PreferenceMP{
    id: string;
    statusCode: number;
}