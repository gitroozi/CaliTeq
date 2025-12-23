#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' | jq -r '.data.accessToken')

echo "Token: ${TOKEN:0:20}..."
echo ""
echo "Generating workout..."
curl -s -X POST http://localhost:3000/api/workout-plans/generate \
  -H "Authorization: Bearer $TOKEN"
