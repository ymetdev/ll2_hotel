import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // เปลี่ยน Status จาก 201 (Created) เป็น 200 (OK)
  @Post('login') // URL จะเป็น /auth/login
  async login(@Body() loginDto: any) {
    // ส่งข้อมูลที่รับจาก Postman (email, password) ไปให้ Service
    return this.authService.login(loginDto);
  }
}
