import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  room_id: number;

  @IsDateString()
  @IsNotEmpty()
  check_in_date: string;

  @IsDateString()
  @IsNotEmpty()
  check_out_date: string;
}
