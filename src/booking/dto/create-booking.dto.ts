import { IsInt, IsNotEmpty, IsDateString, IsIn } from 'class-validator';

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

  @IsIn(['cancelled', 'confirmed', 'pending'])
  status: string;
}
