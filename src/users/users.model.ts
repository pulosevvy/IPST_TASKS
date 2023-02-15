import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

import { Folder } from "../folders/folders.model";

interface UserAttributes {
    login: string,
    password: string
}

@Table({tableName: 'users'})
export class User extends Model<User, UserAttributes> {
    @ApiProperty({example: '3', description: 'id пользователя'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ApiProperty({example: 'myuser', description: 'login пользователя'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    login: string

    @ApiProperty({example: 'fgh23wfsssdcs', description: 'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string

    @HasMany(() => Folder)
    folders: Folder[];
}