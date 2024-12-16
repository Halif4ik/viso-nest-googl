import {
   WebSocketGateway,
   OnGatewayInit,
   OnGatewayConnection,
   OnGatewayDisconnect, WebSocketServer,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {Customer, Row} from "@prisma/client";
import {RowService} from "./row.service";
import {PrismaService} from "../prisma.service";

@WebSocketGateway(3007, {cors: {origin: '*'}})
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

         console.log('###client.request-', clientFromReq);
         console.log('client.join-', clientFromReq.toString());
         const user = await this.prisma.customer.findUnique({
            where: {
               ip_user_agent: {
                  ip: clientFromReq.ip,
                  user_agent: clientFromReq.user_agent,
               },
            }
         });

         console.log('!!user-', user);

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
      console.log('$$$$userIdWhoCreated-', clientIdWhoCreated, createdNewRow, type);

      // Iterate over the rooms map
      this.clientGlobal?.['adapter'].rooms.forEach((room, roomId) => {
         // Check if the roomId is not equal to userId Who Created this new post
         if (roomId != clientIdWhoCreated)
             // Send a message to this room
            this.server.to(roomId).emit('message', {type, post: createdNewRow});

      });
   }

}
