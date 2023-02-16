import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { FoldersService } from "./folders.service";
import { FolderCreateDto } from "./dto/folder-create.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Folder } from "./folders.model";
import { File } from "../files/files.model";
import { GetOneFolderResponse} from "./response/get-one-folder.response";

@ApiTags('Папки')
@Controller('folders')
export class FoldersController {

    constructor(private folderService: FoldersService) {}

    @ApiOperation({summary: 'Создание папки'})
    @ApiResponse({status: 201, type: Folder})
    @UseGuards(AuthGuard)
    @Post()
    async createFolder(@Body() dto: FolderCreateDto, @Req() req) {
        return this.folderService.createFolder(dto, req.user.id);
    }

    @ApiOperation({summary: 'Получение папок'})
    @ApiResponse({status: 200, type: [Folder]})
    @UseGuards(AuthGuard)
    @Get()
    async getFolders(@Req() req) {
        return this.folderService.getFoldersController(req.user.id);
    }

    @ApiOperation({summary: 'Получение одной папки'})
    @ApiResponse({status: 200, type: GetOneFolderResponse })
    @UseGuards(AuthGuard)
    @Get(':id')
    async getOneFolder(@Param('id') id: number, @Req() req) {
        return this.folderService.getOneFolder(id, req.user.id);
    }

    @ApiOperation({summary: 'Удаление папки'})
    @ApiResponse({status: 200})
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteFolder(@Param('id') id: number, @Req() req) {
        return this.folderService.deleteFolder(id, req.user.id);
    }
}
