import { Body, Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { File } from "./files.model";
import { AuthGuard } from "../auth/guards/auth.guard";

@ApiTags('Файлы')
@Controller('files')
export class FilesController {

    constructor(private filesService: FilesService) {}

    @ApiOperation({summary: 'Добавление файла'})
    @ApiResponse({status: 201, type: File})
    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() dto: CreateFileDto, @Req() req) {
        return this.filesService.createFile(dto, req.user.id);
    }

    @ApiOperation({summary: 'Удаление файла'})
    @ApiResponse({status: 200})
    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @Req() req) {
        return this.filesService.deleteFile(id, req.user.id);
    }

}
