import {IConfigService} from "./config.service.interface";
import {config, DotenvConfigOutput, DotenvParseOutput} from 'dotenv';
import {injectable} from "inversify";

@injectable()
export class ConfigService implements IConfigService{

    private config: DotenvParseOutput;

    constructor() {
        const result: DotenvConfigOutput = config();
        if (result.error) {
            console.log(`[ConfigService] Не удалость прочитать .env файл`)
        } else {
            console.log(`[ConfigService] Конфигурация .env загружена`)
            this.config = result.parsed as DotenvParseOutput;
        }
    }

    get(key: string): string {
        return this.config[key];
    }
}