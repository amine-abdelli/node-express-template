import { z } from 'zod';

/**
 * Schema for creating a user.
 */
export const CreateUserSchema = z.object({

  email: z.string({
    required_error: 'email is required',
    description: 'User email',
    invalid_type_error: 'email must be a string',
  }).email({ message: 'Invalid email format' }).min(6, { message: 'Email too short - should be 6 characters minimum' }),

  password: z.string({
    required_error: 'Password is required',
    description: 'User password',
    invalid_type_error: 'password must be a string',
  }).min(6, { message: 'Password too short - should be 6 characters minimum' }),
});

/**
 * Schema for updating a user.
 */
export const UpdateUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  password: z.string().optional(),
});

/**
 * Schema for updating a user's password.
 */
export const UpdatePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

/**
 * Schema for deleting a user.
 */
export const DeleteUserSchema = z.object({
  password: z.string().min(6, { message: 'Password too short - should be 6 characters minimum' }),
});
