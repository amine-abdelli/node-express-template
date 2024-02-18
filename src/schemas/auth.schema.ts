import { z } from 'zod';

/**
 * Represents the login schema for authentication.
 */
export const LoginSchema = z.object({
  email: z.string({
    required_error: 'email is required',
    description: 'User email',
    invalid_type_error: 'email must be a string',
  }),
  password: z.string({
    required_error: 'Password is required',
  }).min(6, 'Password too short - should be 6 characters minimum'),
});
