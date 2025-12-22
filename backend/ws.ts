// server.ts

import { saveChatConversation } from "./services/chatService";

const clients = new Set<WebSocket>();

const server = Bun.serve({
  port: 3001,

  fetch(req, server) {
    //  HTTP → WebSocket
    if (server.upgrade(req)) return;

    return new Response("WebSocket Server Running");
  },

  websocket: {
    open(ws  : any) {
      clients.add(ws);
      console.log("Client connected:", clients.size);

      ws.send(JSON.stringify({ type: "info", msg: "Connected to server" }));
    },

   async message(ws, message) {
      const text = typeof message === "string" ? message : message.toString();
      console.log("Received:", text);
     console.log("Saved chat conversation", text);

      await saveChatConversation(
        {
          from: "test@test.com",
          to: "test2@test.com",
          msg: text,
        }
      );

      // Create structured packet
      const packet = JSON.stringify({
        type: "chat",
        msg: text,
        time: Date.now(),
      });
      
      // Broadcast to all connected clients
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(packet);
        }
      }
    },

    close(ws : any) {
      clients.delete(ws);
      console.log("Client disconnected:", clients.size);
    },
  }
});

console.log(`WebSocket server running on ws://localhost:${server.port}`);
