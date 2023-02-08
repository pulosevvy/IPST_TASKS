import { IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @IsString({message: 'Строковое значение'})
    login: string;

    @IsString({message: 'Строковое значение'})
    password: string;
}