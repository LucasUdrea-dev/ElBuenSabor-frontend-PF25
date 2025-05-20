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
}