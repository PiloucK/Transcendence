"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_model_1 = require("./user.model");
const uuid_1 = require("uuid");
let UsersService = class UsersService {
    constructor() {
        this.users = [];
    }
    getAllUsers() {
        return this.users;
    }
    createUser(createUserDto) {
        const { login, pass } = createUserDto;
        const user = {
            id: (0, uuid_1.v4)(),
            login,
            pass,
            status: user_model_1.UserStatus.IS_GUEST,
        };
        if (!this.searchUser(login)) {
            this.users.push(user);
            return user;
        }
    }
    searchUser(login) {
        return this.users.find((user) => user.login == login);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map