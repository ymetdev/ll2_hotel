export class CreateRoomDto {
  name: string;
  description?: string;
  price_per_night: number; // หรือ String ถ้าต้องการความแม่นยำของ Decimal
  total_rooms: number;
}
