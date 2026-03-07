// ה-DTO הבסיסי לקריאה (מה שחוזר מה-GetAll)
export type Topic = {
    idTopic: number;
    nameTopic: string;
    averageTreatTime: number;
    priorityTopics: number;
}

// ה-DTO ליצירת נושא חדש (ללא ה-ID, כי הוא נוצר ב-DB)
export type TopicAddDto = {
    nameTopic: string;
    averageTreatTime: number;
    priorityTopics: number;
}

// ה-DTO לעדכון (לפעמים זהה ל-Add, אבל טוב להפריד)
export type TopicUpdateDto = {
    idTopic: number;
    nameTopic: string;
    averageTreatTime: number;
    priorityTopics: number;
}

