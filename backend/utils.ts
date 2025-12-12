import zod from 'zod';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'default_secret';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const decodeToken = (token: string): any => {
  return jwt.verify(token, SECRET);
};

export const signupSchema = zod.object({
  userName: zod.string().min(3),
  email: zod.string().email(),
  password: zod.string().min(6),
});
