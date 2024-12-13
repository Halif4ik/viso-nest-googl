import {
   WebSocketGateway,
   OnGatewayInit,
   OnGatewayConnection,
   OnGatewayDisconnect, WebSocketServer,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {Row} from "@prisma/client";

@WebSocketGateway(3007, {cors: {origin: '*'}})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
   private clientGlobal: Socket;


   @WebSocketServer() server: Server;

   async handleConnection(client: Socket): Promise<void> {
      try {
         const clientFromReq = {
            ip:client.request?.['ip'] || client.request.socket.remoteAddress,
            user_agent: client.request.headers['user-agent']
         }
         console.log('###client.request-', clientFromReq);
         console.log('client.join-', clientFromReq.toString());

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

   async sendRowDataToFront(clientIdWhoCreated: number, createdNewRow: Row | any, type: string): Promise<void> {
      console.log('$$$$userIdWhoCreated-', clientIdWhoCreated);

      // Iterate over the rooms map
      this.clientGlobal?.['adapter'].rooms.forEach((room, roomId) => {
         // Check if the roomId is not equal to userId Who Created this new post
         if (roomId != clientIdWhoCreated)
             // Send a message to this room
            this.server.to(roomId).emit('message', {type, post: createdNewRow});

      });
   }

}
