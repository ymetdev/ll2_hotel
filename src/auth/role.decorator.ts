import { SetMetadata } from '@nestjs/common';

// สร้าง key ชื่อ 'roles' และรับค่าจาก users_role enum หรือ string
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
