// ChatSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import '../../styles/ChatPage.css';

interface Message {
    messageID?: number;
    message: string;
    messageType: 'Representative' | 'Customer';
    timestamp: string;
    senderName?: string;
}

interface ChatSectionProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    onCloseChat?: () => void;
    myType: 'Representative' | 'Customer';
    otherPartyName: string;
    isRepresentative: boolean;
}

const ChatSection: React.FC<ChatSectionProps> = ({ 
    messages, 
    onSendMessage, 
    onCloseChat, 
    myType, 
    otherPartyName, 
    isRepresentative 
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // גלילה אוטומטית לסוף בכל פעם שמתווספת הודעה חדשה
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput(''); // איפוס תיבת הטקסט לאחר השליחה
        }
    };

    return (
        <div className="chat-page-container">
            <header className="chat-header">
                <h3>צ'אט עם {otherPartyName}</h3>
                {isRepresentative && <button className="close-chat-btn" onClick={onCloseChat}>סגור שיחה</button>}
            </header>

            <div className="messages-area">
                {messages.map((msg, index) => {
                    const isMe = msg.messageType === myType; 
                    return (
                        <div key={index} className={`message-row ${isMe ? 'sent' : 'received'}`}>
                            <div className="bubble">
                                <div className="message-info-top">
                                    <span className="sender-name">{isMe ? "אני" : otherPartyName}</span>
                                    <span className="time">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* זו תיבת הטקסט שחייבת להופיע */}
            <div className="chat-footer">
                <input 
                    type="text"
                    className="chat-input"
                    placeholder="הקלד הודעה..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
                    שלח
                </button>
            </div>
        </div>
    );
};

export default ChatSection;