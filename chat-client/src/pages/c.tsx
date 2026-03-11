import React, { useState, useRef, useEffect } from 'react';
import './c.css';

interface ChatSectionProps {
    messages: any[];
    onSendMessage: (content: string) => void;
    sending: boolean;
    currentUserType: 'Representative' | 'Customer';
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages, onSendMessage, sending, currentUserType }) => {
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // גלילה אוטומטית למטה כשיש הודעה חדשה
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-list" ref={scrollRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.messageType === currentUserType ? 'me' : 'other'}`}>
                        <div className="message-bubble">
                            <p>{msg.message}</p>
                            <span className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-input-area">
                <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="הקלד הודעה..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                    className="btn-send" 
                    onClick={handleSend}
                    disabled={sending}
                >
                    {sending ? '...' : 'שלח'}
                </button>
            </div>
        </div>
    );
};

export default ChatSection;