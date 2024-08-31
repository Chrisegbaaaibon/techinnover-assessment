// src/common/dtos/response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MetaDto {
  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage?: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages?: number;

  @ApiProperty({ example: 100, description: 'Total number of items' })
  totalItems?: number;
}

export class ProductDto {
  @ApiProperty({ example: '5f9f1b9b9b9b9b9b9b9b9b9b', description: 'Product ID' })
  id: string;

  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  name: string;

  @ApiProperty({ example: 100, description: 'Price of the product' })
  price: number;

  @ApiProperty({ example: 'Product description', description: 'Description of the product' })
  description: string;

  @ApiProperty({ example: true, description: 'Whether the product is approved' })
  isApproved: boolean;
}

export class UserDto {
  @ApiProperty({ example: '5f9f1b9b9b9b9b9b9b9b9b9b', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
  email: string;

  @ApiProperty({ example: 'user', description: 'Role of the user' })
  role: string;

  @ApiProperty({ example: false, description: 'Whether the user is banned' })
  isBanned: boolean;

  @ApiProperty({ type: [ProductDto], description: 'Products associated with the user' })
  @Type(() => ProductDto)
  products: ProductDto[];
}

export class CreateProductResponseDto {
  @ApiProperty({ type: ProductDto })
  @Type(() => ProductDto)
  product: ProductDto;
}

export class GetProductsResponseDto {
  @ApiProperty({ type: [ProductDto] })
  @Type(() => ProductDto)
  products: ProductDto[];
}

export class GetUsersResponseDto {
  @ApiProperty({ type: [UserDto] })
  @Type(() => UserDto)
  users: UserDto[];
}

export class GetUserResponseDto {
  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  user: UserDto;
}

export class GetProfileResponseDto {
  @ApiProperty({ example: 'user', description: 'Role of the user' })
  role: string;

  @ApiProperty({ example: '5f9f1b9b9b9b9b9b9b9b9b9b', description: 'User ID' })
  id: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation successful', description: 'Response message' })
  message: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: {
   accessToken: 'eyJhbGciy ...',
  }, description: 'Access token' })
  token: {
      accessToken: string;
  };
}