import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { OrganizationService } from 'src/organization/organization.service';
import { Organization } from 'src/organization/entities/organization.entity';
import { UserRole } from './enums/user-role.enum';
import { validate as isUUID } from 'uuid';
import { Team } from 'src/team/entities/team.entity';
import { checkIfIdIsValid } from 'src/common/utils/common.utils';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: data.email },
        {
          id: data.id,
        },
      ],
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('User Id is required');
    }
    return await this.userRepository.findOne({
      where: { id },
      relations: ['organization', 'team'],
    });
  }

  findAllByTeam(teamId: string) {
    checkIfIdIsValid(teamId, 'team');
    return this.userRepository.find({
      where: { team: { id: teamId } },
    });
  }

  async findAllByOrganization(organizationId: string) {
    if (!isUUID(organizationId)) {
      throw new BadRequestException('Invalid Organization Id');
    }

    if (!organizationId) {
      throw new BadRequestException('Organization Id is required');
    }
    return await this.userRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['organization', 'team'],
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async updateUserOrganization(userId: string, organization: Organization) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.organization = organization;
    return await this.userRepository.save(user);
  }

  async updateUserTeam(userId: string, team: Team) {
    if (!team) {
      throw new BadRequestException('Team is required');
    }
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.team = team;
    user.accountSetup = true;
    return await this.userRepository.save(user);
  }

  async removeOne(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.remove(user);
  }
}
