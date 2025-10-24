// src/common/base/base-role.controller.ts
import { UseGuards, BadRequestException } from '@nestjs/common';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
export abstract class BaseRoleController {
  protected getUserId(req: any): number {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('User tidak ditemukan');
    return userId;
  }

  protected getUserRole(req: any): string {
    return req.user?.role;
  }
}
