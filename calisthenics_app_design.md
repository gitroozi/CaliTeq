# Calisthenics Workout App - Product Design Document

## Executive Summary

**Product Name:** CaliFlow (working title)

**Vision:** An intelligent web-based calisthenics training platform that creates personalized, evidence-based workout programs tailored to individual goals, experience levels, and physical limitations.

**Target Users:** Adults (18-65+) looking to build strength, lose fat, and improve fitness through bodyweight training, with special consideration for those with injuries, limitations, or returning to exercise after sedentary periods.

**Core Value Proposition:**
- Personalized workout plans based on user profile (age, goals, experience, limitations)
- Evidence-based programming with progressive overload
- Comprehensive exercise library with video demonstrations
- Nutrition guidance for body composition goals
- Progress tracking and analytics
- Safe programming with injury/limitation awareness

**Platform:** Web application (responsive design for desktop, tablet, mobile browsers)

**Monetization Strategy:** Freemium model
- Free: Basic workout generation, limited exercise library
- Premium: Full features, nutrition plans, video library, progress tracking, AI coaching

---

## Table of Contents

1. [User Personas](#user-personas)
2. [Core Features](#core-features)
3. [User Journey & Flow](#user-journey)
4. [Technical Architecture](#technical-architecture)
5. [Data Models](#data-models)
6. [App Structure & Components](#app-structure)
7. [Workout Generation Algorithm](#workout-algorithm)
8. [Exercise Progression System](#exercise-progressions)
9. [Nutrition Module](#nutrition-module)
10. [Progress Tracking System](#progress-tracking)
11. [UI/UX Design Principles](#design-principles)
12. [MVP Roadmap](#mvp-roadmap)
13. [Technology Stack Recommendations](#tech-stack)
14. [Security & Privacy](#security)
15. [Future Enhancements](#future-enhancements)

---

## User Personas {#user-personas}

### Persona 1: "Returning Rick" (Primary Target)
- **Age:** 35-50
- **Background:** Sedentary office worker, hasn't exercised regularly in years
- **Goals:** Lose fat (10-15kg), build strength, improve health markers
- **Challenges:** Limited time (30-45 min sessions), potential injuries/limitations, low fitness baseline
- **Motivation:** Health scare, upcoming milestone (wedding, reunion), doctor's recommendation
- **Tech Savvy:** Moderate, comfortable with web apps
- **Key Needs:** Safe progressions, clear instructions, accountability, visible progress

### Persona 2: "Beginner Beth"
- **Age:** 25-35
- **Background:** Gym intimidation, wants to start strength training at home
- **Goals:** Build muscle definition, improve confidence, sustainable fitness habit
- **Challenges:** No equipment, limited knowledge, consistency
- **Motivation:** Social media fitness inspiration, body composition goals
- **Tech Savvy:** High, uses multiple fitness apps
- **Key Needs:** Education, variety, community support, visual progress

### Persona 3: "Intermediate Ian"
- **Age:** 28-45
- **Background:** Has calisthenics experience, plateaued in progress
- **Goals:** Master advanced skills (muscle-ups, front lever, pistol squats)
- **Challenges:** Programming knowledge, appropriate progressions
- **Motivation:** Skill achievement, strength goals, performance
- **Tech Savvy:** High
- **Key Needs:** Advanced progressions, periodization, skill tracking

### Persona 4: "Recovery Rachel"
- **Age:** 40-60
- **Background:** Has injury or chronic condition (like cervical disc issues)
- **Goals:** Build strength safely, manage pain, maintain mobility
- **Challenges:** Exercise modifications, safety concerns, medical clearance
- **Motivation:** Pain reduction, functional independence, quality of life
- **Tech Savvy:** Moderate
- **Key Needs:** Safe exercise selection, modification options, clear contraindications

---

## Core Features {#core-features}

### 1. Intelligent Onboarding & Assessment
**Purpose:** Gather comprehensive user data to generate optimal workout plans

**Input Collection:**
- **Personal Details**
  - Age, gender, height, current weight, target weight
  - Activity level (sedentary to very active)
  - Training experience (never trained, beginner, intermediate, advanced)
  - Training availability (days per week, session duration)

- **Goals Assessment** (multi-select with priority ranking)
  - Fat loss / Body recomposition
  - Muscle gain / Strength building
  - Skill mastery (specific calisthenics movements)
  - General fitness / Health improvement
  - Athletic performance

- **Medical & Injury Screening**
  - Current injuries or chronic conditions
  - Movement limitations or pain
  - Previous surgeries or significant medical history
  - Clearance for exercise (if needed)
  - Specific body regions to avoid or protect (neck, shoulders, knees, back)

- **Equipment Availability**
  - Pull-up bar (yes/no)
  - Dip bars or parallel bars
  - Resistance bands
  - Elevated surfaces (bench, box, chairs)
  - Other equipment

- **Movement Assessment** (optional video upload or self-assessment)
  - Push-up capability (wall, incline, knee, standard)
  - Pull-up capability (rows, assisted, negative, full)
  - Squat depth and form
  - Core strength (plank hold time)

**Output:**
- User profile with training classification
- Recommended starting point for each movement pattern
- Flagged contraindications or exercise modifications needed

---

### 2. Personalized Workout Plan Generation

**Algorithm Type:** Hybrid rule-based + AI enhancement

**Rule-Based Foundation:**
- **Periodization structure** based on experience level
  - Beginners: Anatomical adaptation → Hypertrophy intro → Strength prep (3-4 week mesocycles)
  - Intermediate: Strength development with undulating periodization
  - Advanced: Skill-focused with DUP (Daily Undulating Periodization)

- **Exercise selection** based on:
  - Current progression level per movement pattern
  - Equipment availability
  - Injury/limitation flags
  - Recovery capacity (age-adjusted)

- **Volume prescription**:
  - Sets per muscle group per week (beginner: 8-10, intermediate: 12-16, advanced: 16-20+)
  - Rep ranges based on phase (strength: 5-8, hypertrophy: 8-12, endurance: 12-20)
  - Rest periods appropriate to intensity

- **Deload scheduling**: Automatic every 3-4 weeks

**AI Enhancement Layer:**
- **Personalized coaching cues** based on user profile and limitations
- **Exercise substitutions** with natural language explanations
- **Form tips** specific to user's injury/limitation profile
- **Motivation and context** for why specific exercises are programmed
- **Adaptive modifications** based on user feedback and progress

**Plan Output:**
- 12-week structured program (3 mesocycles of 4 weeks each)
- Daily workout structure:
  - Warm-up protocol (mobility, activation)
  - Main strength work (4-6 exercises)
  - Core/accessory work
  - Cool-down (stretching, breathing)
- Detailed exercise descriptions
- Video demonstrations for each movement
- Progression targets and benchmarks
- Deload weeks clearly marked

---

### 3. Exercise Library & Video Database

**Structure:** Organized by movement pattern and progression level

**Primary Movement Patterns (Fundamental Strength):**
1. **Horizontal Push** (Push-ups, dips)
2. **Vertical Push** (Pike push-ups, handstand progressions)
3. **Horizontal Pull** (Rows, front lever work)
4. **Vertical Pull** (Pull-ups, chin-ups)
5. **Squat** (Bilateral and unilateral)
6. **Hinge** (Bridges, Nordic curls, single-leg RDL)
7. **Core Stability** (Planks, hollow body, dead bugs)

**Secondary Movement Patterns (Comprehensive Training):**
8. **Anti-Rotation** (Pallof press variations, side planks, Copenhagen planks)
9. **Rotation** (Russian twists, windshield wipers, dragon flags)
10. **Vertical Press-Pull** (Muscle-ups, combination movements)
11. **Locomotion** (Bear crawls, crab walks, quadrupedal movement)
12. **Jumping/Plyometrics** (Jump squats, box jumps, burpees, explosive push-ups)
13. **Carry/Hold** (Farmer walks, suitcase carries - with external load)
14. **Ballistic** (Clap push-ups, kipping movements, explosive variations)

**Skill-Based Movement Patterns (Advanced):**
15. **Static Holds** (L-sits, V-sits, planche progressions, front/back lever)
16. **Handstand/Inversion** (Handstand holds, handstand push-ups, wall runs)
17. **Dynamic Skills** (Muscle-ups, 360 pulls, swing progressions)
18. **Flow/Combination** (Linking movements, freestyle calisthenics)

**Auxiliary Patterns (Support & Mobility):**
19. **Mobility & Flexibility** (Dynamic stretching, active flexibility, splits progressions)
20. **Stability & Balance** (Single-leg holds, instability training)
21. **Grip Strength** (Dead hangs, towel hangs, finger training)
22. **Wrist/Forearm** (Wrist conditioning, forearm strengthening)

---

### Movement Pattern Taxonomy - Implementation Strategy

**For MVP (Phase 1):**
Focus on the **7 Primary Movement Patterns** only - these cover all fundamental strength and muscle building needs:
- Horizontal Push, Vertical Push, Horizontal Pull, Vertical Pull, Squat, Hinge, Core Stability
- Approximately 50-80 exercises total
- This matches the research document's evidence-based approach for beginners and intermediates

**For Phase 2-3 Expansion:**
Add **Secondary Patterns** for variety and comprehensive training:
- Anti-rotation, Rotation, Locomotion patterns
- Approximately 120-150 exercises total
- Introduces athletic development and conditioning elements

**For Advanced Features (Phase 4+):**
Add **Skill-Based and Auxiliary Patterns** for advanced users:
- Static holds, handstands, dynamic skills
- Mobility, flexibility, and prehab work
- 200+ exercises total
- Caters to experienced calisthenics athletes pursuing specific skills

**Pattern Classification Rationale:**

| Pattern Category | Primary Goal | User Level | Programming Priority |
|-----------------|-------------|------------|---------------------|
| Primary Patterns | Strength & Hypertrophy | All levels | Essential (every program) |
| Secondary Patterns | Athletic qualities, variety | Intermediate+ | Optional (based on goals) |
| Skill-Based Patterns | Skill mastery, performance | Advanced | Goal-dependent |
| Auxiliary Patterns | Injury prevention, mobility | All levels | Supplementary |

**How Patterns Map to User Goals:**

- **Fat Loss Goal:** Primary patterns (high metabolic demand) + Plyometrics (calorie burn)
- **Muscle Gain Goal:** Primary patterns (progressive overload focus)
- **Strength Goal:** Primary patterns (low rep strength work)
- **Skill Mastery Goal:** Primary patterns (foundation) + Skill-based patterns (specific practice)
- **General Fitness:** Primary + Secondary patterns (well-rounded)
- **Athletic Performance:** All categories (comprehensive athleticism)

**Exercise Distribution in Library:**

```
Primary Patterns (7): ~60-70 exercises (8-10 per pattern)
├─ Beginner variations: 3-4 per pattern
├─ Intermediate variations: 3-4 per pattern
└─ Advanced variations: 2-3 per pattern

Secondary Patterns (7): ~40-50 exercises (5-7 per pattern)
├─ Each pattern has 3-5 difficulty levels

Skill-Based Patterns (4): ~30-40 exercises (7-10 per pattern)
├─ Heavy emphasis on progressions (10+ steps to master skills)

Auxiliary Patterns (4): ~20-30 exercises (5-7 per pattern)
├─ Supplementary work (warm-up, cool-down, prehab)

Total Exercise Library: 150-190 exercises
```

**Pattern Tagging System:**

Each exercise would be tagged with:
- **Primary Pattern:** Main movement classification
- **Secondary Patterns:** Additional benefits (e.g., push-ups also work core)
- **Muscle Groups:** Specific muscles targeted
- **Difficulty:** 1-10 scale
- **Equipment:** Required equipment
- **Goals Alignment:** Which user goals this supports
- **Training Phase:** When in periodization to use (strength, hypertrophy, power)

---

**Each Exercise Entry Includes:**
- **Video demonstration** (multiple angles)
  - Proper form execution
  - Common mistakes to avoid
  - Side-by-side comparison (correct vs incorrect)
- **Written description**
  - Setup and positioning
  - Movement execution (eccentric, pause, concentric)
  - Breathing cues
  - Target muscles
- **Progression pathway**
  - Easier regression (how to scale down)
  - Current exercise
  - Harder progression (next step up)
- **Modification options**
  - For specific injuries (e.g., cervical-safe modifications)
  - Equipment alternatives
- **Coaching cues**
  - Key points of performance
  - What to feel and focus on
  - Safety reminders
- **Difficulty rating** (1-10 scale)
- **Equipment required**
- **Contraindications** (when to avoid this exercise)

**Library Features:**
- Search and filter (by pattern, difficulty, equipment, body region)
- Favorites/bookmarks
- Personal notes on each exercise
- User ratings and feedback

---

### 4. Nutrition Guidance Module

**Purpose:** Provide evidence-based nutrition plans aligned with training goals

**Calorie & Macro Calculator:**

**Input:**
- User profile (age, gender, height, weight, activity level)
- Goals (fat loss, muscle gain, maintenance, recomposition)
- Training frequency and intensity

**Output:**
- **Total Daily Energy Expenditure (TDEE)**
- **Target caloric intake** with deficit/surplus based on goals
  - Fat loss: -300 to -500 kcal (0.5-0.75kg per week)
  - Muscle gain: +200 to +300 kcal
  - Recomposition: Slight deficit or maintenance
- **Macronutrient targets**
  - Protein: 1.8-2.2g/kg (higher for older adults, cutting phases)
  - Fats: 0.6-1.0g/kg (minimum for hormonal health)
  - Carbs: Remaining calories, adjusted for training days
- **Meal timing recommendations**
  - Protein distribution (3-4 meals with 30-40g each)
  - Pre/post-workout nutrition
  - Pre-sleep protein recommendation (casein)

**Sample Meal Plans:**
- Generate daily meal plans matching macro targets
- Options for dietary preferences (omnivore, vegetarian, vegan, low-carb, etc.)
- Substitution suggestions for foods user dislikes
- Shopping list generation
- Recipe database with nutritional information

**Supplement Guidance:**
- Evidence-based recommendations (Tier 1, 2, 3)
- Tier 1: Creatine, Protein powder, Vitamin D
- Tier 2: Omega-3, Caffeine
- Tier 3: Avoid (minimal evidence)
- Dosing protocols and timing

**Hydration Tracking:**
- Daily water intake targets (3-4L baseline + training adjustments)
- Reminder system

**Integration with Workout Plan:**
- Nutrition targets adjust based on training phase
- Higher carbs on training days (optional carb cycling)
- Deload week nutrition adjustments

---

### 5. Progress Tracking & Analytics

**Workout Logging:**
- **Quick log interface** for each workout session
  - Mark exercises as completed
  - Log actual sets × reps performed
  - Rate difficulty (RPE 1-10 scale)
  - Note any issues or modifications made
  - Session duration
  - Energy level and overall feel
- **Missed workout handling**
  - Options: Reschedule, skip, mark as rest day
  - Impact on weekly volume tracking

**Progress Metrics:**

**Performance Tracking:**
- Rep maxes for each exercise
- Time-based holds (planks, L-sits)
- Skill achievements (first pull-up, first pistol squat)
- Volume progression over time (total sets/reps per week)
- Training frequency and adherence rate

**Body Metrics:**
- Weight tracking (daily/weekly weigh-ins with trend line)
- Waist circumference
- Progress photos
  - Front, side, back poses
  - Date-stamped with side-by-side comparisons
  - Before/after generators
  - Privacy controls (local storage option)
- Body fat percentage (optional, if user has measurements)

**Analytics Dashboard:**
- **Training overview**
  - Weekly volume by muscle group
  - Adherence rate (workouts completed vs scheduled)
  - Consistency streaks
- **Strength progression charts**
  - Rep maxes over time per exercise
  - Volume load trends
- **Body composition trends**
  - Weight trajectory with target overlay
  - Waist circumference trend
  - Photo timeline
- **Recovery metrics**
  - Optional: Morning resting heart rate tracking
  - Subjective wellness score (sleep, energy, soreness, mood)
  - Recovery status indicator (green/yellow/red)

**Achievements & Gamification:**
- Milestone badges (first pull-up, 100 workouts, 6-month streak)
- Strength level classifications (novice → intermediate → advanced → elite)
- Social sharing options for achievements

---

### 6. Adaptive Programming & AI Coaching

**Auto-Regulation Features:**

**Progress-Based Adjustments:**
- If user consistently exceeds rep targets → suggest progression to harder variation
- If user struggles to hit minimums → suggest regression or modification
- Volume adjustments based on recovery feedback

**Check-In System:**
- **Every 2-4 weeks**: Brief assessment
  - How are you feeling overall? (energy, recovery, motivation)
  - Any new pain or injuries?
  - Are workouts too easy, too hard, or just right?
  - Goals still the same?
- **AI analysis** of:
  - Logged workout data (performance trends)
  - User feedback (sentiment analysis)
  - Progress toward goals
- **Recommendations**:
  - Continue current plan
  - Increase/decrease volume
  - Modify exercise selection
  - Insert extra deload week
  - Adjust nutrition targets

**AI Coaching Chat:**
- Natural language interface for questions
- "Why am I doing pike push-ups instead of handstand push-ups?"
- "My shoulder hurts during rows, what should I do?"
- "Can I add more arm work?"
- AI provides contextual answers based on user's specific program and profile

**Form Feedback (Future Enhancement):**
- Video upload for form checks
- AI analysis of movement patterns
- Coaching cues for improvement
- Safety warnings for dangerous form

---

### 7. User Dashboard & Interface

**Dashboard Components:**

**Today's Workout Card:**
- Current day's workout displayed prominently
- Estimated duration
- Quick-start button
- Option to view full week

**Progress Summary:**
- Current weight vs target (with progress bar)
- Workouts completed this week
- Current streak
- Recent achievement

**Quick Stats:**
- Days until goal weight (projected)
- Total workouts completed
- Favorite/strongest exercises

**Upcoming:**
- This week's training schedule
- Next deload week indicator
- Upcoming check-in date

**Navigation:**
- Today's Workout
- My Program (view full 12-week plan)
- Exercise Library
- Nutrition
- Progress
- Profile & Settings

---

## User Journey & Flow {#user-journey}

### First-Time User Journey

```
1. Landing Page
   ↓
2. Sign Up / Create Account
   ↓
3. Welcome & Onboarding Start
   ↓
4. Personal Details Form
   (Age, gender, height, weight, goals)
   ↓
5. Experience & Availability Assessment
   (Training history, days/week available)
   ↓
6. Medical & Injury Screening
   (Conditions, limitations, pain areas)
   ↓
7. Equipment Check
   (What equipment do you have?)
   ↓
8. Movement Assessment (Optional)
   (Test basic movements or self-assess)
   ↓
9. Goal Prioritization
   (Rank your goals: strength, fat loss, skills, etc.)
   ↓
10. Plan Generation (Loading screen with educational tips)
    ↓
11. Plan Review & Explanation
    (AI-generated summary of why this plan fits you)
    ↓
12. Dashboard - Today's First Workout
    ↓
13. Nutrition Setup (Optional but recommended)
    (Calculate macros, review guidance)
    ↓
14. Tutorial Tips (First-time user tooltips)
    ↓
15. Start First Workout
```

### Daily Returning User Journey

```
1. Login → Dashboard
   ↓
2. View Today's Workout
   ↓
3. Click "Start Workout"
   ↓
4. Warm-up Phase
   (Exercise demos, timer for holds/reps)
   ↓
5. Main Work
   (Log sets/reps for each exercise)
   (Watch videos as needed)
   ↓
6. Cool-down
   ↓
7. Complete Workout
   (Summary stats, achievements unlocked)
   ↓
8. Optional: Log body weight or progress photo
   ↓
9. Dashboard (updated with today's completion)
```

### Weekly Check-In Journey

```
1. Notification: "Time for your 2-week check-in!"
   ↓
2. Check-in Survey
   (How are you feeling? Any issues? Progress satisfaction?)
   ↓
3. Progress Review
   (AI analyzes data and shows trends)
   ↓
4. Recommendations
   (Continue, adjust volume, modify exercises, etc.)
   ↓
5. Apply Changes (if any)
   ↓
6. Return to Dashboard
```

---

## Technical Architecture {#technical-architecture}

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  (React SPA - Responsive Web Design)                   │
│  - Dashboard UI                                         │
│  - Workout Logger                                       │
│  - Exercise Library Browser                             │
│  - Progress Charts & Analytics                          │
│  - Nutrition Calculator                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTPS / REST API
                 │
┌────────────────▼────────────────────────────────────────┐
│              API Gateway / Backend Server                │
│              (Node.js + Express OR Python + FastAPI)     │
│                                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Authentication Service                          │  │
│  │  (JWT tokens, session management)                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Workout Generation Engine                       │  │
│  │  - Rule-based algorithm (periodization logic)    │  │
│  │  - Exercise selection & progression              │  │
│  │  - Volume/intensity calculations                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  AI Enhancement Layer                            │  │
│  │  - OpenAI API / Anthropic Claude API             │  │
│  │  - Personalized coaching cues                    │  │
│  │  - Chat interface                                │  │
│  │  - Plan explanations                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Nutrition Calculator                            │  │
│  │  - TDEE calculations                             │  │
│  │  - Macro prescriptions                           │  │
│  │  - Meal plan generation                          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Progress Analytics Engine                       │  │
│  │  - Data aggregation                              │  │
│  │  - Trend analysis                                │  │
│  │  - Recommendations                               │  │
│  └─────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────┘
                 │
                 │
┌────────────────▼────────────────────────────────────────┐
│                  Data Layer                              │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐         │
│  │  PostgreSQL DB   │    │  File Storage     │         │
│  │                  │    │  (S3/Cloudinary)  │         │
│  │  - User profiles │    │  - Exercise videos│         │
│  │  - Workout plans │    │  - Progress photos│         │
│  │  - Exercise lib  │    │  - User uploads   │         │
│  │  - Workout logs  │    └──────────────────┘         │
│  │  - Progress data │                                   │
│  │  - Nutrition data│                                   │
│  └──────────────────┘                                   │
│                                                          │
│  ┌──────────────────┐                                   │
│  │  Redis Cache     │                                   │
│  │  - Session data  │                                   │
│  │  - API responses │                                   │
│  └──────────────────┘                                   │
└──────────────────────────────────────────────────────────┘
```

### Key Technology Decisions

**Frontend:**
- **Framework:** React (with TypeScript)
- **State Management:** Redux Toolkit or Zustand
- **Routing:** React Router
- **UI Component Library:** Material-UI or Chakra UI (accessibility-focused)
- **Charts/Graphs:** Recharts or Chart.js
- **Video Player:** React Player or Video.js

**Backend:**
- **Primary Options:**
  1. Node.js + Express + TypeScript (JavaScript ecosystem consistency)
  2. Python + FastAPI (better for ML/AI integration, scientific computing)
- **API Design:** RESTful API with OpenAPI/Swagger documentation
- **Authentication:** JWT tokens with refresh token rotation
- **Rate Limiting:** To protect AI API calls and prevent abuse

**Database:**
- **Primary Database:** PostgreSQL
  - Relational data (users, workout plans, exercises, logs)
  - JSONB for flexible schema (user preferences, workout metadata)
  - Strong consistency guarantees
- **Caching:** Redis
  - Session management
  - Frequently accessed exercise library data
  - API response caching

**File Storage:**
- **Cloud Storage:** AWS S3 or Cloudinary
  - Exercise demonstration videos
  - User progress photos (encrypted, private)
  - User uploads (form check videos)

**AI/ML Integration:**
- **LLM API:** OpenAI GPT-4 or Anthropic Claude
  - Workout plan explanations
  - Coaching chat
  - Personalized tips
- **Rate limiting and cost control** on AI features

**Infrastructure:**
- **Hosting:**
  - Frontend: Vercel or Netlify (easy deployment, CDN)
  - Backend: Railway, Render, or AWS ECS
  - Database: Managed PostgreSQL (Railway, Supabase, or AWS RDS)
- **CDN:** Cloudflare for global performance
- **Monitoring:** Sentry (error tracking), LogRocket (session replay)

---

## Data Models {#data-models}

### User Model

```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Unique, indexed
  passwordHash: string;

  // Profile
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  // Physical Metrics
  height: number;                // cm
  currentWeight: number;         // kg
  targetWeight?: number;         // kg, optional

  // Account
  subscriptionTier: 'free' | 'premium';
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;

  // Settings
  preferences: {
    units: 'metric' | 'imperial';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}
```

### UserProfile Model

```typescript
interface UserProfile {
  userId: string;                // Foreign key to User

  // Training Background
  trainingExperience: 'never' | 'beginner' | 'intermediate' | 'advanced';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

  // Goals (array, ordered by priority)
  goals: Array<{
    type: 'fat_loss' | 'muscle_gain' | 'strength' | 'skills' | 'general_fitness';
    priority: number;            // 1 = highest
  }>;

  // Availability
  daysPerWeek: number;           // 2-7
  minutesPerSession: number;     // 20-90

  // Medical & Limitations
  injuries: Array<{
    bodyPart: string;            // e.g., "cervical spine", "left knee"
    description: string;
    contraindications: string[]; // Exercise IDs or patterns to avoid
  }>;

  medicalConditions: string[];
  exerciseClearance: boolean;    // Medical clearance obtained

  // Equipment
  equipment: {
    pullUpBar: boolean;
    dipBars: boolean;
    resistanceBands: boolean;
    elevatedSurface: boolean;
    other: string[];
  };

  // Movement Assessment Results
  assessmentScores: {
    pushLevel: number;           // 1-10 scale
    pullLevel: number;
    squatLevel: number;
    hingeLevel: number;
    coreLevel: number;
  };

  updatedAt: Date;
}
```

### Exercise Model

```typescript
interface Exercise {
  id: string;
  name: string;
  slug: string;                  // URL-friendly

  // Classification
  movementPattern: 'horizontal_push' | 'vertical_push' | 'horizontal_pull' |
                   'vertical_pull' | 'squat' | 'hinge' | 'core';
  difficulty: number;            // 1-10

  // Content
  description: string;           // Markdown
  videoUrl: string;              // Primary demo video
  thumbnailUrl: string;

  // Detailed Instructions
  setup: string;                 // How to set up
  execution: string;             // How to perform
  commonMistakes: string[];
  coachingCues: string[];
  targetMuscles: string[];

  // Progression Pathway
  regressionId?: string;         // Easier variation
  progressionId?: string;        // Harder variation
  alternatives: string[];        // Alternative exercises (same difficulty)

  // Requirements
  equipmentRequired: string[];
  contraindications: string[];   // When to avoid
  modifications: Array<{
    condition: string;           // e.g., "cervical disc issues"
    modification: string;        // How to modify
  }>;

  // Metadata
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### WorkoutPlan Model

```typescript
interface WorkoutPlan {
  id: string;
  userId: string;                // Foreign key

  // Plan Metadata
  name: string;                  // e.g., "12-Week Strength Foundation"
  startDate: Date;
  endDate: Date;                 // 12 weeks from start

  // Structure
  duration: number;              // weeks (typically 12)
  frequency: number;             // sessions per week (3-5)
  split: 'full_body' | 'upper_lower' | 'push_pull_legs';

  // Periodization
  mesocycles: Array<{
    name: string;                // e.g., "Anatomical Adaptation"
    startWeek: number;
    endWeek: number;
    focus: string;               // e.g., "Movement learning, conditioning"
    repRange: string;            // e.g., "12-15"
    sets: number;
    restSeconds: number;
  }>;

  // Deload Weeks
  deloadWeeks: number[];         // e.g., [4, 8, 12]

  // AI Context
  generationPrompt: string;      // Original user input/context
  aiExplanation: string;         // Why this plan was chosen

  // Status
  status: 'active' | 'completed' | 'paused';

  createdAt: Date;
  updatedAt: Date;
}
```

### WorkoutSession Model

```typescript
interface WorkoutSession {
  id: string;
  workoutPlanId: string;         // Foreign key
  userId: string;                // Foreign key

  // Schedule
  weekNumber: number;            // 1-12
  dayOfWeek: number;             // 1-7 (Monday = 1)
  sessionNumber: number;         // 1-5 (which session this week)
  scheduledDate: Date;

  // Structure
  name: string;                  // e.g., "Week 1 - Full Body A"
  isDeload: boolean;

  // Exercises
  exercises: Array<{
    exerciseId: string;          // Foreign key to Exercise
    order: number;               // Exercise order in workout
    sets: number;
    reps: string;                // "8-12" or "AMRAP" or "30s hold"
    restSeconds: number;
    tempo?: string;              // e.g., "3-1-1-0" (eccentric-pause-concentric-pause)
    notes?: string;              // AI-generated coaching notes
  }>;

  // Warm-up & Cool-down
  warmup: Array<{
    name: string;
    duration: string;            // "5 minutes" or "10 reps"
  }>;

  cooldown: Array<{
    name: string;
    duration: string;
  }>;

  // Completion
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: Date;
}
```

### WorkoutLog Model

```typescript
interface WorkoutLog {
  id: string;
  userId: string;
  workoutSessionId: string;      // Foreign key

  // Session Details
  startedAt: Date;
  completedAt: Date;
  durationMinutes: number;

  // Exercise Performance
  exerciseLogs: Array<{
    exerciseId: string;
    sets: Array<{
      setNumber: number;
      repsCompleted: number;
      targetReps: string;        // What was prescribed
      rpe: number;               // Rate of Perceived Exertion 1-10
      notes?: string;            // User notes
    }>;
  }>;

  // Subjective Feedback
  overallDifficulty: number;     // 1-10
  energyLevel: number;           // 1-10
  enjoyment: number;             // 1-10
  notes?: string;                // General session notes

  // Issues
  pain?: Array<{
    bodyPart: string;
    severity: number;            // 1-10
    description: string;
  }>;
}
```

### ProgressMetric Model

```typescript
interface ProgressMetric {
  id: string;
  userId: string;

  // Timestamp
  recordedAt: Date;

  // Type
  metricType: 'weight' | 'waist_circumference' | 'body_fat' |
              'rep_max' | 'photo' | 'wellness';

  // Data (polymorphic based on type)
  data: {
    // For weight
    weight?: number;             // kg

    // For waist
    waistCircumference?: number; // cm

    // For body fat
    bodyFatPercentage?: number;

    // For rep max
    exerciseId?: string;
    reps?: number;

    // For photo
    photoUrl?: string;
    photoType?: 'front' | 'side' | 'back';

    // For wellness
    sleepQuality?: number;       // 1-10
    energyLevel?: number;        // 1-10
    soreness?: number;           // 1-10
    mood?: number;               // 1-10
    restingHeartRate?: number;   // bpm
  };
}
```

### NutritionPlan Model

```typescript
interface NutritionPlan {
  id: string;
  userId: string;

  // Calculations
  tdee: number;                  // Total Daily Energy Expenditure (kcal)
  targetCalories: number;        // TDEE +/- deficit/surplus
  deficit: number;               // kcal (negative for deficit)

  // Macros
  macros: {
    protein: number;             // grams
    fat: number;                 // grams
    carbs: number;               // grams
  };

  // Meal Timing
  mealsPerDay: number;           // 3-4
  proteinPerMeal: number;        // grams

  // Recommendations
  preSleepProtein: string;       // e.g., "30-40g casein"
  preWorkoutCarbs: string;       // e.g., "30-50g"
  postWorkoutProtein: string;    // e.g., "30-40g whey"

  // Supplements
  supplements: Array<{
    name: string;
    dosage: string;
    timing: string;
    tier: 1 | 2 | 3;             // Evidence tier
  }>;

  // Hydration
  dailyWaterIntake: number;      // liters

  createdAt: Date;
  updatedAt: Date;
}
```

---

## App Structure & Components {#app-structure}

### Frontend Component Hierarchy

```
App
├── AuthLayout
│   ├── Login
│   ├── SignUp
│   └── PasswordReset
│
├── OnboardingFlow
│   ├── PersonalDetails
│   ├── ExperienceAssessment
│   ├── MedicalScreening
│   ├── EquipmentCheck
│   ├── GoalSelection
│   ├── PlanGeneration (loading)
│   └── PlanReview
│
├── MainLayout (Authenticated)
│   ├── Navigation
│   │   ├── Sidebar (desktop)
│   │   └── BottomNav (mobile)
│   │
│   ├── Dashboard
│   │   ├── TodayWorkoutCard
│   │   ├── ProgressSummary
│   │   ├── QuickStats
│   │   ├── UpcomingSchedule
│   │   └── Achievements
│   │
│   ├── WorkoutView
│   │   ├── WorkoutHeader (name, week, duration)
│   │   ├── WarmupSection
│   │   ├── MainWorkSection
│   │   │   ├── ExerciseCard (for each exercise)
│   │   │   │   ├── ExerciseHeader
│   │   │   │   ├── VideoEmbed (collapsible)
│   │   │   │   ├── SetLogger
│   │   │   │   └── Notes
│   │   ├── CooldownSection
│   │   └── WorkoutSummary (on completion)
│   │
│   ├── ProgramView
│   │   ├── ProgramOverview
│   │   ├── WeeklySchedule (calendar view)
│   │   ├── MesocycleCards
│   │   └── ProgressionPathway
│   │
│   ├── ExerciseLibrary
│   │   ├── SearchBar
│   │   ├── Filters (pattern, difficulty, equipment)
│   │   ├── ExerciseGrid
│   │   └── ExerciseDetailModal
│   │       ├── VideoPlayer
│   │       ├── Description
│   │       ├── ProgressionPath
│   │       ├── Modifications
│   │       └── RelatedExercises
│   │
│   ├── Nutrition
│   │   ├── MacroCalculator
│   │   ├── DailyTargets
│   │   ├── MealPlanner
│   │   ├── SupplementGuide
│   │   └── HydrationTracker
│   │
│   ├── Progress
│   │   ├── TabNavigation (Performance, Body, Photos, Wellness)
│   │   ├── PerformanceTab
│   │   │   ├── StrengthCharts (per exercise)
│   │   │   ├── VolumeChart
│   │   │   └── AchievementTimeline
│   │   ├── BodyTab
│   │   │   ├── WeightChart
│   │   │   ├── WaistChart
│   │   │   └── BodyFatChart
│   │   ├── PhotosTab
│   │   │   ├── UploadInterface
│   │   │   ├── PhotoGallery
│   │   │   └── ComparisonView
│   │   └── WellnessTab
│   │       ├── SleepQualityChart
│   │       ├── EnergyChart
│   │       └── RestingHRChart
│   │
│   ├── Profile
│   │   ├── PersonalInfo
│   │   ├── Goals & Preferences
│   │   ├── Medical & Injuries
│   │   ├── Equipment
│   │   ├── Subscription
│   │   └── Settings
│   │
│   └── AICoach (Chat Modal)
│       ├── ChatInterface
│       ├── QuickQuestions
│       └── FormCheckUpload
│
└── SharedComponents
    ├── ExerciseCard
    ├── VideoPlayer
    ├── ProgressChart
    ├── LoadingStates
    ├── Modals
    └── Forms
```

### Backend API Routes

```
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/reset-password

Users
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
GET    /api/users/:id/profile
PUT    /api/users/:id/profile

Workout Plans
POST   /api/workout-plans/generate        # Generate new plan
GET    /api/workout-plans/:id
PUT    /api/workout-plans/:id
DELETE /api/workout-plans/:id
GET    /api/workout-plans/:id/sessions    # All sessions in plan
POST   /api/workout-plans/:id/adjust      # Request plan adjustment

Workout Sessions
GET    /api/workout-sessions/:id
GET    /api/workout-sessions/today        # Today's workout
GET    /api/workout-sessions/week         # This week's schedule
PUT    /api/workout-sessions/:id          # Reschedule or modify

Workout Logs
POST   /api/workout-logs                  # Log a completed workout
GET    /api/workout-logs                  # User's workout history
GET    /api/workout-logs/:id
PUT    /api/workout-logs/:id
DELETE /api/workout-logs/:id

Exercises
GET    /api/exercises                     # List all (with filters)
GET    /api/exercises/:id                 # Single exercise detail
GET    /api/exercises/search?q=          # Search exercises
GET    /api/exercises/:id/progression     # Get progression pathway

Progress Metrics
POST   /api/progress/metrics              # Log new metric
GET    /api/progress/metrics              # Get user's metrics (filtered)
GET    /api/progress/analytics            # Aggregated analytics
DELETE /api/progress/metrics/:id

Photos
POST   /api/progress/photos/upload        # Upload progress photo
GET    /api/progress/photos               # User's photos
DELETE /api/progress/photos/:id

Nutrition
POST   /api/nutrition/calculate           # Calculate nutrition plan
GET    /api/nutrition/plan                # Get user's plan
PUT    /api/nutrition/plan                # Update plan
GET    /api/nutrition/meals               # Get meal suggestions

AI Coach
POST   /api/ai/chat                       # Send message to AI coach
POST   /api/ai/analyze-workout            # Get workout analysis
POST   /api/ai/explain-exercise           # Get exercise explanation

Check-ins
GET    /api/check-ins/next                # Get next check-in date
POST   /api/check-ins                     # Submit check-in
GET    /api/check-ins/history             # Past check-ins

Subscriptions
POST   /api/subscriptions/checkout        # Create checkout session
GET    /api/subscriptions/status          # Current subscription
POST   /api/subscriptions/cancel
```

---

## Workout Generation Algorithm {#workout-algorithm}

### Algorithm Overview

**Hybrid Approach:**
1. **Rule-based foundation**: Periodization structure, volume calculations, exercise selection logic
2. **AI enhancement**: Personalized explanations, coaching cues, contextual modifications

### Step 1: User Classification

**Input:** UserProfile data

**Output:** Training classification

```typescript
function classifyUser(profile: UserProfile): TrainingClassification {
  // Determine training level
  let level: 'beginner' | 'intermediate' | 'advanced';

  if (profile.trainingExperience === 'never' ||
      profile.trainingExperience === 'beginner') {
    level = 'beginner';
  } else if (profile.trainingExperience === 'intermediate' &&
             profile.assessmentScores.average > 5) {
    level = 'intermediate';
  } else if (profile.trainingExperience === 'advanced' &&
             profile.assessmentScores.average > 7) {
    level = 'advanced';
  } else {
    level = 'beginner'; // Default to safer option
  }

  // Adjust for age (recovery capacity)
  const age = calculateAge(user.dateOfBirth);
  const recoveryMultiplier = age < 30 ? 1.0 :
                            age < 40 ? 0.95 :
                            age < 50 ? 0.90 :
                            age < 60 ? 0.85 : 0.80;

  // Adjust for goals
  const primaryGoal = profile.goals[0].type;

  return {
    level,
    recoveryMultiplier,
    primaryGoal,
    secondaryGoals: profile.goals.slice(1).map(g => g.type)
  };
}
```

### Step 2: Periodization Structure

**Beginner Template (12 weeks):**

```typescript
const beginnerPeriodization = {
  mesocycles: [
    {
      name: "Anatomical Adaptation",
      weeks: [1, 2, 3],
      focus: "Movement learning, conditioning, form mastery",
      repRange: "12-20",
      setsPerExercise: 3,
      restSeconds: 60,
      deload: false
    },
    {
      name: "Deload Week 1",
      weeks: [4],
      focus: "Recovery and adaptation",
      repRange: "12",
      setsPerExercise: 2,
      restSeconds: 90,
      deload: true
    },
    {
      name: "Hypertrophy Introduction",
      weeks: [5, 6, 7],
      focus: "Muscle building, eccentric emphasis",
      repRange: "8-12",
      setsPerExercise: 4,
      restSeconds: 90,
      tempo: "3-1-1-0", // 3s eccentric, 1s pause, 1s concentric, 0s pause
      deload: false
    },
    {
      name: "Deload Week 2",
      weeks: [8],
      focus: "Recovery",
      repRange: "8-10",
      setsPerExercise: 2,
      restSeconds: 90,
      deload: true
    },
    {
      name: "Strength Preparation",
      weeks: [9, 10, 11],
      focus: "Maximum strength development",
      repRange: "6-10",
      setsPerExercise: 4,
      restSeconds: 120,
      deload: false
    },
    {
      name: "Deload Week 3",
      weeks: [12],
      focus: "Final recovery and assessment",
      repRange: "8",
      setsPerExercise: 2,
      restSeconds: 90,
      deload: true
    }
  ],
  frequency: 3, // sessions per week
  split: "full_body"
};
```

**Intermediate/Advanced templates** would have different structures (Upper/Lower, Push/Pull/Legs, DUP, etc.)

### Step 3: Exercise Selection

**For each movement pattern, select appropriate progression level:**

```typescript
function selectExercise(
  pattern: MovementPattern,
  userLevel: number,         // From assessment (1-10)
  equipment: Equipment,
  contraindications: string[]
): Exercise {

  // Get all exercises for this pattern
  const exercises = await getExercisesByPattern(pattern);

  // Filter by equipment availability
  const availableExercises = exercises.filter(ex =>
    ex.equipmentRequired.every(eq => equipment.has(eq))
  );

  // Filter by contraindications
  const safeExercises = availableExercises.filter(ex =>
    !ex.contraindications.some(ci => contraindications.includes(ci))
  );

  // Find exercise matching user level (±1 difficulty tolerance)
  const matchedExercise = safeExercises.find(ex =>
    Math.abs(ex.difficulty - userLevel) <= 1
  );

  // Fallback to closest difficulty
  return matchedExercise ||
         safeExercises.reduce((closest, ex) =>
           Math.abs(ex.difficulty - userLevel) <
           Math.abs(closest.difficulty - userLevel) ? ex : closest
         );
}
```

**Example Exercise Selection for Beginner:**

```typescript
// Week 1 Full-Body Workout (Beginner)
const exerciseSelection = {
  horizontalPush: "Incline Push-ups (Sternum Height)",  // Difficulty 3
  horizontalPull: "Bent-knee Inverted Rows",            // Difficulty 3
  squat: "Box Squats",                                  // Difficulty 2
  hinge: "Glute Bridges",                               // Difficulty 2
  core: "Dead Bugs",                                    // Difficulty 2
  verticalPush: null,  // Skip for weeks 1-4 (beginner safety)
  verticalPull: null   // Skip for weeks 1-4 (build to this)
};
```

### Step 4: Volume Prescription

**Calculate weekly volume based on research guidelines:**

```typescript
function calculateVolume(
  level: TrainingLevel,
  mesocycle: Mesocycle,
  primaryGoal: Goal
): VolumeParams {

  // Base sets per muscle group per week
  const baseSets = {
    beginner: { min: 8, max: 12 },
    intermediate: { min: 12, max: 16 },
    advanced: { min: 16, max: 20 }
  }[level];

  // Adjust for mesocycle
  let sets = baseSets.min;
  if (mesocycle.name.includes("Hypertrophy")) {
    sets = (baseSets.min + baseSets.max) / 2;
  } else if (mesocycle.name.includes("Strength")) {
    sets = baseSets.max;
  }

  // Adjust for goal
  if (primaryGoal === 'muscle_gain') sets *= 1.1;
  if (primaryGoal === 'fat_loss') sets *= 0.9; // Lower volume in deficit

  // Distribute across frequency
  const setsPerSession = Math.round(sets / frequency);

  return {
    setsPerMuscleGroupPerWeek: Math.round(sets),
    setsPerExercise: mesocycle.setsPerExercise,
    repsPerSet: mesocycle.repRange,
    restSeconds: mesocycle.restSeconds
  };
}
```

### Step 5: Session Construction

**Build individual workout sessions:**

```typescript
function buildWorkoutSession(
  weekNumber: number,
  dayNumber: number,
  exercises: Exercise[],
  volumeParams: VolumeParams,
  mesocycle: Mesocycle
): WorkoutSession {

  return {
    weekNumber,
    dayOfWeek: dayNumber,
    name: `Week ${weekNumber} - ${mesocycle.name} - Day ${dayNumber}`,
    isDeload: mesocycle.deload,

    warmup: [
      { name: "Joint rotations", duration: "3 minutes" },
      { name: "Light cardio (jumping jacks, jog in place)", duration: "2 minutes" },
      { name: "Movement-specific warm-up", duration: "3 minutes" }
    ],

    exercises: exercises.map((exercise, index) => ({
      exerciseId: exercise.id,
      order: index + 1,
      sets: mesocycle.deload ?
            Math.floor(volumeParams.setsPerExercise * 0.5) :
            volumeParams.setsPerExercise,
      reps: mesocycle.deload ?
            extractMinReps(volumeParams.repsPerSet) :
            volumeParams.repsPerSet,
      restSeconds: volumeParams.restSeconds,
      tempo: mesocycle.tempo,
      notes: "" // Will be filled by AI
    })),

    cooldown: [
      { name: "Static stretching (major muscle groups)", duration: "5 minutes" },
      { name: "Deep breathing (4-4-4-4 box breathing)", duration: "2 minutes" }
    ],

    status: 'scheduled'
  };
}
```

### Step 6: AI Enhancement

**After rule-based plan is generated, enhance with AI:**

```typescript
async function enhancePlanWithAI(
  plan: WorkoutPlan,
  userProfile: UserProfile,
  user: User
): Promise<WorkoutPlan> {

  // Generate plan explanation
  const explanationPrompt = `
    You are a certified strength coach. Explain why this workout plan is appropriate for:
    - Age: ${calculateAge(user.dateOfBirth)}
    - Experience: ${userProfile.trainingExperience}
    - Goals: ${userProfile.goals.map(g => g.type).join(', ')}
    - Limitations: ${userProfile.injuries.map(i => i.description).join('; ')}

    The plan structure:
    ${JSON.stringify(plan.mesocycles, null, 2)}

    Provide a 2-3 paragraph explanation that:
    1. Explains the periodization approach
    2. Addresses their specific goals and limitations
    3. Sets realistic expectations

    Be encouraging but realistic. Use simple language.
  `;

  const explanation = await callLLM(explanationPrompt);
  plan.aiExplanation = explanation;

  // Generate exercise-specific coaching cues
  for (const session of plan.sessions) {
    for (const exerciseSlot of session.exercises) {
      const exercise = await getExercise(exerciseSlot.exerciseId);

      const cuePrompt = `
        Exercise: ${exercise.name}
        User has: ${userProfile.injuries.map(i => i.description).join('; ')}

        Provide 1-2 sentences of personalized coaching cues for this user.
        Focus on safety given their limitations.
      `;

      exerciseSlot.notes = await callLLM(cuePrompt);
    }
  }

  return plan;
}
```

### Step 7: Progression Logic

**Auto-progression when user hits targets:**

```typescript
function checkForProgression(
  exerciseLogs: WorkoutLog[],
  currentExercise: Exercise,
  targetSets: number,
  targetReps: string
): ProgressionRecommendation {

  // Get last 3 sessions for this exercise
  const recentSessions = exerciseLogs.slice(-3);

  // Check if user consistently hits top of rep range
  const maxReps = extractMaxReps(targetReps); // "8-12" → 12

  const hittingTargets = recentSessions.every(session =>
    session.exerciseLogs.find(el => el.exerciseId === currentExercise.id)
      ?.sets.every(set => set.repsCompleted >= maxReps)
  );

  if (hittingTargets && currentExercise.progressionId) {
    return {
      shouldProgress: true,
      recommendation: "You've mastered this exercise! Time to progress to the next variation.",
      nextExercise: await getExercise(currentExercise.progressionId)
    };
  }

  return { shouldProgress: false };
}
```

---

## Exercise Progression System {#exercise-progressions}

**📘 For complete detailed progression trees for all 22 movement patterns, see:**
**[`exercise_progression_trees.md`](./exercise_progression_trees.md)**

The following are condensed examples from the full progression document.

### Push Pattern Progression Tree

```
Wall Push-ups (Diff: 1)
  └─> Incline Push-ups - Sternum Height (Diff: 2)
        └─> Incline Push-ups - Hip Height (Diff: 3)
              └─> Knee Push-ups (Diff: 4)
                    └─> Standard Push-ups (Diff: 5)
                          ├─> Diamond Push-ups (Diff: 7)
                          ├─> Archer Push-ups (Diff: 8)
                          └─> One-arm Push-up Progressions (Diff: 9-10)

(Vertical Push branch)
Pike Push-ups - Modified (Diff: 4)
  └─> Pike Push-ups - Feet Elevated (Diff: 6)
        └─> Wall-Supported Handstand Push-ups (Diff: 8)
              └─> Freestanding Handstand Push-ups (Diff: 10)
```

### Pull Pattern Progression Tree

```
Doorway Rows (Diff: 1)
  └─> Bent-knee Inverted Rows (Diff: 2)
        └─> Straight-leg Inverted Rows (Diff: 4)
              └─> Feet-elevated Inverted Rows (Diff: 6)
                    └─> Band-Assisted Pull-ups (Diff: 5)
                          └─> Negative Pull-ups (Diff: 6)
                                └─> Full Pull-ups (Diff: 7)
                                      ├─> Weighted Pull-ups (Diff: 8)
                                      ├─> Archer Pull-ups (Diff: 9)
                                      └─> One-arm Pull-up Progressions (Diff: 10)
```

### Squat Pattern Progression Tree

```
Assisted Squats (Diff: 1)
  └─> Box Squats (Diff: 2)
        └─> Bodyweight Squats (Diff: 3)
              ├─> Split Squats (Diff: 4)
              │     └─> Bulgarian Split Squats (Diff: 6)
              │           └─> Weighted Bulgarian Split Squats (Diff: 8)
              │
              └─> Single-leg Box Squats (Diff: 7)
                    └─> Assisted Pistol Squats (Diff: 8)
                          └─> Full Pistol Squats (Diff: 9)
```

### Hinge Pattern Progression Tree

```
Hip Hinge Wall Drill (Diff: 1)
  └─> Bodyweight Romanian Deadlifts (Diff: 2)
        └─> Single-leg Romanian Deadlifts (Diff: 5)

Glute Bridges (Diff: 2)
  └─> Single-leg Bridges (Diff: 4)
        └─> Hip Thrusts (Diff: 5)
              └─> Single-leg Hip Thrusts (Diff: 7)

Nordic Curl Negatives (Diff: 6)
  └─> Nordic Curls - Partial ROM (Diff: 8)
        └─> Full Nordic Curls (Diff: 9)
```

### Core Pattern Progression Tree

```
Dead Bugs (Diff: 2)
  └─> Bird Dogs (Diff: 3)

Incline Planks (Diff: 2)
  └─> Forearm Planks (Diff: 4)
        └─> Weighted Planks (Diff: 6)
              └─> RKC Planks (Diff: 7)

Side Planks (Diff: 4)
  └─> Copenhagen Planks (Diff: 7)

L-sit Progressions (Diff: 6-9)
  └─> V-sit Progressions (Diff: 9-10)

Ab Wheel from Knees (Diff: 6)
  └─> Ab Wheel from Feet (Diff: 9)
```

---

## Nutrition Module {#nutrition-module}

### TDEE Calculation

```typescript
function calculateTDEE(user: User, profile: UserProfile): number {
  const age = calculateAge(user.dateOfBirth);
  const weight = user.currentWeight; // kg
  const height = user.height; // cm
  const gender = user.gender;

  // Mifflin-St Jeor Equation (most accurate for general population)
  let bmr: number;

  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else if (gender === 'female') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  } else {
    // Use average of both formulas for other genders
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 78;
  }

  // Activity multiplier based on training frequency
  const activityMultipliers = {
    sedentary: 1.2,           // Little to no exercise
    lightly_active: 1.375,    // Exercise 1-3 days/week
    moderately_active: 1.55,  // Exercise 3-5 days/week
    very_active: 1.725,       // Exercise 6-7 days/week
    extra_active: 1.9         // Very intense exercise daily + physical job
  };

  // Map training frequency to activity level
  let activityLevel = profile.activityLevel;
  if (profile.daysPerWeek >= 6) activityLevel = 'very_active';
  else if (profile.daysPerWeek >= 4) activityLevel = 'moderately_active';
  else if (profile.daysPerWeek >= 2) activityLevel = 'lightly_active';

  const tdee = bmr * activityMultipliers[activityLevel];

  return Math.round(tdee);
}
```

### Macro Calculation

```typescript
function calculateMacros(
  user: User,
  profile: UserProfile,
  tdee: number
): NutritionPlan {

  const age = calculateAge(user.dateOfBirth);
  const weight = user.currentWeight;
  const primaryGoal = profile.goals[0].type;

  // Determine caloric target
  let targetCalories: number;
  let deficit: number;

  switch (primaryGoal) {
    case 'fat_loss':
      deficit = -400; // Moderate deficit
      targetCalories = tdee + deficit;
      break;

    case 'muscle_gain':
      deficit = 200; // Slight surplus
      targetCalories = tdee + deficit;
      break;

    case 'body_recomposition':
    case 'strength':
      deficit = -300; // Small deficit (recomp possible for beginners)
      targetCalories = tdee + deficit;
      break;

    default:
      deficit = 0;
      targetCalories = tdee;
  }

  // Protein calculation (higher for older adults, cutting)
  let proteinGramsPerKg: number;

  if (primaryGoal === 'fat_loss' || deficit < 0) {
    // Higher protein during deficit to preserve muscle
    proteinGramsPerKg = age >= 40 ? 2.0 : 1.8;
  } else if (primaryGoal === 'muscle_gain') {
    proteinGramsPerKg = age >= 40 ? 1.8 : 1.6;
  } else {
    proteinGramsPerKg = age >= 40 ? 1.8 : 1.6;
  }

  const proteinGrams = Math.round(weight * proteinGramsPerKg);
  const proteinCalories = proteinGrams * 4;

  // Fat calculation (minimum for hormonal health)
  const fatGramsPerKg = 0.8; // Conservative minimum
  const fatGrams = Math.round(weight * fatGramsPerKg);
  const fatCalories = fatGrams * 9;

  // Carbs: remaining calories
  const remainingCalories = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.round(remainingCalories / 4);

  return {
    tdee,
    targetCalories,
    deficit,
    macros: {
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams
    },
    mealsPerDay: 3,
    proteinPerMeal: Math.round(proteinGrams / 3),
    preSleepProtein: "30-40g casein or cottage cheese",
    preWorkoutCarbs: "30-50g fast-acting carbs (banana, rice)",
    postWorkoutProtein: "30-40g whey or lean protein",
    supplements: [
      {
        name: "Creatine Monohydrate",
        dosage: "5g",
        timing: "Daily, any time",
        tier: 1
      },
      {
        name: "Vitamin D",
        dosage: "2000 IU",
        timing: "With a meal containing fat",
        tier: 1
      },
      {
        name: "Omega-3 (EPA/DHA)",
        dosage: "2-3g",
        timing: "With meals",
        tier: 2
      }
    ],
    dailyWaterIntake: Math.round(weight * 0.035) // 35ml per kg bodyweight
  };
}
```

---

## Progress Tracking System {#progress-tracking}

### Analytics Engine

**Calculate key performance indicators:**

```typescript
async function generateProgressAnalytics(userId: string): Promise<Analytics> {

  // Fetch data
  const logs = await getWorkoutLogs(userId, { last: 90 }); // Last 90 days
  const metrics = await getProgressMetrics(userId);
  const user = await getUser(userId);

  // Training metrics
  const totalWorkouts = logs.length;
  const adherenceRate = calculateAdherence(logs); // % of scheduled workouts completed
  const currentStreak = calculateStreak(logs);
  const longestStreak = calculateLongestStreak(logs);

  // Volume analysis
  const volumeByWeek = calculateWeeklyVolume(logs);
  const volumeTrend = calculateTrend(volumeByWeek); // increasing, stable, decreasing

  // Strength progression
  const strengthMetrics = {};
  const keyExercises = ['push-ups', 'pull-ups', 'squats', 'rows'];

  for (const exercise of keyExercises) {
    const repMaxes = getRepMaxHistory(logs, exercise);
    strengthMetrics[exercise] = {
      currentMax: repMaxes[repMaxes.length - 1],
      startingMax: repMaxes[0],
      improvement: calculatePercentageChange(repMaxes[0], repMaxes[repMaxes.length - 1]),
      trend: calculateTrend(repMaxes)
    };
  }

  // Body composition
  const weightData = metrics.filter(m => m.metricType === 'weight')
                            .map(m => ({ date: m.recordedAt, value: m.data.weight }));
  const waistData = metrics.filter(m => m.metricType === 'waist_circumference')
                           .map(m => ({ date: m.recordedAt, value: m.data.waistCircumference }));

  const weightChange = weightData.length > 1 ?
    weightData[weightData.length - 1].value - weightData[0].value : 0;
  const waistChange = waistData.length > 1 ?
    waistData[waistData.length - 1].value - waistData[0].value : 0;

  // Wellness trends
  const wellnessScores = metrics.filter(m => m.metricType === 'wellness');
  const avgSleepQuality = average(wellnessScores.map(w => w.data.sleepQuality));
  const avgEnergyLevel = average(wellnessScores.map(w => w.data.energyLevel));

  return {
    training: {
      totalWorkouts,
      adherenceRate,
      currentStreak,
      longestStreak,
      volumeByWeek,
      volumeTrend
    },
    strength: strengthMetrics,
    bodyComposition: {
      weightChange,
      waistChange,
      weightData,
      waistData
    },
    wellness: {
      avgSleepQuality,
      avgEnergyLevel
    },
    insights: generateInsights({
      adherenceRate,
      strengthMetrics,
      weightChange,
      waistChange,
      avgEnergyLevel
    })
  };
}
```

### AI-Powered Insights

```typescript
async function generateInsights(data: AnalyticsData): Promise<string[]> {

  const insights = [];

  // Adherence insights
  if (data.adherenceRate >= 90) {
    insights.push("Excellent consistency! You're hitting 90%+ of your workouts.");
  } else if (data.adherenceRate < 70) {
    insights.push("Your adherence has dropped below 70%. Consider reducing training frequency or session duration to improve consistency.");
  }

  // Strength insights
  for (const [exercise, metrics] of Object.entries(data.strengthMetrics)) {
    if (metrics.improvement > 50) {
      insights.push(`Outstanding ${exercise} progress! You've improved by ${metrics.improvement}%.`);
    } else if (metrics.improvement < 10 && metrics.trend === 'plateaued') {
      insights.push(`Your ${exercise} has plateaued. Consider progressing to a harder variation or adjusting volume.`);
    }
  }

  // Body composition insights
  if (data.weightChange < -5 && data.waistChange < -5) {
    insights.push("Great body recomposition! You're losing fat while maintaining/building muscle.");
  } else if (data.weightChange < -2 && data.strengthMetrics.overall.trend === 'declining') {
    insights.push("Warning: You're losing weight but also losing strength. Consider increasing calories or protein.");
  }

  // Energy/recovery insights
  if (data.avgEnergyLevel < 5) {
    insights.push("Low energy levels detected. Prioritize sleep (7-9 hours) and consider an extra rest day.");
  }

  // AI enhancement for nuanced insights
  const aiPrompt = `
    Based on this user's training data, provide 1-2 additional actionable insights:
    - Adherence: ${data.adherenceRate}%
    - Strength trend: ${data.strengthMetrics.overall.trend}
    - Weight change: ${data.weightChange}kg
    - Average energy: ${data.avgEnergyLevel}/10

    Keep insights specific, actionable, and encouraging.
  `;

  const aiInsight = await callLLM(aiPrompt);
  insights.push(aiInsight);

  return insights;
}
```

---

## UI/UX Design Principles {#design-principles}

### Core Design Philosophy

**Clarity Over Complexity**
- Minimize cognitive load during workouts (large touch targets, clear CTAs)
- Progressive disclosure (show essential info, hide advanced details until needed)
- Consistent information hierarchy

**Accessibility First**
- WCAG 2.1 AA compliance minimum
- Keyboard navigation support
- Screen reader optimization
- High contrast mode
- Adjustable text sizes

**Mobile-First Responsive Design**
- Breakpoints: Mobile (< 640px), Tablet (640-1024px), Desktop (> 1024px)
- Touch-friendly interfaces (min 44px touch targets)
- Thumb-zone optimization for primary actions

### Key User Flows

**Workout Logging Flow (Critical Path):**
```
Dashboard
  → Tap "Start Today's Workout"
    → Warm-up timer/checklist
      → Exercise 1
        → Watch video (optional)
        → Log Set 1 (tap reps completed)
        → Rest timer (automatic)
        → Log Set 2
        → ...
      → Exercise 2
      → ...
    → Cool-down
  → Complete Workout (confetti animation!)
    → Summary (total time, sets, reps)
    → Achievement unlocked (if any)
  → Return to Dashboard
```

**Minimize steps, maximize clarity.**

### Visual Design System

**Color Palette:**
- **Primary:** Strong blue (#2563EB) - Actions, CTAs
- **Secondary:** Deep purple (#7C3AED) - Accents, achievements
- **Success:** Green (#10B981) - Completed workouts, progress
- **Warning:** Orange (#F59E0B) - Deload weeks, caution
- **Error:** Red (#EF4444) - Pain reports, missed workouts
- **Neutral:** Grays (#F3F4F6 to #1F2937) - Backgrounds, text

**Typography:**
- **Headings:** Inter or Poppins (bold, clear)
- **Body:** Inter or System fonts (readability)
- **Monospace:** Roboto Mono for numbers/data

**Components:**
- **Cards:** Rounded corners (8px), subtle shadows
- **Buttons:** Large, high contrast, clear labels
- **Forms:** Clear labels above inputs, validation feedback
- **Progress bars:** Animated, show percentage
- **Charts:** Simple, color-coded, interactive tooltips

---

## MVP Roadmap {#mvp-roadmap}

### Phase 1: Core MVP (3-4 months)

**Goal:** Launch functional product with core workout generation and tracking

**Features:**
- ✅ User authentication (email/password)
- ✅ Onboarding flow (personal details, goals, experience, equipment)
- ✅ Workout plan generation (rule-based algorithm)
- ✅ Exercise library (50-80 essential exercises with videos)
- ✅ Basic progression trees (push, pull, squat, hinge, core)
- ✅ Weekly workout schedule display
- ✅ Workout logging interface
- ✅ Basic progress tracking (workout completion, weight, rep maxes)
- ✅ User profile management
- ✅ Responsive web design

**Tech Stack:**
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Auth: JWT with bcrypt
- Hosting: Vercel (frontend) + Railway (backend + DB)

**Success Metrics:**
- 100 beta users complete onboarding
- 70%+ adherence rate after 4 weeks
- <5% critical bugs
- Average session time: 30-45 minutes

---

### Phase 2: AI Enhancement (1-2 months)

**Goal:** Add AI-powered features for personalization and coaching

**Features:**
- ✅ AI workout plan explanations
- ✅ AI exercise coaching cues (personalized to user limitations)
- ✅ AI chat coach (answer questions about workouts, form, etc.)
- ✅ AI-powered check-ins with recommendations
- ✅ Adaptive programming (auto-adjustments based on performance)

**Tech Stack:**
- AI API: OpenAI GPT-4 or Anthropic Claude
- Rate limiting and cost controls
- Prompt engineering and testing

**Success Metrics:**
- 80%+ users engage with AI coach
- Positive sentiment on AI recommendations
- AI cost < $0.50 per user per month

---

### Phase 3: Nutrition & Advanced Tracking (2 months)

**Goal:** Complete the body recomposition toolset

**Features:**
- ✅ Nutrition calculator (TDEE, macros)
- ✅ Meal planning and suggestions
- ✅ Supplement recommendations
- ✅ Progress photos (upload, comparison, timeline)
- ✅ Advanced analytics dashboard
- ✅ Wellness tracking (sleep, energy, RHR)
- ✅ Achievement/gamification system

**Success Metrics:**
- 60%+ users use nutrition module
- 40%+ users upload progress photos
- Measurable body composition improvements (testimonials)

---

### Phase 4: Community & Monetization (2 months)

**Goal:** Build community and launch paid tier

**Features:**
- ✅ Subscription system (Stripe integration)
  - Free tier: 1 workout plan, limited exercise library
  - Premium tier ($15/month): Full features, AI coach, nutrition, progress tracking
- ✅ Community forums
- ✅ Workout sharing
- ✅ Social features (follow friends, share achievements)
- ✅ Admin dashboard (user analytics, content management)

**Success Metrics:**
- 10% free-to-paid conversion rate
- $10,000 MRR within 3 months of launch
- 500+ active users

---

### Phase 5: Advanced Features (Ongoing)

**Future Enhancements:**
- Mobile apps (React Native)
- Form check video analysis (AI computer vision)
- Wearable integration (Apple Watch, Fitbit)
- Advanced periodization models
- 1-on-1 coaching marketplace
- Challenge modes (30-day challenges, etc.)
- Internationalization (multiple languages)

---

## Technology Stack Recommendations {#tech-stack}

### Frontend

**Core:**
- **React** (v18+) with **TypeScript**
- **Vite** (fast build tool)
- **React Router** v6 (routing)

**State Management:**
- **Zustand** (lightweight, simple) OR **Redux Toolkit** (if complex state)
- **React Query / TanStack Query** (server state management, caching)

**UI & Styling:**
- **Tailwind CSS** (utility-first, rapid development)
- **Headless UI** or **Radix UI** (accessible components)
- **Framer Motion** (animations)

**Charts/Visualization:**
- **Recharts** (simple, declarative)

**Forms:**
- **React Hook Form** (performance, validation)
- **Zod** (TypeScript schema validation)

**Video:**
- **React Player** (supports YouTube, Vimeo, self-hosted)

---

### Backend

**Option A: Node.js (Recommended for MVP)**
- **Node.js** v18+ LTS
- **Express.js** (web framework)
- **TypeScript** (type safety)
- **Prisma** (ORM for PostgreSQL)
- **Zod** (runtime validation)

**Option B: Python (Better for ML/AI future)**
- **Python** 3.11+
- **FastAPI** (modern, fast, auto-docs)
- **SQLAlchemy** (ORM)
- **Pydantic** (data validation)

---

### Database

**Primary:**
- **PostgreSQL** v15+ (robust, JSONB support, complex queries)
- **Prisma** or **SQLAlchemy** as ORM

**Caching:**
- **Redis** (session storage, API response caching)

**File Storage:**
- **AWS S3** or **Cloudinary** (videos, images)

---

### Authentication

- **JWT** tokens (access + refresh token pattern)
- **bcrypt** for password hashing
- **Email verification** (SendGrid or AWS SES)
- **OAuth** (Google, Apple - Phase 2)

---

### AI/ML

- **OpenAI API** (GPT-4 for chat, explanations)
  - OR **Anthropic Claude** (potentially better for structured outputs)
- **LangChain** (optional, for complex AI workflows)
- **Rate limiting** (to control costs)

---

### Infrastructure & Hosting

**Development:**
- **Docker** (containerization)
- **Docker Compose** (local multi-service setup)

**Production:**
- **Frontend:** Vercel or Netlify (auto-deploy from Git)
- **Backend:** Railway, Render, or AWS ECS
- **Database:** Managed PostgreSQL (Supabase, Railway, or AWS RDS)
- **Redis:** Upstash or Railway
- **CDN:** Cloudflare

**CI/CD:**
- **GitHub Actions** (automated testing, deployment)

**Monitoring:**
- **Sentry** (error tracking)
- **LogRocket** or **Fullstory** (session replay)
- **Mixpanel** or **PostHog** (product analytics)

---

### Payment Processing

- **Stripe** (subscription billing, payment processing)
- **Stripe Customer Portal** (self-service subscription management)

---

## Security & Privacy {#security}

### Data Security

**Encryption:**
- **In-transit:** HTTPS/TLS 1.3 for all connections
- **At-rest:** Database encryption (AWS RDS encryption, Railway encryption)
- **Sensitive data:** Additional encryption for progress photos (user-specific keys)

**Authentication:**
- Password strength requirements (min 8 chars, complexity)
- bcrypt hashing (cost factor 12)
- JWT tokens with short expiry (access: 15 min, refresh: 7 days)
- Refresh token rotation
- Rate limiting on login attempts (max 5 per 15 min)

**Authorization:**
- Role-based access control (user, admin)
- Resource ownership validation (users can only access their own data)
- API endpoint protection (all routes require valid JWT except public endpoints)

### Privacy

**GDPR Compliance:**
- Clear privacy policy and terms of service
- Cookie consent banner (if using analytics cookies)
- Data portability (export user data)
- Right to deletion (delete account and all associated data)
- Data retention policies (logs deleted after 90 days, etc.)

**User Data Protection:**
- Progress photos stored with user-specific encryption
- Photos never shared publicly without explicit consent
- Medical information flagged as sensitive (extra protection)
- No selling of user data (ever)
- Minimal third-party tracking

**Data Minimization:**
- Only collect necessary data
- Anonymous analytics where possible
- Optional data fields clearly marked

---

## Future Enhancements {#future-enhancements}

### Short-term (6-12 months)

1. **Mobile Apps (React Native)**
   - Offline workout logging
   - Push notifications for workout reminders
   - Apple Watch / Wear OS integration

2. **Form Check Video Analysis**
   - Upload workout videos
   - AI computer vision analysis (pose estimation)
   - Automated form feedback

3. **Advanced Periodization**
   - Conjugate method
   - Block periodization
   - Custom program builder (advanced users)

4. **Wearable Integration**
   - Sync with Apple Health, Google Fit
   - Heart rate monitoring during workouts
   - Sleep tracking integration

5. **Social Features**
   - Friend system
   - Workout sharing
   - Leaderboards (opt-in)
   - Group challenges

### Long-term (1-2 years)

1. **1-on-1 Coaching Marketplace**
   - Connect users with certified coaches
   - Video consultations
   - Custom programming by coaches
   - Revenue share model

2. **Equipment-Based Programs**
   - Gym-based calisthenics (adding weights)
   - Hybrid programs (calisthenics + weights)
   - Specialized equipment (rings, parallettes)

3. **Rehabilitation Programs**
   - Post-injury return-to-training
   - Physical therapy integration
   - Medical professional partnerships

4. **Advanced Skill Training**
   - Handstand mastery program
   - Front lever progression
   - Planche training
   - Muscle-up mastery

5. **Corporate Wellness Partnerships**
   - Team accounts for companies
   - Corporate challenges
   - Health metrics for HR (anonymized)

6. **Internationalization**
   - Multi-language support (Spanish, French, German, etc.)
   - Localized content (exercise names, nutrition)
   - Regional exercise preferences

---

## Appendix: Research Foundation

This app design is grounded in the research compiled in the `calisthenics_complete_research.md` document, including:

- **Periodization models** from sports science literature
- **Volume recommendations** from meta-analyses on hypertrophy and strength
- **Progression protocols** based on exercise science research
- **Nutrition guidelines** from ISSN and sports nutrition research
- **Safety protocols** for cervical spine and injury management
- **Recovery science** (sleep, deload weeks, auto-regulation)

All workout generation algorithms and recommendations should align with evidence-based practices to ensure user safety and effectiveness.

---

## Next Steps

1. **Validate assumptions** with user interviews (5-10 target users)
2. **Create wireframes/mockups** for key flows (onboarding, workout logging, dashboard)
3. **Set up development environment** (repo, database, hosting accounts)
4. **Build MVP** following Phase 1 roadmap
5. **Recruit beta testers** (50-100 users)
6. **Iterate based on feedback**
7. **Launch publicly**

---

**Document Version:** 1.0
**Last Updated:** 2025-12-20
**Author:** Product Design Team
