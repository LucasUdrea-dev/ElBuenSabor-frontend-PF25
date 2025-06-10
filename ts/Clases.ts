export class Promocion {
    id?: number | null = null;
    denominacion: string = "";
    descripcion: string = "";
    precioRebajado: number = 0;
    tipoPromocion?: any;
    existe?: boolean;
    sucursal?: any;
    articulos?: any[];
    imagen: string = "";
}

export class Pedido {
    id?: number | null = null;
    tiempoEstimado: string = ""
    existe: boolean = true
    fecha: string = new Date().toLocaleString()
    detallePedidoList: DetallePedido[] = []
    detallePromocionList: DetallePromocion[] = []
    estadoPedido: EstadoPedido = {id: 1, nombreEstado: "INCOMING"}
    sucursal: Sucursal = new Sucursal()
    tipoEnvio: TipoEnvio = tiposEnvioEnum[1]
    tipoPago: TipoPago = new TipoPago()
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
    nombre_calle: string = "";
    numeracion: string = "";
    latitud: number = 0;
    longitud: number = 0;
    alias: string = "";
    text_area: String ="";
    ciudad?: Ciudad;
}


export class Ciudad {
    id?: number; 
    nombre: string = "";
    direccionList?: Direccion[] = [];
    provincia?: Provincia; 
}

export class Provincia {
    id?: number; 
    nombre: string = "";
    pais?: Pais; 
    ciudadList?: Ciudad[] = []; 
}

export class Pais {
    id?: number; 
    nombre: string = "";
    provincias: Provincia[] = [];
}