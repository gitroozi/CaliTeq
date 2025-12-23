import { NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Workout', to: '/workout/today' },
  { label: 'Exercises', to: '/exercises' },
  { label: 'Progress', to: '/progress' },
  { label: 'Profile', to: '/profile' },
]

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink
            to="/"
            className="text-lg font-semibold tracking-tight text-primary-700"
          >
            CaliFlow
          </NavLink>
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary-700'
                    : 'transition-colors hover:text-primary-700'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-primary-700 md:block"
                >
                  {user?.firstName ? `Hi, ${user.firstName}` : 'Account'}
                </NavLink>
                <button onClick={handleLogout} className="btn-secondary">
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-secondary">
                  Log in
                </NavLink>
                <NavLink to="/register" className="btn-primary">
                  Get started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
