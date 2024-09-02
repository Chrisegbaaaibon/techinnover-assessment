import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateProductDto,
  UpdateProductDto,
  IdDto,
} from 'src/common/dtos/product.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetCurrentUserId,
  GetCurrentUserRole,
} from 'src/common/decorators/get-current-user.decorator';
import {
  CreateProductResponseDto,
  GetProductsResponseDto,
  GetUsersResponseDto,
  GetUserResponseDto,
  GetProfileResponseDto,
  MessageResponseDto,
  ProductDto,
} from 'src/common/dtos/response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('product/create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: CreateProductResponseDto,
  })
  @UseGuards(AuthGuard)
  async createProduct(
    @GetCurrentUserId() userId: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<IServiceResponse<CreateProductResponseDto>> {
    return this.userService.createProduct(userId, createProductDto);
  }

  @Get('all-products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved products successfully',
    type: GetProductsResponseDto,
  })
  @UseGuards(AuthGuard)
  async getAllProducts(): Promise<IServiceResponse<GetProductsResponseDto>> {
    return this.userService.getProducts();
  }

  @Get('products/user')
  @ApiOperation({ summary: 'Get all products for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved products successfully',
    type: GetProductsResponseDto,
  })
  @UseGuards(AuthGuard)
  async getProducts(
    @GetCurrentUserId() userId: string,
  ): Promise<IServiceResponse<GetProductsResponseDto>> {
    return this.userService.getUserProducts(userId);
  }

  @Put('product/update')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductDto,
  })
  @UseGuards(AuthGuard)
  async updateProduct(
    @GetCurrentUserId() userId: string,
    @Body() body: UpdateProductDto,
  ): Promise<IServiceResponse<{ product: ProductDto; message: string }>> {
    return this.userService.updateProduct(userId, body);
  }

  @Delete('product/delete')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: MessageResponseDto,
  })
  @UseGuards(AuthGuard)
  async deleteProduct(
    @GetCurrentUserId() userId: string,
    @Body() body: IdDto,
  ): Promise<IServiceResponse<MessageResponseDto>> {
    return this.userService.deleteProduct(body, userId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved user profile successfully',
    type: GetProfileResponseDto,
  })
  @UseGuards(AuthGuard)
  async getProfile(
    @GetCurrentUserId() userId: string,
  ): Promise<IServiceResponse<GetProfileResponseDto>> {
    return this.userService.getProfile(userId);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved users successfully',
    type: GetUsersResponseDto,
  })
  @UseGuards(AuthGuard)
  async getUsers(): Promise<IServiceResponse<GetUsersResponseDto>> {
    return this.userService.getUsers();
  }

  @Get('user')
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved user successfully',
    type: GetUserResponseDto,
  })
  @UseGuards(AuthGuard)
  async getUser(
    @Body() body: IdDto,
  ): Promise<IServiceResponse<GetUserResponseDto>> {
    return this.userService.getUser(body);
  }

  @Post('approve-product')
  @ApiOperation({ summary: 'Approve a product' })
  @ApiResponse({
    status: 200,
    description: 'Product approved successfully',
    type: ProductDto,
  })
  @UseGuards(AuthGuard)
  async approveProduct(
    @GetCurrentUserId() userId: string,
    @GetCurrentUserRole() role: string,
    @Body() body: IdDto,
  ): Promise<IServiceResponse<{ product: ProductDto }>> {
    return this.userService.approveProduct(userId, role, body.id);
  }

  @Get('public-products')
  @ApiOperation({ summary: 'Get all public products' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved public products successfully',
    type: GetProductsResponseDto,
  })
  async getPublicProducts(): Promise<IServiceResponse<GetProductsResponseDto>> {
    return this.userService.getPublicProducts();
  }

  @Get('product/:id')
  @ApiOperation({ summary: 'Get a specific product' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved product successfully',
    type: ProductDto,
  })
  async getProduct(@Param('id') productId: string): Promise<IServiceResponse> {
    return this.userService.getProduct(productId);
  }

  @Post('ban-user')
  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({
    status: 200,
    description: 'User banned successfully',
    type: MessageResponseDto,
  })
  @UseGuards(AuthGuard)
  async banUser(
    @Body() body: IdDto,
    @GetCurrentUserRole() role: string,
  ): Promise<IServiceResponse> {
    return this.userService.banUser(body, role);
  }

  @Post('unban-user')
  @ApiOperation({ summary: 'Unban a user' })
  @ApiResponse({
    status: 200,
    description: 'User unbanned successfully',
    type: MessageResponseDto,
  })
  @UseGuards(AuthGuard)
  async unbanUser(
    @Body() body: IdDto,
    @GetCurrentUserRole() role: string,
  ): Promise<IServiceResponse> {
    return this.userService.unbanUser(body, role);
  }
}
