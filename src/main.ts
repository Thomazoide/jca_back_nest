import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("APIs Intranet JCA")
    .setDescription("Documentación de las apis de la intranet JCA")
    .setVersion("1.0")
    .build()
  
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
