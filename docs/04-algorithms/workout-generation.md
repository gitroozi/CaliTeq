# Workout Generation Algorithm

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Exercise Selection](./exercise-selection.md)
- [Periodization Engine](./periodization-engine.md)
- [Progression Logic](./progression-logic.md)

---

## Table of Contents

1. [Algorithm Overview](#overview)
2. [Input Processing](#input-processing)
3. [12-Week Program Structure](#program-structure)
4. [Periodization Template Selection](#periodization)
5. [Exercise Selection Logic](#exercise-selection)
6. [Session Generation](#session-generation)
7. [AI Enhancement Layer](#ai-enhancement)
8. [Output Format](#output-format)

---

## Algorithm Overview {#overview}

The workout generation algorithm is a **hybrid rule-based + AI enhancement system** that creates personalized 12-week training programs. The algorithm follows these stages:

```
1. Input Processing
   ├─ User profile analysis
   ├─ Goal prioritization
   ├─ Limitation mapping
   └─ Equipment filtering

2. Periodization Template Selection
   ├─ Experience-based template
   ├─ Goal-specific adjustments
   └─ Mesocycle generation (3-4 cycles)

3. Weekly Schedule Creation
   ├─ Frequency determination (2-5 days/week)
   ├─ Split type selection (full-body, upper/lower)
   └─ Session distribution

4. Exercise Selection
   ├─ Movement pattern coverage
   ├─ Difficulty matching
   ├─ Equipment constraints
   └─ Contraindication filtering

5. Volume & Intensity Prescription
   ├─ Sets per muscle group
   ├─ Rep ranges per phase
   ├─ Rest periods
   └─ Deload week insertion

6. AI Enhancement
   ├─ Personalized coaching notes
   ├─ Exercise explanations
   └─ Motivation context

7. Output Generation
   ├─ 36-60 workout sessions
   ├─ 200-400 exercise instances
   └─ Complete 12-week program
```

---

## Input Processing {#input-processing}

### User Profile Data

**Required Inputs:**
- Age (affects recovery, volume tolerance)
- Training experience (never, beginner, intermediate, advanced)
- Activity level (sedentary to very active)
- Goals (fat loss, muscle gain, strength, skill, general fitness)
- Availability (days per week, minutes per session)
- Equipment (pull-up bar, dip bars, bands, elevated surfaces)
- Injuries/limitations (cervical, shoulder, knee, back issues)
- Movement assessment scores (push, pull, squat, hinge, core levels 1-10)

### Derived Metrics

**Training Age Classification:**
- Absolute Beginner: 0 months training
- Beginner: 0-6 months consistent training
- Intermediate: 6-18 months consistent training
- Advanced: 18+ months consistent training

**Recovery Capacity:**
- Age <30: High recovery (4-5 sessions/week tolerable)
- Age 30-45: Moderate recovery (3-4 sessions/week optimal)
- Age 45+: Lower recovery (3 sessions/week recommended)

**Volume Tolerance:**
- Sedentary baseline: Start 40% below standard volume
- Lightly active: Start 20% below standard volume
- Moderately active: Standard volume
- Very active: Can handle 10-20% above standard volume

---

## 12-Week Program Structure {#program-structure}

### Mesocycle Framework

Programs divide into 3-4 mesocycles (training phases) of 3-4 weeks each:

**Beginner Template (First-time trainees):**
1. **Mesocycle 1 (Weeks 1-3): Anatomical Adaptation**
   - Focus: Movement pattern learning, work capacity
   - Sets: 2-3 per exercise
   - Reps: 12-15
   - Rest: 60-90 seconds

2. **Mesocycle 2 (Weeks 5-7): Hypertrophy Introduction**
   - Focus: Muscle building, volume increase
   - Sets: 3 per exercise
   - Reps: 8-12
   - Rest: 90-120 seconds

3. **Mesocycle 3 (Weeks 9-11): Strength Preparation**
   - Focus: Strength development, harder progressions
   - Sets: 3-4 per exercise
   - Reps: 6-10
   - Rest: 120-180 seconds

**Deload Weeks:** Weeks 4, 8, 12 (reduce volume 40-50%, maintain intensity)

### Weekly Frequency Determination

**Formula:**
```
Base Frequency = User's "Days Per Week" input

Adjustments:
- If sedentary baseline AND age >40: Max 3 days/week
- If "Minutes Per Session" <30: Increase frequency +1 day
- If "Minutes Per Session" >60: Decrease frequency -1 day
- Minimum: 2 days/week
- Maximum: 5 days/week (6-7 reserved for advanced athletes)
```

### Split Type Selection

**Decision Tree:**
```
IF frequency == 2-3 AND experience == beginner:
   → Full-body split (all patterns each session)

ELSE IF frequency == 3 AND experience >= intermediate:
   → Full-body OR Upper/Lower split (user preference)

ELSE IF frequency == 4:
   → Upper/Lower split (2 upper days, 2 lower days)

ELSE IF frequency == 5:
   → Upper/Lower/Full OR Push/Pull/Legs split

ELSE IF frequency == 6+:
   → Push/Pull/Legs OR Custom split
```

---

## Periodization Template Selection {#periodization}

See [Periodization Engine](./periodization-engine.md) for detailed phase-by-phase parameters.

---

## Exercise Selection Logic {#exercise-selection}

See [Exercise Selection](./exercise-selection.md) for detailed selection algorithms.

---

## Session Generation {#session-generation}

### Session Template Structure

Each workout session follows this structure:

**1. Warm-up (5-10 minutes)**
- Dynamic stretching
- Joint mobility
- Movement preparation (light versions of workout exercises)
- Optional: Locomotion drills (bear crawls, etc.)

**2. Main Work (20-30 minutes)**
- Primary exercises (4-6 exercises)
- Sets × Reps as prescribed
- Rest periods as specified
- Exercise order: Large muscle groups → Small muscle groups

**3. Core/Accessory Work (5-10 minutes)**
- Core stability exercises
- Auxiliary patterns (grip, wrist, mobility)
- Skill practice (if applicable)

**4. Cool-down (5 minutes)**
- Static stretching
- Breathing exercises
- Session reflection

### Exercise Ordering Within Session

**Priority Order:**
1. Skill work (if present) - requires fresh nervous system
2. Compound pulling movements (pull-ups, rows)
3. Compound pushing movements (push-ups, dips)
4. Lower body compound (squats, hinges)
5. Core stability
6. Isolation/Accessory work

**Reasoning:**
- Most demanding exercises first (when energy is highest)
- Pulling before pushing (prevents shoulder issues)
- Core work later (pre-fatiguing core compromises compound lifts)

---

## AI Enhancement Layer {#ai-enhancement}

After rule-based generation, the program is enhanced with AI-generated content:

### AI Prompt Template

```
You are an expert calisthenics coach. Generate personalized coaching content for this user:

Profile:
- Age: {age}
- Experience: {experience}
- Goals: {goals}
- Limitations: {injuries}
- Current Program Phase: {mesocycle_name}

Task 1: Write a 2-3 sentence explanation for why this program structure was chosen.

Task 2: For each exercise in today's workout, provide:
- 1 personalized coaching cue specific to this user's limitations
- 1 modification if needed for their injuries

Task 3: Write a motivational note for the user based on their goals and current progress.

Keep tone supportive, scientific, and encouraging.
```

### AI Output Integration

AI-generated content is stored in:
- `workout_plans.ai_explanation` - Program overview
- `workout_session_exercises.coaching_notes` - Exercise-specific notes
- `check_ins.ai_analysis` - Periodic assessments

---

## Output Format {#output-format}

### Database Structure

**Generated Tables:**
1. `workout_plans` (1 record)
   - User ID
   - 12-week structure
   - Mesocycle definitions (JSONB)
   - Deload weeks
   - AI explanation

2. `workout_sessions` (36-60 records)
   - Session date
   - Week number
   - Day of week
   - Session name (e.g., "Week 1 - Full Body A")
   - Warm-up (JSONB)
   - Cool-down (JSONB)
   - Is deload (boolean)

3. `workout_session_exercises` (200-400 records)
   - Session ID
   - Exercise ID
   - Exercise order (1, 2, 3, etc.)
   - Sets
   - Reps (string: "8-12" or "AMRAP")
   - Rest seconds
   - Tempo (optional)
   - Coaching notes (AI-generated)

### User-Facing Output

**Dashboard View:**
- Today's workout (if scheduled)
- This week's schedule
- Current phase information
- Progress so far (if mid-program)

**Program View:**
- 12-week calendar
- Weekly breakdown
- Exercise library links
- Printable PDF option

---

---
---
**Source:** calisthenics_app_design.md (lines 1264-1582)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Exercise Selection](./exercise-selection.md)
- [Periodization Engine](./periodization-engine.md)
- [Progression Logic](./progression-logic.md)
