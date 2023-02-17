import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {  ensureDir, writeFile, remove  } from "fs-extra";

import { CreateFileDto } from "./dto/create-file.dto";
import { File } from "./files.model";
import { FoldersService } from "../folders/folders.service";
import { ACCESS_DENIED_ERROR, FOLDER_NOT_FOUND_ERROR } from "../folders/files.constants";
import { FILE_REMOVE_ERROR } from "./files.constants";

@Injectable()
export class FilesService {

    constructor(
        @InjectModel(File) private fileModel: typeof File,
        private folderService: FoldersService
    ) {}

    async createFile(dto: CreateFileDto, userId: number, file: any) {
         const folder = await this.folderService.getFolderById(dto.folderId);
         if(!folder || folder.userId !== userId) {
             throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
         }
        const files = await this.uploadFile(file);
        return await this.createFileDb(dto, files.fileName, files.filepath);
    }

    async deleteFile(fileId: number, userId: number) {
        const file = await this.getOneFile(fileId);
        if(!file) {
            throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
        }
        const folder = await this.folderService.getFolderById(file.folderId);

        if(folder.userId !== userId) {
            throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
        }
        await this.removeFile(file.name);
        await this.deleteFileDb(file.id);
    }


    async uploadFile(file) {
        const folder = `${__dirname}/../uploads`;
        await ensureDir(folder);
        await writeFile(`${folder}/${file.originalname}`, file.buffer);
        const filepath = `uploads/${file.originalname}`
        const fileName = file.originalname;

        return {filepath, fileName};
    }

    async removeFile(name: string) {
        try {
            await remove(`${__dirname}/../uploads/${name}`)
        } catch (e) {
            throw new HttpException(FILE_REMOVE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //repository
    private async createFileDb(dto: CreateFileDto, name: string, filepath: string) {
        return await this.fileModel.create({ ...dto, name: name, filepath: filepath })
    }

    private async deleteFileDb(fileId: number) {
        return await this.fileModel.destroy({where: {id: fileId}});
    }

    private async getOneFile(fileId: number) {
        return await this.fileModel.findOne({where: {id: fileId}})
    }
}
