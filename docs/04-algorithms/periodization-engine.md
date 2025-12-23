# Periodization Engine

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Workout Generation](./workout-generation.md)
- [Programming Principles](../02-science/programming-principles.md)
- [Research Foundation](../02-science/research-foundation.md)

---

## Table of Contents

1. [Periodization Overview](#overview)
2. [Beginner Template](#beginner-template)
3. [Intermediate Template](#intermediate-template)
4. [Advanced Template](#advanced-template)
5. [Deload Week Structure](#deload-weeks)
6. [Phase Transitions](#phase-transitions)

---

## Periodization Overview {#overview}

Periodization is the systematic variation of training variables (volume, intensity, exercise selection) over time to:
- Maximize adaptation
- Prevent overtraining
- Avoid plateaus
- Progress toward goals

The CaliFlow periodization engine uses **linear periodization** for beginners and **undulating periodization** for advanced trainees.

---

## Beginner Template (0-6 months training) {#beginner-template}

### Mesocycle 1: Anatomical Adaptation (Weeks 1-3)

**Focus:** Movement pattern learning, connective tissue strengthening, work capacity building

**Training Parameters:**
- Sets: 2-3 per exercise
- Reps: 12-15 (higher reps, lower intensity)
- Rest: 60-90 seconds
- Exercises: 8-10 total per session
- RPE Target: 6-7 (moderate difficulty)

**Exercise Selection:**
- Simplest variations of each pattern
- Emphasis on form over load
- Full-body sessions

**Weekly Structure (3 days/week):**
- Day 1: Full-body A
- Day 2: Rest
- Day 3: Full-body B
- Day 4: Rest
- Day 5: Full-body A
- Weekend: Rest

**Rationale:** Higher reps with lower complexity builds work capacity, teaches patterns, and prepares joints/tendons for heavier loading.

---

### Deload Week (Week 4)

**Volume Reduction:** 40-50% of week 3
- Sets: 1-2 per exercise (down from 2-3)
- Reps: 8-10 (down from 12-15)
- Same exercises (no regression)
- Same frequency (still 3 days)

**Purpose:** Allow supercompensation, reduce fatigue, prepare for next mesocycle.

---

### Mesocycle 2: Hypertrophy Introduction (Weeks 5-7)

**Focus:** Muscle building, volume increase, progressive overload

**Training Parameters:**
- Sets: 3 per exercise (volume increase)
- Reps: 8-12 (classic hypertrophy range)
- Rest: 90-120 seconds
- Exercises: 6-8 total per session (fewer exercises, more sets each)
- RPE Target: 7-8 (challenging)

**Exercise Selection:**
- Progress 1-2 exercises to harder variations
- Maintain other exercises for continued adaptation
- Introduce tempo variations (3-second eccentric)

**Weekly Structure (3 days/week):**
- Full-body with more volume per exercise

**Rationale:** Rep range and volume optimal for muscle protein synthesis. Intensity increases while recovery capacity improves.

---

### Deload Week (Week 8)

**Volume Reduction:** 50% of week 7

---

### Mesocycle 3: Strength Preparation (Weeks 9-11)

**Focus:** Strength development, harder progressions, skill introduction

**Training Parameters:**
- Sets: 3-4 per exercise
- Reps: 6-10 (strength range)
- Rest: 120-180 seconds (longer recovery for neurological adaptation)
- Exercises: 5-7 total per session
- RPE Target: 8-9 (high effort)

**Exercise Selection:**
- Progress to harder variations where appropriate
- Introduce skill work if interest (handstands, L-sits)
- Lower rep ranges require higher technical proficiency

**Weekly Structure:**
- Option to split into Upper/Lower if user prefers (4 days/week)

**Rationale:** Lower reps with harder progressions build maximal strength. Prepares for advanced training methods.

---

### Deload Week (Week 12)

**Final deload before new program or program extension**

---

## Intermediate Template (6-18 months training) {#intermediate-template}

### Characteristics

- **Frequency:** 4 days/week typical
- **Split:** Upper/Lower or Push/Pull/Legs
- **Periodization:** Wave periodization or Daily Undulating Periodization (DUP)
- **Volume:** 12-16 sets per muscle group per week

### DUP Example (4-week block)

**Week 1:**
- Day 1 (Upper): Strength (5-6 reps, 4-5 sets)
- Day 2 (Lower): Hypertrophy (8-12 reps, 3-4 sets)
- Day 3 (Upper): Hypertrophy (8-12 reps, 3-4 sets)
- Day 4 (Lower): Strength (5-6 reps, 4-5 sets)

**Week 2:**
- Reverse order or introduce power day (3-5 reps explosive)

**Week 3:**
- Peak intensity week (highest loads)

**Week 4:**
- Deload

**Advantage:** Varies stimulus within each week, prevents adaptation staleness.

---

## Advanced Template (18+ months training) {#advanced-template}

### Characteristics

- **Frequency:** 4-6 days/week
- **Split:** Push/Pull/Legs or customized
- **Periodization:** Block periodization or conjugate method
- **Volume:** 16-20+ sets per muscle group per week
- **Skill Work:** Daily practice (handstands, levers, planches)

### Block Periodization Example

**Block 1 (4 weeks): Accumulation**
- High volume, moderate intensity
- Sets: 4-5 per exercise
- Reps: 10-15
- Goal: Build work capacity and muscle mass

**Block 2 (3 weeks): Intensification**
- Moderate volume, high intensity
- Sets: 3-4 per exercise
- Reps: 5-8
- Goal: Convert hypertrophy to strength

**Block 3 (2 weeks): Realization**
- Low volume, maximum intensity
- Sets: 2-3 per exercise
- Reps: 1-5 (or max effort attempts)
- Goal: Peak performance, test PRs

**Deload (1 week)**

---

## Deload Week Structure {#deload-weeks}

### Purpose of Deloads

- **Fatigue dissipation:** Allow accumulated fatigue to clear
- **Supercompensation:** Enable body to adapt to training stress
- **Injury prevention:** Reduce wear and tear on joints/tendons
- **Mental break:** Maintain motivation and avoid burnout

### Deload Implementation

**Volume Reduction:**
- Sets: Reduce by 50% (3 sets → 1-2 sets)
- Reps: Reduce by 20-30% (12 reps → 8-10 reps)

**Intensity Maintenance:**
- Keep same exercise difficulty (don't regress to easier variations)
- Same exercises as previous week

**Frequency Maintenance:**
- Same number of training days (e.g., still 3 days/week)

**Example:**
- **Normal Week 3:** 3x12 Standard Push-ups
- **Deload Week 4:** 2x8 Standard Push-ups

### Unscheduled Deloads

Insert if:
- User reports persistent fatigue
- Performance decreases across multiple exercises
- User reports poor sleep or high life stress
- User requests break

**Action:** Immediately reduce volume for 3-5 days, then resume.

---

## Phase Transitions {#phase-transitions}

### Mesocycle Transitions

**Smooth progression between phases:**

Anatomical Adaptation → Hypertrophy:
- Gradually reduce reps from 15 → 12 → 10 → 8 over 1-2 weeks
- Increase sets from 2 → 3
- Progress 1-2 exercises to harder variations

Hypertrophy → Strength:
- Gradually reduce reps from 12 → 10 → 8 → 6 over 1-2 weeks
- Increase rest periods from 90s → 120s → 180s
- Progress several exercises to harder variations

### Program Completion

After 12 weeks:

**Option 1: New Program**
- Re-assess user's current levels
- Generate new 12-week program with updated difficulty

**Option 2: Program Extension**
- Continue with Mesocycle 3 parameters
- Progress exercises as performance improves
- Insert deloads every 3-4 weeks

**Option 3: Goal-Specific Program**
- If user achieved goal (e.g., first pull-up), switch to maintenance or new goal

---

---
**Source:** calisthenics_app_design.md (lines 1316-1381)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Workout Generation](./workout-generation.md)
- [Programming Principles](../02-science/programming-principles.md)
- [Research Foundation](../02-science/research-foundation.md)
