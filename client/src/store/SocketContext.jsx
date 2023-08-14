import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

// Creating the socket context
const SocketContext = createContext(null);

// Custom hook to use the socketContext
export function useSocket() {
  const ctx = useContext(SocketContext);
  return ctx;
}

// Providing the socket context
export function SocketProvider(props) {
  //for development "localhost:8000";
  const socket = useMemo(() => io("livehost-server.up.railway.app"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}
