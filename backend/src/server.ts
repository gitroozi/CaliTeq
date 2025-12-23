import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors'

// Routes
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import exerciseRoutes from './routes/exercise.routes.js'
import workoutRoutes from './routes/workout.routes.js'
import workoutLogRoutes from './routes/workout-log.routes.js'
import progressRoutes from './routes/progress.routes.js'

// Middleware
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CaliTeq API is running',
    timestamp: new Date().toISOString()
  })
})

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'CaliTeq API v1.0',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        me: 'GET /api/auth/me (protected)',
      },
      profile: {
        get: 'GET /api/users/profile (protected)',
        create: 'POST /api/users/profile (protected)',
        update: 'PUT /api/users/profile (protected)',
        checkComplete: 'GET /api/users/profile/complete (protected)',
        delete: 'DELETE /api/users/profile (protected)',
      },
      exercises: {
        list: 'GET /api/exercises',
        get: 'GET /api/exercises/:idOrSlug',
        search: 'GET /api/exercises/search?q=query',
        progressionChain: 'GET /api/exercises/:id/progression-chain',
      },
      movementPatterns: {
        list: 'GET /api/movement-patterns',
        exercises: 'GET /api/movement-patterns/:patternIdOrName/exercises',
      },
      workouts: {
        generatePlan: 'POST /api/workout-plans/generate (protected)',
        getActivePlan: 'GET /api/workout-plans/active (protected)',
        getPlan: 'GET /api/workout-plans/:id (protected)',
        getAllPlans: 'GET /api/workout-plans (protected)',
        deactivatePlan: 'PUT /api/workout-plans/:id/deactivate (protected)',
        todayWorkout: 'GET /api/workout-sessions/today (protected)',
        weekSessions: 'GET /api/workout-sessions/week/:weekNumber (protected)',
        getSession: 'GET /api/workout-sessions/:id (protected)',
      },
      workoutLogs: {
        create: 'POST /api/workout-logs (protected)',
        list: 'GET /api/workout-logs (protected)',
        get: 'GET /api/workout-logs/:id (protected)',
        delete: 'DELETE /api/workout-logs/:id (protected)',
        stats: 'GET /api/workout-logs/stats (protected)',
        exerciseHistory: 'GET /api/workout-logs/exercises/:exerciseId/history (protected)',
      },
      progress: {
        createMetric: 'POST /api/progress/metrics (protected)',
        listMetrics: 'GET /api/progress/metrics (protected)',
        getMetric: 'GET /api/progress/metrics/:id (protected)',
        deleteMetric: 'DELETE /api/progress/metrics/:id (protected)',
        allStats: 'GET /api/progress/stats (protected)',
        metricStats: 'GET /api/progress/stats/:metricType (protected)',
        metricHistory: 'GET /api/progress/history/:metricType (protected)',
      }
    }
  })
})

// Auth routes
app.use('/api/auth', authRoutes)

// User profile routes
app.use('/api/users', profileRoutes)

// Exercise library routes
app.use('/api', exerciseRoutes)

// Workout generation routes
app.use('/api', workoutRoutes)

// Workout logging routes
app.use('/api/workout-logs', workoutLogRoutes)

// Progress tracking routes
app.use('/api/progress', progressRoutes)

// Error handling middleware (must be last)
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CaliTeq API server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})

export default app
