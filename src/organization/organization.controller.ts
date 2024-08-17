import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/organization.dto';
import { CreateOrganizationLeaveTypeDto } from './dto/organization-leave-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
    constructor(
        private readonly organizationService: OrganizationService
    ) { }

    @Get()
    async findAll() {
        return await this.organizationService.findAll();
    }

    @Get(":id")
    async findOne(id: string) {
        return await this.organizationService.findOne(id);
    }

    @Get("invite-code/:inviteCode")
    async findOneByInviteCode(inviteCode: string) {
        return await this.organizationService.findOneByInviteCode(inviteCode);
    }

    @Post()
    async create(@Body() data: CreateOrganizationDto) {
        return await this.organizationService.create(data);
    }

    @Get(":id/leave")
    async findAllLeave(@Param("id") organizationId: string) {
        return await this.organizationService.findALlLeaveTypesByOrganization(organizationId);
    }

    @Get(":id/leave/:leaveId")
    async findOneLeave(@Param("id") organizationId: string, @Param("leaveId") leaveId: string) {
        return await this.organizationService.findOneLeaveTypeByOrganization(organizationId, leaveId);
    }

    @Post(":id/leave")
    async createLeave(@Param("id") organizationId: string, @Body() data: CreateOrganizationLeaveTypeDto) {
        return await this.organizationService.createLeave(organizationId, data);
    }

    @Patch(":id")
    async update(id: string, data: any) {
        return await this.organizationService.update(id, data);
    }
}
