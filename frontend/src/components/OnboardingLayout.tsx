import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import AppShell from './AppShell'

const steps = [
  { label: 'Personal details', to: '/onboarding/step1' },
  { label: 'Goals', to: '/onboarding/step2' },
  { label: 'Medical', to: '/onboarding/step3' },
  { label: 'Equipment', to: '/onboarding/step4' },
  { label: 'Assessment', to: '/onboarding/step5' },
]

type OnboardingLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

export default function OnboardingLayout({
  title,
  description,
  children,
}: OnboardingLayoutProps) {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="card h-fit">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Onboarding
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {steps.map((step) => (
                <li key={step.to}>
                  <NavLink
                    to={step.to}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    {step.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
            <div className="card space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
