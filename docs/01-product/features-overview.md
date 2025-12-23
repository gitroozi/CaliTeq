# Features Overview

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Vision & Personas](./vision-personas.md)
- [Roadmap](./roadmap.md)
- [User Journeys](../08-ux/user-journeys.md)

---

## Table of Contents

1. [Intelligent Onboarding & Assessment](#intelligent-onboarding-assessment)
2. [Personalized Workout Plan Generation](#personalized-workout-plan-generation)
3. [Exercise Library & Video Database](#exercise-library-video-database)
4. [Nutrition Guidance Module](#nutrition-guidance-module)
5. [Progress Tracking & Analytics](#progress-tracking-analytics)
6. [Adaptive Programming & AI Coaching](#adaptive-programming-ai-coaching)
7. [User Dashboard & Interface](#user-dashboard-interface)

---

## Intelligent Onboarding & Assessment {#intelligent-onboarding-assessment}

**Purpose:** Gather comprehensive user data to generate optimal workout plans

### Input Collection

**Personal Details**
- Age, gender, height, current weight, target weight
- Activity level (sedentary to very active)
- Training experience (never trained, beginner, intermediate, advanced)
- Training availability (days per week, session duration)

**Goals Assessment** (multi-select with priority ranking)
- Fat loss / Body recomposition
- Muscle gain / Strength building
- Skill mastery (specific calisthenics movements)
- General fitness / Health improvement
- Athletic performance

**Medical & Injury Screening**
- Current injuries or chronic conditions
- Movement limitations or pain
- Previous surgeries or significant medical history
- Clearance for exercise (if needed)
- Specific body regions to avoid or protect (neck, shoulders, knees, back)

**Equipment Availability**
- Pull-up bar (yes/no)
- Dip bars or parallel bars
- Resistance bands
- Elevated surfaces (bench, box, chairs)
- Other equipment

**Movement Assessment** (optional video upload or self-assessment)
- Push-up capability (wall, incline, knee, standard)
- Pull-up capability (rows, assisted, negative, full)
- Squat depth and form
- Core strength (plank hold time)

### Output

- User profile with training classification
- Recommended starting point for each movement pattern
- Flagged contraindications or exercise modifications needed

---

## Personalized Workout Plan Generation {#personalized-workout-plan-generation}

**Algorithm Type:** Hybrid rule-based + AI enhancement

### Rule-Based Foundation

**Periodization structure** based on experience level
- Beginners: Anatomical adaptation → Hypertrophy intro → Strength prep (3-4 week mesocycles)
- Intermediate: Strength development with undulating periodization
- Advanced: Skill-focused with DUP (Daily Undulating Periodization)

**Exercise selection** based on:
- Current progression level per movement pattern
- Equipment availability
- Injury/limitation flags
- Recovery capacity (age-adjusted)

**Volume prescription:**
- Sets per muscle group per week (beginner: 8-10, intermediate: 12-16, advanced: 16-20+)
- Rep ranges based on phase (strength: 5-8, hypertrophy: 8-12, endurance: 12-20)
- Rest periods appropriate to intensity

**Deload scheduling:** Automatic every 3-4 weeks

### AI Enhancement Layer

- **Personalized coaching cues** based on user profile and limitations
- **Exercise substitutions** with natural language explanations
- **Form tips** specific to user's injury/limitation profile
- **Motivation and context** for why specific exercises are programmed
- **Adaptive modifications** based on user feedback and progress

### Plan Output

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

## Exercise Library & Video Database {#exercise-library-video-database}

**Structure:** Organized by movement pattern and progression level

### Primary Movement Patterns (Fundamental Strength)

1. **Horizontal Push** (Push-ups, dips)
2. **Vertical Push** (Pike push-ups, handstand progressions)
3. **Horizontal Pull** (Rows, front lever work)
4. **Vertical Pull** (Pull-ups, chin-ups)
5. **Squat** (Bilateral and unilateral)
6. **Hinge** (Bridges, Nordic curls, single-leg RDL)
7. **Core Stability** (Planks, hollow body, dead bugs)

### Secondary Movement Patterns (Comprehensive Training)

8. **Anti-Rotation** (Pallof press variations, side planks, Copenhagen planks)
9. **Rotation** (Russian twists, windshield wipers, dragon flags)
10. **Vertical Press-Pull** (Muscle-ups, combination movements)
11. **Locomotion** (Bear crawls, crab walks, quadrupedal movement)
12. **Jumping/Plyometrics** (Jump squats, box jumps, burpees, explosive push-ups)
13. **Carry/Hold** (Farmer walks, suitcase carries - with external load)
14. **Ballistic** (Clap push-ups, kipping movements, explosive variations)

### Skill-Based Movement Patterns (Advanced)

15. **Static Holds** (L-sits, V-sits, planche progressions, front/back lever)
16. **Handstand/Inversion** (Handstand holds, handstand push-ups, wall runs)
17. **Dynamic Skills** (Muscle-ups, 360 pulls, swing progressions)
18. **Flow/Combination** (Linking movements, freestyle calisthenics)

### Auxiliary Patterns (Support & Mobility)

19. **Mobility & Flexibility** (Dynamic stretching, active flexibility, splits progressions)
20. **Stability & Balance** (Single-leg holds, instability training)
21. **Grip Strength** (Dead hangs, towel hangs, finger training)
22. **Wrist/Forearm** (Wrist conditioning, forearm strengthening)

### Each Exercise Entry Includes

**Video demonstration** (multiple angles)
- Proper form execution
- Common mistakes to avoid
- Side-by-side comparison (correct vs incorrect)

**Written description**
- Setup and positioning
- Movement execution (eccentric, pause, concentric)
- Breathing cues
- Target muscles

**Progression pathway**
- Easier regression (how to scale down)
- Current exercise
- Harder progression (next step up)

**Modification options**
- For specific injuries (e.g., cervical-safe modifications)
- Equipment alternatives

**Coaching cues**
- Key points of performance
- What to feel and focus on
- Safety reminders

**Difficulty rating** (1-10 scale)

**Equipment required**

**Contraindications** (when to avoid this exercise)

### Library Features

- Search and filter (by pattern, difficulty, equipment, body region)
- Favorites/bookmarks
- Personal notes on each exercise
- User ratings and feedback

---

## Nutrition Guidance Module {#nutrition-guidance-module}

**Purpose:** Provide evidence-based nutrition plans aligned with training goals

### Calorie & Macro Calculator

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

### Sample Meal Plans

- Generate daily meal plans matching macro targets
- Options for dietary preferences (omnivore, vegetarian, vegan, low-carb, etc.)
- Substitution suggestions for foods user dislikes
- Shopping list generation
- Recipe database with nutritional information

### Supplement Guidance

- Evidence-based recommendations (Tier 1, 2, 3)
- Tier 1: Creatine, Protein powder, Vitamin D
- Tier 2: Omega-3, Caffeine
- Tier 3: Avoid (minimal evidence)
- Dosing protocols and timing

### Hydration Tracking

- Daily water intake targets (3-4L baseline + training adjustments)
- Reminder system

### Integration with Workout Plan

- Nutrition targets adjust based on training phase
- Higher carbs on training days (optional carb cycling)
- Deload week nutrition adjustments

---

## Progress Tracking & Analytics {#progress-tracking-analytics}

### Workout Logging

**Quick log interface** for each workout session
- Mark exercises as completed
- Log actual sets × reps performed
- Rate difficulty (RPE 1-10 scale)
- Note any issues or modifications made
- Session duration
- Energy level and overall feel

**Missed workout handling**
- Options: Reschedule, skip, mark as rest day
- Impact on weekly volume tracking

### Progress Metrics

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

### Analytics Dashboard

**Training overview**
- Weekly volume by muscle group
- Adherence rate (workouts completed vs scheduled)
- Consistency streaks

**Strength progression charts**
- Rep maxes over time per exercise
- Volume load trends

**Body composition trends**
- Weight trajectory with target overlay
- Waist circumference trend
- Photo timeline

**Recovery metrics**
- Optional: Morning resting heart rate tracking
- Subjective wellness score (sleep, energy, soreness, mood)
- Recovery status indicator (green/yellow/red)

### Achievements & Gamification

- Milestone badges (first pull-up, 100 workouts, 6-month streak)
- Strength level classifications (novice → intermediate → advanced → elite)
- Social sharing options for achievements

---

## Adaptive Programming & AI Coaching {#adaptive-programming-ai-coaching}

### Auto-Regulation Features

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

### AI Coaching Chat

- Natural language interface for questions
- "Why am I doing pike push-ups instead of handstand push-ups?"
- "My shoulder hurts during rows, what should I do?"
- "Can I add more arm work?"
- AI provides contextual answers based on user's specific program and profile

### Form Feedback (Future Enhancement)

- Video upload for form checks
- AI analysis of movement patterns
- Coaching cues for improvement
- Safety warnings for dangerous form

---

## User Dashboard & Interface {#user-dashboard-interface}

### Dashboard Components

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

### Navigation

- Today's Workout
- My Program (view full 12-week plan)
- Exercise Library
- Nutrition
- Progress
- Profile & Settings

---

---
**Source:** calisthenics_app_design.md (lines 86-465)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Vision & Personas](./vision-personas.md)
- [Roadmap](./roadmap.md)
- [User Journeys](../08-ux/user-journeys.md)
