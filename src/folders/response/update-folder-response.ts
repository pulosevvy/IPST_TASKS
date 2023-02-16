import { ApiProperty } from "@nestjs/swagger";

export class UpdateFolderResponse {

    @ApiProperty({example: '2', description: 'id папки'})
    id: number;

    @ApiProperty({example: 'Анапа 2008', description: 'название папки'})
    name: string;

    @ApiProperty({example: '3', description: 'id родительской папки'})
    parentId: number;

    @ApiProperty({example: '1', description: 'id юзера'})
    userId: number

}