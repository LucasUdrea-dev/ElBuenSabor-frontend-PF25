import { useEffect, useState, useCallback, useRef } from "react";
import { useWebSocket } from "./WebSocketContext";
import { Pedido } from "../../../ts/Clases";

export const usePedidosSocket = (
  topic: string,
  estadosPermitidos: string[]
) => {
  const { stompClient, isConnected } = useWebSocket();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Usamos un ref para 'estadosPermitidos' para evitar reconexiones innecesarias
  // si el array se pasa inline en el componente.
  const estadosRef = useRef(estadosPermitidos);
  estadosRef.current = estadosPermitidos;

  // LÓGICA CENTRALIZADA: Qué hacer cuando llega un mensaje
  const handleIncomingMessage = useCallback((pedidoRecibido: Pedido) => {
    setPedidos((prevPedidos) => {
      const esEstadoValido = estadosRef.current.includes(
        pedidoRecibido.estadoPedido.nombreEstado
      );
      const existe = prevPedidos.find((p) => p.id === pedidoRecibido.id);

      if (esEstadoValido) {
        // CASO 1: El estado es válido para esta pantalla
        if (existe) {
          // Si ya estaba, lo actualizamos (ej: cambió de precio o detalles)
          return prevPedidos.map((p) =>
            p.id === pedidoRecibido.id ? pedidoRecibido : p
          );
        } else {
          // Si no estaba, es nuevo, lo agregamos
          return [...prevPedidos, pedidoRecibido];
        }
      } else {
        // CASO 2: El estado YA NO es válido (ej: se canceló o pasó a otra área)
        if (existe) {
          // Si existía en pantalla, HAY QUE BORRARLO
          return prevPedidos.filter((p) => p.id !== pedidoRecibido.id);
        }
        // Si no existía y no es válido, no hacemos nada (ignoramos)
        return prevPedidos;
      }
    });
  }, []);

  useEffect(() => {
    if (isConnected && stompClient) {
      const subscription = stompClient.subscribe(topic, (message) => {
        const pedido: Pedido = JSON.parse(message.body);
        handleIncomingMessage(pedido);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConnected, stompClient, topic, handleIncomingMessage]);

  return { pedidos, setPedidos };
};
