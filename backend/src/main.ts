import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
  .setTitle('Uiara Cake API')
  .setDescription('API para gerenciamento de encomendas da confeitaria Uiara Cake')
  .setVersion('1.0')
  .addTag('customers', 'Gerenciamento de clientes')
  .addTag('orders', 'Gerenciamento de encomendas')
  .addTag('flavors', 'Gerenciamento de sabores')
  .addTag('reports', 'Relatórios e métricas')
  .addBearerAuth() // Para quando adicionar autenticação
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Uiara Cake Backend API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📚 Documentação disponível em http://localhost:${port}/api/docs`);
}
bootstrap();
