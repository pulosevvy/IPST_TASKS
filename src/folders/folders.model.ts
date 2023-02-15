import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

import { User } from "../users/users.model";
import { File } from "../files/files.model";

interface FolderAttributes {
    name: string,
    userId: number,
    parentId: number
}

@Table({tableName: 'folders'})
export class Folder extends Model<Folder, FolderAttributes> {
    @ApiProperty({example: '2', description: 'id папки'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Анапа 2007', description: 'Название папки'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: '1', description: 'id родительской папки'})
    @Column({type: DataType.INTEGER, defaultValue: null, allowNull: true})
    parentId: number;

    @ApiProperty({example: '1', description: 'id пользователя папки'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    owner: User;

    @HasMany(() => File)
    files: File[];

}