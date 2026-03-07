export type RepresentativeChat = {
    IDRepresentative: number;
    NameRepr: string;
    Role: string;
}

export type RepresentativeDto = {

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

export type RepresentativeLoginDto = {
    EmailRepr: string;
    PasswordRepr: string;
}
export type RepresentativeRegister = RepresentativeLoginDto & {
    NameRepr: string;
}
export type RepresentativeUpdate = RepresentativeRegister & {}