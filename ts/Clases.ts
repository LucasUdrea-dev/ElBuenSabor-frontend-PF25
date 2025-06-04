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