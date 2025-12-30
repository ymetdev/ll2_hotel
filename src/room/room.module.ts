import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtService } from '@nestjs/jwt'; // เพิ่มตัวนี้

@Module({
  controllers: [RoomController],
  providers: [RoomService, JwtService], // เพิ่ม JwtService เข้าไปใน providers
  exports: [RoomService],
})
export class RoomModule {}
