import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config/env.config';
import { User, UserDocument } from 'src/models/user.model';

interface Token<T=any, U=any> {
   accessToken?: T;
}
interface JwtPayload {
   id: string,
   role?: string
}

export const generateToken = (user:  UserDocument):Token => {
   const payload: JwtPayload = {
      id: user.id,
      role: user.role,
   };
   const accessToken = sign(payload, JWT_SECRET, {expiresIn: '7d'});
   return {
      accessToken,
   };
};
