import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Product } from 'src/models/product.model';
import { RolesEnum } from 'src/helpers/enum.helpers';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import {
  AdminDto,
  CreateProductDto,
  IdDto,
  UpdateProductDto,
} from 'src/common/dtos/product.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getUsers(): Promise<IServiceResponse> {
    const users = await this.userModel.find();
    return {
      data: {
        users,
      },
    };
  }

  async getUser(body: IdDto): Promise<IServiceResponse> {
    const user = await this.userModel.findById(body.id).populate({
      path: 'products',
      model: 'Product',
      match: { isApproved: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      data: {
        user,
      },
    };
  }

  async getProfile(id: string): Promise<IServiceResponse> {
    const user = await this.userModel.findById(id).populate({
      path: 'products',
      model: 'Product',
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      data: {
        role: user.role,
        id: user.id,
      },
    };
  }

  async createProduct(
    userId: string,
    createProductDto: CreateProductDto,
  ): Promise<IServiceResponse> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const newProduct = new this.productModel({
      ...createProductDto,
      user: user.id,
    });
    await newProduct.save();
    user.products.push(newProduct.id);
    await user.save();
    return {
      data: {
        product: newProduct,
      },
    };
  }

  async getProducts (): Promise<IServiceResponse> {
    const products = await this.productModel.find();
    return {
      data: {
        products,
      },
    };
  }

  async getUserProducts(userId: string): Promise<IServiceResponse> {
    const user = await this.userModel.findById(userId).populate('products');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      data: {
        products: user.products,
      },
    };
  }

  async getPublicProducts(): Promise<IServiceResponse> {
    const products = await this.productModel
      .find({ isApproved: true })
      .select('-user');
    return {
      data: {
        products,
      },
    };
  }

  async getProduct(productId: string): Promise<IServiceResponse> {
    const product = await this.productModel.findById(productId).select('-user');
    if (!product) {
      throw new UnauthorizedException('Product not found');
    }
    return {
      data: {
        product,
      },
    };
  }

  async updateProduct(
    userId: string,
    body: UpdateProductDto,
  ): Promise<IServiceResponse> {
    const product = await this.productModel.findById(body.id).populate('user');
    if (!product) {
      throw new UnauthorizedException('Product not found');
    }
    if (product.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this product',
      );
    }
    if (product.user.role !== RolesEnum.ADMIN && !product.isApproved) {
      throw new UnauthorizedException(
        'You are not authorized to update this product',
      );
    }
    await product.updateOne(
      {
        $set: body,
      },
      { new: true },
    );
    return {
      data: {
        product,
        message: 'Product updated successfully',
      },
    };
  }

  async deleteProduct(body: IdDto, userId: string): Promise<IServiceResponse> {
    const [product, user] = await Promise.all([
      this.productModel.findById(body.id),
      this.userModel.findById(userId),
    ])
    if (!product) {
      throw new UnauthorizedException('Product not found');
    }
    if (product.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this product',
      );
    }
    user.products = user.products.filter((id) => id !== product.id);

    await Promise.all([product.deleteOne(), user.save()]);

    return {
      data: {
        message: 'Product deleted successfully',
      },
    };
  }

  async approveProduct(
    userId: string,
    role: string,
    productId: string,
  ): Promise<IServiceResponse> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if(role !== RolesEnum.ADMIN) {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new UnauthorizedException('Product not found');
    }
    product.isApproved = true;
    await product.save();
    return {
      data: {
        product,
      },
    };
  }

  async banUser(body: IdDto, role: string): Promise<IServiceResponse> {
    if (role !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    const user = await this.userModel.findById(body.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.isBanned = true;
    await user.save();

    return {
      data: {
        message: 'User has been banned',
        user: user,
      },
    };
  }

  async unbanUser(body: IdDto, role: string): Promise<IServiceResponse> {
    if (role !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    const user = await this.userModel.findById(body.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.isBanned = false;
    await user.save();

    return {
      data: {
        message: 'User has been unbanned',
        user: user,
      },
    };
  }
}
