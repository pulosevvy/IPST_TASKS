import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateFileDto {

    @ApiProperty({example: '2', description: 'id папки'})
    folderId: number;

}