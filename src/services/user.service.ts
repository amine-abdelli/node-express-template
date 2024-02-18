import { User } from '@prisma/client';
import { Request } from 'express';
import bcrypt from 'bcryptjs';
import { log } from 'src/log';
import { formatEmail } from 'src/utils/email.utils';
import { UserModel } from 'src/model';
import { emailPolicy, passwordPolicy } from 'src/utils';
import {
  createUserRepository, deleteUserRepository, getUserByEmailRepository,
  getUserByIdRepository, updateUserByIdRepository,
} from 'src/repositories';
import { HttpError, errorMessages } from 'src/errors';
import { sendWelcomeEmail } from './mailing.service';

export async function createUserService(
  { email, password }: UserModel,
): Promise<User> {
  log.info('Creating user with data:', { email });

  if (!emailPolicy.test(email)
    || !passwordPolicy.test(password)) {
    throw new HttpError(400, errorMessages.INVALID_EMAIL_OR_PASSWORD);
  }

  const user = await getUserByEmailRepository(email);

  if (user) {
    throw new HttpError(403, errorMessages.EMAIL_ALREADY_USED);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await createUserRepository({
    email: formatEmail(email),
    password: hashedPassword,
  });

  if (!createdUser) {
    throw new HttpError(500, errorMessages.USER_CREATION_ERROR);
  }

  // Send welcome email on user creation success
  await sendWelcomeEmail(createdUser.email, createdUser.email.split('@')[0]);

  log.info('User created successfully:', { email: createdUser.email });

  return createdUser;
}

export async function deleteUserService(req: Request) {
  const { password } = req.body;

  log.info('Deleting user:', { userId: req.userId });

  if (!password) {
    throw new HttpError(400, errorMessages.EMAIL_OR_PASSWPRD_MISSING_PARAMETER);
  }

  const userToDelete = await getUserByIdRepository(req.userId);

  if (!userToDelete) {
    throw new HttpError(404, errorMessages.CANNOT_DELETE_USER);
  }

  const isPasswordValid = await bcrypt.compare(password, userToDelete.password);

  if (!isPasswordValid) {
    throw new HttpError(401, errorMessages.INVALID_PASSWORD);
  }

  const deleteResponse = await deleteUserRepository(userToDelete.id);

  log.info('User deleted successfully:', { userId: userToDelete.id });

  return deleteResponse;
}

export async function getUserByIdService(req: Request): Promise<User> {
  const { userId } = req;

  log.info('Getting one user by ID: ', { userId });

  if (!userId) {
    throw new HttpError(400, errorMessages.MISSING_USER_ID);
  }

  const user: User | null = await getUserByIdRepository(userId);

  if (!user) {
    throw new HttpError(404, errorMessages.USER_NOT_FOUND);
  }

  log.info('User data retrieved successfully:', { email: user.email });
  return user;
}

export async function getUserByEmailService(email: string): Promise<User | null> {
  log.info('Getting user by email: ', { email });

  if (!emailPolicy.test(email)) {
    throw new HttpError(400, errorMessages.INVALID_EMAIL_FORMAT);
  }

  const user = await getUserByEmailRepository(email);

  if (!user) {
    throw new HttpError(404, errorMessages.USER_NOT_FOUND);
  }

  log.info('User data retrieved successfully:', { email: user.email });

  return user;
}

export async function updateUserByIdService(userId: string, data: User):
  Promise<User> {
  log.info('Updating user by ID: ', userId);

  if (!userId) {
    throw new HttpError(400, errorMessages.MISSING_USER_ID);
  }

  const user = await getUserByIdRepository(userId);

  if (!user) {
    throw new HttpError(404, errorMessages.USER_NOT_FOUND);
  }

  const updatedUser = await updateUserByIdRepository(user.id, data);

  if (!updatedUser) {
    throw new HttpError(500, errorMessages.USER_UPDATE_ERROR);
  }

  log.info('User updated successfully:', { email: updatedUser?.email });
  return updatedUser;
}

export async function updatePasswordService(req: Request) {
  log.info('Updating password', { userId: req.userId });

  const { oldPassword, newPassword } = req.body;

  if (!passwordPolicy.test(newPassword)) {
    throw new HttpError(400, errorMessages.PASSWORD_POLICY_VIOLATION);
  }

  if (!oldPassword || !newPassword) {
    throw new HttpError(400, errorMessages.MISSING_OLD_OR_NEW_PASSWORD);
  }

  const user = await getUserByIdRepository(req.userId);

  if (!user) {
    throw new HttpError(404, errorMessages.USER_NOT_FOUND);
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, errorMessages.INVALID_PASSWORD);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await updateUserByIdRepository(user.id, { password: hashedPassword });

  log.info('Password updated successfully:', { email: updatedUser?.email });

  return updatedUser;
}
