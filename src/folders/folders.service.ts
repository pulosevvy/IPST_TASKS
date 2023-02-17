import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Folder } from "./folders.model";
import { FolderCreateDto } from "./dto/folder-create.dto";
import {
    ACCESS_DENIED_ERROR,
    FOLDER_NOT_FOUND_ERROR,
    PARENT_DESTROY_ERROR,
    PARENT_FOLDER_NOT_EXISTS, UPDATE_ROOT_FOLDER_ERROR
} from "./folders.constants";
import { File } from "../files/files.model";
import { FolderUpdateDto } from "./dto/folder-update.dto";

@Injectable()
export class FoldersService {

    constructor(
        @InjectModel(Folder) private folderModel: typeof Folder,
    ) {}

    async createRootFolder(userId: number) {
        return await this.folderModel.create({name: 'root', userId: userId, parentId: null})
    }

    async createFolder(dto: FolderCreateDto, userId: number) {
        await this.validateParentFolder(dto.parentId, userId);
        return await this.createFolderDb(dto, userId);
    }

    async getFoldersController(userId: number) {
        return await this.getFoldersByUserId(userId);
    }

    async getOneFolder(folderId: number, userId: number) {
        const folder = await this.getFolderById(folderId);
        if(!folder || folder.userId !== userId) {
            throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
        }
        const childrenFolders = await this.findChildrenFolders(folderId)
        return { folder, childrenFolders };
    }

    async updateFolder(id: number, dto: FolderUpdateDto, userId: number) {
        const folder = await this.getFolderById(id);
        if(!folder || folder.userId !== userId) {
            throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
        }
        if(folder.name == 'root') {
            throw new BadRequestException(UPDATE_ROOT_FOLDER_ERROR);
        }
        await this.updateFolderDb(id, dto);
        const updated = await this.getFolderById(id);
        return updated;
    }

    async deleteFolder(folderId: number, userId: number) {
        const searchDeletedFolder = await this.getFolderById(folderId);
        if(!searchDeletedFolder || searchDeletedFolder.userId !== userId) {
            throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
        }
        if(searchDeletedFolder.name == 'root') {
            throw new BadRequestException(PARENT_DESTROY_ERROR);
        }
        await this.deleteFolderDb(folderId);

        const childFolders = await this.findChildrenFolders(folderId);

        return {message: 'Папка удалена'}
    }

    private async validateParentFolder(parentId: number, userId: number) {
        const parentFolder = await this.getFolderById(parentId);
        if (!parentFolder || parentFolder.userId !== userId) {
            throw new BadRequestException(PARENT_FOLDER_NOT_EXISTS);
        }
        return parentFolder;
    }

    //repository
     async getFoldersByUserId(userId: number) {
        return await this.folderModel.findAll({where: {userId: userId}})
    }

    async getFolderById(folderId: number) {
        return await this.folderModel.findOne({where: {id: folderId}, include: {model: File} })
    }

    async getFoldersById(folderId: number) {
        return await this.folderModel.findAll({where: {id: folderId}})
    }

    async findChildrenFolders(folderId: number) {
        return await this.folderModel.findAll({where: {parentId: folderId}, include: {model: File}});
    }

    async createFolderDb(dto: FolderCreateDto, userId: number) {
        return await this.folderModel.create({ ...dto, userId: userId} );
    }

    async updateFolderDb(id: number,dto: FolderUpdateDto) {
        return await this.folderModel.update(dto, {where: {id: id}})
    }

    async deleteFolderDb(folderId: number) {
        return await this.folderModel.destroy({where: {id: folderId}});
    }
}
