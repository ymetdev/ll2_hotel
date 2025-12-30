export class CreateBookingDto {
  room_id: number;
  check_in_date: string; // รับเป็น ISO String เช่น "2025-12-01"
  check_out_date: string; // รับเป็น ISO String เช่น "2025-12-05"
}
