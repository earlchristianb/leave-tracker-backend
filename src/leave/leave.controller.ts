import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dtos/leave.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('leaveTypeId') leaveTypeId: string,
  ) {
    if (userId && leaveTypeId) {
      return this.leaveService.findLeavesByLeaveTypeAndUser(
        userId,
        leaveTypeId,
      );
    }
    if (userId) {
      return this.leaveService.findAllLeavesByUser(userId);
    }
    if (leaveTypeId) {
      return this.leaveService.findLeavesByLeaveType(leaveTypeId);
    }
    return this.leaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(id);
  }

  @Post()
  create(@Query('userId') userId: string, @Body() data: CreateLeaveDto) {
    return this.leaveService.create(userId, data);
  }

  //TODO: Implement other routes
}
