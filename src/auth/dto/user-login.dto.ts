import { IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {

    @ApiProperty({example: 'myuser', description: 'Логин пользователя'})
    @IsString({message: 'Строковое значение'})
    login: string;

    @ApiProperty({example: 'fgh23wfsssdcs', description: 'Пароль пользователя'})
    @IsString({message: 'Строковое значение'})
    password: string;
}