import { AuthUser } from '@/features/auth/types/authTypes';

export const mockUsers: Array<AuthUser & { password: string }> = [
  {
    id: '1',
    email: 'user@workflowos.com',
    password: 'password123',
    role: 'requester',
  },
];
