import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthUser } from '../types/authTypes'
import { authService } from '../services/authService'
import { useAuth } from '../context/auth-context'
import { RequesterDashboard } from '@/features/dashboard/components/RequesterDashboard'
import { ApproverDashboard } from '@/features/dashboard/components/ApproverDashboard'
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard'
import { Icons } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const DashboardPage = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const storedUser = authService.getCurrentUser()
    if (!storedUser) {
      navigate('/login')
    } else {
      setUser(storedUser)
    }
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const renderDashboard = () => {
    if (!user) return null

    switch (user.role) {
      case 'requester':
        return <RequesterDashboard />
      case 'approver':
        return <ApproverDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return <RequesterDashboard />
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Icons.fileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">WorkflowOS</h2>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <Icons.x size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary text-white font-medium"
            >
              <Icons.home size={18} />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Icons.fileText size={18} />
              Requests
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Icons.history size={18} />
              History
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Icons.settings size={18} />
              Settings
            </a>
          </nav>

          {/* User Profile */}
          <div className="pt-6 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500"
              >
                <Icons.logout size={18} />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Icons.menu size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Icons.bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
            <p className="text-gray-600">Here's what's happening with your workflows today.</p>
          </div>

          {renderDashboard()}
        </main>
      </div>
    </div>
  )
}