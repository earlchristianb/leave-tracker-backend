import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from './entities/leave.entity';
import { CreateLeaveDto } from './dtos/leave.dto';
import { validate as isUUID } from 'uuid';
import { UserService } from 'src/user/user.service';
import { OrganizationService } from 'src/organization/organization.service';
import { checkIfUserIdIsValid } from 'src/common/utils/common.utils';
import { OrgLeaveType } from 'src/organization/entities/organization-leave-type.entity';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    private userService: UserService,
    private organizationService: OrganizationService,
  ) {}

  async findOne(id: string): Promise<Leave> {
    checkIfUserIdIsValid(id);
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['leaveType'],
    });
    if (!leave) {
      throw new NotFoundException('Leave not found');
    }
    return leave;
  }

  async findAll({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }): Promise<{ data: Leave[]; total: number }> {
    const [data, total] = await this.leaveRepository.findAndCount({
      relations: ['leaveType', 'createdBy'],
      skip: skip,
      take: limit,
    });
    return { data, total };
  }

  async findLeavesByLeaveType({
    leaveTypeId,
    skip,
    limit,
  }: {
    leaveTypeId: string;
    skip: number;
    limit: number;
  }): Promise<{ data: Leave[]; total: number }> {
    const [data, total] = await this.leaveRepository.findAndCount({
      where: { leaveType: { id: leaveTypeId } },
      skip: skip,
      take: limit,
    });
    return { data, total };
  }

  async findLeavesByLeaveTypeAndUser({
    userId,
    leaveTypeId,
    skip,
    limit,
  }: {
    userId: string;
    leaveTypeId: string;
    skip: number;
    limit: number;
  }): Promise<{ data: Leave[]; total: number }> {
    if (!userId || !leaveTypeId) {
      throw new BadRequestException('User id and leave type id is required');
    }
    if (!isUUID(leaveTypeId)) {
      throw new BadRequestException('Invalid leave type id');
    }
    const [data, total] = await this.leaveRepository.findAndCount({
      where: { createdBy: { id: userId }, leaveType: { id: leaveTypeId } },
      skip: skip,
      take: limit,
    });
    return {
      data,
      total,
    };
  }

  async findAllLeavesByUser({
    userId,
    skip,
    limit,
  }: {
    userId: string;
    skip: number;
    limit: number;
  }): Promise<{ data: Leave[]; total: number }> {
    checkIfUserIdIsValid(userId);
    const [data, total] = await this.leaveRepository.findAndCount({
      where: { createdBy: { id: userId } },
      relations: ['leaveType'],
      skip: skip,
      take: limit,
    });
    return {
      data,
      total,
    };
  }

  async create(userId: string, data: CreateLeaveDto): Promise<Leave> {
    checkIfUserIdIsValid(userId);
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    console.log('user', user);

    const leaveType =
      await this.organizationService.findOneLeaveTypeByOrganization(
        user.organization.id,
        data.leaveTypeId,
      );

    console.log('leaveType', leaveType);

    const { data: existingLeavesWithSameType } =
      await this.findLeavesByLeaveTypeAndUser({
        userId: userId,
        leaveTypeId: leaveType.id,
        skip: 0,
        limit: Number.MAX_SAFE_INTEGER,
      });

    if (
      leaveType.monthlyRestriction > 0 &&
      existingLeavesWithSameType.length > 0
    ) {
      this.checkForMonthlyRestriction(
        data.dates,
        leaveType,
        existingLeavesWithSameType,
      );
    }

    delete data.leaveTypeId;
    const leave = this.leaveRepository.create({
      ...data,
      leaveType,
      createdBy: user,
    });

    return await this.leaveRepository.save(leave);
  }

  private checkForMonthlyRestriction(
    dates: string[],
    leaveType: OrgLeaveType,
    existingLeavesWithSameType: Leave[],
  ) {
    const restriction = leaveType.monthlyRestriction;
    const pendingLeaveDates = dates.map((date) => new Date(date));
    const leaveDates = existingLeavesWithSameType.map((leave) => leave.dates);
    const leaveDatesArray = leaveDates.flat();
    const leaveDatesArrayDates = leaveDatesArray.map((date) => new Date(date));
    let hitCount = 0;
    for (const date of pendingLeaveDates) {
      for (const leaveDate of leaveDatesArrayDates) {
        if (
          date.getMonth() === leaveDate.getMonth() &&
          date.getFullYear() === leaveDate.getFullYear()
        ) {
          hitCount++;
        }
      }
    }
    if (hitCount >= restriction) {
      throw new BadRequestException('Monthly restriction exceeded');
    }
  }
}
