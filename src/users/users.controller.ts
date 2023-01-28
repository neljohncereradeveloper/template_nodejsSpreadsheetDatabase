/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ResponseProps } from './../types';
import { User } from './entities/user.entity';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('qrCode=:qrCode')
  async findOne(@Param('qrCode') qrCode: string): Promise<ResponseProps> {
    return await this.usersService.findOne(qrCode);
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseProps> {
    return await this.usersService.create(createUserDto);
  }

  @Patch('update/qrCode:qrCode')
  async update(
    @Param('qrCode') qrCode: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseProps> {
    return await this.usersService.update(qrCode, updateUserDto);
  }

  @Delete('delete/qrCode:qrCode')
  async remove(@Param('qrCode') qrCode: string): Promise<ResponseProps> {
    return await this.usersService.remove(qrCode);
  }
}
