// הבסיס המשותף לכולם
export type CustomerBase = {
    emailCust: string;
}

// הרחבה לרישום
export type CustomerRegister = CustomerBase & {
    nameCust: string;
    passwordCust: string;
}

// הרחבה להתחברות
export type CustomerLogin = CustomerBase & {
    passwordCust: string;
}

// אובייקט לקוח "חי" במערכת (בלי סיסמה)
export type CustomerChat = CustomerBase & {
    idCustomer: number;
    nameCust: string;
    role: string;
    token: string | null;
    isOnline: boolean;
}