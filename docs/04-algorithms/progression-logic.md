# Progression Logic

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Workout Generation](./workout-generation.md)
- [Exercise Selection](./exercise-selection.md)
- [Primary Progressions](../03-exercise-library/progressions-primary.md)

---

## Table of Contents

1. [Progression Triggers](#progression-triggers)
2. [Progression Methods](#progression-methods)
3. [Regression Logic](#regression-logic)
4. [Performance Tracking](#performance-tracking)
5. [Adaptive Adjustments](#adaptive-adjustments)

---

## Progression Triggers {#progression-triggers}

The algorithm monitors user performance and automatically recommends progressions when specific criteria are met.

### Primary Trigger: Repetition Target Achievement

**Rule:** Progress to next difficulty level when user achieves **3 consecutive sessions** hitting the upper rep range target.

**Example:**
- Exercise: Standard Push-ups (Difficulty 5)
- Target: 3 sets of 10-12 reps
- User performance over last 3 sessions:
  - Session 1: 12, 12, 10 reps (target met)
  - Session 2: 12, 12, 12 reps (target met)
  - Session 3: 12, 12, 11 reps (target met)
- **Trigger:** Recommend progression to Close-grip Push-ups (Difficulty 6)

### Secondary Trigger: Subjective Feedback

**Rule:** If user rates exercise as "Too Easy" for 2+ consecutive sessions, recommend progression.

### Tertiary Trigger: Time-Based

**Rule:** If user performs same exercise at same difficulty for 6+ weeks without progression trigger, system prompts user to attempt next level (may indicate conservative rep tracking).

---

## Progression Methods {#progression-methods}

### 1. Exercise Variation Progression (Primary Method)

Move to harder exercise variation within same movement pattern.

**Example Path:**
- Wall Push-ups (Diff 1)
- Incline Push-ups (Diff 2-3)
- Knee Push-ups (Diff 4)
- **Standard Push-ups (Diff 5)** ← Current
- Diamond Push-ups (Diff 7) ← Progression

**Implementation:**
```sql
SELECT e.* FROM exercises e
WHERE e.progression_id IN (
  SELECT progression_id FROM exercises
  WHERE id = :current_exercise_id
)
```

### 2. Volume Progression

Increase sets or reps within current exercise.

**Progression:**
- 3x8 → 3x10 → 3x12 → 4x10 → 4x12 → 5x10

**Implementation:**
- Rep progression: Add 1-2 reps per week
- Set progression: Add 1 set when reaching upper rep range (3x12 → 4x10)

### 3. Tempo Progression

Slow down movement phases to increase time under tension.

**Progression:**
- Standard tempo (2-1-1-0): 2 sec down, 1 sec pause, 1 sec up, no pause
- Slow eccentric (3-1-1-0): 3 sec down
- Pause emphasis (3-2-1-0): 3 sec down, 2 sec pause
- Full tempo control (4-2-2-0): Maximum tension

### 4. Range of Motion Progression

Increase depth or range of movement.

**Example (Push-ups):**
- Standard push-ups
- Deficit push-ups (hands on parallettes)
- Deep deficit push-ups (6-8" elevation)

### 5. Leverage Progression

Change body angle to increase difficulty without changing fundamental movement.

**Example (Rows):**
- Doorway rows (feet far back)
- Bent-knee inverted rows
- Straight-leg inverted rows (harder lever arm)
- Feet-elevated inverted rows

---

## Regression Logic {#regression-logic}

The algorithm also monitors for need to regress to easier variations.

### Regression Triggers

**1. Performance Failure:**
- User unable to complete minimum rep target (lower range) for 2+ consecutive sessions
- **Example:** Target 3x8-12, user achieves only 5, 4, 3 reps

**2. Subjective Feedback:**
- User rates exercise as "Too Hard" or reports pain/discomfort
- User marks exercise as "Modified" or "Skipped"

**3. Form Breakdown:**
- If AI form checker (future feature) detects poor form
- If user self-reports inability to maintain proper form

### Regression Action

**Automatic Suggestion:**
```
"It looks like [Exercise Name] might be too challenging right now.
Would you like to switch to [Easier Variation]?

This will help you build strength safely before returning to
[Current Exercise]."
```

**Implementation:**
- Replace current exercise with regression_id from exercise database
- Reset progression tracking for new exercise
- Log regression event for future analysis

---

## Performance Tracking {#performance-tracking}

### Metrics Collected Per Exercise

**Set-Level Data:**
- Reps completed
- Target reps
- RPE (Rate of Perceived Exertion, 1-10)
- Notes (optional)

**Aggregate Data:**
- Total reps (sum across all sets)
- Max reps (best set)
- Average RPE
- Completion rate (% of target reps achieved)

### Trend Analysis

**3-Session Rolling Average:**
- Track max reps over last 3 sessions
- If trending upward → progressing well
- If flat → consider progression method change
- If trending downward → check for overtraining/inadequate recovery

**Example Trend Detection:**

```python
def analyze_progression_trend(exercise_id, user_id):
    recent_sessions = get_last_n_sessions(exercise_id, user_id, n=3)
    max_reps = [session.max_reps for session in recent_sessions]

    if is_increasing(max_reps):
        return "PROGRESSING"
    elif is_flat(max_reps) and max_reps[-1] >= target_upper_range:
        return "READY_FOR_PROGRESSION"
    elif is_decreasing(max_reps):
        return "POSSIBLE_OVERTRAINING"
    else:
        return "NORMAL"
```

---

## Adaptive Adjustments {#adaptive-adjustments}

### Auto-Regulation Based on Performance

**Weekly Volume Adjustment:**
- If user consistently exceeds targets → Increase volume 10%
- If user consistently struggles → Decrease volume 10-20%

**Deload Insertion:**
- If user reports low energy for 2+ consecutive sessions
- If performance decreases across multiple exercises simultaneously
- **Action:** Insert unscheduled deload week (reduce volume 50%, maintain exercises)

### Check-In Based Adjustments

Every 2-4 weeks, users complete brief check-in:

**Questions:**
1. How are you feeling overall? (1-10)
2. Energy level? (1-10)
3. Recovery quality? (1-10)
4. Any new pain or injuries? (Yes/No + details)
5. Are workouts too easy/too hard/just right?
6. Goals still the same?

**AI Analysis:**
- Aggregate check-in + performance data
- Recommend adjustments:
  - Continue current plan
  - Increase volume (if too easy + good recovery)
  - Decrease volume (if too hard OR poor recovery)
  - Modify specific exercises (if pain reported)
  - Insert extra deload week

**Example Recommendation Logic:**

```python
def generate_recommendations(check_in, performance_data):
    if check_in.energy < 6 and check_in.recovery < 6:
        return "INSERT_DELOAD_WEEK"

    if check_in.difficulty_rating == "too_easy" and performance_data.adherence > 90%:
        return "INCREASE_VOLUME_10%"

    if check_in.new_pain:
        return "MODIFY_EXERCISES_FOR_PAIN"

    if check_in.difficulty_rating == "too_hard":
        return "DECREASE_VOLUME_20%"

    return "CONTINUE_CURRENT_PLAN"
```

---

---
**Source:** calisthenics_app_design.md (lines 1585-1714)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Workout Generation](./workout-generation.md)
- [Exercise Selection](./exercise-selection.md)
- [Primary Progressions](../03-exercise-library/progressions-primary.md)
