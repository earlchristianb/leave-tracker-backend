import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrganizationLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  leaveName: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(99)
  maxLeavesPerYear: number;

  @IsOptional()
  @IsNumber()
  monthlyRestriction?: number;

  @IsString()
  @IsNotEmpty()
  leaveDescription: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(5)
  abbreviation: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @MaxLength(500, {
    always: true,
    message: 'Additional info must be less than 500 characters',
  })
  @IsString()
  additionalInfo?: string;
}

export class UpdateOrganizationLeaveTypeDto extends PartialType(
  CreateOrganizationLeaveTypeDto,
) {}
