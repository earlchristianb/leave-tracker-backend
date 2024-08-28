import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { PartialType, OmitType } from '@nestjs/mapped-types';

const id = 'id';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  //TODO: When Custom decorator is implemented, remove this property.
  //we will use the custom decorator to get the role instead of explicitly defining it here.
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: 'Invalid role',
  })
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  inviteCode?: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['inviteCode'] as const),
) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  accountSetup?: boolean;
}
