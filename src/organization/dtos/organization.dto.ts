import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  driveLink?: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 10, {
    always: true,
    message: 'Invite code must be between 5 to 10 characters',
  })
  inviteCode: string;

  @IsString()
  description: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
