import { Outlet } from "react-router-dom"

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Topbar will go here */}
      <Outlet />
    </div>
  )
}
