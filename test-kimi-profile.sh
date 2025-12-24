#!/bin/bash

# Login as Kimi
echo "=== Logging in as Kimi ==="
LOGIN_RESPONSE=$(curl -s https://api.caliteq.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kimiasaadat@hotmail.com","password":"test123"}')

echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "Failed to login - check password"
  exit 1
fi

echo -e "\n=== Got token, checking profile ==="
PROFILE_RESPONSE=$(curl -s https://api.caliteq.app/api/users/profile \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE_RESPONSE" | jq '.'

echo -e "\n=== Checking active plan ==="
PLAN_RESPONSE=$(curl -s https://api.caliteq.app/api/workout-plans/active \
  -H "Authorization: Bearer $TOKEN")

echo "$PLAN_RESPONSE" | jq '.'
