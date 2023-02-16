import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginResponse {
    @ApiProperty({example: '{token}', description: 'Токен'})
    token: string;
}