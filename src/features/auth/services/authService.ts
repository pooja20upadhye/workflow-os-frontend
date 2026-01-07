import { mockUsers } from '@/mock/users';
import {
  LoginPayload,
  RegisterPayload,
  AuthUser,
} from '../types/authTypes';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const user = mockUsers.find(
      u => u.email === payload.email && u.password === payload.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },

  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    return {
      id: crypto.randomUUID(),
      email: payload.email,
      role: payload.role,
    };
  },
};
