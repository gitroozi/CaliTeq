#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' | jq -r '.data.accessToken')

# Get and deactivate existing plan
PLAN_ID=$(curl -s -X GET http://localhost:3000/api/workout-plans/active \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data.id')

echo "Deactivating plan: $PLAN_ID"
curl -s -X PUT "http://localhost:3000/api/workout-plans/$PLAN_ID/deactivate" \
  -H "Authorization: Bearer $TOKEN"

echo ""
echo "Generating new workout plan..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/workout-plans/generate \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE" | jq -r '.data.workout_sessions[0].workout_session_exercises[] | "\(.exercise.movement_pattern.name) - \(.exercise.name) (diff: \(.exercise.difficulty))"' | head -10
