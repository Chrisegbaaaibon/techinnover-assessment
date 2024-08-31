import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException,
 } from '@nestjs/common';
 import {verify} from 'jsonwebtoken';
 import {UserDocument} from 'src/models/user.model';
 import {JWT_SECRET} from 'src/config/env.config';
 import {UserService} from 'src/modules/user/user.service';
 
 
 @Injectable()
 export class AuthGuard implements CanActivate {
   constructor(private userService: UserService) {}
   async canActivate(context: ExecutionContext) {
     const request = context.switchToHttp().getRequest();
     const authHeader = request.headers.authorization;
     if (!authHeader) {
       throw new UnauthorizedException('You are not authorized to access this resource');
     }
     const token = authHeader.split(' ')[1] || authHeader;
     try {
       const decoded = verify(token, JWT_SECRET);
       const admin = await this.userService.getProfile(decoded);
       request.user = admin.data.user as { id: string; role: string };
       return true;
     } catch (error) {
       console.log(error);
       throw new UnauthorizedException('You are not authorized to access this resource');
     }
   }
 }