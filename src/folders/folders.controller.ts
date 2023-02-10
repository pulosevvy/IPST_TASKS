import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { FoldersService } from "./folders.service";
import { FolderCreateDto } from "./dto/folder-create.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

@Controller('folders')
export class FoldersController {

    constructor(private folderService: FoldersService) {}

    @UseGuards(AuthGuard)
    @Post()
    async createFolder(@Body() dto: FolderCreateDto, @Req() req) {
        console.log(req.user.id);
        return this.folderService.createFolder(dto, req.user.id);
    }

    @UseGuards(AuthGuard)
    @Get()
    async getFolders(@Req() req) {
        return this.folderService.getFoldersController(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getOneFolder(@Param('id') id: number, @Req() req) {
        return this.folderService.getOneFolder(id, req.user.id);
    }
}
