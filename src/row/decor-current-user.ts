import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Customer} from "@prisma/client";

/*get from request where put guard*/
export const UserDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): {ip: string, user_agent:string} => {
       const request = ctx.switchToHttp().getRequest();

       return {ip: request.ip || request.socket.remoteAddress, user_agent:request.headers['user-agent']}
    },
);

