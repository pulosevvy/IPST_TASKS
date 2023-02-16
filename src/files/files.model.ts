import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

import { Folder } from "../folders/folders.model";

interface FileAttributes {
    name: string;
    filepath: string;
    folderId: number;
}

@Table({tableName: 'files'})
export class File extends Model<File, FileAttributes> {

    @ApiProperty({example: '1', description: 'id файла'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'ya_v_anape_2007', description: 'Название файла'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: '{site}/uploads/ya_v_anape_2007.jpg', description: 'Путь до файла в файловой системе'})
    @Column({type: DataType.STRING, allowNull: false})
    filepath: string;

    @ApiProperty({example: '2', description: 'id папки'})
    @ForeignKey(() => Folder)
    @Column({type: DataType.INTEGER})
    folderId: number;

    @BelongsTo(() => Folder)
    folder: Folder;

}