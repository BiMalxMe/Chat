import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      const socket = io('http://localhost:3000', {
        withCredentials: true, // Send cookies
      });

      setSocket(socket);

      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
