import {App} from "./app";
import {UserController} from "./users/users.controller";
import {ExceptionFilter} from "./errors/exception.filter";
import {Container, ContainerModule, interfaces} from "inversify";
import {TYPES} from "./types";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {IUserController} from "./users/users.controller.interface";
import {IUserService} from "./users/users.service.interface";
import {UserService} from "./users/users.service";
import {ConfigService} from "./config/config.service";
import {IConfigService} from "./config/config.service.interface";
import {PrismaService} from "./database/prisma.service";
import {IUsersRepository} from "./users/users.repository.interface";
import {UsersRepository} from "./users/users.repository";
import {AuthService} from "./auth/auth.service";
import {AuthController} from "./auth/auth.controller";
import {JwtService} from "./auth/jwt.service";
import {MailService} from "./mail/mail.service";


export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
    bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
    bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
    bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
    bind<AuthController>(TYPES.AuthController).to(AuthController);
    bind<JwtService>(TYPES.JwtService).to(JwtService);
    bind<MailService>(TYPES.MailService).to(MailService);
    bind<App>(TYPES.Application).to(App).inSingletonScope();
});

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { app, appContainer }
}

export const { app, appContainer } = bootstrap();



