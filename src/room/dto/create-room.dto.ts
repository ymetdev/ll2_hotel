import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price_per_night: number;

  @IsNumber()
  @IsNotEmpty()
  total_rooms: number;
}
