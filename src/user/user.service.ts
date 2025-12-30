import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    return this.prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  // เพิ่ม parameter currentUser เพื่อเช็คสิทธิ์
  async findOne(id: number, currentUser: any) {
    // เช็ค Ownership: ไม่ใช่ Admin และไม่ใช่เจ้าของ ID นี้
    if (
      currentUser.role !== 'admin' &&
      BigInt(currentUser.sub) !== BigInt(id)
    ) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ดูข้อมูลของผู้อื่น');
    }

    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });
    if (!user) throw new NotFoundException(`User ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
    // 1. เช็ค Ownership
    if (
      currentUser.role !== 'admin' &&
      BigInt(currentUser.sub) !== BigInt(id)
    ) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์แก้ไขข้อมูลของผู้อื่น');
    }

    // 2. ป้องกัน User ทั่วไปเปลี่ยน Role ตัวเองเป็น Admin
    if (currentUser.role !== 'admin') {
      delete updateUserDto['role'];
    }

    // 3. ถ้ามีการเปลี่ยน Password ต้อง Hash ใหม่
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    try {
      return await this.prisma.users.update({
        where: { id: BigInt(id) },
        data: updateUserDto,
      });
    } catch (error) {
      throw new Error(`Could not update user with ID ${id}`);
    }
  }

  async remove(id: number, currentUser: any) {
    // 1. เช็ค Ownership (Admin ลบได้ทุกคน, User ลบได้แค่ตัวเอง)
    if (
      currentUser.role !== 'admin' &&
      BigInt(currentUser.sub) !== BigInt(id)
    ) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบบัญชีของผู้อื่น');
    }

    try {
      return await this.prisma.users.delete({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
