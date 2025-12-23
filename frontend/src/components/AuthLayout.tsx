import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center gap-6">
          <NavLink to="/" className="text-sm font-semibold text-primary-700">
            CaliFlow
          </NavLink>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-3 text-base text-slate-600">{subtitle}</p>
          </div>
          <div className="space-y-4">
            <div className="card bg-white/70">
              <p className="text-sm font-semibold text-slate-700">
                What you will get
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>12-week plan tailored to your training history</li>
                <li>Daily workouts with clear progression targets</li>
                <li>Progress insights based on logged sessions</li>
              </ul>
            </div>
            <div className="text-xs text-slate-500">
              Data stays private and is used only to personalize your training.
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <div className="card shadow-lg">
            {children}
            <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
