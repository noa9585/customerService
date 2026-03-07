// הגדרת ה-Enum עבור סוג השולח (בהתאם למימוש ב-C#)
export enum SenderType {
    Customer = 0,
    Representative = 1
}

// תואם ל-ChatMessageChatDto
export type ChatMessageChatDto={
    message: string;
    idSession: number;
    timestamp: Date | string; // ב-JSON תאריכים עוברים לרוב כסטרינג
    idSend: number;
    messageType: SenderType;
}

// תואם ל-ChatMessageDto
export type ChatMessage={
    messageID: number;
    idSession: number;
    message: string;
    timestamp: Date | string;
    idSend: number;
    messageType: SenderType;
    statusMessage: boolean;
}

// תואם ל-ChatMessageSendDto
export type ChatMessageSend= {
    message: string;
    idSession: number;
    timestamp: Date | string;
    messageType: SenderType;
}