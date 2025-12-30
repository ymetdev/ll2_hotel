import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request, // 1. นำเข้า Request
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/role.decorator';
import { Public } from 'src/auth/public.decorator'; // 2. นำเข้า Public Decorator

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public() // 3. เปิดให้คนทั่วไปสมัครสมาชิกได้
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin') // เฉพาะ Admin เท่านั้นที่ดูรายชื่อทั้งหมดได้
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  findOne(@Param('id') id: string, @Request() req) {
    // 4. รับ req เพื่อส่งต่อ user info
    return this.userService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req, // 5. รับ req เพื่อเช็คความเป็นเจ้าของ
  ) {
    return this.userService.update(+id, updateUserDto, req.user);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  remove(@Param('id') id: string, @Request() req) {
    // 6. รับ req เพื่อเช็คความเป็นเจ้าของ
    return this.userService.remove(+id, req.user);
  }
}
