export type RepresentativeChat = {
    idRepresentative: number;
    nameRepr: string;
    role: string;
}

export type Representative = {

    idRepresentative: number;
    nameRepr: string;
    role: string;
    emailRepr: string;
    scoreForMonth: number;
    entryHourRepr: string;// "HH:mm:ss"
    exitHourRepr: string;// "HH:mm:ss"
    statusRepr: boolean;
    isOnline: boolean;
    isBusy: boolean;
    token: string | null;
}

export type RepresentativeLogin = {
    emailRepr: string;
    passwordRepr: string;
}
export type RepresentativeRegister = RepresentativeLogin & {
    nameRepr: string;
}
export type RepresentativeUpdate = RepresentativeRegister & {}