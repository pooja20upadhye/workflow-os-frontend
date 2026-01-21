// src/components/layout/Navbar.tsx
import { useAuth } from '@/features/auth/context/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/shared/icons'
import { Link, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const getInitials = (name?: string) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'U'

  return (
    <header className="sticky top-0 z-30 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Mobile: Hamburger + simple logo (no black box) */}
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <Sidebar mobile />
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <Icons.workflow className="h-6 w-6 text-primary" />
            <span>WorkflowOS</span>
          </Link>
        </div>

        {/* Desktop: Logo with black box + text */}
        <Link
          to="/dashboard"
          className="hidden items-center gap-3 font-semibold text-lg lg:flex"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Icons.workflow className="h-6 w-6 text-primary-foreground" />
          </div>
          <span>WorkflowOS</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Icons.bell className="h-5 w-5" />
            {/* Uncomment for red dot: <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" /> */}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || '—'}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {user?.role || 'requester'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}