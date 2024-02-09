import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';

export function isTokenExpired(expiresIn: number, emittedAt: number) {
  return Date.now() > ((expiresIn * 1000) + emittedAt);
}

export function getTokenPayload(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET || '');
}

export const COOKIE_SETTINGS: CookieOptions = {
  // cookie is valid for all subpaths of my domain
  path: '/',
  // this cookie won't be readable by the browser
  httpOnly: true,
  // and won't be usable outside of my domain
  sameSite: 'none',
  // HTTPS?
  secure: true,
};
