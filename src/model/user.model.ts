import { User } from '@prisma/client';

export type UserModel = Omit<User, 'id' | 'last_activity'>;
