import { hash } from 'bcryptjs'

export class User {

    private _password: string;

    constructor(
        private readonly _name: string,
        private readonly _surname: string,
        private readonly _middleName: string,
        private readonly _email: string,
        private readonly _username: string,
    ) {}

    get name(): string {
        return this._email
    }

    get surname(): string {
        return this._surname;
    }

    get middleName(): string {
        return this._middleName;
    }

    get email(): string {
        return this._email;
    }

    get username(): string {
        return this._username;
    }

    get password(): string {
        return this._password;
    }

    public async setPassword(pass: string): Promise<void> {
        this._password = await hash(pass, 10);
    }

}