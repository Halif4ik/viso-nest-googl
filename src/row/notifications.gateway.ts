import {
   WebSocketGateway,
   OnGatewayInit,
   OnGatewayConnection,
   OnGatewayDisconnect, WebSocketServer,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {Row} from "@prisma/client";
import {PrismaService} from "../prisma.service";

@WebSocketGateway({cors: {origin: '*'}})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
   private clientGlobal: Socket;

   constructor(private prisma: PrismaService,) {
   }

   @WebSocketServer() server: Server;

   async handleConnection(client: Socket): Promise<void> {
      try {
         const clientFromReq = {
            ip: client.request?.['ip'] || client.request.socket.remoteAddress,
            user_agent: client.request.headers['user-agent']
         }
         const user = await this.prisma.customer.findUnique({
            where: {
               ip_user_agent: {
                  ip: clientFromReq.ip,
                  user_agent: clientFromReq.user_agent,
               },
            }
         });

         await client.join(clientFromReq.toString());
         this.clientGlobal = client;
      } catch (error: Error | any) {
         client.emit('error', 'unauthorized');
         client.disconnect();
      }
   }

   async handleDisconnect(client: Socket): Promise<void> {
      await client.leave(client.nsp.name);
   }

   async sendRowDataToFront(clientIdWhoCreated: number, createdNewRow: Row, type: string): Promise<void> {
      console.log('Send By WS-', clientIdWhoCreated, createdNewRow, type);

      // Iterate over the rooms map
      this.clientGlobal?.['adapter'].rooms.forEach((room, roomId) => {
         // Check if the roomId is not equal to userId Who Created this new post
         if (roomId != clientIdWhoCreated)
             // Send a message to this room
            this.server.to(roomId).emit('message', {type, post: createdNewRow});

      });
   }

}
