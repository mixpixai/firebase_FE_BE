
export interface AppUser {
    name: string,
    email: string | undefined,
    phone: string | undefined,
    id: string,
    ts: number,
    lut: number,
    tosTS: number| null,
    isAdmin?: boolean,
}
