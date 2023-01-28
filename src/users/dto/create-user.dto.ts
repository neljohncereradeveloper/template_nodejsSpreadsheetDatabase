import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message:
      'Username is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(20, {
    message:
      'Username is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  readonly userName?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(30, {
    message:
      'Password is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  readonly password?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message:
      'Fullname is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(40, {
    message:
      'Fullname is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  readonly fullName?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(18)
  @Max(100)
  readonly age?: number;

  readonly birthDate?: Date;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['MALE', 'FEMALE'],{
   message:
      'Gender must be a valid enum value. [ MALE,FEMALE ]',
  })
  readonly gender?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message:
      'Address is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(200, {
    message:
      'Address is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  readonly address?: string;
}
