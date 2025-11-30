import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { host } from "../../../ts/Clases";

interface WebSocketContextType {
  stompClient: Client | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(host + "/ws"),
      reconnectDelay: 5000, // Intenta reconectar si se cae
      onConnect: () => {
        console.log("✅ Conectado al WebSocket");
        setIsConnected(true);
      },
      onDisconnect: () => {
        console.log("❌ Desconectado");
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("Error STOMP: " + frame.headers["message"]);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) client.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ stompClient, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket debe usarse dentro de un WebSocketProvider");
  return context;
};
