import { NavLink } from 'react-router-dom'
import AppShell from '../components/AppShell'

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              CaliTeq MVP
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Build a calisthenics plan that adapts to you.
            </h1>
            <p className="text-lg text-slate-600">
              Answer a quick assessment, get a 12-week program, and log each
              session with progress feedback.
            </p>
            <div className="flex flex-wrap gap-3">
              <NavLink to="/register" className="btn-primary">
                Start onboarding
              </NavLink>
              <NavLink
                to="/exercises"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary-300 hover:text-primary-700"
              >
                Explore exercises
              </NavLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Assessment', value: '5 steps' },
                { label: 'Plan length', value: '12 weeks' },
                { label: 'Focus', value: 'Progressive overload' },
              ].map((item) => (
                <div key={item.label} className="card bg-white/80">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="card flex h-full flex-col justify-between bg-gradient-to-br from-white via-primary-50 to-white">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Today&#39;s Focus
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                Full body strength
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Balanced movement patterns with a primary push focus.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Wall push-ups — 3 sets</li>
                <li>Dead hang — 2 sets</li>
                <li>Box squats — 3 sets</li>
                <li>Plank hold — 2 sets</li>
              </ul>
            </div>
            <div className="mt-6 rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm text-slate-600">
              Log your session to unlock progression targets.
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Personalized onboarding',
                copy: 'Capture goals, equipment, and movement assessments in five steps.',
              },
              {
                title: 'Smart plan generation',
                copy: 'Adaptive templates balance push, pull, squat, and core patterns.',
              },
              {
                title: 'Progress visibility',
                copy: 'Track every session, see readiness, and log body metrics.',
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  )
}
