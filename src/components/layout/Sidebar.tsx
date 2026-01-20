import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/shared/icons'
import { useAuth } from '@/features/auth/context/auth-context'

interface SidebarProps {
  mobile?: boolean
}

export const Sidebar = ({ mobile = false }: SidebarProps) => {
  const { user } = useAuth()

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Icons.home },
    { to: '/requests', label: 'Requests', icon: Icons.fileText },
    { to: '/history', label: 'History', icon: Icons.history, disabled: true },
    { to: '/settings', label: 'Settings', icon: Icons.settings, disabled: true },
  ]

  // You can add role-based items later
  // if (user?.role === 'admin') { ... }

  return (
    <div className={cn('flex h-full flex-col bg-card', mobile ? 'p-4' : 'p-6')}>
      {/* Logo / Brand */}
      {!mobile && (
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Icons.workflow className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">WorkflowOS</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground',
                item.disabled && 'pointer-events-none opacity-50'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="mt-auto border-t pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Icons.user className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}