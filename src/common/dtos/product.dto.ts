import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
   @ApiProperty()
   @IsString()
   id: string;
}

export class IdDto{
   @ApiProperty()
   @IsString()
   id: string;
}

export class AdminDto extends IdDto{
   @ApiProperty()
   @IsString()
   role: string;
}