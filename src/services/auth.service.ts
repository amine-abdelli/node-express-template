import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { log } from 'src/log';
import { UserModel } from 'src/model/user.model';
import { getUserByEmailRepository, updateUserByIdRepository } from 'src/repositories';
import { COOKIE_SETTINGS, HttpError, validatePassword } from 'src/utils';

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS512',
} as jwt.SignOptions;

export async function loginService(userCredentials: UserModel, res: Response) {
  const { email, password } = userCredentials;

  log.info('Logging user : ', { email });

  if (!email || !password) {
    throw new HttpError(400, 'Missing username, email or password');
  }

  const user = await getUserByEmailRepository(email);

  const isPasswordValid = await validatePassword(password, user?.password || '');

  if (!user || !isPasswordValid) {
    throw new HttpError(401, 'Incorrect email or password');
  }

  const JWT_TOKEN_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

  const token = jwt.sign(
    { userId: user.id },
    JWT_TOKEN_SECRET,
    jwtConfig,
  );

  if (!token) {
    throw new HttpError(500, 'An error occurred while generating token');
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
