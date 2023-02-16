import { ApiProperty } from "@nestjs/swagger";

export class AuthRegisterResponse {
    @ApiProperty({example: 'myuser', description: 'Логин пользователя'})
    user: string;

    @ApiProperty({example: '{token}', description: 'Токен'})
    token: string;
}