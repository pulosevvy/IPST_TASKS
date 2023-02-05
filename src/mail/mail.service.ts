import nodemailer from 'nodemailer'
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {IConfigService} from "../config/config.service.interface";

@injectable()
export class MailService {

    public transporter: nodemailer.Transporter;

    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: Number(this.configService.get('SMTP_PORT_TLS')),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USERNAME'),
                pass: this.configService.get('SMTP_PASSWORD')
            }
        })
    }

    async sendMail(to: string, link: string) {
        const site = this.configService.get('SITE');
        await this.transporter.sendMail({
            from: this.configService.get('SMTP_USERNAME'),
            to: to,
            subject: `Подтверждение почты на сайте ${site}`,
            text: '',
            html:
                `
                <div>Для подтверждения перейдите по ссылке</div>
                <a href="${link}">${link}</a>
                `
        })
    }

}