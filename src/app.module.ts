import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { RowModule } from './row/row.module';
import {APP_INTERCEPTOR} from "@nestjs/core";
import {LoggingInterceptor} from "./row/decor-logg";
import { NotifscationModule } from './notifscation/notifscation.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: `.env`,
         isGlobal: true,
      }),
      RowModule,
      NotifscationModule,
   ],
   providers: [
      {
         provide: APP_INTERCEPTOR,
         useClass: LoggingInterceptor,
      }],
})
export class AppModule {
}
