import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from './app.module';

import { CustomValidationPipe } from "./pipes/validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new CustomValidationPipe());

  const documentConfig = new DocumentBuilder()
      .setTitle('Cloud')
      .setDescription('The cloud API description')
      .setVersion('1.0.0')
      .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 7000);
}
bootstrap();
