import zod from 'zod';
import jwt from 'jsonwebtoken';

export const generateToken = (payload: object) => {
    const secretKey = process.env.JWT_SECRET || 'default_secret';
    return jwt.sign(payload, secretKey);
}

export const signupSchema = zod.object({
    userName: zod.string().min(3, 'Username must be at least 3 characters long'),
    email: zod.string().email('Invalid email address'),
    password: zod.string().min(6, 'Password must be at least 6 characters long'),
});