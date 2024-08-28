import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { OrgLeaveType } from './entities/organization-leave-type.entity';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dtos/organization.dto';
import {
  CreateOrganizationLeaveTypeDto,
  UpdateOrganizationLeaveTypeDto,
} from './dtos/organization-leave-type.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/enums/user-role.enum';
import { isUUID } from 'class-validator';
import {
  checkIfIdIsValid,
  checkIfUserIdIsValid,
} from 'src/common/utils/common.utils';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrgLeaveType)
    private readonly orgLeaveTypeRepository: Repository<OrgLeaveType>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.find({
      relations: ['teams','users'],
    });
  }

  async findOne(id: string): Promise<Organization> {
    checkIfIdIsValid(id, 'organization');
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['teams','users'],
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async findOneByInviteCode(inviteCode: string): Promise<Organization> {
    if (!inviteCode) {
      throw new BadRequestException('Invite Code is required');
    }
    const organization = await this.organizationRepository.findOne({
      where: { inviteCode },
      relations: ['users'],
    });
    console.log('organization', organization);
    if (!organization) {
      throw new NotFoundException('Invalid Invite Code');
    }

    return organization;
  }

  async joinOrganization(userId: string, inviteCode: string): Promise<User> {
    console.log(userId, inviteCode);
    if (!userId || !inviteCode) {
      throw new BadRequestException('User Id and Invite Code are required');
    }
    const user = await this.userService.findOne(userId);
    const organization = await this.findOneByInviteCode(inviteCode);
    if (!user || !organization) {
      throw new BadRequestException('Invalid Invite Code or User Id');
    }

    if (user.organization) {
      throw new BadRequestException('User already belongs to an organization');
    }
    // organization.users.push(user);

    console.log('organization after pushing user', organization);
    const updatedUser = await this.userService.updateUserOrganization(
      userId,
      organization,
    );
    // await this.organizationRepository.save(organization);
    return updatedUser;
  }

  async create(
    userId: string,
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    console.log(userId);
    checkIfUserIdIsValid(userId);
    const user = await this.userService.findOne(userId);
    console.log(user);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Only Admin can create an Organization');
    }

    const organization = this.organizationRepository.create({
      ...data,
      createdBy: user,
      users: [user],
    });
    const savedOrganization =
      await this.organizationRepository.save(organization);
    const updatedUser = await this.userService.updateUserOrganization(
      user.id,
      savedOrganization,
    );
    return savedOrganization;
  }

  async update(id: string, data: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    Object.assign(organization, data);
    return await this.organizationRepository.save(organization);
  }

  async removeOrganization(id: string): Promise<void> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    await this.organizationRepository.remove(organization);
  }

  async createLeave(
    organizationId: string,
    createLeaveDto: CreateOrganizationLeaveTypeDto,
  ): Promise<OrgLeaveType> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    const leave = this.orgLeaveTypeRepository.create({
      ...createLeaveDto,
      organization,
    });

    return await this.orgLeaveTypeRepository.save(leave);
  }

  async findALlLeaveTypesByOrganization(
    organizationId: string,
  ): Promise<OrgLeaveType[]> {
    return await this.orgLeaveTypeRepository.find({
      where: { organization: { id: organizationId } },
    });
  }

  async findOneLeaveTypeByOrganization(
    organizationId: string,
    leaveTypeId: string,
  ): Promise<OrgLeaveType> {
    const leaveType = await this.orgLeaveTypeRepository.findOne({
      where: { id: leaveTypeId, organization: { id: organizationId } },
    });
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }
    return leaveType;
  }

  private async findOneLeaveType(leaveTypeId: string): Promise<OrgLeaveType> {
    return await this.orgLeaveTypeRepository.findOne({
      where: { id: leaveTypeId },
    });
  }

  //TODO: Add update and delete methods for leave types and org
  async updateLeaveTypeByOrganization(
    organizationId: string,
    leaveTypeId: string,
    data: UpdateOrganizationLeaveTypeDto,
  ): Promise<OrgLeaveType> {
    const organization = await this.findOne(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const leaveType = await this.findOneLeaveType(leaveTypeId);
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }
    Object.assign(leaveType, data);
    return await this.orgLeaveTypeRepository.save(leaveType);
  }

  async removeLeaveType(
    organizationId: string,
    leaveTypeId: string,
  ): Promise<void> {
    const organization = await this.findOne(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const leaveType = await this.findOneLeaveType(leaveTypeId);
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }
    await this.orgLeaveTypeRepository.remove(leaveType);
  }
}
