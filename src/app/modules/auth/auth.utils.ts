import jwt from 'jsonwebtoken';
import { TUserAuthData } from './auth.interface';

//create access token and send it to the client
export const generateToken = (
  jwtPayload: TUserAuthData,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};
