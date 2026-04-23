import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'OWNER', 'STAFF'])
  role?: 'ADMIN' | 'OWNER' | 'STAFF';
}
