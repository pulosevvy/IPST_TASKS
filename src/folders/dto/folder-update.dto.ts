import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class FolderUpdateDto {
    @ApiProperty({example: 'Анапа 2008', description: 'Название папки'})
    @MinLength(1,{message: 'Минимум 1 символ'})
    @MaxLength(35, {message: 'Максимум 35 символов'})
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({example: '2', description: 'id родительской папки'})
    @IsNumber()
    @IsOptional()
    parentId?: number;
}