export type UserRole = 'requester' | 'approver';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  role: UserRole;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
