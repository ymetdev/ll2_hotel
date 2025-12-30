import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module'; // import เข้ามา
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module'; // ตรวจสอบ path และชื่อ class ให้ตรง
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, RoomModule, BookingModule], // ใส่ PrismaModule ลงในนี้
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
