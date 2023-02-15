import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class FolderCreateDto {
    @ApiProperty({example: 'Анапа 2007', description: 'Название папки'})
    @MinLength(1,{message: 'Минимум 1 символ'})
    @MaxLength(35, {message: 'Максимум 35 символов'})
    @IsString({message: 'Строковое значение'})
    name: string;

    @ApiProperty({example: '1', description: 'id родительской папки'})
    @IsNumber()
    parentId: number;
}