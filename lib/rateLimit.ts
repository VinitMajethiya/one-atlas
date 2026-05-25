import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; reset: number }>();

export function getRateLimitKey(request: NextRequest, userId: string | null): string {
  if (userId && userId !== 'anonymous-user') {
    return userId;
  }
  return request.headers.get('x-forwarded-for') || '127.0.0.1';
}

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
