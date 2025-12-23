#!/bin/bash

BASE_URL="http://localhost:3000/api"

# Register new user
echo "Creating test user..."
TOKEN=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "exercisetest@example.com",
    "password": "Test1234"
  }' | jq -r '.data.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "Failed to get token"
  exit 1
fi

echo "Token obtained"

# Create profile
echo "Creating user profile..."
curl -s -X POST "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "heightCm": 175,
    "currentWeightKg": 75,
    "trainingExperience": "beginner",
    "activityLevel": "lightly_active",
    "goals": ["build_muscle", "increase_strength"],
    "daysPerWeek": 3,
    "minutesPerSession": 60,
    "equipment": {
      "pullUpBar": true,
      "dipBars": false,
      "resistanceBands": false,
      "elevatedSurface": true
    },
    "assessmentScores": {
      "pushLevel": 1,
      "pullLevel": 1,
      "squatLevel": 1,
      "hingeLevel": 1,
      "coreLevel": 1
    }
  }' > /dev/null

echo "Profile created"

# Generate workout
echo "Generating workout plan..."
RESPONSE=$(curl -s -X POST "$BASE_URL/workout-plans/generate" \
  -H "Authorization: Bearer $TOKEN")

echo ""
echo "Full response:"
echo "$RESPONSE" | jq '.'

echo ""
echo "First workout session exercises:"
echo "$RESPONSE" | jq '.data.workout_sessions[0].workout_session_exercises | [.[] | {exercise: .exercise.name, pattern: .exercise.movement_pattern.name, difficulty: .exercise.difficulty}]'

echo ""
echo "Movement patterns covered in first session:"
echo "$RESPONSE" | jq '.data.workout_sessions[0].workout_session_exercises | [.[].exercise.movement_pattern.name] | unique'

echo ""
echo "Total exercises in first session:"
echo "$RESPONSE" | jq '.data.workout_sessions[0].workout_session_exercises | length'
