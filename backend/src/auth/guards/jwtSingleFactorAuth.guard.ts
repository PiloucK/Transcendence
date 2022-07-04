import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSingleFactorAuthGuard extends AuthGuard('jwt-single-factor') {}
