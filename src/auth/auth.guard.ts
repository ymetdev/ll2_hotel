import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core'; // 1. เพิ่มตัวนี้
import { IS_PUBLIC_KEY } from './public.decorator'; // 2. import key ที่เราสร้างไว้

@Injectable()
export class AuthGuard implements CanActivate {
  // 3. ฉีด Reflector เข้ามาใน constructor
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 4. ตรวจสอบว่า API นี้มี @Public() แปะอยู่หรือไม่
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 5. ถ้าเป็น Public ให้คืนค่า true ทันที (ไม่ต้องเช็ค Token)
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('กรุณาล็อคอินก่อนใช้งาน');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'temyproongod',
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
