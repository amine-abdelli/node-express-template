import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { HttpError, errorMessages } from 'src/errors';

import { log } from 'src/log';
import {
  createUserRepository, getUserByEmailRepository, getUserByIdRepository, updateUserByIdRepository,
} from 'src/repositories';
import { LoginInput } from 'src/types/auth.types';
import { COOKIE_SETTINGS, validatePassword } from 'src/utils';

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS512',
} as jwt.SignOptions;

/**
 * Login a user
 */
export async function loginService(userCredentials: LoginInput, res: Response) {
  const { email, password } = userCredentials;

  log.info('Logging user : ', { email });

  const user = await getUserByEmailRepository(email);

  const isPasswordValid = await validatePassword(password, user?.password || '');

  if (!user || !isPasswordValid) {
    throw new HttpError(401, errorMessages.INCORRECT_EMAIL_OR_PASSWORD);
  }

  const JWT_TOKEN_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

  const token = jwt.sign(
    { userId: user.id },
    JWT_TOKEN_SECRET,
    jwtConfig,
  );

  if (!token) {
    throw new HttpError(500, errorMessages.TOKEN_GENERATION_ERROR);
  }

  await updateUserByIdRepository(user.id, { last_activity: new Date() });

  log.info('User successfully logged in : ', { email });

  return res.status(200).cookie('session_id', token, COOKIE_SETTINGS).send({ message: 'User logged in !' });
}

/**
 * Logout a user
 */
export function logoutService(res: Response) {
  log.info('Trying to logout user !');
  res.clearCookie('session_id', COOKIE_SETTINGS).send({ message: 'User logged out !' });
  log.info('User successfully logged out');
}

/**
  * Login with OAuth
  */
export function oauthLoginService(req: Request, res: Response) {
  log.info('Trying to login with OAuth !');

  res.header('Access-Control-Allow-Origin', process.env.WEB_FRONTEND_URL);
  res.header('Referrer-Policy', 'no-referrer-when-downgrade');

  const redirectUrl = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/auth/oauth/callback';

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl,
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // TODO: Should be different for production
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'consent',
  });

  res.json({ url: authorizeUrl });
}

/**
 * OAuth callback
 */
export async function oauthCallBackService(req: Request, res: Response) {
  log.info('oauth callback', req.query.code);

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const { tokens } = await oAuth2Client.getToken(req.query.code as string);
  oAuth2Client.setCredentials(tokens);

  // console.log('credentials', credentials);

  const ticket = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token as string,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  /**
    * Payload contains the user's information such as:
    * - email
    * - name
    * - given_name
    * - family_name
    * - picture
    * - sub
    * - locale
    * - iat
    * - exp
    */
  const payload = ticket.getPayload();

  if (!payload) {
    throw new HttpError(500, errorMessages.OAUTH_PAYLOAD_ERROR);
  }

  const {
    email, name, picture, sub, email_verified,
  } = payload;

  const user = await getUserByIdRepository(sub);

  if (!user && email) {
    await createUserRepository({
      id: sub,
      email,
      is_verified: email_verified,
      picture_url: picture,
      username: name,
      password: '',
    });
  }

  await updateUserByIdRepository(
    sub,
    {
      is_verified: email_verified,
      last_activity: new Date(),
      picture_url: picture,
      username: name,
    },
  );

  res.status(200).cookie('session_id', tokens.id_token, COOKIE_SETTINGS).send({ message: 'User logged in !' });
}
