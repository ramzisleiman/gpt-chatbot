'use client';
import { useState, useRef, useEffect } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);
    setMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: String(data.response) }]);
    } } catch (error) {
        console.error('sendMessage error:', error);
        setMessages([...newMessages, { role: 'assistant', content: '⚠️ Something went wrong' }]);
      }
      

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4 text-center text-xl font-bold flex items-center justify-center gap-2">
        <span>🧠</span> GPT Chatbot
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl mx-auto p-3 rounded-xl whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white text-right'
                : 'bg-white text-black text-left border'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      <footer className="p-4 bg-white shadow flex gap-2">
        <textarea
          className="flex-1 p-2 border rounded resize-none"
          rows={2}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </footer>
    </div>
  );
}
