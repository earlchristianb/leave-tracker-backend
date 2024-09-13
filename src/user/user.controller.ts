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
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    console.log('skip', skip);
    console.log('limit', limit);
    console.log('search', search);
    const parsedSkip = parseInt(skip, 10) || 0;
    const parsedLimit =
      limit === 'all' ? Number.MAX_SAFE_INTEGER : parseInt(limit, 10) || 10;

    if (organizationId) {
      return this.userService.findAllByOrganization({
        organizationId,
        skip: parsedSkip,
        limit: parsedLimit,
        search,
      });
    }
    if (teamId) {
      return this.userService.findAllByTeam({
        teamId,
        skip: parsedSkip,
        limit: parsedLimit,
        search,
      });
    }
    return this.userService.findAll({
      skip: parsedSkip,
      limit: parsedLimit,
      search,
    });
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
