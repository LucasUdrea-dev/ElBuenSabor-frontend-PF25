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