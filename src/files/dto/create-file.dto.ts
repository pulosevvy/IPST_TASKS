import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateFileDto {
    @ApiProperty({example: 'ya_v_anape_2007.jpg', description: 'Название файла'})
    @MinLength(1,{message: 'Минимум 1 символ'})
    @MaxLength(35, {message: 'Максимум 35 символов'})
    @IsString({message: 'Строковое значение'})
    name: string;

    @ApiProperty({example: '2', description: 'id папки'})
    @IsNumber()
    folderId: number;
}