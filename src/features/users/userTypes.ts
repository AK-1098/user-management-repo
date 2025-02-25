// src/features/users/userTypes.ts
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}
