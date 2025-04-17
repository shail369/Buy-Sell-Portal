import React, { useState, useEffect } from "react";
import { 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  RefreshCw 
} from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initiateChat();
  }, []);

  const initiateChat = async () => {
    const token = localStorage.getItem("authToken");
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot/initiate",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        const modifiedHistory = data.history.slice(1).map((msg) => ({
          role: msg.role === "Model" ? "bot" : "user",
          content: msg.text,
        }));
        setMessages(modifiedHistory);
      } else {
        setMessages([{ role: "bot", content: data.message }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages([
        { role: "bot", content: "Sorry, I couldn't process that." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    const token = localStorage.getItem("authToken");
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const message = await fetch("http://localhost:5000/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ message: input }),
      });
      const response = await message.json();
      if (response.success) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: response.botMessage },
        ]);
      } else {
        console.error("Chatbot error:", response.message);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Sorry, I couldn't process that." },
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I couldn't process that." },
      ]);
    }

    setInput("");
  };

  if (isLoading) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-loading">
          <RefreshCw className="spin-icon" size={24} />
          <p>Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chatbot-header">
          <h2>AI Chatbot</h2>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'bot' ? <Bot size={16} className="message-icon" /> : <User size={16} className="message-icon" />}
              <span className="message-content">{msg.content}</span>
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>
            <Send size={20} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;