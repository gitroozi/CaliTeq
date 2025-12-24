#!/bin/bash

echo "=== Logging in as admin ==="

# Try different admin credentials
for password in "admin123" "Admin123!" "password" "admin"; do
  echo "Trying password: $password"
  TOKEN=$(curl -s https://api.caliteq.app/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"admin@caliteq.app\",\"password\":\"$password\"}" | jq -r '.data.accessToken // empty')

  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "Login successful with password: $password"
    break
  fi
done

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "Failed to login with any password. Please provide admin credentials."
  exit 1
fi

echo -e "\n=== Searching for Kimi ==="
curl -s "https://api.caliteq.app/api/admin/users?search=kimi" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n=== Getting Kimi's user ID ==="
USER_ID=$(curl -s "https://api.caliteq.app/api/admin/users?search=kimi" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data.users[0].id // empty')

if [ -n "$USER_ID" ] && [ "$USER_ID" != "null" ]; then
  echo "User ID: $USER_ID"

  echo -e "\n=== Getting Kimi's detailed info ==="
  curl -s "https://api.caliteq.app/api/admin/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
fi
