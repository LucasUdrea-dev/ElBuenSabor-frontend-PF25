// mockData.ts - Datos hardcodeados para pruebas
import { 
  Pedido, 
  DetallePedido, 
  DetallePromocion,
  EstadoPedido, 
  TypeState, 
  ArticuloVentaDTO,
  Promocion,
  Subcategoria,
  Categoria,
  Sucursal,
  Direccion,
  DireccionPedido,
  Usuario,
  TipoEnvio,
  TipoPago,
  UnidadMedida,
  Ciudad,
  Provincia,
  Pais
} from "../../ts/Clases";

// Crear país, provincia y ciudad
const pais = new Pais();
pais.id = 1;
pais.nombre = "Argentina";

const provincia = new Provincia();
provincia.id = 1;
provincia.nombre = "Mendoza";
provincia.pais = pais;

const ciudad = new Ciudad();
ciudad.id = 1;
ciudad.nombre = "Mendoza";
ciudad.provincia = provincia;

// Crear unidad de medida
const unidadMedida = new UnidadMedida();
unidadMedida.id = 1;
unidadMedida.unidad = "unidad";

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

// Crear artículos usando ArticuloVentaDTO para los detalles de pedido
const articuloVenta1 = new ArticuloVentaDTO();
articuloVenta1.id = 1;
articuloVenta1.nombre = "Hamburguesa Clásica";
articuloVenta1.descripcion = "Hamburguesa con carne, lechuga, tomate y queso";
articuloVenta1.precio = 850;
articuloVenta1.imagen = "https://example.com/hamburguesa-clasica.jpg";
articuloVenta1.subcategoria = subcategoria1;
articuloVenta1.insumos = []; // Array vacío para productos elaborados
articuloVenta1.tiempoEstimado = "15 minutos";

const articuloVenta2 = new ArticuloVentaDTO();
articuloVenta2.id = 2;
articuloVenta2.nombre = "Pizza Margherita";
articuloVenta2.descripcion = "Pizza con salsa de tomate, mozzarella y albahaca";
articuloVenta2.precio = 1200;
articuloVenta2.imagen = "https://example.com/pizza-margherita.jpg";
articuloVenta2.subcategoria = subcategoria2;
articuloVenta2.insumos = [];
articuloVenta2.tiempoEstimado = "20 minutos";

const articuloVenta3 = new ArticuloVentaDTO();
articuloVenta3.id = 3;
articuloVenta3.nombre = "Papas Fritas";
articuloVenta3.descripcion = "Papas fritas crocantes";
articuloVenta3.precio = 450;
articuloVenta3.imagen = "https://example.com/papas-fritas.jpg";
articuloVenta3.subcategoria = subcategoria1;
articuloVenta3.insumos = [];
articuloVenta3.tiempoEstimado = "10 minutos";

const articuloVenta4 = new ArticuloVentaDTO();
articuloVenta4.id = 4;
articuloVenta4.nombre = "Gaseosa Cola";
articuloVenta4.descripcion = "Bebida cola 500ml";
articuloVenta4.precio = 300;
articuloVenta4.imagen = "https://example.com/gaseosa-cola.jpg";
articuloVenta4.subcategoria = subcategoria1;
articuloVenta4.insumos = [];
articuloVenta4.tiempoEstimado = "0 minutos";

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
direccion.nombreCalle = "San Martín";
direccion.numeracion = "454";
direccion.alias = "Casa";
direccion.descripcionEntrega = "Entre Rivadavia y Belgrano";
direccion.existe = true;
direccion.latitud = -32.8895;
direccion.longitud = -68.8458;
direccion.ciudad = ciudad;

// Crear dirección de pedido
const direccionPedido = new DireccionPedido();
direccionPedido.id = 1;
direccionPedido.direccion = direccion;

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
estadoEnCamino.nombreEstado = "EN CAMINO";
estadoEnCamino.nombreEstado = TypeState.EN_CAMINO;

const estadoListo = new EstadoPedido();
estadoListo.id = 2;
estadoListo.nombreEstado = "LISTO";
estadoListo.nombreEstado = TypeState.LISTO;

const estadoEntregado = new EstadoPedido();
estadoEntregado.id = 3;
estadoEntregado.nombreEstado = "ENTREGADO";
estadoEntregado.nombreEstado = TypeState.ENTREGADO;

const estadoCancelado = new EstadoPedido();
estadoCancelado.id = 4;
estadoCancelado.nombreEstado = "CANCELADO";
estadoCancelado.nombreEstado = TypeState.CANCELADO;

// Crear usuario
const usuario = new Usuario();
usuario.id = 1;
usuario.nombre = "Juan";
usuario.apellido = "Pérez";
usuario.email = "juan.perez@email.com";
usuario.telefono = "+54 261 123-4567";
usuario.existe = true;
usuario.contrasena = "";
usuario.repetirContrasena = "";

// Crear tipo de envío
const tipoEnvio = new TipoEnvio();
tipoEnvio.id = 1;
tipoEnvio.tipoDelivery = "Delivery";

// Crear tipo de pago
const tipoPago = new TipoPago();
tipoPago.id = 1;
tipoPago.tipoPago = "Efectivo";

// Crear detalles de pedido
const detallePedido1 = new DetallePedido();
detallePedido1.id = 1;
detallePedido1.articulo = articuloVenta1;
detallePedido1.cantidad = 2;

const detallePedido2 = new DetallePedido();
detallePedido2.id = 2;
detallePedido2.articulo = articuloVenta3;
detallePedido2.cantidad = 1;

const detallePedido3 = new DetallePedido();
detallePedido3.id = 3;
detallePedido3.articulo = articuloVenta4;
detallePedido3.cantidad = 2;

const detallePedido4 = new DetallePedido();
detallePedido4.id = 4;
detallePedido4.articulo = articuloVenta2;
detallePedido4.cantidad = 1;

const detallePedido5 = new DetallePedido();
detallePedido5.id = 5;
detallePedido5.articulo = articuloVenta1;
detallePedido5.cantidad = 1;

const detallePedido6 = new DetallePedido();
detallePedido6.id = 6;
detallePedido6.articulo = articuloVenta3;
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
    tiempoEstimado: "30 minutos",
    existe: true,
    fecha: new Date(2025, 5, 2, 19, 45).toLocaleString(), // Hace 45 minutos
    detallePedidoList: [detallePedido1, detallePedido2, detallePedido3],
    detallePromocionList: [detallePromocion1],
    estadoPedido: estadoEnCamino,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario,
    direccionPedido: direccionPedido
  },
  
  // Pedido 2 - LISTO
  {
    id: 1002,
    tiempoEstimado: "0 minutos",
    existe: true,
    fecha: new Date(2025, 5, 2, 19, 30).toLocaleString(), // Hace 1 hora
    detallePedidoList: [detallePedido4],
    detallePromocionList: [],
    estadoPedido: estadoListo,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario,
    direccionPedido: direccionPedido
  },
  
  // Pedido 3 - ENTREGADO (ayer)
  {
    id: 1003,
    tiempoEstimado: "0 minutos",
    existe: true,
    fecha: new Date(2025, 5, 1, 20, 15).toLocaleString(), // Ayer
    detallePedidoList: [detallePedido5, detallePedido6],
    detallePromocionList: [detallePromocion2],
    estadoPedido: estadoEntregado,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario,
    direccionPedido: direccionPedido
  },
  
  // Pedido 4 - CANCELADO
  {
    id: 1004,
    tiempoEstimado: "0 minutos",
    existe: true,
    fecha: new Date(2025, 5, 1, 18, 45).toLocaleString(),
    detallePedidoList: [
      {
        id: 7,
        articulo: articuloVenta1,
        cantidad: 1
      },
      {
        id: 8,
        articulo: articuloVenta4,
        cantidad: 1
      }
    ],
    detallePromocionList: [],
    estadoPedido: estadoCancelado,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario,
    direccionPedido: direccionPedido
  },
  
  // Pedido 5 - ENTREGADO (hace una semana)
  {
    id: 1005,
    tiempoEstimado: "0 minutos",
    existe: true,
    fecha: new Date(2025, 4, 26, 21, 15).toLocaleString(),
    detallePedidoList: [
      {
        id: 9,
        articulo: articuloVenta2,
        cantidad: 2
      },
      {
        id: 10,
        articulo: articuloVenta4,
        cantidad: 3
      }
    ],
    detallePromocionList: [],
    estadoPedido: estadoEntregado,
    sucursal: sucursal,
    tipoEnvio: tipoEnvio,
    tipoPago: tipoPago,
    usuario: usuario,
    direccionPedido: direccionPedido
  }
];