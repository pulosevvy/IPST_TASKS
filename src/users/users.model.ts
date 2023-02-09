import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Folder } from "../folders/folders.model";

interface UserAttributes {
    login: string,
    password: string
}

@Table({tableName: 'users'})
export class User extends Model<User, UserAttributes> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    login: string

    @Column({type: DataType.STRING, allowNull: false})
    password: string

    @HasMany(() => Folder)
    folders: Folder[];
}