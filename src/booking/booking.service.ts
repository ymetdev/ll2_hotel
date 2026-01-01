import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { room_id, check_in_date, check_out_date } = createBookingDto;

    // 1. ตรวจสอบว่าห้องพักมีจริงไหม
    const room = await this.prisma.rooms.findUnique({
      where: { id: BigInt(room_id) },
    });
    if (!room) throw new NotFoundException('ไม่พบห้องพักที่ระบุ');

    const start = new Date(check_in_date);
    const end = new Date(check_out_date);

    // ตรวจสอบเบื้องต้น: วันที่จองต้องไม่เป็นอดีต และ Check-out ต้องหลัง Check-in
    if (start < new Date(new Date().setHours(0, 0, 0, 0))) {
      throw new BadRequestException('ไม่สามารถจองวันในอดีตได้');
    }
    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 0) {
      throw new BadRequestException(
        'วันที่ Check-out ต้องหลังจาก Check-in อย่างน้อย 1 คืน',
      );
    }

    // --- ส่วนความปลอดภัย: เช็คการจองซ้อน (Availability Check) ---
    const overlappingBooking = await this.prisma.bookings.findFirst({
      where: {
        room_id: BigInt(room_id),
        status: { not: 'cancelled' as any }, // ไม่นับรายการที่ยกเลิกไปแล้ว
        OR: [
          {
            // เคสที่ 1: วันที่เริ่มจองใหม่ อยู่ระหว่างช่วงที่มีคนจองไว้แล้ว
            check_in: { lte: start },
            check_out: { gt: start },
          },
          {
            // เคสที่ 2: วันที่สิ้นสุดจองใหม่ อยู่ระหว่างช่วงที่มีคนจองไว้แล้ว
            check_in: { lt: end },
            check_out: { gte: end },
          },
          {
            // เคสที่ 3: จองใหม่ครอบคลุมช่วงที่มีคนจองไว้แล้วทั้งหมด
            check_in: { gte: start },
            check_out: { lte: end },
          },
        ],
      },
    });

    if (overlappingBooking) {
      throw new ConflictException(
        'ขออภัย ห้องพักนี้มีผู้จองแล้วในช่วงเวลาดังกล่าว',
      );
    }
    // -------------------------------------------------------

    // 3. คำนวณราคาทั้งหมด
    const totalPrice = Number(room.price_per_night) * diffDays;

    // 4. บันทึกข้อมูล
    return await this.prisma.bookings.create({
      data: {
        user_id: BigInt(userId),
        room_id: BigInt(room_id),
        check_in: start,
        check_out: end,
        total_price: totalPrice,
        status: 'pending' as any,
      },
    });
  }

  // ฟังก์ชัน findAll, findOne, update, remove เหมือนเดิม...
  async findAll() {
    return await this.prisma.bookings.findMany({
      include: {
        rooms: { select: { name: true, price_per_night: true } },
        users: { select: { name: true, email: true } },
      },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: BigInt(id) },
      include: { rooms: true, users: true },
    });
    if (!booking) throw new NotFoundException('ไม่พบข้อมูลการจอง');
    return booking;
  }

  async update(id: number, dto: UpdateBookingDto) {
    const data: any = {};

    if (dto.room_id !== undefined) {
      data.room_id = BigInt(dto.room_id);
    }

    if (dto.check_in_date !== undefined) {
      data.check_in = new Date(dto.check_in_date);
    }

    if (dto.check_out_date !== undefined) {
      data.check_out = new Date(dto.check_out_date);
    }

    if (dto.status !== undefined) {
      data.status = dto.status as any;
    }

    return this.prisma.bookings.update({
      where: { id: BigInt(id) },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.bookings.delete({
      where: { id: BigInt(id) },
    });
  }
}
