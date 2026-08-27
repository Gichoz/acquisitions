import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

export const jwttoken = {
  sign: (payload, options = {}) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d', ...options });
  },
  verify: (token) => {
    return jwt.verify(token, JWT_SECRET);
  },
};