import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export const AppLayout = () => {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Fixed top navbar */}
      <Navbar />

      {/* Content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – hidden on mobile, shown on lg+ */}
        <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0 lg:border-r lg:bg-card">
          <Sidebar />
        </aside>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}