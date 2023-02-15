import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { CreateFileDto } from "./dto/create-file.dto";
import { File } from "./files.model";
import { FoldersService } from "../folders/folders.service";
import { ACCESS_DENIED_ERROR, FILE_NOT_FOUND_ERROR } from "../folders/files.constants";

@Injectable()
export class FilesService {

    constructor(
        @InjectModel(File) private fileModel: typeof File,
        private folderService: FoldersService
    ) {}

    async createFile(dto: CreateFileDto, userId: number) {
        const folder = await this.folderService.getFolderById(dto.folderId);
        if(!folder) {
            throw new BadRequestException(FILE_NOT_FOUND_ERROR);
        }
        if(folder.userId !== userId) {
            throw new BadRequestException(ACCESS_DENIED_ERROR);
        }
        return await this.createFileDb(dto);
    }

    async deleteFile(fileId: number, userId: number) {
        const file = await this.getOneFile(fileId);
        if(!file) {
            throw new BadRequestException(FILE_NOT_FOUND_ERROR);
        }
        const folder = await this.folderService.getFolderById(file.folderId);

        if(folder.userId !== userId) {
            throw new BadRequestException(ACCESS_DENIED_ERROR);
        }
        await this.deleteFileDb(fileId);
    }

    //repository
    private async createFileDb(dto: CreateFileDto) {
        return await this.fileModel.create({ ...dto, filepath: 'static/test' })
    }

    private async deleteFileDb(fileId: number) {
        return await this.fileModel.destroy({where: {id: fileId}});
    }

    private async getOneFile(fileId: number) {
        return await this.fileModel.findOne({where: {id: fileId}})
    }
}
