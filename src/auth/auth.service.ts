import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // ตรวจสอบ path ให้ถูกตามเครื่องคุณ
import { JwtService } from '@nestjs/jwt'; // แก้ Error: Cannot find name 'JwtService'
import * as bcrypt from 'bcrypt'; // แก้ Error: Cannot find name 'bcrypt'

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    // 1. หา User จาก Email
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // 2. ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // 3. สร้าง JWT Token (เปรียบเหมือนตั๋วเข้าใช้งาน)
    const payload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
