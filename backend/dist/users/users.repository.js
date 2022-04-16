"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const user_status_enum_1 = require("./user-status.enum");
class UserRepository extends typeorm_1.Repository {
    createUser(createUserDto) {
        const { login, password } = createUserDto;
        const user = this.create({
            login,
            password,
            status: user_status_enum_1.UserStatus.IS_42API,
            level: 0,
            ranking: 0,
            gamesWin: 0,
            gamesLost: 0,
        });
        await this.save(user);
        return user;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=users.repository.js.map