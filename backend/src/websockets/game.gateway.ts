import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Namespace } from 'socket.io';
import { StatusService } from 'src/status/status.service';
import { WebsocketsGateway } from './main.gateway';

@Injectable()
export class GameNamespaces extends WebsocketsGateway {
  private gameNamespace: Namespace;
  constructor(
    @Inject(forwardRef(() => StatusService))
    statusService: StatusService,
  ) {
    super(statusService);

    console.log(this.server);
    
    this.gameNamespace = this.server.of(/^\/gameRoom_[\w-]+_\w+$/);
    this.gameNamespace.on('connection', () => {
      console.log('game connected!');
    });
  }
}
