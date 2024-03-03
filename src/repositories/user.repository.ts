import { User } from '@prisma/client';

import { prisma } from 'src/client';
import { CreateUserRequest, UpdateUserRequest } from 'src/types';

/**
 * Create one user
 * @param data CreateUserRequest
 */
export function createUserRepository(data: CreateUserRequest): Promise<User> {
  return prisma.user.create({
    data,
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
export function updateUserByIdRepository(userId: string, data: UpdateUserRequest): Promise<User> {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}
