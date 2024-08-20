import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/user.dto';

const ORGANIZATION = 'organizationId';
const TEAM = 'teamId';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(
    @Query(ORGANIZATION) organizationId: string,
    @Query(TEAM) teamId: string,
  ) {
    if (organizationId) {
      return this.userService.findAllByOrganization(organizationId);
    }
    if (teamId) {
      return this.userService.findAllByTeam(teamId);
    }
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Patch(':id')
  update(@Request() req: Request, @Param('id') id: string) {
    console.log(req['user'].sub);
    return this.userService.update(id, {
      id: req['user'].sub,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeOne(id);
  }
}
