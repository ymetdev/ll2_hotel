import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive() // 👈 ต้อง > 0
  price_per_night: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive() // 👈 ต้อง > 0
  total_rooms: number;
}
