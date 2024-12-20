import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";
import {RequestMethod} from "@nestjs/common";

!(async function bootstrap(): Promise<void> {
   const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
   });

   const config = new DocumentBuilder()
       .setTitle('webhook test application')
       .setDescription('Documentation REST API')
       .setVersion('1.0.0')
       .addTag('Test Doc')
       .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup(process.env.SWAGGER_HOST || '/docs', app, document);

   // Define the CORS options
   const corsOptions: CorsOptions = {
      origin: [
         '*' // process.env.CORS_HOST_HTTP,
      ],
      methods: 'POST,GET,PATCH,DELETE',
      credentials: true, // Enable cookies and authentication headers
   };

   app.enableCors(corsOptions);
   // app.useGlobalInterceptors(new LoggingInterceptor());

   await app.listen(+(process.env.NODE_LOCAL_PORT || 3000));
})();