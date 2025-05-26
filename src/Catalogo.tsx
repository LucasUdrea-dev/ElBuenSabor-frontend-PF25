import { useEffect, useState } from "react";
import SliderPromociones from "./SliderPromociones";
import { ArticuloInsumo, ArticuloVentaDTO, Categoria, Promocion, Subcategoria } from "../ts/Clases";
import { obtenerImagen } from "../ts/Imagen";
import ArticuloCardCatalogo from "./ArticuloCardCatalogo";

export default function Catalogo() {

    const [buscador, setBuscador] = useState("")
    const [promos, setPromos] = useState<Promocion[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("")
    const [todosArticulos, setTodosArticulos] = useState<ArticuloVentaDTO[]>([])
    const [articulosFiltrados, setArticulosFiltrados] = useState<ArticuloVentaDTO[]>([])
    const [ordenamiento, setOrdenamiento] = useState("");
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(1)

    const articulosPorPagina = 9;

    //Funcion para obtener promociones
    useEffect(()=>{
        let data: Promocion[] = [];
        let promocion1: Promocion = {
            denominacion: "Promo 1",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "pizza.jpg"
        }
        let promocion2: Promocion = {
            denominacion: "Promo 2",
            descripcion: "2 hamburguesas + 2 CocaCola 500ml + 2 papas grandes",
            precioRebajado: 500,
            imagen: "hamburguesa.jpg"
        }
        let promocion3: Promocion = {
            denominacion: "Promo 3",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "pizza.jpg"
        }
        let promocion4: Promocion = {
            denominacion: "Promo 4",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "hamburguesa.jpg"
        }
        let promocion5: Promocion = {
            denominacion: "Promo 5",
            descripcion: "1 pizza + 2 CocaCola 500ml",
            precioRebajado: 500,
            imagen: "pizza.jpg"
        }
        data.push(promocion1)
        data.push(promocion2)
        data.push(promocion3)
        data.push(promocion4)
        data.push(promocion5)
        setPromos(data)
    }, [])

    //Obtener categorias
    useEffect(()=>{
        let data: Categoria[] = []

        const categoriaComidaRapida: Categoria = {
            id: 1,
            denominacion: "Rápida",
            imagen: "categoriaPizza.jpg",
            subcategorias: []
        };

        const subcategoriaHamburguesas: Subcategoria = {
            id: 101,
            denominacion: "Hamburguesas",
            categoria: categoriaComidaRapida
        };
        categoriaComidaRapida.subcategorias.push(subcategoriaHamburguesas);

        const subcategoriaPizzas: Subcategoria = {
            id: 102,
            denominacion: "Pizzas",
            categoria: categoriaComidaRapida
        };
        categoriaComidaRapida.subcategorias.push(subcategoriaPizzas);


        const categoriaPastas: Categoria = {
            id: 2,
            denominacion: "Pastas",
            imagen: "categoriaPastas.jpg",
            subcategorias: []
        };

        const subcategoriaPastasRellenas: Subcategoria = {
            id: 201,
            denominacion: "Pastas Rellenas",
            categoria: categoriaPastas
        };
        categoriaPastas.subcategorias.push(subcategoriaPastasRellenas);

        const categoriaBebidas: Categoria = {
            id: 3,
            denominacion: "Bebidas",
            imagen: "categoriaBebidas.jpg",
            subcategorias: []
        };

        const subcategoriaGaseosas: Subcategoria = {
            id: 301,
            denominacion: "Gaseosas",
            categoria: categoriaBebidas
        };
        categoriaBebidas.subcategorias.push(subcategoriaGaseosas);

        const categoriaPostres: Categoria = {
            id: 4,
            denominacion: "Postres",
            imagen: "categoriaPostres.jpg",
            subcategorias: []
        };
        const subcategoriaHelados: Subcategoria = {
            id: 401,
            denominacion: "Helados",
            categoria: categoriaPostres
        };
        categoriaPostres.subcategorias.push(subcategoriaHelados);
        const subcategoriaTortas: Subcategoria = {
            id: 402,
            denominacion: "Tortas",
            categoria: categoriaPostres
        };
        categoriaPostres.subcategorias.push(subcategoriaTortas);

        const categoriaEnsaladas: Categoria = {
            id: 5,
            denominacion: "Ensaladas",
            imagen: "categoriaEnsaladas.jpg",
            subcategorias: []
        };
        const subcategoriaVegetarianas: Subcategoria = {
            id: 501,
            denominacion: "Vegetarianas",
            categoria: categoriaEnsaladas
        };
        categoriaEnsaladas.subcategorias.push(subcategoriaVegetarianas);
        
        data.push(categoriaComidaRapida)
        data.push(categoriaPastas)
        data.push(categoriaBebidas)
        data.push(categoriaPostres)
        data.push(categoriaEnsaladas)
        setCategorias(data)
    }, [])

    //Obtener productos
    useEffect(() => {
        // Creación de categorías y subcategorías
        const categoriaComidaRapida: Categoria = {
            id: 1,
            denominacion: "Rápida",
            imagen: "categoriaPizza.jpg",
            subcategorias: []
        };

        const subcategoriaHamburguesas: Subcategoria = {
            id: 101,
            denominacion: "Hamburguesas",
            categoria: categoriaComidaRapida
        };
        categoriaComidaRapida.subcategorias.push(subcategoriaHamburguesas);

        const subcategoriaPizzas: Subcategoria = {
            id: 102,
            denominacion: "Pizzas",
            categoria: categoriaComidaRapida
        };
        categoriaComidaRapida.subcategorias.push(subcategoriaPizzas);


        const categoriaPastas: Categoria = {
            id: 2,
            denominacion: "Pastas",
            imagen: "categoriaPastas.jpg",
            subcategorias: []
        };

        const subcategoriaPastasRellenas: Subcategoria = {
            id: 201,
            denominacion: "Pastas Rellenas",
            categoria: categoriaPastas
        };
        categoriaPastas.subcategorias.push(subcategoriaPastasRellenas);

        const categoriaBebidas: Categoria = {
            id: 3,
            denominacion: "Bebidas",
            imagen: "categoriaBebidas.jpg",
            subcategorias: []
        };

        const subcategoriaGaseosas: Subcategoria = {
            id: 301,
            denominacion: "Gaseosas",
            categoria: categoriaBebidas
        };
        categoriaBebidas.subcategorias.push(subcategoriaGaseosas);

        // --- Nuevas categorías y subcategorías para mayor variedad ---
        const categoriaPostres: Categoria = {
            id: 4,
            denominacion: "Postres",
            imagen: "categoriaPostres.jpg",
            subcategorias: []
        };
        const subcategoriaHelados: Subcategoria = {
            id: 401,
            denominacion: "Helados",
            categoria: categoriaPostres
        };
        categoriaPostres.subcategorias.push(subcategoriaHelados);
        const subcategoriaTortas: Subcategoria = {
            id: 402,
            denominacion: "Tortas",
            categoria: categoriaPostres
        };
        categoriaPostres.subcategorias.push(subcategoriaTortas);

        const categoriaEnsaladas: Categoria = {
            id: 5,
            denominacion: "Ensaladas",
            imagen: "categoriaEnsaladas.jpg",
            subcategorias: []
        };
        const subcategoriaVegetarianas: Subcategoria = {
            id: 501,
            denominacion: "Vegetarianas",
            categoria: categoriaEnsaladas
        };
        categoriaEnsaladas.subcategorias.push(subcategoriaVegetarianas);


        // Creación de artículos de insumo (ejemplos)
        const insumoPanBrioche: ArticuloInsumo = {
            id: 1,
            precioCompra: 50,
            nombre: "Pan Brioche",
            descripcion: "Pan especial para hamburguesas",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-pan-brioche.jpg",
            subcategoria: subcategoriaHamburguesas
        };

        const insumoCarneVacuna: ArticuloInsumo = {
            id: 2,
            precioCompra: 200,
            nombre: "Carne Vacuna",
            descripcion: "Carne picada para hamburguesas",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-carne-vacuna.jpg",
            subcategoria: subcategoriaHamburguesas
        };

        const insumoMasaPizza: ArticuloInsumo = {
            id: 3,
            precioCompra: 80,
            nombre: "Masa para Pizza",
            descripcion: "Masa fresca para pizza",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-masa-pizza.jpg",
            subcategoria: subcategoriaPizzas
        };

        const insumoSalsaTomate: ArticuloInsumo = {
            id: 4,
            precioCompra: 60,
            nombre: "Salsa de Tomate",
            descripcion: "Salsa casera para pizza",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-salsa-tomate.jpg",
            subcategoria: subcategoriaPizzas
        };

        const insumoHarina: ArticuloInsumo = {
            id: 5,
            precioCompra: 30,
            nombre: "Harina 000",
            descripcion: "Harina de trigo",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-harina.jpg",
            subcategoria: subcategoriaPastasRellenas
        };

        const insumoHuevo: ArticuloInsumo = {
            id: 6,
            precioCompra: 20,
            nombre: "Huevos",
            descripcion: "Huevos frescos",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-huevo.jpg",
            subcategoria: subcategoriaPastasRellenas
        };

        // Nuevos insumos para postres y ensaladas
        const insumoAzucar: ArticuloInsumo = {
            id: 7,
            precioCompra: 15,
            nombre: "Azúcar",
            descripcion: "Azúcar refinada",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-azucar.jpg",
            subcategoria: subcategoriaTortas
        };

        const insumoLechuga: ArticuloInsumo = {
            id: 8,
            precioCompra: 25,
            nombre: "Lechuga Fresca",
            descripcion: "Lechuga de hoja verde",
            precio: 0,
            esParaElaborar: true,
            imagen: "imagen-lechuga.jpg",
            subcategoria: subcategoriaVegetarianas
        };


        // Artículos de venta DTO base
        const articuloVenta1: ArticuloVentaDTO = {
            id: 1,
            nombre: "Hamburguesa Clásica",
            descripcion: "Deliciosa hamburguesa con pan brioche, carne, lechuga y tomate.",
            precio: 850,
            imagen: "hamburguesa.jpg",
            subcategoria: subcategoriaHamburguesas,
            insumos: [insumoPanBrioche, insumoCarneVacuna],
            tiempoEstimado: "15 minutos"
        };

        const articuloVenta2: ArticuloVentaDTO = {
            id: 2,
            nombre: "Pizza Muzzarella",
            descripcion: "Clásica pizza con salsa de tomate y abundante muzzarella.",
            precio: 1200,
            imagen: "pizza.jpg",
            subcategoria: subcategoriaPizzas,
            insumos: [insumoMasaPizza, insumoSalsaTomate],
            tiempoEstimado: "20 minutos"
        };

        const articuloVenta3: ArticuloVentaDTO = {
            id: 3,
            nombre: "Ravioles de Ricota y Nuez",
            descripcion: "Exquisitos ravioles caseros rellenos de ricota y nuez con salsa a elección.",
            precio: 1500,
            imagen: "ravioles.jpg",
            subcategoria: subcategoriaPastasRellenas,
            insumos: [insumoHarina, insumoHuevo],
            tiempoEstimado: "25 minutos"
        };

        const articuloVenta4: ArticuloVentaDTO = {
            id: 4,
            nombre: "Coca-Cola Zero",
            descripcion: "Gaseosa Coca-Cola Zero azúcares de 500ml.",
            precio: 300,
            imagen: "coca-cola.jpg",
            subcategoria: subcategoriaGaseosas,
            insumos: [],
            tiempoEstimado: ""
        };

        // Array para almacenar todos los artículos
        const data: ArticuloVentaDTO[] = [
            articuloVenta1,
            articuloVenta2,
            articuloVenta3,
            articuloVenta4
        ];

        // --- Generar 20 artículos adicionales ---
        const nombresExtra = [
            "Hamburguesa Doble", "Pizza Pepperoni", "Fideos con Salsa", "Agua Mineral",
            "Helado Vainilla", "Torta Chocolate", "Ensalada César", "Sándwich de Pollo",
            "Empanadas Carne", "Jugo Naranja", "Milanesa Napolitana", "Papas Fritas",
            "Lomo Saltado", "Cerveza Artesanal", "Brownie", "Wrap Vegetal",
            "Sopa del Día", "Tacos de Pollo", "Batido Frutas", "Pastel de Choclo"
        ];

        const descripcionesExtra = [
            "El doble de sabor.", "Con el picante justo.", "Clásico reconfortante.", "Refrescante.",
            "Cremoso y delicioso.", "Un placer para el paladar.", "Fresca y liviana.", "Rápido y sabroso.",
            "Caseras y jugosas.", "Natural y recién exprimido.", "El clásico argentino.", "Crujientes.",
            "Sabores peruanos.", "Rubia y refrescante.", "Húmedo y chocolatoso.", "Opción saludable.",
            "Caliente y nutritiva.", "Estilo mexicano.", "Energizante.", "Tradicional y sabroso."
        ];

        const preciosBase = [900, 1300, 1400, 350, 400, 600, 1000, 750, 800, 400, 1600, 500, 1800, 700, 550, 950, 700, 1100, 650, 1450];
        const tiemposBase = ["18 minutos", "22 minutos", "20 minutos", "", "5 minutos", "10 minutos", "15 minutos", "12 minutos", "17 minutos", "", "25 minutos", "10 minutos", "30 minutos", "", "8 minutos", "14 minutos", "15 minutos", "20 minutos", "7 minutos", "28 minutos"];


        // Array de subcategorías disponibles para asignación aleatoria
        const subcategoriasDisponibles = [
            subcategoriaHamburguesas, subcategoriaPizzas, subcategoriaPastasRellenas,
            subcategoriaGaseosas, subcategoriaHelados, subcategoriaTortas, subcategoriaVegetarianas
        ];

        // Helper para seleccionar una subcategoría aleatoria
        const getRandomSubcategoria = () => {
            const randomIndex = Math.floor(Math.random() * subcategoriasDisponibles.length);
            return subcategoriasDisponibles[randomIndex];
        };

        for (let i = 0; i < 20; i++) {
            const id = data.length + 1; // ID incremental
            const nombre = nombresExtra[i % nombresExtra.length] + (i < 5 ? "" : ` ${id}`); // Para que los nombres no se repitan tan pronto
            const descripcion = descripcionesExtra[i % descripcionesExtra.length];
            const precio = preciosBase[i % preciosBase.length] + Math.floor(Math.random() * 50); // Un poco de variación en el precio
            const tiempoEstimado = tiemposBase[i % tiemposBase.length];
            const subcategoriaAsignada = getRandomSubcategoria();

            const nuevoArticulo: ArticuloVentaDTO = {
                id: id,
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                imagen: "pizza.jpg", // Puedes variar esto si tienes más imágenes
                subcategoria: subcategoriaAsignada,
                insumos: tiempoEstimado === "" ? [] : [insumoPanBrioche, insumoCarneVacuna, insumoAzucar, insumoLechuga].filter(() => Math.random() > 0.5), // Insumos aleatorios si no es bebida
                tiempoEstimado: tiempoEstimado
            };
            data.push(nuevoArticulo);
        }

        setTodosArticulos(data);

    }, []); // El 

    //Filtrar los articulos que se van a mostrar
    useEffect(()=>{
        let datosFiltrados: ArticuloVentaDTO[] = todosArticulos;

        //Filtro por nombre
        if (buscador) {
            datosFiltrados = datosFiltrados.filter((articulo)=>
                articulo.nombre.toLowerCase().includes(buscador.toLowerCase())
            );
        }

        //Filtro por categoria
        if (categoriaSeleccionada) {
            datosFiltrados = datosFiltrados.filter((articulo)=>
                articulo.subcategoria.categoria?.id === categorias[Number(categoriaSeleccionada)].id
            )
        }
        
        //Filtro por subcategoria
        if (subcategoriaSeleccionada) {
            datosFiltrados = datosFiltrados.filter((articulo)=>
                articulo.subcategoria.id === categorias[Number(categoriaSeleccionada)].subcategorias[Number(subcategoriaSeleccionada)].id
            )
        }

        //Ordenamiento
        switch (ordenamiento) {
            case "precioMenorMayor":
                console.log("Entro precio menor")
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=> 
                    anterior.precio - siguiente.precio)
                break;
                
            case "precioMayorMenor":
                console.log("Entro precio mayor")
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=> 
                    siguiente.precio - anterior.precio)
                break;

            case "nombreAZ":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                    anterior.nombre.localeCompare(siguiente.nombre))
                break;

            case "nombreZA":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                    siguiente.nombre.localeCompare(anterior.nombre))
                break;

            case "tiempoMenorMayor":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                Number(anterior.tiempoEstimado.split(" ")[0]) - Number(siguiente.tiempoEstimado.split(" ")[0]))
                break;

            case "tiempoMayorMenor":
                datosFiltrados = [...datosFiltrados].sort((anterior, siguiente)=>
                Number(siguiente.tiempoEstimado.split(" ")[0]) - Number(anterior.tiempoEstimado.split(" ")[0]))
                break;

            default:
                datosFiltrados = datosFiltrados
                break;
        }

        setArticulosFiltrados(datosFiltrados)

        setPaginaSeleccionada(1)
    }, [todosArticulos, categoriaSeleccionada, subcategoriaSeleccionada, buscador, ordenamiento])
    
    return(
        <>
        
        <div className="bg-[#333333] h-full w-1/1 text-white font-[Lato]">

            {/**Primera seccion */}
            <div className="p-[3%] flex flex-col gap-5">

                <h1 className="text-6xl">Los platillos mas ricos de<br/>Argentina</h1>

                <h3 className="text-3xl">Lista de los mejores platos, postres, desayunos, bebidas...</h3>

                <div className="flex gap-5">
                    <input defaultValue={buscador} onChange={(event)=>{setBuscador(event.target.value)}} className="bg-[#D9D9D98C] w-1/2 rounded-2xl px-5 py-1 text-2xl" placeholder="Por ejemplo, pizza, hamburguesa..." type="text"/>
                </div>
            </div>

            {/**Promociones */}
            <div className="px-[3%]">
                <SliderPromociones promos={promos}/>
            </div>

            {/**Categorias */}
            <div className="p-[3%]">
                <div className="flex justify-between">
                    <h1 className="text-4xl">Categorias</h1>
                    {/**Ordenar por */}
                    <select defaultValue={""} onChange={(e)=>{setOrdenamiento(e.target.value)}} className="bg-white text-black rounded-xl text-xl">
                        <option value="" disabled>Ordenar por</option>
                        <option value="precioMenorMayor">Precio mas bajo</option>
                        <option value="precioMayorMenor">Precio mas alto</option>
                        <option value="nombreAZ">A - Z</option>
                        <option value="nombreZA">Z - A</option>
                        <option value="tiempoMenorMayor">Menor tiempo</option>
                        <option value="tiempoMayorMenor">Mayor tiempo</option>
                    </select>
                </div>

                {/**Se muestran las categorias existentes + Todos */}
                <div className="mt-10 flex gap-3">
                    <button onClick={()=>{
                            setCategoriaSeleccionada("")
                            setSubcategoriaSeleccionada("")
                            }} 
                            className={`${ categoriaSeleccionada === "" && "bg-[#D93F21]"} px-1 pt-1 pb-5 rounded-[20rem] flex flex-col gap-1`}>
                            <img className="rounded-[20rem] object-cover h-20 m-auto" src="./img/categoriaTodos.jpg" alt="No se encontro la imagen" />
                            <h3 className="m-auto">Todos</h3>
                        </button>
                    {categorias.map((categoria, index)=>(
                        <button key={index} onClick={()=>{
                            setCategoriaSeleccionada(String(index))
                            setSubcategoriaSeleccionada("")
                            }} 
                            className={`${ String(index) === categoriaSeleccionada && "bg-[#D93F21]"} px-1 pt-1 pb-5 rounded-[20rem] flex flex-col gap-1`}>
                            <img className="rounded-[20rem] h-20 object-cover m-auto" src={obtenerImagen(categoria.imagen)} alt="No se encontro la imagen" />
                            <h3 className="m-auto">{categoria.denominacion}</h3>
                        </button>
                    ))}
                </div>
                
                {/**Se muestran las subcategorias de la categoria seleccionada + Todos*/}
                <div className="mt-10 flex gap-5 text-xl">
                    
                    <button onClick={()=> setSubcategoriaSeleccionada("")} className={`${subcategoriaSeleccionada === "" ? "bg-[#D93F21]" : "bg-white text-black"} px-5 rounded-2xl uppercase`}>Todos</button>
                    
                    {(categorias.length > 0 && categoriaSeleccionada != "") && categorias[Number(categoriaSeleccionada)].subcategorias.map((subcat, index) => (
                        <button key={index} onClick={()=> setSubcategoriaSeleccionada(String(index))} className={`${String(index) === subcategoriaSeleccionada ? "bg-[#D93F21]" : "bg-white text-black"} px-5 rounded-2xl uppercase`}>{subcat.denominacion}</button>
                    ))}
                </div>

            </div>
            
            {/**Productos */}            
            <div className="px-[1%] pb-5">
                {/**Se muestran los productos segun los filtros */}
                <div className={`mt-10 grid ${articulosFiltrados.length > 0 ? ("grid-cols-3") : ""} gap-x-10 gap-y-5`}>
                    {articulosFiltrados.length > 0 ? articulosFiltrados.map((articulo, index)=>{
                        //La posicion del articulo debe ser menor a la cantidad
                        //que falta por mostrar 
                        //Y 
                        //Mayor o igual a la cantidad de articulos ya mostrados
                        //en paginas anteriores
                        if (index < articulosPorPagina*paginaSeleccionada && index >= articulosPorPagina*(paginaSeleccionada-1)) {
                            
                            return (
                                <ArticuloCardCatalogo key={articulo.id} articulo={articulo}/>
                            )
                        }

                    }
                    ) : (
                        <h1 className="text-2xl text-center">No se encuentran articulos</h1>
                    )}
                </div>

            </div>

            {/**Paginador */}
            <div className="p-[3%] m-auto flex justify-center">
                {articulosFiltrados.length > 0 && [...Array(Math.ceil(articulosFiltrados.length / articulosPorPagina))].map((_,index)=>{
                    const numeroPagina = index + 1;
                    return (
                        <button key={numeroPagina} onClick={()=>{setPaginaSeleccionada(numeroPagina)}} className={`p-5 ${numeroPagina === paginaSeleccionada ? "bg-[#D93F21] text-white " : "bg-white text-black border-1"}`}>
                            {numeroPagina}
                        </button>
                    )
                })}
            </div>

        </div>
        
        </>
    )

}