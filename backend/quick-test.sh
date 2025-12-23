#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' | jq -r '.data.accessToken')

curl -s -X POST http://localhost:3000/api/workout-plans/generate \
  -H "Authorization: Bearer $TOKEN" | jq '{
    success: .success,
    total_sessions: (.data.workout_sessions | length),
    first_session: {
      name: .data.workout_sessions[0].name,
      exercises: .data.workout_sessions[0].workout_session_exercises | length,
      exercise_list: [.data.workout_sessions[0].workout_session_exercises[] | {
        name: .exercise.name,
        pattern: .exercise.movement_pattern.name,
        difficulty: .exercise.difficulty
      }]
    }
  }'
