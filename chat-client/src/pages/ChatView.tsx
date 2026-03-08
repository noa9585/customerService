import React, { useEffect, useRef, useState } from 'react';
import '../styles/ChatView.css';

type Message = {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time?: string;
};

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'other', text: 'היי! איך אפשר לעזור היום?' },
    { id: 2, sender: 'me', text: 'שלום, יש לי שאלה לגבי הזמנת שירות.' },
    { id: 3, sender: 'other', text: 'בשמחה — ספר לי מה העניין בקצרה.' },
  ]);
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(4);

  useEffect(() => {
    // Scroll to bottom on messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const newMsg: Message = { id: nextId.current++, sender: 'me', text: text.trim() };
    setMessages(prev => [...prev, newMsg]);
    setText('');

    // simulated reply after short delay
    setTimeout(() => {
      const reply: Message = { id: nextId.current++, sender: 'other', text: 'תודה על הפנייה — נבדוק ונחזור אליך בהקדם.' };
      setMessages(prev => [...prev, reply]);
    }, 900);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <header className="chat-header">
          <div className="avatar">👥</div>
          <div className="chat-title">צ'אט תמיכה</div>
        </header>

        <div className="chat-list" ref={listRef} dir="rtl">
          {messages.map(m => (
            <div key={m.id} className={m.sender === 'me' ? 'message-row me' : 'message-row other'}>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
        </div>

        <form className="chat-input" onSubmit={handleSend} dir="rtl">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="כתוב הודעה... (Enter לשורה חדשה, לחץ על שלח לשליחה)"
            aria-label="הודעה"
          />
          <button type="submit">שלח</button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
