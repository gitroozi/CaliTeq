import { NavLink } from 'react-router-dom';
import AppShell from '../components/AppShell';

// Design Option 4: Sunset Vibes (Warm Gradients)
export default function DesignOption4() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Sunset Gradient Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 -mx-6 px-8 py-12 rounded-[2rem] mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 via-transparent to-orange-300/30"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Welcome back, Roozi!
            </h1>
            <p className="mt-2 text-sm text-white/95 font-medium drop-shadow">
              Beginner Linear Periodization - 12/24/2025 - Week 1 of 12
            </p>
          </div>
          <button className="relative z-10 px-8 py-4 bg-white/95 backdrop-blur text-rose-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white transform hover:scale-105 transition-all">
            Start today's workout
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Plan Snapshot - Gradient Card */}
            <div className="bg-gradient-to-br from-white via-pink-50 to-orange-50 rounded-[2rem] shadow-xl border border-pink-200 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent"></div>
                <h2 className="text-2xl font-bold text-white relative z-10 drop-shadow">Plan Snapshot</h2>
              </div>
              <div className="p-8">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">
                      Current Week
                    </p>
                    <div className="relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full opacity-30 blur-2xl"></div>
                      <svg className="relative w-28 h-28" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#fecaca" strokeWidth="6"/>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#sunsetGradient)" strokeWidth="6"
                                strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round"
                                transform="rotate(-90 50 50)"/>
                        <defs>
                          <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f472b6"/>
                            <stop offset="50%" stopColor="#fb7185"/>
                            <stop offset="100%" stopColor="#fb923c"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">1</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">
                      Training Days
                    </p>
                    <div className="mt-3 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-100 via-rose-100 to-orange-100 rounded-2xl border-2 border-pink-300 shadow-lg">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <p className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                          3
                        </p>
                        <p className="text-xs text-slate-600 font-medium">per week</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">
                      Plan Duration
                    </p>
                    <div className="mt-3 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 rounded-2xl border-2 border-amber-300 shadow-lg">
                      <span className="text-2xl">📆</span>
                      <div>
                        <p className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          12
                        </p>
                        <p className="text-xs text-slate-600 font-medium">weeks</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-gradient-to-r from-pink-200 to-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🌅</span>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Plan Period
                    </p>
                  </div>
                  <p className="text-base text-slate-800 font-semibold">
                    Dec 24, 2025 - Mar 18, 2026
                  </p>
                </div>
              </div>
            </div>

            {/* No Workout Today - Warm Gradient */}
            <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 rounded-[2rem] shadow-xl p-10 text-center border-2 border-pink-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-transparent to-pink-200/30"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-300/40 to-orange-300/40 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 mb-6 shadow-xl">
                  <span className="text-5xl">✨</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-2">No workout scheduled for today.</p>
                <p className="text-slate-700 mb-8 text-lg">
                  Enjoy your rest day or check out the exercise library!
                </p>
                <button className="px-10 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                  Browse Exercises
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions - Gradient Cards */}
            <div className="bg-gradient-to-br from-white to-pink-50 rounded-[2rem] shadow-xl overflow-hidden border border-pink-200">
              <div className="px-8 py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500">
                <h2 className="text-2xl font-bold text-white drop-shadow">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="block px-6 py-5 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm">
                      <span className="text-3xl">💪</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Browse Exercises</p>
                      <p className="text-xs text-white/90 mt-1">
                        Explore the full exercise library
                      </p>
                    </div>
                  </div>
                </div>
                <div className="block px-6 py-5 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm">
                      <span className="text-3xl">📈</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Track Progress</p>
                      <p className="text-xs text-white/90 mt-1">
                        Log body metrics and view stats
                      </p>
                    </div>
                  </div>
                </div>
                <div className="block px-6 py-5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm">
                      <span className="text-3xl">⚙️</span>
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

            {/* Upcoming Sessions - Warm Gradient Cards */}
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-[2rem] shadow-xl overflow-hidden border border-orange-200">
              <div className="px-8 py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-white drop-shadow">Upcoming Sessions</h2>
                <select className="px-4 py-2 text-sm bg-white/90 backdrop-blur border-2 border-white/50 text-rose-600 font-bold rounded-xl focus:ring-2 focus:ring-white shadow-lg">
                  <option>Week 1</option>
                </select>
              </div>
              <div className="p-6 space-y-4">
                <div className="block rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 p-5 hover:from-pink-200 hover:to-rose-200 transition-all cursor-pointer border-l-4 border-pink-500 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-pink-500">🏋️</span>
                        Week 1 - Full Body A
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Wed, Dec 24 • Session 1
                      </p>
                    </div>
                    <span className="text-xs font-bold text-pink-700 bg-pink-200 px-4 py-2 rounded-full shadow">View</span>
                  </div>
                </div>
                <div className="block rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 p-5 hover:from-purple-200 hover:to-blue-200 transition-all cursor-pointer border-l-4 border-purple-500 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-purple-500">🏋️</span>
                        Week 1 - Full Body B
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Fri, Dec 26 • Session 2
                      </p>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-200 px-4 py-2 rounded-full shadow">View</span>
                  </div>
                </div>
                <div className="block rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-5 hover:from-amber-200 hover:to-orange-200 transition-all cursor-pointer border-l-4 border-amber-500 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-amber-500">🏋️</span>
                        Week 1 - Full Body A
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Sun, Dec 28 • Session 3
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-200 px-4 py-2 rounded-full shadow">View</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips - Warm Color Boxes */}
            <div className="bg-gradient-to-br from-white to-rose-50 rounded-[2rem] shadow-xl overflow-hidden border border-rose-200">
              <div className="px-8 py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500">
                <h2 className="text-2xl font-bold text-white drop-shadow">Training Tips</h2>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-100 border-l-4 border-pink-500 shadow-md">
                  <span className="text-2xl">🎯</span>
                  <p className="text-slate-700 font-medium">Log your workouts to track progress and unlock new progressions</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-100 border-l-4 border-purple-500 shadow-md">
                  <span className="text-2xl">✨</span>
                  <p className="text-slate-700 font-medium">Focus on form quality over rep count - control is key</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-100 border-l-4 border-sky-500 shadow-md">
                  <span className="text-2xl">💤</span>
                  <p className="text-slate-700 font-medium">Rest days are crucial for recovery and adaptation</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-100 border-l-4 border-amber-500 shadow-md">
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
