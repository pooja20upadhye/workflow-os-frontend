import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/layouts/authLayout'
import { LoginPage } from '@/features/auth/pages/loginPage'
import { RegisterPage } from '@/features/auth/pages/registerPage'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
])
