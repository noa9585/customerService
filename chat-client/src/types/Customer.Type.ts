// הבסיס המשותף לכולם
export type CustomerBase = {
    EmailCust: string;
}

// הרחבה לרישום
export type CustomerRegister = CustomerBase & {
    NameCust: string;
    PasswordCust: string;
}

// הרחבה להתחברות
export type CustomerLogin = CustomerBase & {
    PasswordCust: string;
}

// אובייקט לקוח "חי" במערכת (בלי סיסמה)
export type CustomerChat = CustomerBase & {
    IDCustomer: number;
    NameCust: string;
    Role: string;
}