// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true; // jika tidak ada role spesifik, berarti terbuka untuk semua role

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('User tidak terautentikasi');
    if (!roles.includes(user.role)) {
      throw new ForbiddenException(`Akses ditolak untuk role: ${user.role}`);
    }

    return true;
  }
}
