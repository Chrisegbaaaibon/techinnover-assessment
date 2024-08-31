import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/common/dtos/auth.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginResponseDto } from 'src/common/dtos/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: LoginResponseDto })
  async register(@Body() createUserDto: CreateUserDto): Promise<IServiceResponse> {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
   @ApiResponse({ status: 200, description: 'User logged in successfully', type: LoginResponseDto })
  async login(@Body() loginUserDto: LoginUserDto): Promise<IServiceResponse> {
    return this.authService.loginUser(loginUserDto);
  }
}