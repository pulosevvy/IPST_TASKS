import {injectable} from "inversify";
import { PrismaClient } from "@prisma/client";

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor() {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            console.log(`[PrismaService] Подключено к БД`);
            await this.client.$connect();
        } catch(e) {
            if (e instanceof Error) {
                console.log('[PrismaService] Ошибка подключения к БД' + e.message);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }

}