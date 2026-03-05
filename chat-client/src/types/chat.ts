// מבוסס על Topic.cs
export interface Topic {
    idTopic: number;
    nameTopic: string;
    averageTreatTime: number;
    priorityTopics: number;
}

// מבוסס על Customer.cs
export interface Customer {
    idCustomer: number;
    nameCust: string;
    emailCust: string;
}

// מבוסס על ChatSession.cs
export interface ChatSession {
    sessionID: number;
    idCustomer: number;
    idTopic: number;
    idRepresentative?: number;
    statusChat: 'Waiting' | 'Active' | 'Close';
    estimatedWaitTime: number;
    startTimestamp: string;
    serviceStartTimestamp?: string;
    endTimestamp?: string;
}

// מבוסס על ChatMessage.cs
export interface ChatMessage {
    messageID: number;
    idSession: number;
    message: string;
    timestamp: string;
    idSend: number;
    messageType: 'Customer' | 'Representative';
}