export interface CreateUserRequest {
  id?: string;
  email: string;
  password: string;
  username?: string;
  picture_url?: string;
  last_activity?: Date;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UpdateUserRequest {
  password?: string;
  username?: string;
  picture_url?: string;
  last_activity?: Date;
  is_verified?: boolean;
  updated_at?: Date;
}
