import  {ChatMessage}  from './chatMessage.Type';

// הגדרת ה-Enum עבור מצב השיחה
export enum SessionStatus {
    Waiting = 0,
    Active = 1,
    Close = 2,
}

// תואם ל-ChatSessionCreateDto
export type ChatSessionCreate ={
    idCustomer: number;
    idTopic: number;
}

// תואם ל-ChatSessionDto
export type ChatSession= {
    sessionID: number;
    messages: ChatMessage[]; // רשימת ההודעות בשיחה
    startTimestamp: Date | string;
    serviceStartTimestamp: Date | string;
    endTimestamp?: Date | string | null; // שדה אופציונלי (Nullable)
    estimatedWaitTime: number;
    statusChat: SessionStatus;
    status: boolean;
    idRepresentative?: number | null; // שדה אופציונלי
    idCustomer: number;
    idTopic: number;
}

// תואם ל-ChatSessionUpdateDto
export type ChatSessionUpdate ={
    serviceStartTimestamp: Date | string;
    endTimestamp?: Date | string | null;
    statusChat: SessionStatus;
    estimatedWaitTime: number;
    status: boolean;
    idRepresentative?: number | null;
}