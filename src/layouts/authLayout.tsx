import { Outlet } from 'react-router-dom'
import { Card } from '@/components/ui/card'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md p-6">
        <Outlet />
      </Card>
    </div>
  )
}
