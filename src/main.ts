import {App} from "./app";
import {UserController} from "./users/users.controller";
import {ExceptionFilter} from "./errors/exception.filter";
import {Container, ContainerModule, interfaces} from "inversify";
import {TYPES} from "./types";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {IUserController} from "./users/users.controller.interface";
import {IUserService} from "./users/users.service.interface";
import {UserService} from "./users/users.service";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { app, appContainer }
}

export const { app, appContainer } = bootstrap();



