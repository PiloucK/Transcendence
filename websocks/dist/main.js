"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:3000"
        }
    });
    await io.on('connection', (socket) => {
        console.log("server websock connected");
        socket.on("newName", (username) => {
            console.log("server side received ", username);
            io.emit("update");
        });
    });
    await server.listen(3003);
}
bootstrap();
//# sourceMappingURL=main.js.map