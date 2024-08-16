import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { OrgLeaveType } from './entities/organization-leave-type.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrgLeaveType)
    private readonly orgLeaveTypeRepository: Repository<OrgLeaveType>,
  ) {}
  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.find();
  }

  async findOne(id: string): Promise<Organization> {
    return await this.organizationRepository.findOne({
      where: { id },
    });
  }

  async findOneByInviteCode(inviteCode: string): Promise<Organization> {
    return await this.organizationRepository.findOne({
      where: { inviteCode },
    });
  }

  async create(data: Organization): Promise<Organization> {
    const organization = this.organizationRepository.create(data);
    return await this.organizationRepository.save(organization);
  }

  async update(id: string, data: Organization): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
     Object.assign(organization, data);
     return await this.organizationRepository.save(organization);
    
  }

  async createLeaveType(id: string, data: any) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    organization.orgLeaveTypes.push(data);
    return await this.organizationRepository.save(organization);
  }
}
