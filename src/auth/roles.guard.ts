import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึงค่า roles ที่กำหนดไว้ใน @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // ถ้าไม่ได้กำหนด @Roles ไว้เลย ให้ผ่านได้ (Public สำหรับทุกคนที่มี Token)
    if (!requiredRoles) {
      return true;
    }

    // 2. ดึงข้อมูล user จาก request (ที่ AuthGuard เคยใส่ไว้ให้)
    const { user } = context.switchToHttp().getRequest();

    // 3. ตรวจสอบว่า role ของ user ตรงกับที่ API ต้องการไหม
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้ (เฉพาะ Admin เท่านั้น)',
      );
    }

    return hasRole;
  }
}
