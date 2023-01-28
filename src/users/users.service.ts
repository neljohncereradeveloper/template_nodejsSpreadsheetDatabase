import { formatDate } from './../helper/formatDate';
import * as bcrypt from 'bcrypt';
import { updateSpreadsheet } from './../helper/spreadsheet/updateSpreadsheet';
import { appendSpreadsheet } from './../helper/spreadsheet/appendSpreadsheet';
import { getRowsSpreadsheet } from './../helper/spreadsheet/getRowsSpreadsheet';
import { ConfigService } from '@nestjs/config';
import { ResponseProps } from './../types';
import { User } from './entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { customAlphabet } from 'nanoid';
import { uppercase, alphanumeric } from 'nanoid-dictionary';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  async findAll(): Promise<User[] | undefined | null> {
    const { data } = await getRowsSpreadsheet({
      _spreadsheetId: this.configService.get('SPREADSHEET_ID'),
      keyFile: this.configService.get('KEYFILE'),
      range: 'Users!A:J',
    });
    const users: User[] = [];
    data?.map((row: any) => {
      if (row[3] === 'QR Code') return null;
      return users.push({
        ID: row[0],
        userName: row[1],
        qrCode: row[3],
        fullName: row[4],
        age: row[5],
        birthDate: row[6],
        gender: row[7],
        address: row[8],
        isActive: row[9],
      });
    });
    return users;
  }

  async findOne(qrCode: string): Promise<ResponseProps> {
    const { data } = await getRowsSpreadsheet({
      _spreadsheetId: this.configService.get('SPREADSHEET_ID'),
      keyFile: this.configService.get('KEYFILE'),
      range: 'Users!A:J',
    });
    const userData = data.find((row: any) => row[3] === qrCode);
    return {
      data: {
        ID: userData[0],
        userName: userData[1],
        qrCode: userData[3],
        fullName: userData[4],
        age: userData[5],
        birthDate: userData[6],
        gender: userData[7],
        address: userData[8],
        isActive: userData[9],
      } as User,
      isSuccess: true,
      error: null,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseProps> {
    const nanoidUppercase = customAlphabet(uppercase, 10);
    const nanoidAlphanumeric = customAlphabet(alphanumeric, 10);
    const dt = new Date();
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(createUserDto.password, salt);
    const data = await appendSpreadsheet({
      _spreadsheetId: this.configService.get('SPREADSHEET_ID'),
      keyFile: this.configService.get('KEYFILE'),
      range: 'Users!A:L',
      values: [
        nanoidAlphanumeric(),
        createUserDto.userName,
        hash,
        nanoidUppercase(),
        createUserDto.fullName,
        createUserDto.age,
        formatDate(createUserDto.birthDate),
        createUserDto.gender,
        createUserDto.address,
        'TRUE',
        dt.toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
        dt.toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
      ],
    });
    return {
      data: {
        ID: data[0],
        userName: data[1],
        qrCode: data[3],
        fullName: data[4],
        age: data[5],
        birthDate: data[6],
        gender: data[7],
        address: data[8],
        isActive: data[9],
        created_at: data[10],
      },
      message: 'User created successfully',
      isSuccess: true,
      error: null,
    };
  }

  async update(
    qrCode: string,
    updateUserDto: UpdateUserDto
  ): Promise<ResponseProps> {
    const { data: rowsData } = await getRowsSpreadsheet({
      _spreadsheetId: this.configService.get('SPREADSHEET_ID'),
      keyFile: this.configService.get('KEYFILE'),
      range: 'Users!A:J',
    });

    let rowIndex = 0;
    let created_at: any;
    const dt = new Date();

    const isUserFound = rowsData.some((row: any, index) => {
      if (row[3] === qrCode && row[9] === 'TRUE') {
        rowIndex = index + 1;
        created_at = row[10];
        return true;
      }
      return false;
    });

    if (!isUserFound) {
      throw new NotFoundException('User Not Found.');
    }

    await updateSpreadsheet({
      _spreadsheetId: this.configService.get('SPREADSHEET_ID'),
      keyFile: this.configService.get('KEYFILE'),
      range: `Users!E${rowIndex}:L${rowIndex}`,
      values: [
        updateUserDto.fullName,
        updateUserDto.age,
        formatDate(updateUserDto.birthDate),
        updateUserDto.gender,
        updateUserDto.address,
        'TRUE',
        created_at,
        dt.toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
      ],
    });

    return {
      message: 'Updated successfully',
      isSuccess: true,
      error: null,
    };
  }

  async remove(qrCode: string): Promise<ResponseProps> {
    const { data: rowsData } = await getRowsSpreadsheet({
      _spreadsheetId: this.configService.get('SPREADSHEET_ID'),
      keyFile: this.configService.get('KEYFILE'),
      range: 'Users!D:K',
    });

    let rowIndex = 0;
    let created_at: any;
    const dt = new Date();

    const isUserFound = rowsData.some((row: any, index) => {
      if (row[0] === qrCode && row[6] === 'TRUE') {
        rowIndex = index + 1;
        created_at = row[10];
        return true;
      }
      return false;
    });

    if (!isUserFound) {
      throw new NotFoundException('User Not Found.');
    }

    await updateSpreadsheet({
      _spreadsheetId: this.configService.get('SPREADSHEET_ID'),
      keyFile: this.configService.get('KEYFILE'),
      range: `Users!J${rowIndex}:L${rowIndex}`,
      values: [
        'FALSE',
        created_at,
        dt.toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
      ],
    });
    return {
      message: 'Deleted successfully',
      isSuccess: true,
      error: null,
    };
  }
}
