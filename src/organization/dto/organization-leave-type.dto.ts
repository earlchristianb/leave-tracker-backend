import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, MaxLength, Min, MIN_DATE, MIN_LENGTH } from 'class-validator';
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

    @IsOptional()
    @IsString(
        {
            always: true,
            message: 'Additional info must be a string',
        }
    )
    @MaxLength(500, {
        always: true,
        message: 'Additional info must be less than 500 characters',
    })
    additionlInfo?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationLeaveTypeDto) { }
