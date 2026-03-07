export type RepresentativeChat = {
    IDRepresentative: number;
    NameRepr: string;
    Role: string;
}

export type Representative = {

    IDRepresentative: number;
    NameRepr: string;
    Role: string;
    EmailRepr: string;
    ScoreForMonth: number;
    entryHourRepr: string;// "HH:mm:ss"
    exitHourRepr: string;// "HH:mm:ss"
    StatusRepr: boolean;
    IsOnline: boolean;
    IsBusy: boolean;
}

export type RepresentativeLogin = {
    EmailRepr: string;
    PasswordRepr: string;
}
export type RepresentativeRegister = RepresentativeLogin & {
    NameRepr: string;
}
export type RepresentativeUpdate = RepresentativeRegister & {}