import { Injectable } from "@nestjs/common";
import { Folder } from "./folders.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class FoldersService {

    constructor(
        @InjectModel(Folder) private folderModel: typeof Folder,
    ) {}

    async createRootFolder(userId: number) {
        return await this.folderModel.create({name: 'root', userId: userId, parentId: null})
    }
}
