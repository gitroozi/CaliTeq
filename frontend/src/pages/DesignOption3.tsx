import AppShell from '../components/AppShell';

// Design Option 3: Bold & Athletic (Red & Purple)
export default function DesignOption3() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10 bg-slate-50 -mx-6 px-6 min-h-screen">
        {/* Bold Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-red-600 via-red-500 to-purple-600 px-8 py-12 rounded-3xl mb-8 shadow-2xl border-4 border-red-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">
              Welcome back, Roozi!
            </h1>
            <p className="mt-2 text-sm text-white/95 font-bold">
              Beginner Linear Periodization - 12/24/2025 - Week 1 of 12
            </p>
          </div>
          <button className="relative z-10 px-8 py-4 bg-white text-red-600 font-black rounded-2xl shadow-2xl hover:bg-red-50 transform hover:scale-110 transition-all uppercase tracking-wide border-4 border-white">
            Start Workout
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Plan Snapshot - Bold Design */}
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-500 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-red-600 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <h2 className="text-2xl font-black text-white uppercase relative z-10">Plan Snapshot</h2>
              </div>
              <div className="p-8 bg-gradient-to-br from-white to-red-50">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-black mb-3">
                      Current Week
                    </p>
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
                      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-white transform hover:rotate-6 transition-transform">
                        <p className="text-4xl font-black text-white">1</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-black mb-3">
                      Training Days
                    </p>
                    <div className="mt-3 inline-flex flex-col gap-1 px-6 py-4 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl shadow-xl border-4 border-white">
                      <p className="text-3xl font-black text-white">3</p>
                      <p className="text-xs text-white/90 font-bold uppercase tracking-wide">per week</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-black mb-3">
                      Plan Duration
                    </p>
                    <div className="mt-3 inline-flex flex-col gap-1 px-6 py-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl border-4 border-white">
                      <p className="text-3xl font-black text-white">12</p>
                      <p className="text-xs text-white/90 font-bold uppercase tracking-wide">weeks</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-4 border-red-200">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-black mb-3">
                    Plan Period
                  </p>
                  <p className="text-lg text-slate-900 font-bold">
                    Dec 24, 2025 - Mar 18, 2026
                  </p>
                </div>
              </div>
            </div>

            {/* No Workout Today - Bold Design */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-10 text-center border-4 border-purple-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-600/20"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-purple-600 mb-6 shadow-2xl border-4 border-white">
                  <span className="text-5xl">⚡</span>
                </div>
                <p className="text-3xl font-black text-white mb-3 uppercase">Rest Day</p>
                <p className="text-white/90 mb-8 text-lg font-medium">
                  Recharge and come back stronger!
                </p>
                <button className="px-10 py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all uppercase tracking-wide border-4 border-white">
                  Browse Exercises
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions - Athletic Cards */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-500">
              <div className="px-8 py-6 bg-gradient-to-r from-red-600 to-purple-600">
                <h2 className="text-2xl font-black text-white uppercase">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4 bg-gradient-to-br from-white to-purple-50">
                <div className="relative block px-6 py-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer border-4 border-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/50">
                      <span className="text-3xl">💪</span>
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase">Browse Exercises</p>
                      <p className="text-xs text-white/90 mt-1 font-medium">
                        Explore the full exercise library
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative block px-6 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer border-4 border-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/50">
                      <span className="text-3xl">📈</span>
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase">Track Progress</p>
                      <p className="text-xs text-white/90 mt-1 font-medium">
                        Log body metrics and view stats
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative block px-6 py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer border-4 border-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/50">
                      <span className="text-3xl">⚙️</span>
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase">Update Profile</p>
                      <p className="text-xs text-white/90 mt-1 font-medium">
                        Adjust goals and preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions - Bold Cards */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-red-500">
              <div className="px-8 py-6 bg-gradient-to-r from-red-600 to-purple-600 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white uppercase">Sessions</h2>
                <select className="px-4 py-2 text-sm bg-white text-red-600 font-black rounded-xl focus:ring-4 focus:ring-white border-4 border-white uppercase">
                  <option>Week 1</option>
                </select>
              </div>
              <div className="p-6 space-y-4 bg-gradient-to-br from-white to-red-50">
                <div className="block rounded-2xl bg-gradient-to-r from-red-500 to-red-600 p-5 hover:from-red-600 hover:to-red-700 transition-all cursor-pointer shadow-xl border-4 border-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-black text-white uppercase">
                        Full Body A
                      </p>
                      <p className="text-xs text-white/90 mt-1 font-bold">
                        Wed, Dec 24 • Session 1
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-full">
                      <span className="text-xs font-black text-red-600 uppercase">Go</span>
                    </div>
                  </div>
                </div>
                <div className="block rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 p-5 hover:from-purple-600 hover:to-purple-700 transition-all cursor-pointer shadow-xl border-4 border-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-black text-white uppercase">
                        Full Body B
                      </p>
                      <p className="text-xs text-white/90 mt-1 font-bold">
                        Fri, Dec 26 • Session 2
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-full">
                      <span className="text-xs font-black text-purple-600 uppercase">Go</span>
                    </div>
                  </div>
                </div>
                <div className="block rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 p-5 hover:from-orange-600 hover:to-red-700 transition-all cursor-pointer shadow-xl border-4 border-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-black text-white uppercase">
                        Full Body A
                      </p>
                      <p className="text-xs text-white/90 mt-1 font-bold">
                        Sun, Dec 28 • Session 3
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-full">
                      <span className="text-xs font-black text-orange-600 uppercase">Go</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips - Bold Boxes */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-500">
              <div className="px-8 py-6 bg-gradient-to-r from-red-600 to-purple-600">
                <h2 className="text-2xl font-black text-white uppercase">Pro Tips</h2>
              </div>
              <div className="p-6 space-y-4 bg-gradient-to-br from-white to-purple-50">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-100 border-l-8 border-red-600 shadow-md">
                  <span className="text-3xl">🎯</span>
                  <p className="text-slate-900 font-bold">Log your workouts to track progress and unlock new progressions</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-100 border-l-8 border-purple-600 shadow-md">
                  <span className="text-3xl">✨</span>
                  <p className="text-slate-900 font-bold">Focus on form quality over rep count - control is key</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-100 border-l-8 border-blue-600 shadow-md">
                  <span className="text-3xl">💤</span>
                  <p className="text-slate-900 font-bold">Rest days are crucial for recovery and adaptation</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-100 border-l-8 border-orange-600 shadow-md">
                  <span className="text-3xl">⚡</span>
                  <p className="text-slate-900 font-bold">Deload weeks help prevent burnout and reduce injury risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
