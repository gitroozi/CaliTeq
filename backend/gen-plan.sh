#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' | jq -r '.data.accessToken')

echo "Generating new workout plan..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/workout-plans/generate \
  -H "Authorization: Bearer $TOKEN")

echo ""
echo "First session exercises:"
echo "$RESPONSE" | jq -r '.data.workout_sessions[0].workout_session_exercises[] | "\(.exercise.movement_pattern.name): \(.exercise.name) (difficulty \(.exercise.difficulty))"'

echo ""
echo "Movement patterns in first session:"
echo "$RESPONSE" | jq -r '.data.workout_sessions[0].workout_session_exercises[].exercise.movement_pattern.name' | sort | uniq -c
