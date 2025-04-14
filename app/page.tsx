"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Something went wrong" },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <main className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 px-4 py-3 rounded-xl text-sm whitespace-pre-wrap max-w-2xl w-fit shadow-md ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-zinc-800 text-gray-200 self-start mr-auto border border-zinc-700"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </main>

      <footer className="bg-zinc-900 p-4 w-full border-t border-zinc-700">
        <div className="max-w-3xl mx-auto flex gap-2">
          <textarea
            className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </footer>
    </div>
  );
}