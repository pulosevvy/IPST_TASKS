import { ApiProperty } from "@nestjs/swagger";

class GetFilesInFolder {
    @ApiProperty({example: '1', description: 'id файла'})
    id: number;

    @ApiProperty({example: 'ya_v_anape_2007.jpg', description: 'Название файла'})
    name: string;

    @ApiProperty({example: '{site}/static/ya_v_anape_2007.jpg', description: 'Путь по файла'})
    filepath: string;

    @ApiProperty({example: '2', description: 'id папки'})
    folderId: number
}

class GetFolderFields {

    @ApiProperty({example: '2', description: 'id папки'})
    id: number;

    @ApiProperty({example: 'Анапа 2007', description: 'название папки'})
    name: string;

    @ApiProperty({example: '1', description: 'id родительской папки'})
    parentId: number;

    @ApiProperty({example: '1', description: 'id юзера'})
    userId: number

    @ApiProperty({ type: [GetFilesInFolder] })
    files: []
}

class GetChildFolders {
    @ApiProperty({example: '3', description: 'id папки'})
    id: number;

    @ApiProperty({example: 'Анапа 2007 новое', description: 'название папки'})
    name: string;

    @ApiProperty({example: '2', description: 'id родительской папки'})
    parentId: number;

    @ApiProperty({example: '1', description: 'id юзера'})
    userId: number

    @ApiProperty({ type: [GetFilesInFolder] })
    files: []
}

export class GetOneFolderResponse {
    @ApiProperty()
    folder: GetFolderFields;
    @ApiProperty({type: [GetChildFolders]})
    childrenFolders: []

}


