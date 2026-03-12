import React, { useState, useEffect, useRef } from 'react';
import '../../styles/ChatPage.css';
import { SenderType } from '../../types/chatMessage.types';

interface Message {
    messageID?: number;
    message: string;
    messageType: SenderType.Representative | SenderType.Customer;
    timestamp: string;
    senderName?: string;
}

interface ChatSectionProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    onCloseChat?: () => void;
    myType: SenderType.Representative | SenderType.Customer;
    myName: string;
    otherPartyName: string;
    isRepresentative: boolean;
}

const ChatSection: React.FC<ChatSectionProps> = ({
    messages,
    onSendMessage,
    onCloseChat,
    myType,
    myName,
    otherPartyName,
    isRepresentative
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // גלילה לסוף
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // פונקציית התאמת גובה (הייתה חסרה)
    const adjustHeight = () => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = '40px'; // גובה בסיס
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    // פונקציית שליחה מאוחדת (הייתה כפולה)
    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
            if (textAreaRef.current) {
                textAreaRef.current.style.height = '40px';
            }
        }
    };

    return (
        <div className="chat-page-container">
            <header className="chat-header">
                <h3>צ'אט עם {otherPartyName}</h3>
                {isRepresentative && (
                    <button className="close-chat-btn" onClick={onCloseChat}>
                   ☎️ סגור שיחה
                    </button>
                )}
            </header>

            <div className="messages-area">
                {messages.map((msg, index) => {
                    const isMe = msg.messageType === myType;
                    return (
                        <div key={index} className={`message-row ${isMe ? 'sent' : 'received'}`}>
                            <div className="bubble">
                                <div className="message-info-top">
                                    <span className="sender-name">{isMe ? "אני" : otherPartyName}</span>
                                    <span className="time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
                <textarea
                    ref={textAreaRef}
                    className="chat-input"
                    placeholder="הקלד הודעה..."
                    value={input}
                    rows={1}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    style={{ overflowY: 'hidden' }}
                />
                <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
                    שלח
                </button>
            </div>
        </div>
    );
};

export default ChatSection;