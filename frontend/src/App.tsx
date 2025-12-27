import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoute from './components/ProtectedRoute'
import AdminSubdomainRedirect from './components/AdminSubdomainRedirect'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Workout from './pages/Workout'
import Exercises from './pages/Exercises'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import OnboardingStep1 from './pages/OnboardingStep1'
import OnboardingStep2 from './pages/OnboardingStep2'
import OnboardingStep3 from './pages/OnboardingStep3'
import OnboardingStep4 from './pages/OnboardingStep4'
import OnboardingStep5 from './pages/OnboardingStep5'
import NotFound from './pages/NotFound'

// Design Option Pages
import DesignOption1 from './pages/DesignOption1'
import DesignOption2 from './pages/DesignOption2'
import DesignOption3 from './pages/DesignOption3'
import DesignOption4 from './pages/DesignOption4'

// Admin components
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserDetail from './pages/admin/AdminUserDetail'
import AdminSubscriptions from './pages/admin/AdminSubscriptions'
import AdminAudit from './pages/admin/AdminAudit'
import AdminManagement from './pages/admin/AdminManagement'
import AdminSettings from './pages/admin/AdminSettings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AdminSubdomainRedirect />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/:id"
            element={
              <ProtectedRoute>
                <Workout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/today"
            element={
              <ProtectedRoute>
                <Workout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <Exercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Onboarding Routes */}
          <Route
            path="/onboarding/step1"
            element={
              <ProtectedRoute>
                <OnboardingStep1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step2"
            element={
              <ProtectedRoute>
                <OnboardingStep2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step3"
            element={
              <ProtectedRoute>
                <OnboardingStep3 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step4"
            element={
              <ProtectedRoute>
                <OnboardingStep4 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/step5"
            element={
              <ProtectedRoute>
                <OnboardingStep5 />
              </ProtectedRoute>
            }
          />

          {/* Design Option Routes */}
          <Route path="/design_1" element={<DesignOption1 />} />
          <Route path="/design_2" element={<DesignOption2 />} />
          <Route path="/design_3" element={<DesignOption3 />} />
          <Route path="/design_4" element={<DesignOption4 />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminProtectedRoute>
                <AdminUserDetail />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <AdminProtectedRoute>
                <AdminSubscriptions />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <AdminProtectedRoute>
                <AdminAudit />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <AdminProtectedRoute requireSuperAdmin={true}>
                <AdminManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute>
                <AdminSettings />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
