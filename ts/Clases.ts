export class Promocion {
    id?: number;
    denominacion: string = "";
    descripcion: string = "";
    precioRebajado: number = 0;
    tipoPromocion?: any;
    existe?: boolean;
    sucursal?: any;
    articulos?: any[];
    imagen: string = "";
}

export class Categoria {
    id?: number;
    denominacion: string = "";
    imagen: string = "";
    subcategorias: Subcategoria[] = [];
}

export class Subcategoria {
    id?: number;
    denominacion: string = "";
    categoria?: Categoria = new Categoria;
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

export class ArticuloInsumo {
    id?: number;
    precioCompra: number = 0;
    articulo: Articulo = new Articulo();
}

export class Articulo{
    id?: number;
    nombre: string = "";
    descripcion: string = "";
    precio: number = 0;
    existe?: boolean;
    esParaElaborar?: boolean;
    imagen: string = "";
    subcategoria: Subcategoria = new Subcategoria();
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
    direccionList: Direccion[] = [];
    provincia?: Provincia; 
}

export class Provincia {
    id?: number; 
    nombre: string = "";
    pais?: Pais; 
    ciudadList: Ciudad[] = []; 
}

export class Pais {
    id?: number; 
    nombre: string = "";
    provincias: Provincia[] = []; 
}

//Pedido

export class Pedido {
    id?: number;
    tiempoEstimado?: Date;
    existe?: boolean;
    fecha?: Date;
    detallePedidoList: DetallePedido[] = [];
    estadoPedido?: EstadoPedido;
    sucursal?: Sucursal; 
    tipoEnvio?: TipoEnvio; 
    tipoPago?: TipoPago; 
    usuario?: Usuario; 
    detallePromocionList: DetallePromocion[] = []; 
}

export class DetallePedido {
    id?: number;
    pedido?: Pedido;
    articulo?: Articulo; 
    cantidad: number = 0;
}

export class EstadoPedido {
    id?: number;
    nombre_estado?: TypeState;
    pedidoList: Pedido[] = [];
}

export enum TypeState {
    EN_CAMINO = "EN CAMINO",
    LISTO = "LISTO",
    ENTREGADO = "ENTREGADO",
    CANCELADO = "CANCELADO",
}



export class Empresa {
    id?: number;
    nombre: string = "";
    razonSocial: string = "";
    cuil: string = "";
    sucursalList: Sucursal[] = [];
}

export class Sucursal {
    id?: number;
    nombre: string = "";
    horaApertura: string = "";
    horaCierre: string = "";
    existe?: boolean;
    //empleadoList: Empleado[] = []; 
    //stockArticuloInsumoList: StockArticuloInsumo[] = []; 
    pedidoList: Pedido[] = []; 
    direccion?: Direccion; 
    empresa?: Empresa; 
    promocionList: Promocion[] = []; 
}

export class TipoEnvio {
    id?: number;
    //tipoDelivery?: TypeDelivery; 
    pedidoList: Pedido[] = []; 
}

export class TipoPago {
    id?: number;
    //tipoPago?: TypePay; 
    pedidoList: Pedido[] = []; 
    //mercadoPagoList: MercadoPago[] = []; 
}


export class DetallePromocion {
    id?: number;
    pedido?: Pedido; 
    promocion?: Promocion; 
    cantidad: number = 0;
}