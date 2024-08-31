import {randomBytes} from 'crypto';
import {hash, verify} from 'argon2'


export class Helpers {
   static generatePublicId(): string {
      return randomBytes(16).toString('hex');
    }
  
    static hashPassword(password: string): Promise<string> {
      const data = hash(password);
      return data;
    }
  
    static verifyPassword(password: string, hash: string): Promise<boolean> {
      const data = verify(hash, password);
      return data;
    }
  
}