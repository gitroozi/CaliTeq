#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' | jq -r '.data.accessToken')

echo "Getting active workout plan..."
curl -s -X GET http://localhost:3000/api/workout-plans/active \
  -H "Authorization: Bearer $TOKEN" | jq '{
    plan_name: .data.name,
    first_session: {
      name: .data.workout_sessions[0].name,
      exercise_count: (.data.workout_sessions[0].workout_session_exercises | length),
      exercises: [.data.workout_sessions[0].workout_session_exercises[] | {
        name: .exercise.name,
        pattern: .exercise.movement_pattern.name,
        difficulty: .exercise.difficulty
      }]
    }
  }'
