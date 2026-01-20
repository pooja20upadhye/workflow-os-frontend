// src/features/auth/pages/DashboardPage.tsx   (or wherever it lives)
import { useAuth } from '@/features/auth/context/auth-context'
import { RequesterDashboard } from '@/features/dashboard/components/RequesterDashboard'
import { ApproverDashboard } from '@/features/dashboard/components/ApproverDashboard'
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard'

export const DashboardPage = () => {
  const { user } = useAuth()

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  const renderDashboard = () => {
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

  return (
    <div className="container mx-auto space-y-8 py-6 px-4 md:px-6">
      {/* Welcome header - this is fine to keep here */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your workflows today.
        </p>
      </div>

      {/* Role-specific dashboard content */}
      {renderDashboard()}
    </div>
  )
}