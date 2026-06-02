import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'edifice-properties-uganda-secret-key-2026';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function signJWT(payload: UserSession, expiresIn: string = '24h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyJWT(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (error) {
    return null;
  }
}
