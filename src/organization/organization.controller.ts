import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/organization.dto';
import {
  CreateOrganizationLeaveTypeDto,
  UpdateOrganizationLeaveTypeDto,
} from './dtos/organization-leave-type.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { IS_ADMIN } from 'src/common/constants/constants';
import { GetUser } from 'src/common/decorators/get-user.param.decorator';
import { RequestUser } from 'src/common/types/request-user.type';

@ApiTags('organization')
@Controller('organization')
@UseGuards(JwtAuthGuard)
@UseGuards(PermissionsGuard)
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Permissions(IS_ADMIN)
  @Get()
  findAll(
    @Query('inviteCode') inviteCode: string,
    @Query('userId') userId: string,
  ) {
    if (userId && inviteCode) {
      return this.organizationService.joinOrganization(userId, inviteCode);
    }
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Permissions(IS_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrganizationDto) {
    return this.organizationService.update(id, data);
  }

  @Permissions(IS_ADMIN)
  @Post()
  create(@Body() data: CreateOrganizationDto, @GetUser() user: RequestUser) {
    return this.organizationService.create(user.sub, data);
  }

  @Permissions(IS_ADMIN)
  @Get(':id/leave')
  findAllLeave(@Param('id') organizationId: string) {
    return this.organizationService.findALlLeaveTypesByOrganization(
      organizationId,
    );
  }

  @Get(':id/leave/:leaveId')
  findOneLeaveType(
    @Param('id') organizationId: string,
    @Param('leaveId') leaveId: string,
  ) {
    return this.organizationService.findOneLeaveTypeByOrganization(
      organizationId,
      leaveId,
    );
  }

  @Permissions(IS_ADMIN)
  @Patch(':id/leave/:leaveId')
  updateOneLeaveTypeByOrganization(
    @Param('id') organizationId: string,
    @Param('leaveId') leaveId: string,
    @Body() data: UpdateOrganizationLeaveTypeDto,
  ) {
    return this.organizationService.updateLeaveTypeByOrganization(
      organizationId,
      leaveId,
      data,
    );
  }

  @Permissions(IS_ADMIN)
  @Post(':id/leave')
  createLeaveType(
    @Param('id') organizationId: string,
    @Body() data: CreateOrganizationLeaveTypeDto,
  ) {
    return this.organizationService.createLeave(organizationId, data);
  }

  @Permissions(IS_ADMIN)
  @Delete(':id')
  removeOrg(@Param('id') id: string) {
    return this.organizationService.removeOrganization(id);
  }

  @Permissions(IS_ADMIN)
  @Delete(':id/leave/:leaveId')
  removeLeaveType(@Param('id') id: string, @Param('leaveId') leaveId: string) {
    return this.organizationService.removeLeaveType(id, leaveId);
  }
}
