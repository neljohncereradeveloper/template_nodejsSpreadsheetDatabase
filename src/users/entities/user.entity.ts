import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: 'uuid Automated data' })
  ID?: string;
  @ApiProperty({ example: 'john', description: 'Username without spacing' })
  userName?: string;
  @ApiProperty({ description: 'Automated data' })
  qrCode?: string;
  @ApiProperty({ example: 'Neljohn Cerera', description: 'Your fullname' })
  fullName?: string;
  @ApiProperty({ example: 12, description: 'Your Age' })
  age?: number;
  @ApiProperty({ example: '08-19-1993', description: 'Your Birthdate' })
  birthDate?: string;
  @ApiProperty({ example: 'Male', description: 'Male | Female' })
  gender?: string;
  @ApiProperty({ example: 'Toril Davao City', description: 'Full address' })
  address?: string;
  @ApiProperty({
    example: 'TRUE',
    description: 'Values for determing the account activation.',
  })
  isActive?: string;
}
