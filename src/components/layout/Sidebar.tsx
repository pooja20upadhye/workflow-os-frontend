// src/components/layout/Sidebar.tsx
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
    { to: '/requests',  label: 'Requests',  icon: Icons.fileText },
    { to: '/history',   label: 'History',   icon: Icons.history },
    { to: '/settings',  label: 'Settings',  icon: Icons.settings },
  ]

  return (
    <div className={cn(
      'flex h-full flex-col bg-card',
      mobile ? 'p-4' : 'p-4' // reduced from p-6 → p-4 for tighter look
    )}>
      {/* No logo here anymore – moved to Navbar */}

      {/* Navigation – tighter spacing */}
      <nav className="flex-1 space-y-0.5 mt-2"> {/* reduced space-y-1 → space-y-0.5 */}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom – slightly reduced padding */}
      <div className="mt-auto border-t pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Icons.user className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">
              {user?.name || 'Pooja Prasad Upadhye'}
            </p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {user?.role || 'Requester'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}