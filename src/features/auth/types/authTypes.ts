export type UserRole = 'requester' | 'approver' | 'admin'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  mobile: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  mobile: string
  role: UserRole
}
