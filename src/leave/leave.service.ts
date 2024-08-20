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
import { generate } from 'rxjs';
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

  async findAll(): Promise<Leave[]> {
    return await this.leaveRepository.find({
      relations: ['leaveType', 'createdBy'],
    });
  }

  async findLeavesByLeaveType(leaveTypeId: string): Promise<Leave[]> {
    const leaves = await this.leaveRepository.find({
      where: { leaveType: { id: leaveTypeId } },
    });
    return leaves;
  }

  async findLeavesByLeaveTypeAndUser(
    userId: string,
    leaveTypeId: string,
  ): Promise<Leave[]> {
    if (!userId || !leaveTypeId) {
      throw new BadRequestException('User id and leave type id is required');
    }
    if (!isUUID(leaveTypeId)) {
      throw new BadRequestException('Invalid leave type id');
    }
    return await this.leaveRepository.find({
      where: { createdBy: { id: userId }, leaveType: { id: leaveTypeId } },
    });
  }

  async findAllLeavesByUser(userId: string): Promise<Leave[]> {
    checkIfUserIdIsValid(userId);
    return await this.leaveRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['leaveType'],
    });
  }

  checkForMonthlyRestriction(
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

    const existingLeavesWithSameType = await this.findLeavesByLeaveTypeAndUser(
      userId,
      leaveType.id,
    );

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

    const savedLeave = await this.leaveRepository.save(leave);
    return savedLeave;
  }
}
