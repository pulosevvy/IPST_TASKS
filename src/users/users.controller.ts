import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ALREADY_USER_ERROR } from "./users.constants";

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    // @Post()
    // async createUser(@Body() dto: CreateUserDto) {
    //     return this.usersService.createUser(dto);
    // }

}
