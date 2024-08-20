import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestUser } from '../types/request-user.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    const hasPermission = () =>
      requiredPermissions.every((permission) =>
        user.permissions.includes(permission),
      );
    console.log('has permisison', hasPermission);
    if (!hasPermission()) {
      throw new ForbiddenException('You do not have the required permissions');
    }
    return true;
  }
}
