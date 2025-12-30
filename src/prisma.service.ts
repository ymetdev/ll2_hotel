import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // ถ้าไม่มีรหัสผ่านให้ใส่ ""
      database: 'll2_hotel', // <--- ต้องมีบรรทัดนี้ เพื่อบอกชื่อ DB ที่จะใช้งาน
      connectionLimit: 5,
    });
    super({ adapter });
  }
}
