import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "@/layouts/authLayout"
import { AppLayout } from "@/layouts/appLayout"
import { LoginPage } from "@/features/auth/pages/loginPage"
import { RegisterPage } from "@/features/auth/pages/registerPage"
import { DashboardPage } from "@/features/auth/pages/dashboardPage"


export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
    ],
  },
])
