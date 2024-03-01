import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { HttpError, errorMessages } from 'src/errors';

import { log } from 'src/log';
import { UserModel } from 'src/model/user.model';
import { getUserByEmailRepository, updateUserByIdRepository } from 'src/repositories';
import { COOKIE_SETTINGS, validatePassword } from 'src/utils';

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS512',
} as jwt.SignOptions;

export async function loginService(userCredentials: UserModel, res: Response) {
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

export function logoutService(res: Response) {
  log.info('Trying to logout user !');
  res.clearCookie('session_id', COOKIE_SETTINGS).send({ message: 'User logged out !' });
  log.info('User successfully logged out');
}

export function oauthLoginService(req: Request, res: Response) {
  log.info('Trying to login with OAuth !');
  log.info('googleLogin', req.body);

  res.header('Access-Control-Allow-Origin', process.env.WEB_FRONTEND_URL);
  res.header('Referrer-Policy', 'no-referrer-when-downgrade');

  const redirectUrl = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/auth/oauth/callback';

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl,
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    // TODO: Should be different for production
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'consent',
  });
  console.log('##############################################');
  console.log('authorizeUrl', authorizeUrl);
  console.log('##############################################');

  res.json({ url: authorizeUrl });
}

export async function oauthCallBackService(req: Request, res: Response) {
  log.info('oauth callback', req.query.code);

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
  console.log('req.query.code : ', req.query.code);
  const { tokens } = await oAuth2Client.getToken(req.query.code as string);

  oAuth2Client.setCredentials(tokens);

  const { credentials } = oAuth2Client;

  console.log('credentials', credentials);

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

  // If user not in database, save user in database

  // TODO: Save user to database
  // Otherwise get user from database
  // save user in session

  // TODO: store tokens.id_token in a cookie

  if (!payload) {
    throw new HttpError(404, 'No payload');
  }

  // Redirect to the main application
  res.redirect(302, process.env.WEB_FRONTEND_URL as string);
}

// async function getUserData(access_token: string) {
//   const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
//   const data = await response.json();
//   return data;
// }
