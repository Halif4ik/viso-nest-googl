import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, body, query, params } = request;
      const startTime = Date.now();

      console.log(`[Request] ${method} ${url}`);

      return next.handle().pipe(
          tap((response) => {
             const elapsedTime = Date.now() - startTime;
             console.log(`[Response] ${method} ${url} data.length _${response?.length}_ - ${elapsedTime}ms`);
          }),
      );
   }
}
