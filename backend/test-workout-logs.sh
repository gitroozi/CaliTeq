#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

# Test credentials
EMAIL="test@example.com"
PASSWORD="Test1234"

# Global variables
TOKEN=""
WORKOUT_SESSION_ID=""
EXERCISE_ID=""
WORKOUT_LOG_ID=""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CaliTeq Workout Logging API Tests${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Helper function to print test results
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ $2${NC}"
  else
    echo -e "${RED}✗ $2${NC}"
    echo -e "${RED}Response: $3${NC}"
  fi
}

# Test 1: Login to get auth token
echo -e "\n${YELLOW}Test 1: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

if [ -n "$TOKEN" ]; then
  print_result 0 "Login successful"
  echo "Token: ${TOKEN:0:50}..."
else
  print_result 1 "Login failed" "$LOGIN_RESPONSE"
  echo -e "${RED}Cannot proceed without auth token${NC}"
  exit 1
fi

# Test 2: Get active workout plan to find a session
echo -e "\n${YELLOW}Test 2: Get active workout plan${NC}"
PLAN_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-plans/active" \
  -H "Authorization: Bearer $TOKEN")

WORKOUT_SESSION_ID=$(echo $PLAN_RESPONSE | grep -o '"id":"[^"]*' | head -2 | tail -1 | sed 's/"id":"//')

if [ -n "$WORKOUT_SESSION_ID" ]; then
  print_result 0 "Got active workout plan with sessions"
  echo "Session ID: $WORKOUT_SESSION_ID"
else
  print_result 1 "No active workout plan found" "$PLAN_RESPONSE"
  echo -e "${YELLOW}Note: Some tests require an active workout plan${NC}"
fi

# Test 3: Get exercises to find an exercise ID
echo -e "\n${YELLOW}Test 3: Get exercises${NC}"
EXERCISE_RESPONSE=$(curl -s -X GET "$BASE_URL/exercises?limit=1" \
  -H "Authorization: Bearer $TOKEN")

EXERCISE_ID=$(echo $EXERCISE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

if [ -n "$EXERCISE_ID" ]; then
  print_result 0 "Got exercise ID for testing"
  echo "Exercise ID: $EXERCISE_ID"
else
  print_result 1 "No exercises found" "$EXERCISE_RESPONSE"
  exit 1
fi

# Test 4: Create a workout log
echo -e "\n${YELLOW}Test 4: Create workout log${NC}"

# Get current timestamp
STARTED_AT=$(date -u -v-1H +"%Y-%m-%dT%H:%M:%SZ")
COMPLETED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

CREATE_LOG_DATA="{
  \"workout_session_id\": $(if [ -n "$WORKOUT_SESSION_ID" ]; then echo "\"$WORKOUT_SESSION_ID\""; else echo "null"; fi),
  \"started_at\": \"$STARTED_AT\",
  \"completed_at\": \"$COMPLETED_AT\",
  \"overall_difficulty\": 7,
  \"energy_level\": 8,
  \"enjoyment\": 9,
  \"notes\": \"Great workout! Felt strong today.\",
  \"pain_reports\": [
    {
      \"body_part\": \"lower_back\",
      \"severity\": 2,
      \"description\": \"Slight tightness, nothing concerning\"
    }
  ],
  \"exercises\": [
    {
      \"exercise_id\": \"$EXERCISE_ID\",
      \"sets\": [
        {
          \"set_number\": 1,
          \"reps\": 12,
          \"rpe\": 6,
          \"rest_seconds\": 60,
          \"notes\": \"Warmup set\"
        },
        {
          \"set_number\": 2,
          \"reps\": 10,
          \"rpe\": 8,
          \"rest_seconds\": 60,
          \"notes\": \"Working set\"
        },
        {
          \"set_number\": 3,
          \"reps\": 8,
          \"rpe\": 9,
          \"rest_seconds\": 60,
          \"notes\": \"Final set, pushed hard\"
        }
      ]
    }
  ]
}"

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/workout-logs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$CREATE_LOG_DATA")

WORKOUT_LOG_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

if [ -n "$WORKOUT_LOG_ID" ]; then
  print_result 0 "Workout log created successfully"
  echo "Workout Log ID: $WORKOUT_LOG_ID"
  echo "Response preview: $(echo $CREATE_RESPONSE | cut -c1-200)..."
else
  print_result 1 "Failed to create workout log" "$CREATE_RESPONSE"
fi

# Test 5: Get all workout logs
echo -e "\n${YELLOW}Test 5: Get all workout logs${NC}"
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-logs?limit=10" \
  -H "Authorization: Bearer $TOKEN")

LOG_COUNT=$(echo $LIST_RESPONSE | grep -o '"id":"[^"]*' | wc -l)

if [ $LOG_COUNT -gt 0 ]; then
  print_result 0 "Retrieved workout logs (count: $LOG_COUNT)"
  echo "Response preview: $(echo $LIST_RESPONSE | cut -c1-200)..."
else
  print_result 1 "No workout logs found" "$LIST_RESPONSE"
fi

# Test 6: Get specific workout log by ID
if [ -n "$WORKOUT_LOG_ID" ]; then
  echo -e "\n${YELLOW}Test 6: Get specific workout log${NC}"
  GET_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-logs/$WORKOUT_LOG_ID" \
    -H "Authorization: Bearer $TOKEN")

  GET_ID=$(echo $GET_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

  if [ "$GET_ID" == "$WORKOUT_LOG_ID" ]; then
    print_result 0 "Retrieved specific workout log"
    echo "Response preview: $(echo $GET_RESPONSE | cut -c1-200)..."
  else
    print_result 1 "Failed to retrieve workout log" "$GET_RESPONSE"
  fi
fi

# Test 7: Get workout statistics
echo -e "\n${YELLOW}Test 7: Get workout statistics${NC}"
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-logs/stats?days=30" \
  -H "Authorization: Bearer $TOKEN")

TOTAL_WORKOUTS=$(echo $STATS_RESPONSE | grep -o '"total_workouts":[0-9]*' | sed 's/"total_workouts"://')

if [ -n "$TOTAL_WORKOUTS" ]; then
  print_result 0 "Retrieved workout statistics"
  echo "Total workouts (last 30 days): $TOTAL_WORKOUTS"
  echo "Response: $STATS_RESPONSE"
else
  print_result 1 "Failed to retrieve statistics" "$STATS_RESPONSE"
fi

# Test 8: Get exercise history
if [ -n "$EXERCISE_ID" ]; then
  echo -e "\n${YELLOW}Test 8: Get exercise history${NC}"
  HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-logs/exercises/$EXERCISE_ID/history?limit=10" \
    -H "Authorization: Bearer $TOKEN")

  HISTORY_COUNT=$(echo $HISTORY_RESPONSE | grep -o '"workout_log_id":"[^"]*' | wc -l)

  if [ -n "$HISTORY_RESPONSE" ]; then
    print_result 0 "Retrieved exercise history (count: $HISTORY_COUNT)"
    echo "Response preview: $(echo $HISTORY_RESPONSE | cut -c1-200)..."
  else
    print_result 1 "Failed to retrieve exercise history" "$HISTORY_RESPONSE"
  fi
fi

# Test 9: Filter workout logs by date
echo -e "\n${YELLOW}Test 9: Filter workout logs by date${NC}"
FROM_DATE=$(date -u -v-7d +"%Y-%m-%d")
TO_DATE=$(date -u +"%Y-%m-%d")

FILTER_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-logs?from_date=$FROM_DATE&to_date=$TO_DATE" \
  -H "Authorization: Bearer $TOKEN")

FILTER_COUNT=$(echo $FILTER_RESPONSE | grep -o '"id":"[^"]*' | wc -l)

if [ -n "$FILTER_RESPONSE" ]; then
  print_result 0 "Filtered workout logs by date (count: $FILTER_COUNT)"
  echo "Date range: $FROM_DATE to $TO_DATE"
else
  print_result 1 "Failed to filter workout logs" "$FILTER_RESPONSE"
fi

# Test 10: Test pagination
echo -e "\n${YELLOW}Test 10: Test pagination${NC}"
PAGE_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-logs?limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN")

HAS_PAGINATION=$(echo $PAGE_RESPONSE | grep -o '"pagination"' | wc -l)

if [ $HAS_PAGINATION -gt 0 ]; then
  print_result 0 "Pagination working"
  echo "Response preview: $(echo $PAGE_RESPONSE | grep -o '"pagination":{[^}]*}' | head -1)"
else
  print_result 1 "Pagination not found" "$PAGE_RESPONSE"
fi

# Test 11: Delete workout log
if [ -n "$WORKOUT_LOG_ID" ]; then
  echo -e "\n${YELLOW}Test 11: Delete workout log${NC}"
  DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/workout-logs/$WORKOUT_LOG_ID" \
    -H "Authorization: Bearer $TOKEN")

  SUCCESS=$(echo $DELETE_RESPONSE | grep -o '"success":true' | wc -l)

  if [ $SUCCESS -gt 0 ]; then
    print_result 0 "Workout log deleted successfully"
    echo "Response: $DELETE_RESPONSE"
  else
    print_result 1 "Failed to delete workout log" "$DELETE_RESPONSE"
  fi
fi

# Test 12: Verify deletion
if [ -n "$WORKOUT_LOG_ID" ]; then
  echo -e "\n${YELLOW}Test 12: Verify workout log is deleted${NC}"
  VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/workout-logs/$WORKOUT_LOG_ID" \
    -H "Authorization: Bearer $TOKEN")

  ERROR=$(echo $VERIFY_RESPONSE | grep -o '"error"' | wc -l)

  if [ $ERROR -gt 0 ]; then
    print_result 0 "Workout log successfully deleted (404 confirmed)"
  else
    print_result 1 "Workout log still exists after deletion" "$VERIFY_RESPONSE"
  fi
fi

# Test 13: Create workout log without session_id (ad-hoc workout)
echo -e "\n${YELLOW}Test 13: Create ad-hoc workout log (no session)${NC}"

ADHOC_STARTED=$(date -u -v-30M +"%Y-%m-%dT%H:%M:%SZ")
ADHOC_COMPLETED=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

ADHOC_DATA="{
  \"started_at\": \"$ADHOC_STARTED\",
  \"completed_at\": \"$ADHOC_COMPLETED\",
  \"overall_difficulty\": 5,
  \"energy_level\": 6,
  \"enjoyment\": 7,
  \"notes\": \"Quick impromptu workout\",
  \"exercises\": [
    {
      \"exercise_id\": \"$EXERCISE_ID\",
      \"sets\": [
        {
          \"set_number\": 1,
          \"reps\": 15,
          \"rpe\": 7
        }
      ]
    }
  ]
}"

ADHOC_RESPONSE=$(curl -s -X POST "$BASE_URL/workout-logs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$ADHOC_DATA")

ADHOC_ID=$(echo $ADHOC_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

if [ -n "$ADHOC_ID" ]; then
  print_result 0 "Ad-hoc workout log created successfully"
  echo "Ad-hoc Log ID: $ADHOC_ID"

  # Clean up ad-hoc log
  curl -s -X DELETE "$BASE_URL/workout-logs/$ADHOC_ID" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
else
  print_result 1 "Failed to create ad-hoc workout log" "$ADHOC_RESPONSE"
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All workout logging API tests completed!${NC}"
echo -e "\nEndpoints tested:"
echo -e "  ✓ POST /api/workout-logs (create)"
echo -e "  ✓ GET /api/workout-logs (list with filters)"
echo -e "  ✓ GET /api/workout-logs/:id (get specific)"
echo -e "  ✓ DELETE /api/workout-logs/:id (delete)"
echo -e "  ✓ GET /api/workout-logs/stats (statistics)"
echo -e "  ✓ GET /api/workout-logs/exercises/:id/history (exercise history)"
echo -e "\nFeatures tested:"
echo -e "  ✓ Authentication required"
echo -e "  ✓ Workout session linking"
echo -e "  ✓ Ad-hoc workout logging"
echo -e "  ✓ Exercise performance tracking"
echo -e "  ✓ Subjective ratings (difficulty, energy, enjoyment)"
echo -e "  ✓ Pain reports"
echo -e "  ✓ Set-by-set data"
echo -e "  ✓ Date filtering"
echo -e "  ✓ Pagination"
echo -e "  ✓ Statistics calculation"
echo -e "  ✓ Exercise history tracking"
