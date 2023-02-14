import { BadRequestException, Injectable } from "@nestjs/common";
import { Folder } from "./folders.model";
import { InjectModel } from "@nestjs/sequelize";
import { FolderCreateDto } from "./dto/folder-create.dto";
import {
    ACCESS_DENIED_ERROR,
    FOLDER_NOT_FOUND_ERROR,
    PARENT_DESTROY_ERROR,
    PARENT_FOLDER_NOT_EXISTS
} from "./folders.constants";

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
        if(!folder) {
            throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
        }
        if (folder.userId !== userId) {
            throw new BadRequestException(ACCESS_DENIED_ERROR);
        }
        const childrenFolders = await this.findChildrenFolders(folderId)
        return { folder: folder, childrenFolders: childrenFolders };
    }

    async deleteFolder(folderId: number, userId: number) {
        const searchDeletedFolder = await this.getFolderById(folderId);
        if(!searchDeletedFolder) {
            throw new BadRequestException(FOLDER_NOT_FOUND_ERROR);
        }
        if(searchDeletedFolder.name == 'root') {
            throw new BadRequestException(PARENT_DESTROY_ERROR);
        }
        if(searchDeletedFolder.userId !== userId) {
            throw new BadRequestException(ACCESS_DENIED_ERROR);
        }
        await this.deleteFolderDb(folderId);

        const childFolders = await this.findChildrenFolders(folderId);

        return {message: 'Папка удалена'}
    }

    private async validateParentFolder(parentId: number, userId: number) {
        const parentFolder = await this.getFolderById(parentId);
        if (!parentFolder) {
            throw new BadRequestException(PARENT_FOLDER_NOT_EXISTS);
        }
        if(parentFolder.userId !== userId) {
            throw new BadRequestException(ACCESS_DENIED_ERROR);
        }
        return parentFolder;
    }

    //repository
    private async getFoldersByUserId(userId: number) {
        return await this.folderModel.findAll({where: {userId: userId}})
    }

    private async getFolderById(folderId: number) {
        return await this.folderModel.findOne({where: {id: folderId}})
    }

    private async getFoldersById(folderId: number) {
        return await this.folderModel.findAll({where: {id: folderId}})
    }

    private async findChildrenFolders(folderId: number) {
        return await this.folderModel.findAll({where: {parentId: folderId}});
    }

    private async createFolderDb(dto: FolderCreateDto, userId: number) {
        return await this.folderModel.create({ ...dto, userId: userId} );
    }

    private async deleteFolderDb(folderId: number) {
        return await this.folderModel.destroy({where: {id: folderId}});
    }
}
