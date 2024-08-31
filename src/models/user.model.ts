import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as mongooseSchema} from 'mongoose';
import {RolesEnum} from 'src/helpers/enum.helpers';

export type UserDocument = User & HydratedDocument<User>;

@Schema({ timestamps: true })

export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: RolesEnum.USER, enum: RolesEnum })
  role: string;

  @Prop({ default: false})
  isBanned: boolean;

  @Prop({ default: [], type: [mongooseSchema.Types.ObjectId], ref: 'Product' })
   products: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);