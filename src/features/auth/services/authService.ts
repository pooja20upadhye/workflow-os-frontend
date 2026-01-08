import rawUsersData from '@/mock/users.json'
import { AuthUser, LoginPayload, RegisterPayload } from '../types/authTypes'

// Load JSON + check localStorage for persisted users
const savedUsers = localStorage.getItem('mockUsers')
const usersData: Array<AuthUser & { password: string }> = savedUsers
  ? JSON.parse(savedUsers)
  : [...(rawUsersData as Array<AuthUser & { password: string }>)] 

// Helper: persist to localStorage
const saveUsers = () => {
  localStorage.setItem('mockUsers', JSON.stringify(usersData))
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const user = usersData.find(
      u => u.email === payload.email && u.password === payload.password
    )

    if (!user) throw new Error('Invalid email or password')

    const { password, ...rest } = user
    return rest
  },

  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const exists = usersData.some(u => u.email === payload.email)
    if (exists) throw new Error('User already exists')

    const newUser: AuthUser & { password: string } = {
      id: crypto.randomUUID(),
      ...payload,
      password: payload.password
    }

    usersData.push(newUser)
    saveUsers() // persist to localStorage

    const { password, ...rest } = newUser
    return rest
  },

  getAllUsers: (): AuthUser[] => {
    // Return all users (without passwords)
    return usersData.map(({ password, ...rest }) => rest)
  }
}
