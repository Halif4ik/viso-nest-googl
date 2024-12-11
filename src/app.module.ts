import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { RowModule } from './row/row.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: `.env`,
         isGlobal: true,
      }),
      RowModule,
   ],
/*   providers: [
      {
         provide: APP_INTERCEPTOR,
         useClass: TransformResponseInterceptor,
      }],*/
})
export class AppModule {
}
