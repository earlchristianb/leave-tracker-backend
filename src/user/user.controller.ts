import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { IS_ADMIN, ORGANIZATION, TEAM } from 'src/common/constants/constants';
import { GetUser } from 'src/common/decorators/get-user.param.decorator';
import { RequestUser } from 'src/common/types/request-user.type';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions(IS_ADMIN)
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
  update(
    @GetUser() user: RequestUser,
    @Body() data: UpdateUserDto,
    @Param('id') id: string,
  ) {
    if (user.sub === id) {
      return this.userService.update(id, data);
    }

    if (!user.permissions.includes(IS_ADMIN)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return this.userService.update(id, data);
  }

  @Permissions(IS_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeOne(id);
  }
}
