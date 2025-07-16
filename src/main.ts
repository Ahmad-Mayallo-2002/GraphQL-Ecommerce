import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ValidationPipe } from '@nestjs/common';
import cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({origin: "http://localhost:5173", credentials: true}))
  app.use(graphqlUploadExpress({ maxFieldSize: 5_000_000, maxFiles: 1 }));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
