// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. จัดการเรื่อง BigInt (เพื่อให้ JSON ส่งค่า BigInt เป็น String ได้ ไม่ Error)
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // 2. ตั้งค่า Swagger
  const config = new DocumentBuilder()
    .setTitle('Hotel Booking API')
    .setDescription('API สำหรับระบบจัดการโรงแรม (Room, Booking, Auth)')
    .setVersion('1.0')
    .addBearerAuth() // รองรับการใส่ Token ในหน้าเว็บ
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // ทางเข้าคือ http://localhost:3000/api

  // 3. เปิด CORS (เผื่อเพื่อนเขียนหน้าบ้านมาต่อ)
  app.enableCors();

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();
