import { NavLink } from 'react-router-dom';
import AppShell from '../components/AppShell';

// Design Option 1: Energetic Fitness (Orange & Teal)
export default function DesignOption1() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header with Gradient */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-orange-500 to-teal-500 -mx-6 px-6 py-8 rounded-2xl mb-8 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, Roozi!
            </h1>
            <p className="mt-2 text-sm text-white/90">
              Beginner Linear Periodization - 12/24/2025 - Week 1 of 12
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
            Start today's workout
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Plan Snapshot with Gradient Border */}
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-orange-500 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-teal-50">
                <h2 className="text-lg font-bold text-slate-900">Plan Snapshot</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Current Week
                    </p>
                    <div className="mt-3 relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full opacity-20 blur-sm"></div>
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <p className="text-2xl font-bold text-white">1</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Training Days
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-teal-100 rounded-full">
                      <span className="text-2xl">🔥</span>
                      <p className="text-lg font-bold text-slate-900">
                        3 / week
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Plan Duration
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-teal-100 rounded-full">
                      <span className="text-2xl">📅</span>
                      <p className="text-lg font-bold text-slate-900">
                        12 weeks
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-gradient-to-r from-orange-200 to-teal-200">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">
                    Plan Period
                  </p>
                  <p className="text-sm text-slate-700 font-medium">
                    Dec 24, 2025 - Mar 18, 2026
                  </p>
                </div>
              </div>
            </div>

            {/* No Workout Today - Playful Design */}
            <div className="bg-gradient-to-br from-orange-50 via-white to-teal-50 rounded-2xl shadow-lg p-8 text-center border-2 border-orange-200">
              <div className="text-6xl mb-4">🌴</div>
              <p className="text-xl font-bold text-slate-900 mb-2">No workout scheduled for today.</p>
              <p className="text-slate-600 mb-6">
                Enjoy your rest day or check out the exercise library!
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                Browse Exercises
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions with Colorful Cards */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-teal-50">
                <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="block px-5 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <p className="font-bold">Browse Exercises</p>
                      <p className="text-xs text-white/90 mt-1">
                        Explore the full exercise library
                      </p>
                    </div>
                  </div>
                </div>
                <div className="block px-5 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-bold">Track Progress</p>
                      <p className="text-xs text-white/90 mt-1">
                        Log body metrics and view stats
                      </p>
                    </div>
                  </div>
                </div>
                <div className="block px-5 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚙️</span>
                    <div>
                      <p className="font-bold">Update Profile</p>
                      <p className="text-xs text-white/90 mt-1">
                        Adjust goals and preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions with Color Coding */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-teal-50 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">Upcoming Sessions</h2>
                <select className="px-3 py-1.5 text-sm border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium">
                  <option>Week 1</option>
                </select>
              </div>
              <div className="p-6 space-y-3">
                <div className="block rounded-xl border-l-4 border-orange-500 bg-orange-50 p-4 hover:bg-orange-100 transition-colors cursor-pointer shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Week 1 - Full Body A
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Wed, Dec 24 • Session 1
                      </p>
                    </div>
                    <span className="text-xs font-bold text-orange-700 bg-orange-200 px-3 py-1 rounded-full">View</span>
                  </div>
                </div>
                <div className="block rounded-xl border-l-4 border-teal-500 bg-teal-50 p-4 hover:bg-teal-100 transition-colors cursor-pointer shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Week 1 - Full Body B
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Fri, Dec 26 • Session 2
                      </p>
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-200 px-3 py-1 rounded-full">View</span>
                  </div>
                </div>
                <div className="block rounded-xl border-l-4 border-purple-500 bg-purple-50 p-4 hover:bg-purple-100 transition-colors cursor-pointer shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Week 1 - Full Body A
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Sun, Dec 28 • Session 3
                      </p>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-200 px-3 py-1 rounded-full">View</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips with Colorful Bullets */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-teal-50">
                <h2 className="text-lg font-bold text-slate-900">Training Tips</h2>
              </div>
              <div className="p-6 space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border-l-3 border-orange-500">
                  <span className="text-orange-600 font-bold text-lg">🎯</span>
                  <p>Log your workouts to track progress and unlock new progressions</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-teal-50 border-l-3 border-teal-500">
                  <span className="text-teal-600 font-bold text-lg">✨</span>
                  <p>Focus on form quality over rep count - control is key</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border-l-3 border-purple-500">
                  <span className="text-purple-600 font-bold text-lg">💤</span>
                  <p>Rest days are crucial for recovery and adaptation</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border-l-3 border-amber-500">
                  <span className="text-amber-600 font-bold text-lg">⚡</span>
                  <p>Deload weeks help prevent burnout and reduce injury risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
