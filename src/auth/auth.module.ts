import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma.module'; // นำเข้า PrismaModule ที่เราทำเป็น Global ไว้

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true, // ทำให้ใช้ JwtService ได้ทั่วทั้งแอป
      secret: 'temyproongod', // ในอนาคตควรดึงจาก .env
      signOptions: { expiresIn: '1d' }, // Token หมดอายุใน 1 วัน
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
