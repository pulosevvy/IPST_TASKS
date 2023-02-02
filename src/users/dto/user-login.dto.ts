import {IsEmail, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UserLoginDto {
    @MinLength(2, {message: 'Минимум 2 символа'})
    @MaxLength(255, {message: 'Максимум 255 символов'})
    @IsEmail({}, {message: 'Неверно указан email'})
    email: string;

    @MinLength(8, {message: 'Минимум 8 символов'})
    @MaxLength(16, {message: 'Максимум 16 символов'})
    @IsString({message: 'Не введён пароль'})
    password: string;
}