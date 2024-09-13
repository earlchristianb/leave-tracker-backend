import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dtos/leave.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/get-user.param.decorator';
import { RequestUser } from 'src/common/types/request-user.type';

@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('leaveTypeId') leaveTypeId: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Query('leaveTypeId') status: string,
  ) {
    const parsedSkip = parseInt(skip, 10) || 0;
    const parsedLimit =
      limit === 'all' ? Number.MAX_SAFE_INTEGER : parseInt(limit, 10) || 10;

    if (userId && leaveTypeId) {
      return this.leaveService.findLeavesByLeaveTypeAndUser({
        userId,
        leaveTypeId,
        skip: parsedSkip,
        limit: parsedLimit,
      });
    }
    if (userId) {
      return this.leaveService.findAllLeavesByUser({
        userId,
        skip: parsedSkip,
        limit: parsedLimit,
      });
    }
    if (leaveTypeId) {
      return this.leaveService.findLeavesByLeaveType({
        leaveTypeId,
        skip: parsedSkip,
        limit: parsedLimit,
      });
    }
    return this.leaveService.findAll({
      skip: parsedSkip,
      limit: parsedLimit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(id);
  }

  @Post()
  create(@GetUser() user: RequestUser, @Body() data: CreateLeaveDto) {
    return this.leaveService.create(user.sub, data);
  }

  //TODO: Implement other routes
}
