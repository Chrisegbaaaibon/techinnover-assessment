import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/models/user.model';
import { RolesEnum } from 'src/helpers/enum.helpers';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { CreateUserDto, LoginUserDto } from 'src/common/dtos/auth.dto';
import { generateToken } from 'src/utils/token.provider';
import { Helpers } from 'src/helpers';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<IServiceResponse> {
    const { email } = createUserDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hash = await Helpers.hashPassword(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hash,
    });
    await newUser.save();
    const token = generateToken(newUser);
    return {
      data: {
        token,
      },
    };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<IServiceResponse> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    let isMatch = await Helpers.verifyPassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if(user.isBanned){
      throw new UnauthorizedException('There is an error logging you in. Please contact support');
    }
    const token = generateToken(user);
    return {
      data: {
        token,
      },
    };
  }
}
