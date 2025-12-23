# Exercise Database

**Part of the CaliFlow App Documentation**

**Related Documentation:**
- [Movement Patterns](./movement-patterns.md)
- [Primary Progressions](./progressions-primary.md)
- [Workout Generation](../04-algorithms/workout-generation.md)

---

## Table of Contents

1. [Database Structure](#database-structure)
2. [Exercise Data Model](#exercise-data-model)
3. [Exercise Attributes](#exercise-attributes)
4. [Video Content Requirements](#video-content)
5. [Progression Relationships](#progression-relationships)
6. [Exercise Selection Criteria](#selection-criteria)

---

## Database Structure {#database-structure}

The exercise database contains 150+ exercises organized across 22 movement patterns, with each exercise categorized by difficulty (1-10) and containing comprehensive instructional content.

### Organization Hierarchy

```
Movement Pattern (22 total)
  ├─ Difficulty Level 1-3 (Beginner)
  │   └─ Exercises (5-10 per pattern)
  ├─ Difficulty Level 4-6 (Intermediate)
  │   └─ Exercises (3-6 per pattern)
  ├─ Difficulty Level 7-8 (Advanced)
  │   └─ Exercises (2-4 per pattern)
  └─ Difficulty Level 9-10 (Expert)
      └─ Exercises (1-3 per pattern)
```

---

## Exercise Data Model {#exercise-data-model}

### Core Fields

**Identification:**
- `id` (UUID): Unique identifier
- `name` (string): Exercise name (e.g., "Standard Push-ups")
- `slug` (string): URL-friendly identifier (e.g., "standard-push-ups")

**Classification:**
- `movement_pattern_id` (UUID): Links to movement pattern
- `difficulty` (integer 1-10): Complexity and strength requirement
- `category` (string): Primary, Secondary, Skill-Based, Auxiliary

**Content:**
- `description` (markdown): Full exercise description
- `video_url` (string): Primary video demonstration URL
- `thumbnail_url` (string): Video thumbnail for UI
- `video_urls` (JSON array): Multiple camera angles

**Instructions:**
- `setup_instructions` (text): How to position body
- `execution_instructions` (text): Step-by-step movement description
- `common_mistakes` (string array): Errors to avoid
- `coaching_cues` (string array): Key focus points

**Biomechanics:**
- `target_muscles` (string array): Primary muscles worked
- `equipment_required` (string array): Needed equipment
- `contraindications` (string array): When to avoid exercise
- `modifications` (JSON): Adjustments for limitations

**Progression Pathway:**
- `regression_id` (UUID): Easier variation
- `progression_id` (UUID): Harder variation
- `alternative_ids` (UUID array): Same-difficulty alternatives

**Metadata:**
- `estimated_time_to_master_weeks` (integer)
- `tags` (string array): Searchable keywords
- `is_published` (boolean): Visibility status

---

## Exercise Attributes {#exercise-attributes}

### Difficulty Scale (1-10)

**1-3: Beginner** (Accessible to sedentary/untrained individuals)
- Examples: Wall push-ups, doorway rows, assisted squats
- No prerequisites
- Can be learned in 2-4 weeks

**4-6: Intermediate** (Requires 3-6 months consistent training)
- Examples: Standard push-ups, inverted rows, bodyweight squats
- Prerequisite: Master lower difficulty variations
- 6-12 weeks to master each level

**7-8: Advanced** (Requires 1-2 years consistent training)
- Examples: Diamond push-ups, weighted pull-ups, pistol squats
- Prerequisite: Solid intermediate strength base
- 12+ weeks to master

**9-10: Expert/Elite** (Requires 2+ years focused training)
- Examples: One-arm push-ups, muscle-ups, full planche
- Prerequisite: Years of progressive training
- Months to years to master

### Equipment Categories

- `none`: Pure bodyweight
- `pull_up_bar`: Requires overhead bar
- `dip_bars`: Parallel bars or dip station
- `resistance_bands`: Elastic bands for assistance/resistance
- `elevated_surface`: Bench, box, chair for support
- `rings`: Gymnastic rings
- `parallettes`: Small parallel bars for hand support
- `external_weight`: Dumbbells, kettlebells, weighted vest

### Contraindication Flags

- `cervical_disc_issues`: Avoid if neck problems
- `shoulder_impingement`: Modify if shoulder pain
- `knee_issues`: Caution for knee-dominant movements
- `wrist_limitations`: Wrist stress warning
- `lower_back_pain`: Core-intensive caution
- `high_impact`: Plyometric caution

---

## Video Content Requirements {#video-content}

### Primary Video (Required)

- **Duration:** 30-90 seconds
- **Angles:** Front or side view (shows full movement)
- **Content:**
  1. Starting position (3-5 seconds)
  2. Full movement execution (3-5 reps demonstrated)
  3. Common mistake demonstration (optional but recommended)
  4. Proper form re-emphasized
- **Quality:** 1080p minimum, good lighting
- **Audio:** Optional voiceover with coaching cues

### Secondary Videos (Optional but Recommended)

- **Side angle:** Shows depth of movement (squats, push-ups)
- **Close-up:** Hand/foot positioning details
- **Comparison:** Correct vs. incorrect form side-by-side
- **Modification videos:** For injury/limitation adaptations

### Video Hosting

- **Platform:** YouTube (unlisted), Vimeo (Pro), or self-hosted (S3/Cloudinary)
- **Embedding:** Responsive video player in app
- **Accessibility:** Closed captions for all videos

---

## Progression Relationships {#progression-relationships}

### Regression Links

Each exercise (difficulty 2+) should link to an easier variation that:
- Reduces load (incline vs. floor)
- Simplifies movement (knee vs. straight-leg)
- Adds assistance (band-assisted)
- Decreases range of motion

**Example:** Standard Push-ups → Knee Push-ups (regression)

### Progression Links

Each exercise (difficulty <10) should link to a harder variation that:
- Increases load (weighted, elevated)
- Adds complexity (tempo, pause)
- Removes assistance
- Increases range of motion
- Changes leverage (archer, one-arm)

**Example:** Standard Push-ups → Diamond Push-ups (progression)

### Alternative Links

Exercises at same difficulty addressing same movement pattern:
- Different equipment (pull-ups vs. chin-ups)
- Different emphasis (wide vs. narrow grip)
- Injury-friendly alternatives

**Example:** Pull-ups ↔ Neutral-grip pull-ups (alternative, more shoulder-friendly)

---

## Exercise Selection Criteria {#selection-criteria}

### For Workout Generation Algorithm

Exercises are selected based on:

**User Profile Matching:**
- Difficulty ≤ User's assessed level for that pattern
- Equipment matches user's available equipment
- No contraindicated exercises for user's injuries
- Modifications applied automatically when needed

**Program Requirements:**
- Movement pattern coverage (all primary patterns minimum)
- Volume distribution (sets per muscle group)
- Periodization phase (rep ranges, intensity)

**Variation & Engagement:**
- Rotate exercises week-to-week to prevent boredom
- Include user favorites (tracked via user ratings)
- Progress exercises when performance triggers met

### User Interface Filtering

Users can search/filter exercises by:
- Movement pattern
- Difficulty range
- Equipment available
- Body region targeted
- Skill type (strength, skill, conditioning)

---

## Sample Exercise Entry

### Standard Push-ups

**ID:** `uuid-standard-push-ups`
**Slug:** `standard-push-ups`
**Movement Pattern:** Horizontal Push
**Difficulty:** 5
**Category:** Primary

**Description:**
The fundamental horizontal pushing exercise. From a plank position with hands shoulder-width apart, lower your chest to within 1-2 inches of the floor while keeping your body straight, then push back up to the starting position.

**Setup Instructions:**
- Start in plank position
- Hands slightly wider than shoulder-width
- Feet together or hip-width apart
- Body forms straight line from head to heels
- Engage core to prevent sagging hips

**Execution Instructions:**
1. Take a breath at the top
2. Lower body in controlled manner (2-3 seconds)
3. Keep elbows at 45-degree angle to torso
4. Lower until chest is 1-2 inches from floor
5. Pause briefly at bottom
6. Push through hands to return to start
7. Exhale as you push up
8. Fully extend arms at top

**Common Mistakes:**
- Sagging hips (indicates weak core)
- Flaring elbows out to 90 degrees
- Incomplete range of motion (not going low enough)
- Neck hyperextension (looking too far forward)
- Shrugging shoulders toward ears

**Coaching Cues:**
- "Keep body straight as a board"
- "Elbows track at 45 degrees"
- "Chest to floor, not chin to floor"
- "Look 6-12 inches ahead, not directly down"
- "Squeeze glutes throughout"

**Target Muscles:**
- Pectoralis major (chest)
- Triceps brachii
- Anterior deltoid (front shoulder)
- Core stabilizers

**Equipment Required:** None

**Contraindications:**
- Active wrist injury (use knuckles or parallettes)
- Shoulder impingement (reduce range or use incline)

**Modifications:**
- Cervical issues: Keep neutral neck, don't look forward
- Wrist pain: Use parallettes, knuckles, or fists
- Shoulder pain: Reduce range of motion, use incline

**Regression:** Knee Push-ups (difficulty 4)
**Progression:** Diamond Push-ups (difficulty 7) OR Archer Push-ups (difficulty 7)
**Alternatives:** Dumbbell Floor Press, Band-Resisted Push-ups

**Estimated Time to Master:** 8-12 weeks from beginner baseline

**Tags:** compound, bodyweight, chest, upper-body, beginner-friendly

---

---
**Source:** calisthenics_app_design.md (lines 284-316) + database_schema.sql (exercises table)
**Last Updated:** 2025-12-21
**Related Docs:**
- [Movement Patterns](./movement-patterns.md)
- [Primary Progressions](./progressions-primary.md)
- [Workout Generation](../04-algorithms/workout-generation.md)
