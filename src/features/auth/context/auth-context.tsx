import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthUser } from '../types/authTypes'
import { authService } from '../services/authService'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: any) => Promise<void> // Should return Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('authUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await authService.login({ email, password })
      setUser(userData)
      localStorage.setItem('authUser', JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authUser')
    localStorage.removeItem('rememberedEmail')
    localStorage.removeItem('rememberedPassword')
  }

  const register = async (data: any): Promise<void> => {
    setIsLoading(true)
    try {
      // Just call authService.register but don't use the return value
      await authService.register(data)
      // Don't auto-login after registration
      // Don't set user state
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user && !isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}