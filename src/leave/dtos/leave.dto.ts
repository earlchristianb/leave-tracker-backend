import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsUUID()
  leaveTypeId: string;

  //Frontend Choose date=> convert to iso string =>make a api request => store in db
  @IsISO8601(
    {
      strict: true,
    },
    {
      each: true,
    },
  )
  @IsArray()
  @ArrayMinSize(1, {
    message: 'Select atleast one date',
  })
  dates: string[];

  @IsUrl(
    {},
    {
      message: 'File Link must be a valid URL',
    },
  )
  @IsNotEmpty()
  fileLink: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveDto extends PartialType(CreateLeaveDto) {}
