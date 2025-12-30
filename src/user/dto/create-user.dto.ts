import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(100, { message: 'Name is too long' })
  // 1. ตัดช่องว่างหัว-ท้ายออกก่อน
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  // 2. Regex: บังคับขึ้นต้นด้วยตัวอักษร, เว้นวรรคตรงกลางได้ 1 เคาะระหว่างชื่อ-นามสกุล, ห้ามมีตัวเลข/อักขระพิเศษ
  @Matches(/^[a-zA-Z\u0E00-\u0E7F]+(?:\s[a-zA-Z\u0E00-\u0E7F]+)*$/, {
    message: 'Name must only contain letters and a single space between words',
  })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format (missing @ or .)' })
  // 1. ตัดช่องว่างหัว-ท้าย และแปลงเป็นตัวพิมพ์เล็ก
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  // 2. Regex: ห้ามมีช่องว่างใน Email เด็ดขาด (ป้องกัน spacebar ตรงกลาง)
  @Matches(/^\S+$/, { message: 'Email must not contain any spaces' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  // 1. ตัดช่องว่างหัว-ท้าย (ถ้าใส่ space ล้วนๆ มา จะกลายเป็นสตริงว่าง "" และติด @IsNotEmpty ทันที)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password is too long' })
  // 2. Regex: ห้ามมีช่องว่างแทรกในรหัสผ่าน
  @Matches(/^\S*$/, { message: 'Password cannot contain spaces' })
  // 3. ความปลอดภัย: บังคับตัวใหญ่, ตัวเล็ก, ตัวเลข อย่างน้อย 1 ตัว
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain uppercase, lowercase, and a number',
  })
  password: string;
}
