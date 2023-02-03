import {IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class UserCreateDto {
    @MinLength(2, {message: 'Минимум 2 символа'})
    @MaxLength(255, {message: 'Максимум 255 символов'})
    @IsString({message: 'Не указано имя'})
    name: string;

    @MinLength(2, {message: 'Минимум 2 символа'})
    @MaxLength(255, {message: 'Максимум 255 символов'})
    @IsString({message: 'Не указано имя'})
    surname: string;

    @IsOptional()
    @MinLength(2, {message: 'Минимум 2 символа'})
    @MaxLength(255, {message: 'Максимум 255 символов'})
    @IsString()
    middleName?: string;

    @MinLength(2, {message: 'Минимум 2 символа'})
    @MaxLength(255, {message: 'Максимум 255 символов'})
    @IsEmail({}, {message: 'Неверно указан email'})
    email: string;

    @IsOptional()
    @MinLength(2, {message: 'Минимум 2 символа'})
    @MaxLength(15, {message: 'Максимум 15 символов'})
    @IsString()
    username?: string;

    @MinLength(8, {message: 'Минимум 8 символов'})
    @MaxLength(16, {message: 'Максимум 16 символов'})
    @IsString()
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&? "])/, {message: 'Необходимо: минимум одна буква заглавная, одна строчная, одна цифра и один уникальный символ'})
    password: string;
}