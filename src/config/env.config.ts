import * as env from 'env-var';
import {config} from 'dotenv';


config();


export const MONGO_URI = env.get('MONGO_URI').asString();
export const JWT_SECRET = env.get('JWT_SECRET').asString();
