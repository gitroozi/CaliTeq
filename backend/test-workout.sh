#!/bin/bash

# CaliTeq Workout Generation API Test Script
# Tests the workout plan generation endpoints

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================="
echo "CaliTeq Workout Generation API Tests"
echo "========================================="
echo ""

# Function to print test results
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $2"
  else
    echo -e "${RED}✗ FAIL${NC}: $2"
  fi
  echo ""
}

# Store tokens
ACCESS_TOKEN=""
USER_EMAIL="test@example.com"
USER_PASSWORD="Test1234"

echo -e "${BLUE}Step 1: Login to get access token${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$USER_EMAIL"'",
    "password": "'"$USER_PASSWORD"'"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}Failed to get access token. Make sure test user exists.${NC}"
  echo "Creating test user first..."

  REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "'"$USER_EMAIL"'",
      "password": "'"$USER_PASSWORD"'",
      "firstName": "Test",
      "lastName": "User"
    }')

  ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
fi

if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}Still failed to get access token. Exiting.${NC}"
  exit 1
fi

echo "Access token obtained: ${ACCESS_TOKEN:0:20}..."
print_result 0 "Authentication successful"

# Check if profile exists and create if needed
echo -e "${BLUE}Step 2: Ensure user profile is complete${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/users/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

PROFILE_COMPLETE=$(echo $PROFILE_RESPONSE | grep -o '"profile":{' | wc -l)

if [ $PROFILE_COMPLETE -eq 0 ]; then
  echo "Creating user profile..."
  CREATE_PROFILE_RESPONSE=$(curl -s -X POST "$API_URL/users/profile" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "firstName": "Test",
      "lastName": "User",
      "dateOfBirth": "1990-01-01",
      "gender": "male",
      "heightCm": 175,
      "currentWeightKg": 75,
      "trainingExperience": "beginner",
      "activityLevel": "moderately_active",
      "goals": ["muscle_gain", "strength"],
      "daysPerWeek": 3,
      "minutesPerSession": 45,
      "injuries": [],
      "pullUpBar": true,
      "dipBars": false,
      "resistanceBands": false,
      "gymnasticsRings": false,
      "parallettes": false,
      "weightedVest": false,
      "horizontalPushLevel": 5,
      "horizontalPullLevel": 4,
      "verticalPushLevel": 3,
      "verticalPullLevel": 3,
      "squatLevel": 5,
      "hingeLevel": 4,
      "coreStabilityLevel": 5
    }')

  echo "Profile created"
fi

print_result 0 "User profile ready"

# Test 1: Generate workout plan
echo -e "${BLUE}Test 1: Generate Workout Plan${NC}"
GENERATE_RESPONSE=$(curl -s -X POST "$API_URL/workout-plans/generate" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

PLAN_ID=$(echo $GENERATE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
SESSIONS_COUNT=$(echo $GENERATE_RESPONSE | grep -o '"totalSessions":[0-9]*' | grep -o '[0-9]*')

if [ ! -z "$PLAN_ID" ] && [ ! -z "$SESSIONS_COUNT" ]; then
  print_result 0 "Generate workout plan (ID: $PLAN_ID, Sessions: $SESSIONS_COUNT)"
else
  print_result 1 "Generate workout plan"
  echo "Response: $GENERATE_RESPONSE"
fi

# Test 2: Get active plan
echo -e "${BLUE}Test 2: Get Active Workout Plan${NC}"
ACTIVE_PLAN_RESPONSE=$(curl -s -X GET "$API_URL/workout-plans/active" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

ACTIVE_PLAN_ID=$(echo $ACTIVE_PLAN_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

if [ ! -z "$ACTIVE_PLAN_ID" ]; then
  print_result 0 "Get active workout plan"
else
  print_result 1 "Get active workout plan"
  echo "Response: $ACTIVE_PLAN_RESPONSE"
fi

# Test 3: Get all workout plans
echo -e "${BLUE}Test 3: Get All Workout Plans${NC}"
ALL_PLANS_RESPONSE=$(curl -s -X GET "$API_URL/workout-plans" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

PLANS_COUNT=$(echo $ALL_PLANS_RESPONSE | grep -o '"id":"[^"]*' | wc -l)

if [ $PLANS_COUNT -gt 0 ]; then
  print_result 0 "Get all workout plans (Count: $PLANS_COUNT)"
else
  print_result 1 "Get all workout plans"
fi

# Test 4: Get specific plan by ID
echo -e "${BLUE}Test 4: Get Specific Workout Plan${NC}"
if [ ! -z "$PLAN_ID" ]; then
  PLAN_RESPONSE=$(curl -s -X GET "$API_URL/workout-plans/$PLAN_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  PLAN_NAME=$(echo $PLAN_RESPONSE | grep -o '"name":"[^"]*' | head -1 | sed 's/"name":"//')

  if [ ! -z "$PLAN_NAME" ]; then
    print_result 0 "Get specific workout plan"
  else
    print_result 1 "Get specific workout plan"
  fi
else
  print_result 1 "Get specific workout plan (no plan ID)"
fi

# Test 5: Get today's workout
echo -e "${BLUE}Test 5: Get Today's Workout${NC}"
TODAY_WORKOUT_RESPONSE=$(curl -s -X GET "$API_URL/workout-sessions/today" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

TODAY_SESSION_ID=$(echo $TODAY_WORKOUT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

if [ ! -z "$TODAY_SESSION_ID" ]; then
  print_result 0 "Get today's workout"
elif echo "$TODAY_WORKOUT_RESPONSE" | grep -q "No workout scheduled"; then
  print_result 0 "Get today's workout (none scheduled - expected)"
else
  print_result 1 "Get today's workout"
  echo "Response: $TODAY_WORKOUT_RESPONSE"
fi

# Test 6: Get week 1 sessions
echo -e "${BLUE}Test 6: Get Week 1 Sessions${NC}"
WEEK_SESSIONS_RESPONSE=$(curl -s -X GET "$API_URL/workout-sessions/week/1" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

WEEK_SESSIONS_COUNT=$(echo $WEEK_SESSIONS_RESPONSE | grep -o '"id":"[^"]*' | wc -l)

if [ $WEEK_SESSIONS_COUNT -gt 0 ]; then
  print_result 0 "Get week sessions (Count: $WEEK_SESSIONS_COUNT)"
else
  print_result 1 "Get week sessions"
  echo "Response: $WEEK_SESSIONS_RESPONSE"
fi

# Test 7: Get specific session
echo -e "${BLUE}Test 7: Get Specific Workout Session${NC}"
if [ $WEEK_SESSIONS_COUNT -gt 0 ]; then
  FIRST_SESSION_ID=$(echo $WEEK_SESSIONS_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

  SESSION_RESPONSE=$(curl -s -X GET "$API_URL/workout-sessions/$FIRST_SESSION_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  SESSION_NAME=$(echo $SESSION_RESPONSE | grep -o '"name":"[^"]*' | head -1 | sed 's/"name":"//')
  EXERCISES_COUNT=$(echo $SESSION_RESPONSE | grep -o '"exerciseId":"[^"]*' | wc -l)

  if [ ! -z "$SESSION_NAME" ] && [ $EXERCISES_COUNT -gt 0 ]; then
    print_result 0 "Get specific session (Exercises: $EXERCISES_COUNT)"
  else
    print_result 1 "Get specific session"
    echo "Response: $SESSION_RESPONSE"
  fi
else
  print_result 1 "Get specific session (no sessions found)"
fi

# Test 8: Try to generate duplicate plan (should fail)
echo -e "${BLUE}Test 8: Prevent Duplicate Active Plans${NC}"
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/workout-plans/generate" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

if echo "$DUPLICATE_RESPONSE" | grep -q "already have an active"; then
  print_result 0 "Prevent duplicate active plans"
else
  print_result 1 "Prevent duplicate active plans (should have been blocked)"
fi

# Test 9: Deactivate plan
echo -e "${BLUE}Test 9: Deactivate Workout Plan${NC}"
if [ ! -z "$PLAN_ID" ]; then
  DEACTIVATE_RESPONSE=$(curl -s -X PUT "$API_URL/workout-plans/$PLAN_ID/deactivate" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  if echo "$DEACTIVATE_RESPONSE" | grep -q "deactivated"; then
    print_result 0 "Deactivate workout plan"
  else
    print_result 1 "Deactivate workout plan"
    echo "Response: $DEACTIVATE_RESPONSE"
  fi
else
  print_result 1 "Deactivate workout plan (no plan ID)"
fi

echo "========================================="
echo "Tests completed!"
echo "========================================="
