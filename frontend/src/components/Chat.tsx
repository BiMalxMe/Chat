import { useEffect, useRef, useState } from "react";
import { ChatList } from "./Chatlist";
import { sendMessage } from "../utils/SendMessage";
import { Image } from "lucide-react";

interface Message {
  from: string;
  to: string;
  msg: string;
  time: string;
}

export default function Chat() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCookie = (name: string) =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];

  const userEmail = getCookie("email")
    ? decodeURIComponent(getCookie("email")!)
    : "Anonymous";

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!selectedUserEmail || !input.trim()) return;

    sendMessage({
      ws,
      from: userEmail,
      to: selectedUserEmail,
      msg: input,
      onSent: () => setInput(""),
    });
  };

  return (
    <div className="max-w-6xl mx-auto border border-gray-700 rounded-xl p-4 bg-gray-900 text-white h-[500px] flex">
      <ChatList
        selectedEmail={selectedUserEmail}
        onSelectUser={setSelectedUserEmail}
      />

      <div className="flex-1 flex flex-col p-3">
        <h1 className="text-xl font-bold mb-2">Chat</h1>

        {selectedUserEmail && (
          <p className="text-sm text-gray-400 mb-2">
            Chatting with: {selectedUserEmail}
          </p>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {/* summarize the chat button */}
<div className="flex justify-end w-full">
  <button className="ml-2 text-xs bg-green-700 px-2 py-1 rounded-md hover:bg-green-600">
    Summarize Chat
  </button>
</div>       
          {messages.map((m, idx) => (
            <div key={idx} className="p-2 bg-gray-800 rounded-md">
              <strong>{m.from}</strong>
              <span className="text-xs text-gray-400"> [{m.time}]</span>
              <div>{m.msg}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

      <div className="flex gap-2 mt-2 items-center">
  {/* Image Upload Button */}
  <label className="cursor-pointer text-gray-400 hover:text-white transition-colors">
    <Image size={24} />
    <input 
      type="file" 
      className="hidden"
      accept="image/*" 
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          // Handle your file upload logic here
          console.log("Selected file:", file);
        }
      }}
      disabled={!selectedUserEmail}
    />
  </label>

  <input
    className="flex-1 bg-gray-800 rounded-md p-2 focus:outline-none"
    placeholder={
      selectedUserEmail
        ? "Type a message..."
        : "Select a user to start chatting"
    }
    value={input}
    disabled={!selectedUserEmail}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSend()}
  />

  <button
    onClick={handleSend}
    disabled={!selectedUserEmail}
    className="bg-blue-600 px-4 py-2 rounded-md font-semibold disabled:opacity-50"
  >
    Send
  </button>
</div>
      </div>
    </div>
  );
}

