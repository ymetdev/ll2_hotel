import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // prisma.service.ts
    const adapter = new PrismaMariaDb({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root', // <--- ใส่รหัสผ่าน "root" ลงไปตรงนี้
      database: 'll2_hotel',
      connectionLimit: 5,
    });
    super({ adapter });
  }
}
