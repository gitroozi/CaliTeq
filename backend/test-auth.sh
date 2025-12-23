#!/bin/bash

echo "🧪 Testing CaliTeq Authentication Endpoints"
echo "============================================"
echo ""

echo "✅ 1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"SecurePass123","firstName":"John","lastName":"Doe"}')

echo "$REGISTER_RESPONSE"
echo ""

echo "✅ 2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"SecurePass123"}')

echo "$LOGIN_RESPONSE"
echo ""

# Extract token using grep and cut
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to extract token"
  exit 1
fi

echo "✅ 3. Testing Protected Endpoint /api/auth/me..."
ME_RESPONSE=$(curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

echo "$ME_RESPONSE"
echo ""

echo "✅ 4. Testing Invalid Token..."
INVALID_RESPONSE=$(curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here")

echo "$INVALID_RESPONSE"
echo ""

echo "✅ All tests completed!"
