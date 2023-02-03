import {inject, injectable} from "inversify";
import {sign, verify} from "jsonwebtoken";
import {TYPES} from "../types";
import {IConfigService} from "../config/config.service.interface";
import {PrismaService} from "../database/prisma.service";

@injectable()
export class JwtService {

    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService
    ) {}

    signJWTokens(id: number, email: string, is_confirmed: boolean, secret: string) {
        const accessToken = sign({id, email, is_confirmed}, secret, {algorithm: "HS256", expiresIn: '5min'});
        const refreshToken = sign({id, email, is_confirmed}, this.configService.get('REFRESH_SECRET'), {algorithm: "HS256", expiresIn: '15d'});

        return {accessToken , refreshToken};
    }

    async saveRefreshToken(userId: number, refresh: string) {
        const tokens = await this.prismaService.client.refreshToken.findFirst({where: {userId: userId}});
        if (tokens) {
            tokens.refresh_token = refresh;
        }
        return this.prismaService.client.refreshToken.create({data: {userId: userId, refresh_token: refresh}})
    }

    async refreshToken(refreshToken: string) {
        const result = this.validateRefreshToken(refreshToken) as string;
        const isExists = await this.prismaService.client.refreshToken.findFirst({where: {refresh_token: refreshToken}});
        if (!result || !isExists) {
            return null;
        }
        const userId = isExists.userId
        const user = await this.prismaService.client.userModel.findFirst({where: {id: userId}});
        if (!user) {
            return null
        }
        const tokens = this.signJWTokens(user.id, user.email, user.is_confirmed, this.configService.get('SECRET'));
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        return {user, tokens};
    }

    private validateRefreshToken(refreshToken: string): string | boolean {
       const result = verify(refreshToken, this.configService.get('REFRESH_SECRET')) as string;
       if (!result) {
           return false;
       }
       return result as string;
    }

}