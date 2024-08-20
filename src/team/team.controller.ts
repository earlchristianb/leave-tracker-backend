import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dtos/team.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { IS_ADMIN } from 'src/common/constants/constants';

@Controller('team')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  findAll(@Query('organizationId') organizationId: string) {
    if (organizationId) {
      return this.teamService.findByOrganization(organizationId);
    }
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(id: string) {
    return this.teamService.findOne(id);
  }

  @Permissions(IS_ADMIN)
  @Post()
  create(@Body() data: CreateTeamDto) {
    return this.teamService.create(data);
  }

  @Permissions(IS_ADMIN)
  @Patch(':id')
  update(@Body() data: UpdateTeamDto, @Param('id') id: string) {
    return this.teamService.update(id, data);
  }

  @Post(':id')
  joinTeam(@Param('id') id: string, @Body('userId') userId: string) {
    return this.teamService.joinTeam(id, userId);
  }
}
