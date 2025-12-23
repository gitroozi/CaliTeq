#!/bin/bash

# Progress Tracking API Test Script
# Tests all endpoints for progress metrics tracking

BASE_URL="http://localhost:3000/api"
CONTENT_TYPE="Content-Type: application/json"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $2"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: $2"
    ((TESTS_FAILED++))
  fi
}

echo "=========================================="
echo "Progress Tracking API Test Suite"
echo "=========================================="
echo ""

# Step 1: Register or login a test user
echo -e "${YELLOW}[1/15] Registering/logging in test user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "progress-test@example.com",
    "password": "TestPass123",
    "firstName": "Progress",
    "lastName": "Tester"
  }')

ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

# If registration failed (user exists), try login
if [ -z "$ACCESS_TOKEN" ]; then
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "$CONTENT_TYPE" \
    -d '{
      "email": "progress-test@example.com",
      "password": "TestPass123"
    }')

  ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
fi

if [ -n "$ACCESS_TOKEN" ]; then
  print_result 0 "User authentication successful"
else
  print_result 1 "User authentication failed"
  echo "Register Response: $REGISTER_RESPONSE"
  echo "Login Response: $LOGIN_RESPONSE"
  exit 1
fi

# Step 2: Create weight metric
echo ""
echo -e "${YELLOW}[2/15] Creating weight metric...${NC}"
WEIGHT_RESPONSE=$(curl -s -X POST "$BASE_URL/progress/metrics" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "metric_type": "weight",
    "data": {
      "weight_kg": 75.5
    },
    "notes": "Morning weight after breakfast"
  }')

WEIGHT_ID=$(echo $WEIGHT_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')

if [ -n "$WEIGHT_ID" ]; then
  print_result 0 "Weight metric created"
  echo "Weight ID: $WEIGHT_ID"
else
  print_result 1 "Weight metric creation failed"
  echo "Response: $WEIGHT_RESPONSE"
fi

# Step 3: Create body fat metric
echo ""
echo -e "${YELLOW}[3/15] Creating body fat metric...${NC}"
BODYFAT_RESPONSE=$(curl -s -X POST "$BASE_URL/progress/metrics" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "metric_type": "body_fat",
    "data": {
      "body_fat_percentage": 18.5,
      "measurement_method": "calipers"
    },
    "notes": "3-site caliper test"
  }')

BODYFAT_ID=$(echo $BODYFAT_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')

if [ -n "$BODYFAT_ID" ]; then
  print_result 0 "Body fat metric created"
else
  print_result 1 "Body fat metric creation failed"
  echo "Response: $BODYFAT_RESPONSE"
fi

# Step 4: Create waist measurement
echo ""
echo -e "${YELLOW}[4/15] Creating waist measurement...${NC}"
WAIST_RESPONSE=$(curl -s -X POST "$BASE_URL/progress/metrics" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "metric_type": "waist",
    "data": {
      "measurement_cm": 85.0,
      "location": "around navel"
    }
  }')

WAIST_ID=$(echo $WAIST_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')

if [ -n "$WAIST_ID" ]; then
  print_result 0 "Waist measurement created"
else
  print_result 1 "Waist measurement creation failed"
  echo "Response: $WAIST_RESPONSE"
fi

# Step 5: Create wellness metric
echo ""
echo -e "${YELLOW}[5/15] Creating wellness metric...${NC}"
WELLNESS_RESPONSE=$(curl -s -X POST "$BASE_URL/progress/metrics" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "metric_type": "wellness",
    "data": {
      "sleep_hours": 7.5,
      "stress_level": 4,
      "soreness_level": 3,
      "energy_level": 8,
      "mood": 7
    },
    "notes": "Feeling good after rest day"
  }')

WELLNESS_ID=$(echo $WELLNESS_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')

if [ -n "$WELLNESS_ID" ]; then
  print_result 0 "Wellness metric created"
else
  print_result 1 "Wellness metric creation failed"
  echo "Response: $WELLNESS_RESPONSE"
fi

# Step 6: Create another weight metric (for trend tracking)
echo ""
echo -e "${YELLOW}[6/15] Creating second weight metric...${NC}"
sleep 1 # Small delay to ensure different timestamp
WEIGHT2_RESPONSE=$(curl -s -X POST "$BASE_URL/progress/metrics" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "metric_type": "weight",
    "data": {
      "weight_kg": 74.8
    },
    "notes": "One week later"
  }')

WEIGHT2_ID=$(echo $WEIGHT2_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')

if [ -n "$WEIGHT2_ID" ]; then
  print_result 0 "Second weight metric created"
else
  print_result 1 "Second weight metric creation failed"
fi

# Step 7: Get all metrics
echo ""
echo -e "${YELLOW}[7/15] Getting all metrics...${NC}"
ALL_METRICS=$(curl -s -X GET "$BASE_URL/progress/metrics" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

METRIC_COUNT=$(echo $ALL_METRICS | grep -o '"total":[0-9]*' | sed 's/"total"://')

if [ "$METRIC_COUNT" -ge 5 ]; then
  print_result 0 "Retrieved all metrics (count: $METRIC_COUNT)"
else
  print_result 1 "Failed to retrieve all metrics"
  echo "Response: $ALL_METRICS"
fi

# Step 8: Get metrics filtered by type (weight)
echo ""
echo -e "${YELLOW}[8/15] Getting weight metrics only...${NC}"
WEIGHT_METRICS=$(curl -s -X GET "$BASE_URL/progress/metrics?metric_type=weight" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

WEIGHT_COUNT=$(echo $WEIGHT_METRICS | grep -o '"total":[0-9]*' | sed 's/"total"://')

if [ "$WEIGHT_COUNT" -eq 2 ]; then
  print_result 0 "Retrieved weight metrics (count: $WEIGHT_COUNT)"
else
  print_result 1 "Failed to filter weight metrics (expected 2, got $WEIGHT_COUNT)"
fi

# Step 9: Get specific metric by ID
echo ""
echo -e "${YELLOW}[9/15] Getting specific metric by ID...${NC}"
SPECIFIC_METRIC=$(curl -s -X GET "$BASE_URL/progress/metrics/$WEIGHT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

RETRIEVED_ID=$(echo $SPECIFIC_METRIC | grep -o '"id":"[^"]*' | sed 's/"id":"//')

if [ "$RETRIEVED_ID" = "$WEIGHT_ID" ]; then
  print_result 0 "Retrieved specific metric by ID"
else
  print_result 1 "Failed to retrieve specific metric"
fi

# Step 10: Get weight statistics
echo ""
echo -e "${YELLOW}[10/15] Getting weight statistics...${NC}"
WEIGHT_STATS=$(curl -s -X GET "$BASE_URL/progress/stats/weight" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

STATS_TYPE=$(echo $WEIGHT_STATS | grep -o '"metric_type":"[^"]*' | sed 's/"metric_type":"//')

if [ "$STATS_TYPE" = "weight" ]; then
  print_result 0 "Retrieved weight statistics"
  echo "Stats preview:"
  echo $WEIGHT_STATS | grep -o '"total_entries":[0-9]*'
  echo $WEIGHT_STATS | grep -o '"change":[^,}]*'
else
  print_result 1 "Failed to retrieve weight statistics"
  echo "Response: $WEIGHT_STATS"
fi

# Step 11: Get all stats summary
echo ""
echo -e "${YELLOW}[11/15] Getting all stats summary...${NC}"
ALL_STATS=$(curl -s -X GET "$BASE_URL/progress/stats" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

STATS_ARRAY=$(echo $ALL_STATS | grep -o '"stats":\[')

if [ -n "$STATS_ARRAY" ]; then
  print_result 0 "Retrieved all stats summary"
else
  print_result 1 "Failed to retrieve all stats"
  echo "Response: $ALL_STATS"
fi

# Step 12: Get weight history with trend
echo ""
echo -e "${YELLOW}[12/15] Getting weight history with trend...${NC}"
WEIGHT_HISTORY=$(curl -s -X GET "$BASE_URL/progress/history/weight" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

TREND=$(echo $WEIGHT_HISTORY | grep -o '"trend":"[^"]*' | sed 's/"trend":"//')

if [ -n "$TREND" ]; then
  print_result 0 "Retrieved weight history (trend: $TREND)"
else
  print_result 1 "Failed to retrieve weight history"
  echo "Response: $WEIGHT_HISTORY"
fi

# Step 13: Test pagination
echo ""
echo -e "${YELLOW}[13/15] Testing pagination (limit=2)...${NC}"
PAGINATED=$(curl -s -X GET "$BASE_URL/progress/metrics?limit=2" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

RETURNED_COUNT=$(echo $PAGINATED | grep -o '"metrics":\[.*\]' | grep -o '"id":"[^"]*' | wc -l)

if [ "$RETURNED_COUNT" -le 2 ]; then
  print_result 0 "Pagination working (returned: $RETURNED_COUNT items)"
else
  print_result 1 "Pagination not working correctly"
fi

# Step 14: Test authentication required
echo ""
echo -e "${YELLOW}[14/15] Testing authentication required...${NC}"
UNAUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/progress/metrics")
HTTP_CODE=$(echo "$UNAUTH_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
  print_result 0 "Authentication required (401)"
else
  print_result 1 "Authentication not enforced (HTTP $HTTP_CODE)"
fi

# Step 15: Delete a metric
echo ""
echo -e "${YELLOW}[15/15] Deleting a metric...${NC}"
DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/progress/metrics/$WELLNESS_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
  print_result 0 "Metric deleted successfully"
else
  print_result 1 "Failed to delete metric (HTTP $HTTP_CODE)"
fi

# Final results
echo ""
echo "=========================================="
echo "Test Results Summary"
echo "=========================================="
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed! 🎉${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Please check the output above.${NC}"
  exit 1
fi
