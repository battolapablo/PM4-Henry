import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config({ path: '.env.development' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          if (error.children && error.children.length) {
            return {
              property: error.property,
              children: error.children.map((child) => {
                if (child.children && child.children.length) {
                  return {
                    property: child.property,
                    children: child.children.map((grandchild) => ({
                      property: grandchild.property,
                      constraints: grandchild.constraints,
                    })),
                  };
                }
                return {
                  property: child.property,
                  constraints: child.constraints,
                };
              }),
            };
          }
          return { property: error.property, constraints: error.constraints };
        });

        return new BadRequestException({
          alert: 'Se han detectado los siguientes errores en la petición:',
          errors: cleanErrors,
        });
      },
    }),
  );
  app.use(LoggerGlobal);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce API Documentation')
    .setDescription(
      `
      
      API construida con Nest para ser empleada en el Proyecto Integrador Modulo 4 de la especialidad Backend de la carrera Fullstack Developer de Henry`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
