import { NestFactory } from '@nestjs/core';
import { Socket } from 'dgram';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    })
  });
  await server.listen(3003);
  await app.listen(3001)
}
bootstrap();
