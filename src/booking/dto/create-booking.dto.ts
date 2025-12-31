import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsInt() // ระบุว่าเป็นเลขจำนวนเต็ม
  @IsNotEmpty()
  room_id: number;

  @IsDateString() // ตรวจสอบว่าต้องเป็นรูปแบบวันที่ ISO (เช่น 2025-12-01)
  @IsNotEmpty()
  check_in_date: string;

  @IsDateString()
  @IsNotEmpty()
  check_out_date: string;
}
