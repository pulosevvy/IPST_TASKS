import { BadRequestException, Injectable } from "@nestjs/common";
import { Folder } from "./folders.model";
import { InjectModel } from "@nestjs/sequelize";
import { FolderCreateDto } from "./dto/folder-create.dto";
import { ACCESS_DENIED_ERROR, FOLDER_NOT_FOUND_ERROR } from "./folders.constants";

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

    private async validateParentFolder(parentId: number, userId: number) {
        const folder = await this.getFolderById(parentId);
        if (!folder) {
            throw new BadRequestException(ACCESS_DENIED_ERROR);
        }
        if(folder.userId !== userId) {
            throw new BadRequestException(ACCESS_DENIED_ERROR);
        }
        return folder;
    }

    //repository
    async getFoldersByUserId(userId: number) {
        return await this.folderModel.findAll({where: {userId: userId}})
    }

    async getFolderById(folderId: number) {
        return await this.folderModel.findOne({where: {id: folderId}})
    }

    async findChildrenFolders(folderId: number) {
        return await this.folderModel.findAll({where: {parentId: folderId}});
    }

    async createFolderDb(dto: FolderCreateDto, userId: number) {
        return await this.folderModel.create({ ...dto, userId: userId} );
    }
}
