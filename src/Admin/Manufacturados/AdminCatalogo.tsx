import { useEffect, useState } from "react"
import { ArticuloManufacturado, ArticuloInsumo, Subcategoria, Sucursal } from '../../../ts/Clases.ts'; // Adjust the path as needed

import AdminFormManufacturado from "./AdminFormManufacturado.tsx";
import AdminMostrarManufacturado from "./AdminMostrarManufacturado.tsx";

export default function AdminCatalogo() {

    const [articulosManufacturados, setArticulosManufacturados] = useState<ArticuloManufacturado[]>([])
    const [articulosManufacturadosMostrados, setArticulosManufacturadosMostrados] = useState<ArticuloManufacturado[]>([])
    const [buscador, setBuscador] = useState("")
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)
    const [mostrarArticulo, setMostrarArticulo] = useState<ArticuloManufacturado | null>(null)
    const [formManufacturado, setFormManufacturado] = useState<ArticuloManufacturado | null>(null)

    const cantidadPorPagina = 10;
    
    useEffect(()=>{
        cargarManufacturados()
    }, [])

    const cerrarDetalle = ()=>{
        setMostrarArticulo(null)
    }

    const cerrarForm = ()=>{
        setFormManufacturado(null)
    }

    const cargarManufacturados = ()=>{

        // Helper function to create an ArticuloInsumo
        const createInsumo = (id: number, nombre: string, precioCompra: number, unidad: string): ArticuloInsumo => {
            const insumo = new ArticuloInsumo();
            insumo.id = id;
            insumo.nombre = nombre;
            insumo.precio = precioCompra * 1.5; // Example: selling price is 1.5 times cost
            insumo.precioCompra = precioCompra;
            insumo.imagen = "no-image.jpg"; // Default for insumos if not specified

            let unidadMedidaId: number;
            switch (unidad) {
                case "unidad":
                    unidadMedidaId = 1;
                    break;
                case "gr":
                    unidadMedidaId = 2;
                    break;
                case "ml":
                    unidadMedidaId = 3;
                    break;
                default:
                    unidadMedidaId = 0; // Or handle unknown units as appropriate
            }

            insumo.unidadMedida = { id: unidadMedidaId, unidad: unidad };
            insumo.subcategoria = { id: 1, denominacion: "Insumos Varios" }; // Example subcategory
            return insumo;
        };

        // Helper function to create a Subcategoria
        const createSubcategoria = (id: number, denominacion: string, categoriaId: number, categoriaDenominacion: string): Subcategoria => {
            const sub = new Subcategoria();
            sub.id = id;
            sub.denominacion = denominacion;
            sub.categoria = { id: categoriaId, denominacion: categoriaDenominacion, imagen: "no-image.jpg", subcategorias: [] };
            return sub;
        };

        // Common ingredients
        const masaPizza = createInsumo(1, "Masa para Pizza", 50, "gr");
        const quesoMuzzarella = createInsumo(2, "Queso Muzzarella", 100, "gr");
        const salsaTomate = createInsumo(3, "Salsa de Tomate", 30, "ml");
        const pepperoni = createInsumo(4, "Pepperoni", 80, "gr");
        const jamon = createInsumo(5, "Jamón Cocido", 70, "gr");
        const morron = createInsumo(6, "Morrón", 20, "gr");
        const champinones = createInsumo(7, "Champiñones", 60, "gr");
        const cebolla = createInsumo(8, "Cebolla", 25, "gr");
        const huevo = createInsumo(9, "Huevo", 15, "unidad");
        const aceitunas = createInsumo(10, "Aceitunas", 10, "gr");
        const harina = createInsumo(11, "Harina 000", 20, "gr");
        const carnePicada = createInsumo(12, "Carne Picada", 150, "gr");
        const panHamburguesa = createInsumo(13, "Pan de Hamburguesa", 40, "unidad");
        const lechuga = createInsumo(14, "Lechuga", 15, "gr");
        const tomate = createInsumo(15, "Tomate", 20, "gr");
        const panceta = createInsumo(16, "Panceta Ahumada", 50, "gr");
        const quesoCheddar = createInsumo(17, "Queso Cheddar", 40, "gr");
        const papasFritas = createInsumo(18, "Papas Fritas", 80, "gr");
        const sal = createInsumo(19, "Sal", 5, "gr");
        const pimienta = createInsumo(20, "Pimienta", 3, "gr");
        const ajo = createInsumo(21, "Ajo", 5, "gr");
        const albahaca = createInsumo(22, "Albahaca", 5, "gr");
        const ricota = createInsumo(23, "Ricota", 100, "gr");
        const espinaca = createInsumo(24, "Espinaca", 50, "gr");
        const masaPasta = createInsumo(25, "Masa para Pasta", 120, "gr");
        const crema = createInsumo(26, "Crema de Leche", 50, "ml");
        const nuezMoscada = createInsumo(27, "Nuez Moscada", 2, "gr");
        const panRallado = createInsumo(28, "Pan Rallado", 10, "gr");
        const aceite = createInsumo(29, "Aceite", 10, "ml");

        const todosInsumos: ArticuloInsumo[] = [
            masaPizza,
            quesoMuzzarella,
            salsaTomate,
            pepperoni,
            jamon,
            morron,
            champinones,
            huevo,
            cebolla,
            aceitunas,
            harina,
            carnePicada,
            panHamburguesa,
            lechuga,
            tomate,
            panceta,
            quesoCheddar,
            papasFritas,
            sal,
            pimienta,
            panRallado,
            aceite
        ]

        // Common Subcategories
        const subPizza = createSubcategoria(1, "Pizzas", 1, "Comida Italiana");
        const subHamburguesa = createSubcategoria(2, "Hamburguesas", 2, "Fast Food");
        const subPasta = createSubcategoria(3, "Pastas", 1, "Comida Italiana");

        let datos: ArticuloManufacturado[] = [
            // --- Pizzas ---
            {
                id: 1,
                nombre: "Pizza Muzzarella",
                descripcion: "Clásica pizza con salsa de tomate y abundante muzzarella.",
                precio: 850,
                existe: false,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Estirar masa, untar salsa, cubrir con muzzarella y hornear.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 250 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: aceitunas, cantidad: 10 }
                ]
            },
            {
                id: 2,
                nombre: "Pizza Napolitana",
                descripcion: "Pizza con muzzarella, rodajas de tomate fresco y ajo.",
                precio: 900,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "25 minutos",
                preparacion: "Base de muzzarella, rodajas de tomate y ajo picado, albahaca fresca.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: tomate, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: ajo, cantidad: 5 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: albahaca, cantidad: 5 }
                ]
            },
            {
                id: 3,
                nombre: "Pizza Calabresa",
                descripcion: "Pizza con muzzarella y longaniza calabresa.",
                precio: 950,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "25 minutos",
                preparacion: "Base de muzzarella, rodajas de calabresa y ají molido.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 250 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: pepperoni, cantidad: 100 }
                ]
            },
            {
                id: 4,
                nombre: "Pizza Fugazzeta",
                descripcion: "Pizza sin salsa, con doble capa de cebolla y muzzarella.",
                precio: 880,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Doble masa, rellena de muzzarella, cubierta con cebolla.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 400 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: cebolla, cantidad: 200 }
                ]
            },
            {
                id: 5,
                nombre: "Pizza Jamón y Morrones",
                descripcion: "Clásica pizza con jamón y morrones asados.",
                precio: 920,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "25 minutos",
                preparacion: "Base de muzzarella, jamón y tiras de morrón.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 250 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: jamon, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: morron, cantidad: 50 }
                ]
            },

            // --- Hamburguesas ---
            {
                id: 6,
                nombre: "Hamburguesa Clásica",
                descripcion: "Hamburguesa de carne con lechuga, tomate y aderezos.",
                precio: 750,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "15 minutos",
                preparacion: "Cocinar medallón, armar con pan y vegetales.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 180 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: lechuga, cantidad: 20 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: tomate, cantidad: 30 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: sal, cantidad: 2 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: pimienta, cantidad: 1 }
                ]
            },
            {
                id: 7,
                nombre: "Hamburguesa con Queso",
                descripcion: "Hamburguesa con queso cheddar derretido.",
                precio: 800,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "18 minutos",
                preparacion: "Cocinar medallón, agregar queso al final, armar.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 180 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoCheddar, cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: lechuga, cantidad: 20 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: tomate, cantidad: 30 }
                ]
            },
            {
                id: 8,
                nombre: "Hamburguesa Doble Bacon",
                descripcion: "Doble medallón, doble queso y extra panceta crocante.",
                precio: 1100,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Cocinar medallones, fritar panceta, armar.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 360 }, // Double
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoCheddar, cantidad: 80 }, // Double
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panceta, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: cebolla, cantidad: 30 }
                ]
            },
            {
                id: 9,
                nombre: "Hamburguesa Veggie",
                descripcion: "Medallón vegetariano, palta y vegetales frescos.",
                precio: 850,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "18 minutos",
                preparacion: "Cocinar medallón veggie, armar con pan y vegetales.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(100, "Medallón Veggie", 100, "unidad"), cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: lechuga, cantidad: 25 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: tomate, cantidad: 35 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(101, "Palta", 60, "gr"), cantidad: 50 }
                ]
            },
            {
                id: 10,
                nombre: "Hamburguesa con Huevo Frito",
                descripcion: "Hamburguesa con queso, panceta y un huevo frito.",
                precio: 950,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Cocinar medallón, huevo y panceta, armar.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 180 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoCheddar, cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panceta, cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: huevo, cantidad: 1 }
                ]
            },

            // --- Pastas (Ravioles) ---
            {
                id: 11,
                nombre: "Ravioles de Ricota y Nuez",
                descripcion: "Ravioles caseros rellenos de ricota y nuez moscada.",
                precio: 1000,
                existe: true,
                esParaElaborar: true,
                imagen: "ravioles.jpg",
                subcategoria: subPasta,
                unidadMedida: { id: 1, unidad: "porción" },
                tiempoEstimado: "25 minutos",
                preparacion: "Hacer la masa, el relleno, armar ravioles y cocinar.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPasta, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: ricota, cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: huevo, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: nuezMoscada, cantidad: 2 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: sal, cantidad: 5 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: pimienta, cantidad: 3 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(102, "Queso Parmesano", 40, "gr"), cantidad: 30 }
                ]
            },
            {
                id: 12,
                nombre: "Ravioles de Espinaca y Queso",
                descripcion: "Ravioles rellenos de espinaca fresca y mezcla de quesos.",
                precio: 1050,
                existe: true,
                esParaElaborar: true,
                imagen: "ravioles.jpg",
                subcategoria: subPasta,
                unidadMedida: { id: 1, unidad: "porción" },
                tiempoEstimado: "25 minutos",
                preparacion: "Preparar relleno de espinaca y quesos, armar y cocinar.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPasta, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: espinaca, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: ricota, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(103, "Queso Cremoso", 50, "gr"), cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: huevo, cantidad: 1 }
                ]
            },
            {
                id: 13,
                nombre: "Ravioles de Calabaza y Jengibre",
                descripcion: "Ravioles dulces y salados con calabaza y un toque de jengibre.",
                precio: 1100,
                existe: true,
                esParaElaborar: true,
                imagen: "ravioles.jpg",
                subcategoria: subPasta,
                unidadMedida: { id: 1, unidad: "porción" },
                tiempoEstimado: "30 minutos",
                preparacion: "Asar calabaza, mezclar con jengibre y queso, armar ravioles.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPasta, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(104, "Calabaza", 80, "gr"), cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(105, "Jengibre", 10, "gr"), cantidad: 5 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: ricota, cantidad: 80 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: nuezMoscada, cantidad: 2 }
                ]
            },
            {
                id: 14,
                nombre: "Ravioles de Carne Braseada",
                descripcion: "Ravioles rellenos de carne de res braseada por horas.",
                precio: 1200,
                existe: true,
                esParaElaborar: true,
                imagen: "ravioles.jpg",
                subcategoria: subPasta,
                unidadMedida: { id: 1, unidad: "porción" },
                tiempoEstimado: "30 minutos",
                preparacion: "Cocinar carne lentamente, desmenuzar, armar ravioles.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPasta, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(106, "Carne Braseada", 200, "gr"), cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: cebolla, cantidad: 30 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: harina, cantidad: 20 }
                ]
            },
            {
                id: 15,
                nombre: "Ravioles con Salsa Rosada",
                descripcion: "Ravioles de ricota y espinaca con salsa rosada de tomate y crema.",
                precio: 1150,
                existe: true,
                esParaElaborar: true,
                imagen: "ravioles.jpg",
                subcategoria: subPasta,
                unidadMedida: { id: 1, unidad: "porción" },
                tiempoEstimado: "30 minutos",
                preparacion: "Cocinar ravioles. Preparar salsa con tomate y crema.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPasta, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: ricota, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: espinaca, cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: crema, cantidad: 50 }
                ]
            },

            // --- More Pizzas ---
            {
                id: 16,
                nombre: "Pizza Provolone",
                descripcion: "Pizza con queso provolone, panceta y orégano.",
                precio: 980,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "25 minutos",
                preparacion: "Base de salsa, queso provolone, panceta y orégano.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(107, "Queso Provolone", 120, "gr"), cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panceta, cantidad: 50 }
                ]
            },
            {
                id: 17,
                nombre: "Pizza Cuatro Quesos",
                descripcion: "Exquisita combinación de cuatro quesos.",
                precio: 1050,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "25 minutos",
                preparacion: "Mezcla de quesos, sin salsa, directo sobre la masa.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 100 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoCheddar, cantidad: 70 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(108, "Queso Roquefort", 80, "gr"), cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(109, "Queso Fontina", 90, "gr"), cantidad: 50 }
                ]
            },
            {
                id: 18,
                nombre: "Pizza Huevo y Panceta",
                descripcion: "Pizza con muzzarella, huevo frito y crujiente panceta.",
                precio: 990,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "25 minutos",
                preparacion: "Base de muzzarella, agregar huevo y panceta al salir del horno.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: huevo, cantidad: 2 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panceta, cantidad: 50 }
                ]
            },
            {
                id: 19,
                nombre: "Pizza Vegetales Asados",
                descripcion: "Pizza con una colorida variedad de vegetales asados.",
                precio: 950,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "30 minutos",
                preparacion: "Asar vegetales, disponer sobre base de muzzarella.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: morron, cantidad: 40 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: cebolla, cantidad: 40 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: champinones, cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: tomate, cantidad: 30 }
                ]
            },
            {
                id: 20,
                nombre: "Pizza con Rúcula y Crudo",
                descripcion: "Pizza con jamón crudo y rúcula fresca post-horno.",
                precio: 1100,
                existe: true,
                esParaElaborar: true,
                imagen: "pizza.jpg",
                subcategoria: subPizza,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Muzzarella, luego rúcula y crudo al salir del horno.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: masaPizza, cantidad: 300 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: salsaTomate, cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoMuzzarella, cantidad: 200 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(110, "Jamón Crudo", 150, "gr"), cantidad: 70 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(111, "Rúcula", 20, "gr"), cantidad: 30 }
                ]
            },

            // --- More Hamburguesas ---
            {
                id: 21,
                nombre: "Hamburguesa BBQ",
                descripcion: "Hamburguesa con salsa barbacoa, aros de cebolla y panceta.",
                precio: 980,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Cocinar medallón y panceta, armar con salsa BBQ.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 180 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(112, "Salsa BBQ", 30, "ml"), cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panceta, cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(113, "Aros de Cebolla", 40, "gr"), cantidad: 40 }
                ]
            },
            {
                id: 22,
                nombre: "Hamburguesa Picante",
                descripcion: "Hamburguesa con jalapeños, queso y salsa picante.",
                precio: 900,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "18 minutos",
                preparacion: "Cocinar medallón, agregar jalapeños y queso picante.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 180 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoCheddar, cantidad: 50 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(114, "Jalapeños", 20, "gr"), cantidad: 30 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(115, "Salsa Picante", 20, "ml"), cantidad: 20 }
                ]
            },
            {
                id: 23,
                nombre: "Hamburguesa con Champiñones",
                descripcion: "Hamburguesa con queso suizo y champiñones salteados.",
                precio: 930,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Cocinar medallón, saltear champiñones, armar.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 180 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(116, "Queso Suizo", 60, "gr"), cantidad: 40 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: champinones, cantidad: 70 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: cebolla, cantidad: 20 }
                ]
            },
            {
                id: 24,
                nombre: "Hamburguesa con Pollo Grillado",
                descripcion: "Pechuga de pollo grillada con lechuga, tomate y mayonesa.",
                precio: 890,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "15 minutos",
                preparacion: "Grillar pechuga de pollo, armar con vegetales.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(117, "Pechuga de Pollo", 120, "gr"), cantidad: 150 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: lechuga, cantidad: 20 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: tomate, cantidad: 30 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(118, "Mayonesa", 10, "ml"), cantidad: 20 }
                ]
            },
            {
                id: 25,
                nombre: "Hamburguesa Cheeseburger Deluxe",
                descripcion: "Medallón con queso, pepinillos, cebolla y salsa especial.",
                precio: 1000,
                existe: true,
                esParaElaborar: true,
                imagen: "hamburguesa.jpg",
                subcategoria: subHamburguesa,
                unidadMedida: { id: 1, unidad: "unidad" },
                tiempoEstimado: "20 minutos",
                preparacion: "Cocinar medallón, derretir queso, armar con ingredientes.",
                detalleInsumos: [
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: carnePicada, cantidad: 180 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: panHamburguesa, cantidad: 1 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: quesoCheddar, cantidad: 60 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(119, "Pepinillos", 15, "gr"), cantidad: 30 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: cebolla, cantidad: 20 },
                    { articuloManufacturado: new ArticuloManufacturado(), articuloInsumo: createInsumo(120, "Salsa Especial", 25, "ml"), cantidad: 30 }
                ]
            }
        ];

        // --- Function to add incremental IDs to detalleInsumo ---
        function addIncrementalIdsToDetalleInsumo(data: ArticuloManufacturado[]) {
            let detailIdCounter = 1; // Initialize the counter for detalleInsumo IDs

            for (const articulo of data) {
                if (articulo.detalleInsumos && Array.isArray(articulo.detalleInsumos)) {
                    for (const detalle of articulo.detalleInsumos) {
                        // Ensure the id doesn't already exist or you might want to overwrite
                        // For this request, we'll simply assign it.
                        detalle.id = detailIdCounter++;
                    }
                }
            }
            return data;
        }

        // Call the function to add IDs
        const datosConIds = addIncrementalIdsToDetalleInsumo(datos);

        for (const articulo of datosConIds) {
            articulo.sucursal = new Sucursal()
        }

        setArticulosManufacturados(datosConIds)
    }

    useEffect(()=>{

        let filtrado: ArticuloManufacturado[] = articulosManufacturados

        if (buscador) {
            filtrado = filtrado.filter((articulo)=>
            articulo.nombre.toLowerCase().includes(buscador.toLowerCase()))
        }

        setPaginaSeleccionada(1)
        setArticulosManufacturadosMostrados(filtrado)

    }, [articulosManufacturados, buscador])
    
    return(
        <>
        
            <div className="bg-[#333333] w-full h-full py-10">

                {/**Tabla */}
                <div className={`bg-white w-11/12 m-auto rounded-2xl ${(mostrarArticulo || formManufacturado) && "hidden"}`}>

                    {/**Titulo, agregar y buscador */}
                    <div className="flex justify-between p-5 h-2/12">

                        <h1 className="pl-5 text-4xl">Catálogo</h1>

                        <div className="flex gap-5 pr-[2%] text-2xl">
                            <button onClick={()=>setFormManufacturado(new ArticuloManufacturado())} className="bg-[#D93F21] text-white px-10 rounded-4xl flex items-center gap-2">
                                <h2>Agregar</h2>
                                <img className="h-5" src="/svg/Agregar.svg" alt="" />
                            </button>

                            <input onChange={(e)=>setBuscador(e.target.value)} className="bg-[#878787] text-white pl-5 rounded-4xl" placeholder="Buscar..." type="text" />

                        </div>

                    </div>

                    {/**Tabla CRUD catalogo */}
                    <div className="w-full pb-10">

                        {/**Cabecera */}
                        <div className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center">

                            <h1>Categoría</h1>
                            <h1>Denominación</h1>
                            <h1>Precio</h1>
                            <h1>Publicado</h1>
                            <h1>Acciones</h1>

                        </div>

                        {/**Articulos */}
                        {articulosManufacturadosMostrados.length > 0 && articulosManufacturadosMostrados.map((articulo, index)=>{
                            
                            if (index < (paginaSeleccionada*cantidadPorPagina) && index >= (cantidadPorPagina*(paginaSeleccionada-1))) {

                                return(
                                    
                                    <div key={articulo.id} className="text-4xl w-full grid grid-cols-5 *:border-1 *:border-r-0 *:border-gray-500 *:w-full *:p-5 *:border-collapse text-center *:flex *:items-center *:justify-center">
                                        
                                        <div>
                                            <h3>{articulo.subcategoria.categoria?.denominacion}</h3>
                                        </div>
                                        <div>
                                            <h3>{articulo.nombre}</h3>
                                        </div>
                                        <h3>${articulo.precio}</h3>
                                        <div className="flex">
                                            <div className={`${articulo.existe ? "bg-green-600" : "bg-gray-500"} h-10 w-10 m-auto rounded-4xl`}></div>
                                        </div>
                                        <div className="flex justify-around">
                                            <button onClick={()=>setMostrarArticulo(articulo)}><img className="h-15" src="/svg/LogoVer.svg" alt="" /></button>
                                            <button onClick={()=>setFormManufacturado(articulo)}><img className="h-15" src="/svg/LogoEditar.svg" alt="" /></button>
                                            <button><img className="h-15" src="/svg/LogoBorrar.svg" alt="" /></button>
                                        </div>
    
                                    </div>
                                )
                                
                            }

                        })}

                        {/**Paginacion */}
                        <div className="text-gray-500 flex items-center pt-10 pr-20 justify-end gap-2 text-2xl *:h-10">

                            {/**Informacion articulos mostrados y totales */}
                            <div className="h-10 flex items-center">
                                <h4>{(paginaSeleccionada*cantidadPorPagina)-cantidadPorPagina+1}-{paginaSeleccionada*cantidadPorPagina < articulosManufacturadosMostrados.length ? (paginaSeleccionada*cantidadPorPagina) : articulosManufacturadosMostrados.length} de {articulosManufacturadosMostrados.length}</h4>
                            </div>

                            {/**Control de paginado a traves de botones */}
                            <button onClick={()=>setPaginaSeleccionada(1)}><img className="h-10" src="/svg/PrimeraPagina.svg" alt="" /></button>
                            <button onClick={()=>setPaginaSeleccionada(prev=> {
                                if (paginaSeleccionada > 1) {
                                    return prev - 1
                                }
                                return prev;
                            })}><img className="h-10" src="/svg/AnteriorPagina.svg" alt="" /></button>

                            <button onClick={()=>setPaginaSeleccionada(prev=> {
                                if (paginaSeleccionada < Math.ceil(articulosManufacturadosMostrados.length / cantidadPorPagina)) {
                                    return prev+1
                                }
                                return prev;
                            })}><img className="h-10" src="/svg/SiguientePagina.svg" alt="" /></button>
                            
                            <button onClick={()=>setPaginaSeleccionada(Math.ceil(articulosManufacturadosMostrados.length / cantidadPorPagina))}><img className="h-10" src="/svg/UltimaPagina.svg" alt="" /></button>

                        </div>                        

                    </div>

                </div>
                
                {/**MostrarManufacturado */}
                <div className={`${!mostrarArticulo && "hidden"}`}>

                    <AdminMostrarManufacturado articulo={mostrarArticulo} cerrarMostrar={cerrarDetalle}/>

                </div>

                {/**Editar, crear manufacturado */}
                <div className={`${!formManufacturado && "hidden"}`}>

                    <AdminFormManufacturado articulo={formManufacturado} cargarAdminCatalogo={cargarManufacturados} cerrarEditar={cerrarForm}/>

                </div>

            </div>

        </>
    )

}