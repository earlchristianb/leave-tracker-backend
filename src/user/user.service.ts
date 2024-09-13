import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { Organization } from 'src/organization/entities/organization.entity';
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

  async findAll({
    skip,
    limit,
    search,
  }: {
    skip: number;
    limit: number;
    search?: string;
  }) {
    const whereCondition = search
      ? [{ email: Like(`%${search}%`) }, { name: Like(`%${search}%`) }]
      : {};
    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
      relations: ['organization', 'team'],
    });
    return {
      data,
      total,
    };
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

  async findAllByTeam({
    teamId,
    skip,
    limit,
    search,
  }: {
    teamId: string;
    skip: number;
    limit: number;
    search?: string;
  }) {
    checkIfIdIsValid(teamId, 'team');
    const whereCondition = search
      ? [
          { team: { id: teamId }, name: Like(`%${search}%`) },
          { team: { id: teamId }, email: Like(`%${search}%`) },
        ]
      : { team: { id: teamId } };
    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      relations: ['organization', 'team'],
      skip: skip,
      take: limit,
    });
    return {
      data,
      total,
    };
  }

  async findAllByOrganization({
    organizationId,
    skip,
    limit,
    search,
  }: {
    organizationId: string;
    skip: number;
    limit: number;
    search?: string;
  }) {
    if (!isUUID(organizationId)) {
      throw new BadRequestException('Invalid Organization Id');
    }
    if (!organizationId) {
      throw new BadRequestException('Organization Id is required');
    }

    const whereCondition = search
      ? [
          { organization: { id: organizationId }, name: Like(`%${search}%`) },
          { organization: { id: organizationId }, email: Like(`%${search}%`) },
        ]
      : { organization: { id: organizationId } };
    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      relations: ['organization', 'team'],
      skip: skip,
      take: limit,
    });
    return {
      data,
      total,
    };
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
