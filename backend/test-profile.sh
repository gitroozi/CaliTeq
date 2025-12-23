#!/bin/bash

echo "🧪 Testing CaliTeq Profile Endpoints"
echo "====================================="
echo ""

# First, login to get a token
echo "🔐 Logging in to get access token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"SecurePass123"}')

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to extract token. Make sure the test user exists."
  echo "Run ./test-auth.sh first to create the test user."
  exit 1
fi

echo "✅ Token obtained successfully"
echo ""

echo "✅ 1. Testing GET /api/users/profile (initial state)..."
GET_PROFILE_RESPONSE=$(curl -s http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN")

echo "$GET_PROFILE_RESPONSE"
echo ""

echo "✅ 2. Testing POST /api/users/profile (create profile)..."
CREATE_PROFILE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "heightCm": 175,
    "currentWeightKg": 75,
    "targetWeightKg": 70,
    "trainingExperience": "beginner",
    "activityLevel": "lightly_active",
    "goals": ["fat_loss", "muscle_gain", "strength"],
    "daysPerWeek": 3,
    "minutesPerSession": 45,
    "injuries": [
      {
        "type": "shoulder",
        "severity": "mild",
        "description": "Previous rotator cuff strain"
      }
    ],
    "medicalConditions": [],
    "exerciseClearance": true,
    "equipment": {
      "pullUpBar": true,
      "dipBars": false,
      "resistanceBands": true,
      "elevatedSurface": true,
      "other": ["yoga mat"]
    },
    "assessmentScores": {
      "pushLevel": 3,
      "pullLevel": 2,
      "squatLevel": 4,
      "hingeLevel": 3,
      "coreLevel": 3
    }
  }')

echo "$CREATE_PROFILE_RESPONSE"
echo ""

echo "✅ 3. Testing GET /api/users/profile (after creation)..."
GET_PROFILE_AFTER_RESPONSE=$(curl -s http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN")

echo "$GET_PROFILE_AFTER_RESPONSE"
echo ""

echo "✅ 4. Testing PUT /api/users/profile (update profile)..."
UPDATE_PROFILE_RESPONSE=$(curl -s -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "currentWeightKg": 73,
    "daysPerWeek": 4,
    "assessmentScores": {
      "pushLevel": 4,
      "pullLevel": 3
    }
  }')

echo "$UPDATE_PROFILE_RESPONSE"
echo ""

echo "✅ 5. Testing GET /api/users/profile/complete..."
CHECK_COMPLETE_RESPONSE=$(curl -s http://localhost:3000/api/users/profile/complete \
  -H "Authorization: Bearer $TOKEN")

echo "$CHECK_COMPLETE_RESPONSE"
echo ""

echo "✅ 6. Testing validation - Invalid data..."
VALIDATION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "heightCm": 999,
    "daysPerWeek": 10,
    "trainingExperience": "invalid_level"
  }')

echo "$VALIDATION_RESPONSE"
echo ""

echo "✅ 7. Testing without auth token..."
UNAUTHORIZED_RESPONSE=$(curl -s http://localhost:3000/api/users/profile)

echo "$UNAUTHORIZED_RESPONSE"
echo ""

echo "✅ All profile tests completed!"
