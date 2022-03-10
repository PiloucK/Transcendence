import { Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    /* should pass a NEXT.js server instance
        as the argument to `forRootAsync` */
    imports: [
      RenderModule.forRootAsync(
        Next({ dev: NODE_ENV === 'development' }),
        { viewsDir: null }
      )    
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
