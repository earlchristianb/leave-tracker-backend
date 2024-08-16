import { Controller, Get, Patch, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';

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
    async create(data: any) {
        return await this.organizationService.create(data);
    }

    @Patch(":id")
    async update(id: string, data: any) {
        return await this.organizationService.update(id, data);
    }
}
