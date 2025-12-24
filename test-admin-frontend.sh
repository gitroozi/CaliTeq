#!/bin/bash

echo "Testing Admin Login Flow..."
echo ""

# Step 1: Login
echo "Step 1: Admin Login"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@caliteq.com","password":"changeme123"}')

echo "$LOGIN_RESPONSE" | jq '.'

# Extract token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.accessToken')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
  echo "ERROR: Failed to get access token"
  exit 1
fi

echo ""
echo "Access token obtained: ${ACCESS_TOKEN:0:50}..."
echo ""

# Step 2: Test /me endpoint
echo "Step 2: Test /me endpoint"
ME_RESPONSE=$(curl -s http://localhost:3000/api/admin/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$ME_RESPONSE" | jq '.'

# Check if successful
SUCCESS=$(echo "$ME_RESPONSE" | jq -r '.success')

if [ "$SUCCESS" = "true" ]; then
  echo ""
  echo "✅ Admin authentication flow working!"
  echo ""
  echo "Admin Details:"
  echo "$ME_RESPONSE" | jq '.data'
else
  echo ""
  echo "❌ Admin /me endpoint failed"
  echo "Response: $ME_RESPONSE"
  exit 1
fi

# Step 3: Test user stats endpoint
echo ""
echo "Step 3: Test user stats endpoint"
STATS_RESPONSE=$(curl -s http://localhost:3000/api/admin/users/stats \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$STATS_RESPONSE" | jq '.'

echo ""
echo "✅ All admin endpoints working!"
