import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const corsOptions = {
  origin: '*', // Cho phép tất cả các nguồn truy cập
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cho phép các phương thức HTTP
  allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các header HTTP
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các field không mong muốn
      forbidNonWhitelisted: true, // Trả về lỗi nếu có field không mong muốn
    }),
  );
  await app.listen(3000);
}
bootstrap();
