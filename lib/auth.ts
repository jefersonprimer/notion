import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getUserId(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return null;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not found');

    const decoded = jwt.verify(token, secret);
    return (decoded as any).sub || null;
  } catch (err) {
    return null;
  }
}
