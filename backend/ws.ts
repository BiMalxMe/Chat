// server.ts

const server = Bun.serve({
  port: 3001,
  fetch(req, server) {
    // Upgrade HTTP → WebSocket
    if (server.upgrade(req)) return;

    return new Response("WebSocket Server Running");
  },

  websocket: {
    open(ws) {
      console.log("Client connected");
      ws.send("Welcome to Bun WebSocket server!");
    },

    message(ws, message) {
      console.log("Received:", message);
      ws.send(`Server echo: ${message}`);
    },

    close(ws) {
      console.log("Client disconnected");
    },
  }
});

console.log(`WebSocket server running on ws://localhost:${server.port}`);
