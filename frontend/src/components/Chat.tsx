
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //log all the cookies in the console
    console.log("Cookies:", document.cookie);
    const socket = new WebSocket("ws://localhost:3001");
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        console.log("Invalid WebSocket message");
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(input);
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-lg mx-auto border border-gray-700 rounded-xl p-4 bg-gray-900 text-white h-[500px] flex flex-col">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className="p-2 bg-gray-800 rounded-md">
            {m.msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-800 rounded-md p-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 rounded-md font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
