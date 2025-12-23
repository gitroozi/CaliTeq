# CaliFlow - Intelligent Calisthenics Workout Platform

**Version:** 1.0.0 (Phase 1 MVP)
**Status:** In Development

---

## Overview

CaliFlow is a full-stack web application that provides personalized, evidence-based calisthenics workout programs. The platform generates customized 12-week training plans based on user profiles, tracks progress, and provides comprehensive exercise guidance.

### Key Features (Phase 1 MVP)

- ✅ User authentication & profiles
- ✅ Intelligent onboarding flow
- ✅ Personalized 12-week workout generation
- ✅ Exercise library (50-80 exercises with videos)
- ✅ Workout logging & tracking
- ✅ Progress analytics
- ✅ Responsive web design

---

## Project Structure

This is a **monorepo** containing frontend, backend, and shared code:

```
calisthenics-workout/
├── frontend/          # React + TypeScript + Vite + Tailwind
├── backend/           # Node.js + Express + TypeScript + Prisma
├── shared/            # Shared TypeScript types
├── docs/              # Complete product & technical documentation
└── package.json       # Root workspace configuration
```

---

## Tech Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand + React Query
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express + TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Zod + express-validator

### Development Tools
- **Package Manager:** npm workspaces
- **Linting:** ESLint
- **Formatting:** Prettier
- **Version Control:** Git

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+ (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Calisthenics Workout"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create `backend/.env` from the example:
   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` and configure:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Random secret key for JWT tokens
   - `JWT_REFRESH_SECRET` - Random secret key for refresh tokens

4. **Setup the database**

   Generate Prisma client and run migrations:
   ```bash
   npm run db:generate --workspace=backend
   npm run db:migrate --workspace=backend
   ```

   Seed the database with exercise library:
   ```bash
   npm run db:seed --workspace=backend
   ```

5. **Start development servers**

   Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - Backend (port 3000)
   npm run dev:backend

   # Terminal 2 - Frontend (port 5173)
   npm run dev:frontend
   ```

6. **Open the application**

   Frontend: http://localhost:5173
   Backend API: http://localhost:3000
   API Health Check: http://localhost:3000/health

---

## Available Scripts

### Root Level
- `npm run dev` - Run both frontend and backend
- `npm run dev:frontend` - Run frontend only
- `npm run dev:backend` - Run backend only
- `npm run build` - Build both projects
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier

### Backend
- `npm run db:migrate --workspace=backend` - Run database migrations
- `npm run db:seed --workspace=backend` - Seed database with exercises
- `npm run db:studio --workspace=backend` - Open Prisma Studio
- `npm run db:generate --workspace=backend` - Generate Prisma client
- `node backend/scripts/rls-smoke-test.mjs` - Run RLS smoke test checks
- `npm run rls:test --workspace=backend` - Run RLS smoke test checks

### Frontend
- `npm run build --workspace=frontend` - Build for production
- `npm run preview --workspace=frontend` - Preview production build

---

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key tables:

**Core Tables:**
- `users` - Authentication and basic profile
- `user_profiles` - Extended training information
- `movement_patterns` - 22 exercise categorization patterns
- `exercises` - Complete exercise database (150+ exercises)
- `workout_plans` - 12-week training programs
- `workout_sessions` - Individual workouts within plans
- `workout_session_exercises` - Exercises within each session
- `workout_logs` - Completed workout tracking
- `exercise_logs` - Per-exercise performance data
- `progress_metrics` - Body measurements and wellness tracking

View the schema: `backend/prisma/schema.prisma`

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### User Profile
- `GET /api/users/profile` - Get user profile
- `POST /api/users/profile` - Create user profile
- `PUT /api/users/profile` - Update user profile

### Exercises
- `GET /api/exercises` - List all exercises
- `GET /api/exercises/:id` - Get exercise details
- `GET /api/exercises/search` - Search/filter exercises
- `GET /api/movement-patterns` - List movement patterns

### Workouts
- `POST /api/workout-plans/generate` - Generate new workout plan
- `GET /api/workout-plans/active` - Get active plan
- `GET /api/workout-sessions/today` - Get today's workout

### Progress
- `POST /api/workout-logs` - Log completed workout
- `GET /api/workout-logs` - Get workout history
- `POST /api/progress/metrics` - Log body metrics
- `GET /api/progress/stats` - Get progress statistics

---

## Development Workflow

### Creating a New Feature

1. **Backend**
   - Add database models to `backend/prisma/schema.prisma`
   - Run migration: `npm run db:migrate --workspace=backend`
   - Create service in `backend/src/services/`
   - Create controller in `backend/src/controllers/`
   - Add routes in `backend/src/routes/`

2. **Frontend**
   - Create types in `shared/types/`
   - Create page in `frontend/src/pages/`
   - Create components in `frontend/src/components/`
   - Add route in `frontend/src/App.tsx`

3. **Testing**
   - Test API endpoints with Postman or curl
   - Test UI in browser
   - Verify database changes in Prisma Studio

---

## Documentation

Complete product and technical documentation is in the `/docs` folder:

- **Product Docs** (`docs/01-product/`) - Vision, features, roadmap
- **Science Docs** (`docs/02-science/`) - Research foundation, safety protocols
- **Exercise Library** (`docs/03-exercise-library/`) - Movement patterns, progressions
- **Algorithms** (`docs/04-algorithms/`) - Workout generation logic
- **Database** (`docs/05-data/`) - Schema design, query patterns
- **Architecture** (`docs/06-architecture/`) - System design, tech stack
- **Features** (`docs/07-features/`) - Feature specifications
- **UX** (`docs/08-ux/`) - User journeys, design system

Start with: `docs/00-meta/README.md`

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set root directory to `backend`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables (DATABASE_URL, JWT_SECRET, etc.)

### Database (Railway/Supabase)
1. Create PostgreSQL instance
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npm run db:migrate:deploy --workspace=backend`
4. Run seed: `npm run db:seed --workspace=backend`
5. Apply RLS policies if using Supabase client access:
   - SQL source: `backend/prisma/rls_policies.sql`
   - Migration: `backend/prisma/migrations/20251223_add_rls_policies/migration.sql`
   - Ensure `auth.uid()` maps to `public.users.id` for authenticated users

---

## Contributing

### Code Style
- Follow ESLint rules
- Format with Prettier before committing
- Write meaningful commit messages
- Keep functions small and focused

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and test thoroughly
3. Run linter: `npm run lint`
4. Format code: `npm run format`
5. Create pull request with clear description

---

## License

MIT License - See LICENSE file for details

---

## Support

For questions or issues:
- Check documentation in `/docs`
- Review implementation plan in `.claude/plans/`
- Open an issue on GitHub

---

**Built with ❤️ for calisthenics athletes**
**Generated with Claude Sonnet 4.5**
