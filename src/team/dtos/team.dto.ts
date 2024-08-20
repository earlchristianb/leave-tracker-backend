import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateTeamDto extends PartialType(
  OmitType(CreateTeamDto, ['organizationId']),
) {}
