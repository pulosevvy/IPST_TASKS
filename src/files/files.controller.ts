import { Body, Controller, Delete, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { File } from "./files.model";
import { AuthGuard } from "../auth/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('Файлы')
@Controller('folders/files')
export class FilesController {

    constructor(private filesService: FilesService) {}

    @ApiOperation({summary: 'Добавление файла'})
    @ApiResponse({status: 201, type: File})
    @ApiParam({ name: 'file', type: String })
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('name'))
    @Post()
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateFileDto,
        @Req() req
    ) {
        return this.filesService.createFile(dto, req.user.id,file);
    }

    @ApiOperation({summary: 'Удаление файла'})
    @ApiResponse({status: 200})
    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @Req() req) {
        return this.filesService.deleteFile(id, req.user.id);
    }

}
