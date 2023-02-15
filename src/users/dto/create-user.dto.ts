import { IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({example: 'myuser', description: 'Логин пользователя'})
    @MinLength(3,{message: 'Минимум 3 символа'})
    @MaxLength(15, {message: 'Максимум 15 символов'})
    @IsString({message: 'Строковое значение'})
    login: string;

    @ApiProperty({example: 'fgh23wfsssdcs', description: 'Пароль пользователя'})
    @MinLength(8,{message: 'Минимум 8 символов'})
    @MaxLength(20, {message: 'Максимум 20 символов'})
    @IsString({message: 'Строковое значение'})
    password: string;
}