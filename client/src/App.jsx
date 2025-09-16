import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const App = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]); // store chat history
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      toast.success(`You connected with id: ${newSocket.id}`);
    });

    // listen for messages
    newSocket.on("receive-message", (message) => {
      displayMessage(message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  function displayMessage(message) {
    setMessages((prev) => [...prev, message]);
  }

  function handleSubmit() {
    if (socket && msg.trim() !== "") {
      socket.emit("send-message", msg);
      displayMessage(msg); // also add it locally as "sent"
      setMsg("");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg flex flex-col">
        {/* Room ID input */}
        <div className="p-4 border-b flex gap-2">
          <input
            type="text"
            placeholder="Enter Room ID"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
            Join
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg w-max ${
                i % 2 === 0 ? "bg-gray-200" : "bg-blue-500 text-white ml-auto"
              }`}
            >
              {m}
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t flex gap-2">
          <input
            value={msg}
            type="text"
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
