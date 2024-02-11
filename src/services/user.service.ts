import { User } from '@prisma/client';
import { Request } from 'express';
import bcrypt from 'bcryptjs';
import { log } from 'src/log';
import { formatEmail } from 'src/utils/email.utils';
import { UserModel } from 'src/model';
import {
  HttpError, emailPolicy, passwordPolicy, usernamePolicy,
} from '../utils';
import {
  createUserRepository, deleteUserRepository, getUserByEmailRepository,
  getUserByIdRepository, getUserByUsernameRepository, updateUserByIdRepository,
} from '../repositories';

export async function createUserService(
  { username, email, password }: UserModel,
): Promise<User> {
  log.info('Creating user with data:', { email });

  if (!emailPolicy.test(email)
    || !passwordPolicy.test(password)
    || !usernamePolicy.test(username)) {
    throw new HttpError(400, 'Invalid email, username or password');
  }

  const user = await getUserByEmailRepository(email);

  if (user) {
    throw new HttpError(403, 'This email is already used');
  }

  const userByUsername = await getUserByUsernameRepository(username);

  if (userByUsername) {
    throw new HttpError(403, 'This username is already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await createUserRepository({
    username,
    email: formatEmail(email),
    password: hashedPassword,
  });

  if (!createdUser) {
    throw new HttpError(500, 'An error occurred while creating a user');
  }

  log.info('User created successfully:', { email: createdUser.email });

  return createdUser;
}

export async function deleteUserService(req: Request) {
  const { password } = req.body;

  log.info('Deleting user:', { userId: req.userId });

  if (!password) {
    throw new HttpError(400, 'Email or password parameter missing');
  }
  const userToDelete = await getUserByIdRepository(req.userId);

  if (!userToDelete) {
    throw new HttpError(404, 'Cannot perform user deletion as user could not be found');
  }

  const isPasswordValid = await bcrypt.compare(password, userToDelete.password);

  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid password');
  }

  const deleteResponse = await deleteUserRepository(userToDelete.id);

  log.info('User deleted successfully:', { userId: userToDelete.id });
  return deleteResponse;
}

export async function getUserByIdService(req: Request): Promise<User> {
  const { userId } = req;
  log.info('Getting one user by ID: ', { userId });
  const username = req.query.username as string;
  const isVisitingOwnProfile = !username;

  if (!userId) {
    throw new HttpError(400, 'Missing user ID');
  }

  let user: User | null;

  if (isVisitingOwnProfile) {
    user = await getUserByIdRepository(userId);
  } else {
    user = await getUserByUsernameRepository(username);
  }

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  log.info('User data retrieved successfully:', { email: user.email });
  return user;
}

export async function getUserByEmailService(email: string): Promise<User | null> {
  log.info('Getting user by email: ', { email });

  if (!emailPolicy.test(email)) {
    throw new HttpError(400, 'Invalid email format or parameter missing');
  }

  const user = await getUserByEmailRepository(email);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  log.info('User data retrieved successfully:', { email: user.email });
  return user;
}

export async function updateUserByIdService(userId: string, data: User):
  Promise<User> {
  log.info('Updating user by ID: ', userId);

  if (!userId) {
    throw new HttpError(400, 'Missing user ID');
  }

  const user = await getUserByIdRepository(userId);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const updatedUser = await updateUserByIdRepository(user.id, data);

  if (!updatedUser) {
    throw new HttpError(500, 'An error occurred while updating user');
  }

  log.info('User updated successfully:', { email: updatedUser?.email });
  return updatedUser;
}

export async function updatePasswordService(req: Request) {
  log.info('Updating password', { userId: req.userId });

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new HttpError(400, 'Missing old or new password');
  }

  const user = await getUserByIdRepository(req.userId);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await updateUserByIdRepository(user.id, { password: hashedPassword });

  log.info('Password updated successfully:', { email: updatedUser?.email });
  return updatedUser;
}

export const isUsernameAvailableService = async (username: string): Promise<boolean> => {
  log.info('Checking if username is available', { username });
  const user = await getUserByUsernameRepository(username);
  log.info('Username availability checked successfully:', { isAvailable: !user });
  return !user;
};
