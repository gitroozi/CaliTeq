#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' | jq -r '.data.accessToken')

# Deactivate the existing plan
echo "Deactivating existing plan..."
curl -s -X PUT "http://localhost:3000/api/workout-plans/a97f56ed-c44d-4154-b74d-bb2673604eea/deactivate" \
  -H "Authorization: Bearer $TOKEN" | jq '.success'

echo ""
echo "Generating new plan..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/workout-plans/generate \
  -H "Authorization: Bearer $TOKEN")

echo ""
echo "First session exercises:"
echo "$RESPONSE" | jq -r '.data.workout_sessions[0].workout_session_exercises[] | "\(.exercise.movement_pattern.name): \(.exercise.name) (difficulty \(.exercise.difficulty))"'

echo ""
echo "Movement patterns covered:"
echo "$RESPONSE" | jq -r '.data.workout_sessions[0].workout_session_exercises[].exercise.movement_pattern.name' | sort | uniq -c

echo ""
echo "Total exercises in first session:"
echo "$RESPONSE" | jq '.data.workout_sessions[0].workout_session_exercises | length'
