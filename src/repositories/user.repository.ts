import { User } from '@prisma/client';

import { UserModel } from 'src/model';
import { prisma } from '../client';

/**
 * Create one user
 * @param data UserModel
 */
export function createUserRepository(data: UserModel): Promise<User> {
  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: data.password,
    },
  });
}

/**
 * Delete one user.
 * @param userId string
 */
export function deleteUserRepository(userId: string) {
  return prisma.user.delete({ where: { id: userId } });
}

/**
 * Get one user by ID.
 * @param userId string
 * @returns a one user
 */
export function getUserByIdRepository(userId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

/**
 * Get one user by Email.
 * @param email string
 * @returns one user
 */
export function getUserByEmailRepository(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

/**
 * Update a user by its ID.
 * @param userId string
 * @param data Partial<User>
 * @returns An updated user
 */
export function updateUserByIdRepository(userId: string, data: Partial<User>) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
}

/**
 * Get one user by its username.
 * @param username string
 * @returns one user
 */
export function getUserByUsernameRepository(username: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
}
