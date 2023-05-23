import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([] as any);
  const [inputValue, setInputValue] = useState("");
  // const [socket, setSocket] = useState(null);
  const socket = io("http://localhost:8000/", {
      path: "/socket",
    });

  useEffect(() => {
    // const newSocket = io("http://localhost:8000/", {
    //   path: "/socket",
    // });
    // setSocket(newSocket as any);

    socket?.on("chat message", (message) => {
      setMessages((prevMessages: any) => [...prevMessages, message]);
    });

    socket?.on("teste", () => {
      alert("mensagem de teste");
    });

    return () => {
      // Clean up event listeners
      socket?.off("chat message");
    };
  }, []);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const message = inputValue.trim();

    if (message !== "") {
      // Emit the message to the server
      socket?.emit("chat message", message);
      setInputValue("");
    }
  };

  return (
    <div>
      <ul>
        {messages.map((message: any, index: any) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
