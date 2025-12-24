#!/bin/bash
echo "Checking Kimi's data..."
curl -s https://api.caliteq.app/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@caliteq.app","password":"AdminPassword123!"}' | jq -r '.data.accessToken' > /tmp/admin_token.txt

if [ ! -s /tmp/admin_token.txt ]; then
  echo "Failed to get admin token"
  exit 1
fi

TOKEN=$(cat /tmp/admin_token.txt)
echo "Got admin token"

echo -e "\n=== Searching for Kimi ==="
curl -s "https://api.caliteq.app/api/admin/users?search=kimi" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
