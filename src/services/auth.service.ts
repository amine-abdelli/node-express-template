import { Response } from 'express';
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

  if (!email || !password) {
    throw new HttpError(400, errorMessages.MISSING_CREDENTIALS);
  }

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
