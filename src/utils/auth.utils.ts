import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { HttpError } from 'src/errors';
import { log } from 'src/log';

export function isTokenExpired(expiresIn: number, emittedAt: number) {
  return Date.now() > ((expiresIn * 1000) + emittedAt);
}

export function getTokenPayload(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET || '');
}

export function validatePassword(password: string, currentPassword: string) {
  return bcrypt.compare(password, currentPassword);
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

export async function verifyOauthIdToken(token: string): Promise<string> {
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const userId = payload?.sub;

    if (userId) return userId;

    throw new HttpError(403, 'Invalid or expired token');
  } catch (error) {
    log.error('Error while verifying the token', error);
    throw new HttpError(403, 'Invalid or expired token');
  }
}
