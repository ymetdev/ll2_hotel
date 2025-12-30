// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // <-- 1. เพิ่มการ Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. จัดการเรื่อง BigInt
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // 2. ตั้งค่า Swagger
  const config = new DocumentBuilder()
    .setTitle('Hotel Booking API')
    .setDescription('API สำหรับระบบจัดการโรงแรม (Room, Booking, Auth)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 3. เปิด CORS
  app.enableCors();

  // --- เพิ่มส่วนนี้เข้าไปครับ ---
  // 4. เปิดใช้งาน Validation ทั่วทั้งระบบ
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัด Property ที่ไม่ได้นิยามใน DTO ทิ้งไป
      forbidNonWhitelisted: true, // ถ้าส่งค่าที่ไม่อยู่ใน DTO มา ให้ Error ทันที
      transform: true, // สำคัญมาก: เพื่อให้ @Transform ใน DTO ทำงาน
    }),
  );
  // -------------------------

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();
