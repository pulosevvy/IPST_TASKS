import {compare, hash} from 'bcryptjs'

export class User {

    private _password: string;

    constructor(
        private readonly _name: string,
        private readonly _surname: string,
        private readonly _middleName: string | null,
        private readonly _email: string,
        private readonly _username: string | null,
        passwordHash?: string
    ) {
        if (passwordHash) {
            this._password = passwordHash;
        }
    }

    get name(): string {
        return this._name;
    }

    get surname(): string {
        return this._surname;
    }

    get middleName(): string | null {
        if(this._middleName) {
            return this._middleName;
        }
        return null;
    }

    get email(): string {
        return this._email;
    }

    get username(): string | null {
        if (this._username) {
            return this._username;
        }
        return null;
    }

    get password(): string {
        return this._password;
    }

    public async setPassword(pass: string, salt: number): Promise<void> {
        this._password = await hash(pass, salt);
    }

    public async comparePassword(pass: string): Promise<boolean> {
        return compare(pass, this._password);
    }

}