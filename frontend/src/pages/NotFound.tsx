import { NavLink } from 'react-router-dom'
import AppShell from '../components/AppShell'

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The page you are looking for does not exist yet.
        </p>
        <NavLink to="/" className="mt-6 btn-primary">
          Back to home
        </NavLink>
      </div>
    </AppShell>
  )
}
