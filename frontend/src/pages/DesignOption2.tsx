import { NavLink } from 'react-router-dom';
import AppShell from '../components/AppShell';

// Design Option 2: Fresh & Modern (Green & Blue Gradient)
export default function DesignOption2() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header with Soft Gradient */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 -mx-6 px-6 py-10 rounded-3xl mb-8 shadow-xl">
          <div>
            <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
              Welcome back, Roozi!
            </h1>
            <p className="mt-2 text-sm text-white/95 font-medium">
              Beginner Linear Periodization - 12/24/2025 - Week 1 of 12
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
            Start today's workout
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Plan Snapshot with Gradient Card */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-blue-500">
                <h2 className="text-xl font-bold text-white">Plan Snapshot</h2>
              </div>
              <div className="p-8">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mb-3">
                      <span className="text-white text-xl font-bold">📊</span>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                      Current Week
                    </p>
                    <div className="relative">
                      <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e7ff" strokeWidth="8"/>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient1)" strokeWidth="8"
                                strokeDasharray="283" strokeDashoffset="212" strokeLinecap="round"
                                transform="rotate(-90 50 50)"/>
                        <defs>
                          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981"/>
                            <stop offset="100%" stopColor="#3b82f6"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">1</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-3">
                      <span className="text-white text-xl font-bold">🔥</span>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                      Training Days
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl border-2 border-emerald-300">
                      <p className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        3
                      </p>
                      <span className="text-slate-600 font-medium">/ week</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 mb-3">
                      <span className="text-white text-xl font-bold">⏱️</span>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                      Plan Duration
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border-2 border-amber-300">
                      <p className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        12
                      </p>
                      <span className="text-slate-600 font-medium">weeks</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-gradient-to-r from-emerald-200 to-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-600">📅</span>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                      Plan Period
                    </p>
                  </div>
                  <p className="text-base text-slate-800 font-semibold">
                    Dec 24, 2025 - Mar 18, 2026
                  </p>
                </div>
              </div>
            </div>

            {/* No Workout Today - Fresh Design */}
            <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-3xl shadow-xl p-10 text-center border-2 border-blue-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 mb-4 shadow-lg">
                <span className="text-4xl">🌟</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-2">No workout scheduled for today.</p>
              <p className="text-slate-600 mb-8 text-lg">
                Enjoy your rest day or check out the exercise library!
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all">
                Browse Exercises
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-blue-500">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="group block px-6 py-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">💪</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Browse Exercises</p>
                      <p className="text-xs text-white/90 mt-1">
                        Explore the full exercise library
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group block px-6 py-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Track Progress</p>
                      <p className="text-xs text-white/90 mt-1">
                        Log body metrics and view stats
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group block px-6 py-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Update Profile</p>
                      <p className="text-xs text-white/90 mt-1">
                        Adjust goals and preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">Upcoming Sessions</h2>
                <select className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl focus:ring-2 focus:ring-white">
                  <option className="text-slate-900">Week 1</option>
                </select>
              </div>
              <div className="p-6 space-y-4">
                <div className="block rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 p-5 hover:from-emerald-100 hover:to-emerald-200 transition-all cursor-pointer border-l-4 border-emerald-500 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Week 1 - Full Body A
                      </p>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                        <span>📅</span> Wed, Dec 24 • Session 1
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-4 py-2 rounded-full">View</span>
                  </div>
                </div>
                <div className="block rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-5 hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer border-l-4 border-blue-500 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Week 1 - Full Body B
                      </p>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                        <span>📅</span> Fri, Dec 26 • Session 2
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-200 px-4 py-2 rounded-full">View</span>
                  </div>
                </div>
                <div className="block rounded-2xl bg-gradient-to-r from-amber-50 to-orange-100 p-5 hover:from-amber-100 hover:to-orange-200 transition-all cursor-pointer border-l-4 border-amber-500 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Week 1 - Full Body A
                      </p>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                        <span>📅</span> Sun, Dec 28 • Session 3
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-200 px-4 py-2 rounded-full">View</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-blue-500">
                <h2 className="text-xl font-bold text-white">Training Tips</h2>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-500">
                  <span className="text-2xl">🎯</span>
                  <p className="text-slate-700 font-medium">Log your workouts to track progress and unlock new progressions</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                  <span className="text-2xl">✨</span>
                  <p className="text-slate-700 font-medium">Focus on form quality over rep count - control is key</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500">
                  <span className="text-2xl">💤</span>
                  <p className="text-slate-700 font-medium">Rest days are crucial for recovery and adaptation</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-100 border-l-4 border-amber-500">
                  <span className="text-2xl">⚡</span>
                  <p className="text-slate-700 font-medium">Deload weeks help prevent burnout and reduce injury risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
