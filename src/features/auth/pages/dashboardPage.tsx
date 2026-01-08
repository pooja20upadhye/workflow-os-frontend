import { useEffect, useState } from 'react'
import { AuthUser } from '@/features/auth/types/authTypes'
import { authService } from '@/features/auth/services/authService'

export const DashboardPage = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [allUsers, setAllUsers] = useState<AuthUser[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('authUser')
    if (stored) setUser(JSON.parse(stored))

    setAllUsers(authService.getAllUsers())
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">WorkflowOS</h2>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard" className="p-2 rounded hover:bg-gray-200">Dashboard</a>
          <a href="#" className="p-2 rounded hover:bg-gray-200">Requests</a>
          <a href="#" className="p-2 rounded hover:bg-gray-200">History</a>
          <a href="#" className="p-2 rounded hover:bg-gray-200">Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
          <h1 className="text-2xl font-bold">WorkflowOS</h1>
          {user && <span className="text-sm text-gray-700">Logged in as: {user.name} ({user.role})</span>}
        </header>

        {/* Dashboard content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
          <p className="text-gray-600 mb-6">Role: {user?.role}</p>

          <h3 className="text-lg font-semibold mb-2">All Users</h3>
          <ul className="bg-white shadow rounded p-4 space-y-2">
            {allUsers.map(u => (
              <li key={u.id} className="flex justify-between">
                <span>{u.name} ({u.role})</span>
                <span>{u.email}</span>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}
