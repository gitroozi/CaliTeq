# Exercise Selection Algorithm

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Workout Generation](./workout-generation.md)
- [Progression Logic](./progression-logic.md)
- [Exercise Database](../03-exercise-library/exercise-database.md)

---

## Table of Contents

1. [Selection Criteria](#selection-criteria)
2. [Filtering Process](#filtering-process)
3. [Movement Pattern Coverage](#movement-pattern-coverage)
4. [Difficulty Matching](#difficulty-matching)
5. [Equipment Constraints](#equipment-constraints)
6. [Contraindication Filtering](#contraindication-filtering)
7. [Variation & Engagement](#variation)

---

## Selection Criteria {#selection-criteria}

Exercise selection balances multiple competing priorities:

1. **Movement Pattern Coverage:** All primary patterns included
2. **Difficulty Appropriateness:** Matches user's current ability
3. **Equipment Availability:** Only uses available equipment
4. **Safety:** Avoids contraindicated exercises
5. **Progression:** Builds toward user goals
6. **Variety:** Rotates exercises to prevent boredom
7. **Preference:** Incorporates user favorites

---

## Filtering Process {#filtering-process}

### Step 1: Initial Pool Creation

```sql
SELECT * FROM exercises
WHERE movement_pattern_id = :pattern_id
  AND is_published = TRUE
```

### Step 2: Difficulty Filtering

```sql
WHERE difficulty <= :user_level_for_pattern
  AND difficulty >= :user_level_for_pattern - 2
```

**Logic:** Include exercises at or below user's level, but not more than 2 levels below (to maintain challenge)

### Step 3: Equipment Filtering

```sql
WHERE NOT EXISTS (
  SELECT 1 FROM unnest(equipment_required) AS eq
  WHERE eq NOT IN (:user_available_equipment)
)
```

### Step 4: Contraindication Filtering

```sql
WHERE NOT EXISTS (
  SELECT 1 FROM unnest(contraindications) AS contra
  WHERE contra IN (:user_injuries)
)
```

### Step 5: Preference Weighting

```sql
ORDER BY
  CASE WHEN id IN (:user_favorites) THEN 1 ELSE 2 END,
  CASE WHEN id IN (:recently_performed) THEN 2 ELSE 1 END,
  difficulty DESC,
  RANDOM()
LIMIT 1
```

**Priority Order:**
1. User favorites (if not done recently)
2. Highest appropriate difficulty
3. Random selection (within constraints)

---

## Movement Pattern Coverage {#movement-pattern-coverage}

### Minimum Pattern Requirements

**Full-Body Session (3x/week):**
- 1 Horizontal Push exercise
- 1 Horizontal Pull exercise
- 1 Squat or Lunge exercise
- 1 Hinge exercise
- 1-2 Core exercises
- Optional: Vertical Push OR Vertical Pull

**Upper/Lower Split:**

Upper Day:
- 1-2 Horizontal Push
- 1-2 Horizontal Pull
- 1 Vertical Push OR Vertical Pull
- 1 Core exercise

Lower Day:
- 1-2 Squat variations
- 1-2 Hinge variations
- 1-2 Core exercises

---

## Difficulty Matching {#difficulty-matching}

User's current level per pattern is determined by:

1. **Initial Assessment:** Self-reported or video-assessed
2. **Performance Data:** Last 3 sessions of each exercise
3. **Progression Triggers:** Automatic difficulty increase when:
   - User completes 3 consecutive sessions with 3x12-15 reps
   - User rates exercise as "too easy" (subjective feedback)

### Difficulty Assignment Example

User's horizontal push level: 5 (can do standard push-ups)

**Eligible exercises:**
- Difficulty 3-5: Incline push-ups (low), knee push-ups, standard push-ups
- Primary selection: Difficulty 5 (standard push-ups)
- Regression available: Difficulty 4 (knee push-ups)
- Progression available: Difficulty 6-7 (close-grip, diamond)

---

## Equipment Constraints {#equipment-constraints}

### Equipment Categories

**None Required:**
- Push-ups, squats, lunges, planks, most core work

**Pull-up Bar Required:**
- All vertical pull exercises
- Hanging core work
- Some skill work (front lever, muscle-ups)

**Dip Bars Required:**
- Parallel bar dips
- L-sits on bars
- Some handstand work

**Resistance Bands:**
- Assisted pull-ups/dips
- Pallof press variations
- Mobility work

### Substitution Rules

If user lacks required equipment:

**No pull-up bar:**
- Substitute: Inverted rows (requires table/sturdy surface)
- Progression path: Rows instead of pull-ups initially

**No dip bars:**
- Substitute: Bench dips, push-up variations
- Note: Dips can be delayed until user has access

**No resistance bands:**
- Substitute: Negative repetitions for assistance
- Substitute: Partner-assisted variations

---

## Contraindication Filtering {#contraindication-filtering}

### Automatic Exercise Exclusions

**User reports "cervical disc issues":**

Excluded exercises:
- All headstands and handstand push-ups
- Exercises requiring looking up (overhead work)
- Heavy overhead pressing

Modified exercises:
- Pull-ups: Neutral neck position coaching cue added
- Push-ups: "Look 6-12 inches ahead, not down" cue added

**User reports "shoulder impingement":**

Excluded exercises:
- Wide-grip pull-ups
- Overhead pressing (until cleared)

Modified exercises:
- Use neutral-grip pull-ups (shoulder-friendly)
- Limit range of motion in push-ups if needed

**User reports "knee issues":**

Excluded exercises:
- High-impact plyometrics (box jumps, jump squats)
- Deep squats (until assessed)

Modified exercises:
- Box squats (controlled depth)
- Split squats (less knee stress than bilateral)

---

## Variation & Engagement {#variation}

### Weekly Rotation Strategy

**Weeks 1-3 (Mesocycle 1):**
- Same exercises repeated to learn movement patterns
- Builds familiarity and confidence

**Weeks 4+ (Subsequent mesocycles):**
- Rotate 1-2 exercises every 2-3 weeks
- Maintain at least 50% of exercises from previous week
- Prevents boredom while allowing progressive overload

### User Favorites Integration

Track user ratings:
- After each workout, user can rate exercises (1-5 stars)
- Highly rated exercises (4-5 stars) prioritized in future selections
- Low-rated exercises (1-2 stars) substituted when possible

### Example Selection Logic

```python
def select_exercise(pattern, user_profile, session_history):
    # Get eligible exercises
    eligible = filter_by_pattern(pattern)
    eligible = filter_by_difficulty(eligible, user_profile.level)
    eligible = filter_by_equipment(eligible, user_profile.equipment)
    eligible = filter_by_contraindications(eligible, user_profile.injuries)

    # Apply preference weighting
    favorites = [e for e in eligible if e.id in user_profile.favorites]
    recently_performed = get_recent_exercises(session_history, days=14)
    fresh_exercises = [e for e in eligible if e.id not in recently_performed]

    # Selection priority
    if favorites and fresh_exercises:
        # Prioritize favorites not done recently
        return random.choice([e for e in favorites if e in fresh_exercises])
    elif fresh_exercises:
        # Choose from exercises not done recently
        return random.choice(fresh_exercises)
    else:
        # All exercises done recently, choose highest difficulty
        return max(eligible, key=lambda e: e.difficulty)
```

---

---
**Source:** calisthenics_app_design.md (lines 1383-1437)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Workout Generation](./workout-generation.md)
- [Progression Logic](./progression-logic.md)
- [Exercise Database](../03-exercise-library/exercise-database.md)
