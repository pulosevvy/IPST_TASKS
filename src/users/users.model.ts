import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserAttributes {
    login: string,
    password: string
}

@Table
export class User extends Model<User, UserAttributes> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    login: string

    @Column({type: DataType.STRING, allowNull: false})
    password: string
}