import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as mongooseSchema} from 'mongoose';
import { UserDocument } from './user.model';

export type ProductDocument = Product & HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({type: mongooseSchema.Types.ObjectId, ref: 'User' })
  user: UserDocument;
}

export const ProductSchema = SchemaFactory.createForClass(Product);