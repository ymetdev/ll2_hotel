import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';

// room.controller.ts
@Controller('rooms')
@UseGuards(AuthGuard, RolesGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Roles('admin') // ล็อค: เฉพาะ Admin เท่านั้นที่สร้างห้องได้
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Public() // ปลอดภัยแบบยืดหยุ่น: ใครๆ ก็ดูรายการห้องพักได้โดยไม่ต้อง Login
  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin') // ล็อค: เฉพาะ Admin เท่านั้นที่แก้ไขห้องได้
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @Roles('admin') // ล็อค: เฉพาะ Admin เท่านั้นที่ลบห้องได้
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
