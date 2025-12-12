import { useEffect, useRef, useState } from "react";
import { ChatList } from "./Chatlist";

interface Message {
  user: string;
  msg: string;
  time: string;
}

export default function Chat() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // cookie reader
  const getCookie = (name: string) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  const userName = getCookie("name")
    ? decodeURIComponent(getCookie("name")!)
    : "Anonymous";

  // websocket
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    setWs(socket);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        console.log("Invalid message received:", event.data);
      }
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          user: userName,
          msg: input,
          time: new Date().toLocaleTimeString(),
        })
      );
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-6xl mx-auto border border-gray-700 rounded-xl p-4 bg-gray-900 text-white h-[500px] flex">

      {/* LEFT SIDEBAR */}
      <ChatList />

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col p-3">
        <h1 className="text-xl font-bold mb-4">Chat</h1>

        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((m, idx) => (
            <div key={idx} className="p-2 bg-gray-800 rounded-md">
              <strong>{m.user}</strong>{" "}
              <span className="text-xs text-gray-400">[{m.time}]</span>
              <div>{m.msg}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 bg-gray-800 rounded-md p-2 focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 rounded-md font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
