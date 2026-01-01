import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma.service';
// 1. นำเข้า rooms_status มาโดยตรง (Prisma มักจะยอมให้ตัวนี้)

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    return await this.prisma.rooms.create({
      data: {
        name: createRoomDto.name,
        description: createRoomDto.description,
        price_per_night: createRoomDto.price_per_night,

        // เปลี่ยนจาก 'available' เป็น 'active' ให้ตรงตาม Schema ของคุณ
        status: 'inactive' as any,
      },
    });
  }

  // 2. ดูห้องพักทั้งหมด
  async findAll() {
    return await this.prisma.rooms.findMany({
      orderBy: {
        id: 'asc', // เรียงตาม ID จากน้อยไปมาก
      },
    });
  }

  // 3. ดูรายละเอียดห้องพักรายห้อง
  async findOne(id: number) {
    const room = await this.prisma.rooms.findUnique({
      where: { id: BigInt(id) },
    });

    if (!room) {
      throw new NotFoundException(`ไม่พบห้องพักรหัส ${id}`);
    }
    return room;
  }

  // 4. แก้ไขข้อมูลห้องพัก
  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      return await this.prisma.rooms.update({
        where: { id: BigInt(id) },
        data: updateRoomDto,
      });
    } catch (error) {
      throw new NotFoundException(
        `ไม่สามารถแก้ไขได้ เพราะไม่พบห้องพักรหัส ${id}`,
      );
    }
  }

  // 5. ลบห้องพัก (พร้อมระบบเช็คความปลอดภัย)
  async remove(id: number) {
    // ตรวจสอบก่อนว่าห้องมีอยู่จริงไหม และมีการจองอยู่หรือไม่
    const room = await this.prisma.rooms.findUnique({
      where: { id: BigInt(id) },
      include: {
        _count: {
          select: { bookings: true }, // เช็คจำนวนการจองที่เชื่อมโยงอยู่
        },
      },
    });

    if (!room) {
      throw new NotFoundException(`ไม่พบห้องพักรหัส ${id}`);
    }

    // ความปลอดภัย: ห้ามลบถ้ามีการจองค้างในระบบ
    if (room._count.bookings > 0) {
      throw new ForbiddenException(
        'ไม่สามารถลบห้องพักนี้ได้ เนื่องจากมีข้อมูลการจองเชื่อมโยงอยู่ ในฐานข้อมูล',
      );
    }

    return await this.prisma.rooms.delete({
      where: { id: BigInt(id) },
    });
  }
}
