#!/bin/bash

# Test profile creation with proper injury structure

echo "=== Testing Profile Creation ==="

# First, login to get a token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s https://api.caliteq.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kimiasaadat@hotmail.com",
    "password": "test123"
  }')

echo "Login response:"
echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "Failed to login"
  exit 1
fi

echo -e "\n=== Creating Profile with Injury Structure ==="

PROFILE_DATA='{
  "firstName": "Kimia",
  "lastName": "Saadat",
  "dateOfBirth": "1990-01-01",
  "gender": "female",
  "heightCm": 165,
  "currentWeightKg": 60,
  "trainingExperience": "beginner",
  "activityLevel": "lightly_active",
  "goals": ["fat_loss", "general_fitness"],
  "daysPerWeek": 3,
  "minutesPerSession": 45,
  "injuries": [
    {
      "type": "knee pain",
      "severity": "mild",
      "description": "knee pain"
    }
  ],
  "medicalConditions": [],
  "exerciseClearance": true,
  "equipment": {
    "pullUpBar": false,
    "dipBars": false,
    "resistanceBands": false,
    "elevatedSurface": true,
    "other": []
  },
  "assessmentScores": {
    "pushLevel": 3,
    "pullLevel": 2,
    "squatLevel": 4,
    "hingeLevel": 3,
    "coreLevel": 3
  }
}'

echo "Sending profile data..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  https://api.caliteq.app/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -X POST \
  -d "$PROFILE_DATA")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $HTTP_STATUS"
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
