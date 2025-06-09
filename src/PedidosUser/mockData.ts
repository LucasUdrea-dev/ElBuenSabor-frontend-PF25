// mockData.ts - Datos hardcodeados para pruebas
import { 
  Pedido, 
  DetallePedido, 
  DetallePromocion,
  EstadoPedido, 
  TypeState, 
  Articulo, 
  Promocion,
  Subcategoria,
  Categoria,
  Sucursal,
  Direccion,
  Usuario,
  TipoEnvio,
  TipoPago
} from "../../ts/Clases";

// Crear categorías
const categoria1 = new Categoria();
categoria1.id = 1;
categoria1.denominacion = "Hamburguesas";
categoria1.imagen = "https://example.com/hamburguesas.jpg";

const categoria2 = new Categoria();
categoria2.id = 2;
categoria2.denominacion = "Pizzas";
categoria2.imagen = "https://example.com/pizzas.jpg";

// Crear subcategorías
const subcategoria1 = new Subcategoria();
subcategoria1.id = 1;
subcategoria1.denominacion = "Clásicas";
subcategoria1.categoria = categoria1;

const subcategoria2 = new Subcategoria();
subcategoria2.id = 2;
subcategoria2.denominacion = "Gourmet";
subcategoria2.categoria = categoria2;

// Crear artículos
const articulo1 = new Articulo();
articulo1.id = 1;
articulo1.nombre = "Hamburguesa Clásica";
articulo1.descripcion = "Hamburguesa con carne, lechuga, tomate y queso";
articulo1.precio = 850;
articulo1.existe = true;
articulo1.esParaElaborar = true;
articulo1.imagen = "https://example.com/hamburguesa-clasica.jpg";
articulo1.subcategoria = subcategoria1;

const articulo2 = new Articulo();
articulo2.id = 2;
articulo2.nombre = "Pizza Margherita";
articulo2.descripcion = "Pizza con salsa de tomate, mozzarella y albahaca";
articulo2.precio = 1200;
articulo2.existe = true;
articulo2.esParaElaborar = true;
articulo2.imagen = "https://example.com/pizza-margherita.jpg";
articulo2.subcategoria = subcategoria2;

const articulo3 = new Articulo();
articulo3.id = 3;
articulo3.nombre = "Papas Fritas";
articulo3.descripcion = "Papas fritas crocantes";
articulo3.precio = 450;
articulo3.existe = true;
articulo3.esParaElaborar = false;
articulo3.imagen = "https://example.com/papas-fritas.jpg";
articulo3.subcategoria = subcategoria1;

const articulo4 = new Articulo();
articulo4.id = 4;
articulo4.nombre = "Gaseosa Cola";
articulo4.descripcion = "Bebida cola 500ml";
articulo4.precio = 300;
articulo4.existe = true;
articulo4.esParaElaborar = false;
articulo4.imagen = "https://example.com/cola.jpg";
articulo4.subcategoria = subcategoria1;

// Crear promociones
const promocion1 = new Promocion();
promocion1.id = 1;
promocion1.denominacion = "Combo Hamburguesa";
promocion1.descripcion = "Hamburguesa + Papas + Gaseosa";
promocion1.precioRebajado = 1200;
promocion1.existe = true;
promocion1.imagen = "https://example.com/combo-hamburguesa.jpg";

const promocion2 = new Promocion();
promocion2.id = 2;
promocion2.denominacion = "Pizza Familiar";
promocion2.descripcion = "Pizza grande + 2 Gaseosas";
promocion2.precioRebajado = 1800;
promocion2.existe = true;
promocion2.imagen = "https://example.com/pizza-familiar.jpg";

// Crear dirección
const direccion = new Direccion();
direccion.id = 1;
direccion.nombre_calle = "San Martín";
direccion.numeracion = "454";
direccion.alias = "Casa";
direccion.text_area = "Entre Rivadavia y Belgrano";
direccion.existe = true;

// Crear sucursal
const sucursal = new Sucursal();
sucursal.id = 1;
sucursal.nombre = "Sucursal Centro";
sucursal.horaApertura = "10:00";
sucursal.horaCierre = "23:00";
sucursal.existe = true;
sucursal.direccion = direccion;

// Crear estados de pedido
const estadoEnCamino = new EstadoPedido();
estadoEnCamino.id = 1;
estadoEnCamino.nombre_estado = TypeState.EN_CAMINO;

const estadoListo = new EstadoPedido();
estadoListo.id = 2;
estadoListo.nombre_estado = TypeState.LISTO;

const estadoEntregado = new EstadoPedido();
estadoEntregado.id = 3;
estadoEntregado.nombre_estado = TypeState.ENTREGADO;

const estadoCancelado = new EstadoPedido();
estadoCancelado.id = 4;
estadoCancelado.nombre_estado = TypeState.CANCELADO;

// Crear usuario
const usuario = new Usuario();
usuario.id = 1;
usuario.nombre = "Juan";
usuario.apellido = "Pérez";
usuario.email = "juan.perez@email.com";
usuario.telefono = "+54 261 123-4567";
usuario.existe = true;

// Crear tipo de envío
const tipoEnvio = new TipoEnvio();
tipoEnvio.id = 1;

// Crear tipo de pago
const tipoPago = new TipoPago();
tipoPago.id = 1;

// Crear detalles de pedido
const detallePedido1 = new DetallePedido();
detallePedido1.id = 1;
detallePedido1.articulo = articulo1;
detallePedido1.cantidad = 2;

const detallePedido2 = new DetallePedido();
detallePedido2.id = 2;
detallePedido2.articulo = articulo3;
detallePedido2.cantidad = 1;

const detallePedido3 = new DetallePedido();
detallePedido3.id = 3;
detallePedido3.articulo = articulo4;
detallePedido3.cantidad = 2;

const detallePedido4 = new DetallePedido();
detallePedido4.id = 4;
detallePedido4.articulo = articulo2;
detallePedido4.cantidad = 1;

const detallePedido5 = new DetallePedido();
detallePedido5.id = 5;
detallePedido5.articulo = articulo1;
detallePedido5.cantidad = 1;

const detallePedido6 = new DetallePedido();
detallePedido6.id = 6;
detallePedido6.articulo = articulo3;
detallePedido6.cantidad = 2;

// Crear detalles de promoción
const detallePromocion1 = new DetallePromocion();
detallePromocion1.id = 1;
detallePromocion1.promocion = promocion1;
detallePromocion1.cantidad = 1;

const detallePromocion2 = new DetallePromocion();
detallePromocion2.id = 2;
detallePromocion2.promocion = promocion2;
detallePromocion2.cantidad = 1;

// Crear pedidos mock
export const pedidosMock: Pedido[] = [
  // Pedido 1 - EN CAMINO
  {
    id: 1001,
    tiempoEstimado: new Date(2025, 5, 2, 20, 30), // 20:30 de hoy
    existe: true,
    fecha: new Date(2025, 5, 2, 19, 45), // Hace 45 minutos
    detallePedidoList: [detallePedido1, detallePedido2, detallePedido3],
    detallePromocionList: [detallePromocion1],
    estadoPedido: estadoEnCamino,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario
  },
  
  // Pedido 2 - LISTO
  {
    id: 1002,
    tiempoEstimado: new Date(2025, 5, 2, 20, 15), // 20:15 de hoy
    existe: true,
    fecha: new Date(2025, 5, 2, 19, 30), // Hace 1 hora
    detallePedidoList: [detallePedido4],
    detallePromocionList: [],
    estadoPedido: estadoListo,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario
  },
  
  // Pedido 3 - ENTREGADO (ayer)
  {
    id: 1003,
    tiempoEstimado: new Date(2025, 5, 1, 21, 0), // 21:00 de ayer
    existe: true,
    fecha: new Date(2025, 5, 1, 20, 15), // Ayer
    detallePedidoList: [detallePedido5, detallePedido6],
    detallePromocionList: [detallePromocion2],
    estadoPedido: estadoEntregado,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario
  },
  
  // Pedido 4 - CANCELADO
  {
    id: 1004,
    tiempoEstimado: new Date(2025, 5, 1, 19, 30),
    existe: true,
    fecha: new Date(2025, 5, 1, 18, 45),
    detallePedidoList: [
      {
        id: 7,
        articulo: articulo1,
        cantidad: 1
      },
      {
        id: 8,
        articulo: articulo4,
        cantidad: 1
      }
    ],
    detallePromocionList: [],
    estadoPedido: estadoCancelado,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario
  },
  
  // Pedido 5 - ENTREGADO (hace una semana)
  {
    id: 1005,
    tiempoEstimado: new Date(2025, 4, 26, 22, 0),
    existe: true,
    fecha: new Date(2025, 4, 26, 21, 15),
    detallePedidoList: [
      {
        id: 9,
        articulo: articulo2,
        cantidad: 2
      },
      {
        id: 10,
        articulo: articulo4,
        cantidad: 3
      }
    ],
    detallePromocionList: [],
    estadoPedido: estadoEntregado,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario
  }
];