import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationService } from 'src/organization/organization.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto, UpdateTeamDto } from './dtos/team.dto';
import { isUUID } from 'class-validator';
import { checkIfIdIsValid } from 'src/common/utils/common.utils';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    private readonly organizationService: OrganizationService,

    private readonly userService: UserService,
  ) {}

  async findOne(id: string): Promise<Team> {
    checkIfIdIsValid(id, 'team');
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({
      relations: ['users'],
    });
  }

  async findByOrganization(organizationId: string): Promise<Team[]> {
    checkIfIdIsValid(organizationId, 'organization');
    return await this.teamRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['users'],
    });
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { organizationId, abbreviation, name, description } = createTeamDto;
    const organization = await this.organizationService.findOne(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const team = this.teamRepository.create({
      name,
      organization,
      abbreviation,
      description,
    });
    return await this.teamRepository.save(team);
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    Object.assign(team, updateTeamDto);
    return await this.teamRepository.save(team);
  }

  async joinTeam(id: string, userId: string): Promise<User> {
    checkIfIdIsValid(id, 'team');
    const team = await this.findOne(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userService.updateUserTeam(user.id, team);
  }
}
