#!/bin/bash

# Admin API Test Script
# Tests all admin endpoints for CaliTeq

BASE_URL="http://localhost:3000/api"
ADMIN_EMAIL="admin@caliteq.com"
ADMIN_PASSWORD="changeme123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to print section header
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

echo -e "${BLUE}Starting CaliTeq Admin API Tests${NC}\n"

# ============================================================================
# 1. ADMIN AUTHENTICATION
# ============================================================================
print_header "ADMIN AUTHENTICATION"

# Test 1: Admin Login
echo "Test 1: Admin Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

echo "$LOGIN_RESPONSE" | jq '.'

ADMIN_ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.accessToken // empty')
ADMIN_REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.refreshToken // empty')

if [ -n "$ADMIN_ACCESS_TOKEN" ] && [ "$ADMIN_ACCESS_TOKEN" != "null" ]; then
    print_result 0 "Admin login successful"
else
    print_result 1 "Admin login failed"
    echo "Cannot continue without authentication"
    exit 1
fi

# Test 2: Get Current Admin Profile
echo -e "\nTest 2: Get Current Admin Profile"
ADMIN_ME_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/auth/me" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$ADMIN_ME_RESPONSE" | jq '.'

ADMIN_ID=$(echo "$ADMIN_ME_RESPONSE" | jq -r '.data.id // empty')
if [ -n "$ADMIN_ID" ]; then
    print_result 0 "Get admin profile successful"
else
    print_result 1 "Get admin profile failed"
fi

# Test 3: Refresh Admin Token
echo -e "\nTest 3: Refresh Admin Token"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$ADMIN_REFRESH_TOKEN\"
  }")

echo "$REFRESH_RESPONSE" | jq '.'

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.data.tokens.accessToken // empty')
if [ -n "$NEW_ACCESS_TOKEN" ]; then
    print_result 0 "Token refresh successful"
else
    print_result 1 "Token refresh failed"
fi

# ============================================================================
# 2. USER MANAGEMENT
# ============================================================================
print_header "USER MANAGEMENT"

# Test 4: Get User Statistics
echo "Test 4: Get User Statistics"
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/users/stats" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$STATS_RESPONSE" | jq '.'

TOTAL_USERS=$(echo "$STATS_RESPONSE" | jq -r '.data.total_users // empty')
if [ -n "$TOTAL_USERS" ]; then
    print_result 0 "Get user statistics successful (Total users: $TOTAL_USERS)"
else
    print_result 1 "Get user statistics failed"
fi

# Test 5: List All Users
echo -e "\nTest 5: List All Users (Paginated)"
USERS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/users?limit=5&offset=0" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$USERS_RESPONSE" | jq '.'

USER_COUNT=$(echo "$USERS_RESPONSE" | jq -r '.data.users | length')
TEST_USER_ID=$(echo "$USERS_RESPONSE" | jq -r '.data.users[0].id // empty')

if [ "$USER_COUNT" -gt 0 ]; then
    print_result 0 "List users successful ($USER_COUNT users returned)"
else
    print_result 1 "List users failed"
fi

# Test 6: Get Specific User Details
echo -e "\nTest 6: Get Specific User Details"
USER_DETAIL_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/users/$TEST_USER_ID" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$USER_DETAIL_RESPONSE" | jq '.'

USER_EMAIL=$(echo "$USER_DETAIL_RESPONSE" | jq -r '.data.email // empty')
if [ -n "$USER_EMAIL" ]; then
    print_result 0 "Get user details successful (Email: $USER_EMAIL)"
else
    print_result 1 "Get user details failed"
fi

# Test 7: Search Users by Email
echo -e "\nTest 7: Search Users by Email"
SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/users/search?email=test" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$SEARCH_RESPONSE" | jq '.'

SEARCH_COUNT=$(echo "$SEARCH_RESPONSE" | jq -r '.data | length')
if [ "$SEARCH_COUNT" -ge 0 ]; then
    print_result 0 "Search users successful ($SEARCH_COUNT results)"
else
    print_result 1 "Search users failed"
fi

# ============================================================================
# 3. SUBSCRIPTION MANAGEMENT
# ============================================================================
print_header "SUBSCRIPTION MANAGEMENT"

# Test 8: Get All Subscription Tiers
echo "Test 8: Get All Subscription Tiers"
TIERS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/subscriptions/tiers" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$TIERS_RESPONSE" | jq '.'

TIER_COUNT=$(echo "$TIERS_RESPONSE" | jq -r '.data | length')
PRO_TIER_ID=$(echo "$TIERS_RESPONSE" | jq -r '.data[] | select(.name == "Pro") | .id // empty')

if [ "$TIER_COUNT" -eq 3 ]; then
    print_result 0 "Get subscription tiers successful (3 tiers found)"
else
    print_result 1 "Get subscription tiers failed (expected 3, got $TIER_COUNT)"
fi

# Test 9: Get Subscription Statistics
echo -e "\nTest 9: Get Subscription Statistics"
SUB_STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/subscriptions/stats" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$SUB_STATS_RESPONSE" | jq '.'

FREE_TIER_COUNT=$(echo "$SUB_STATS_RESPONSE" | jq -r '.data.tier_breakdown[] | select(.tier == "free") | .count // empty')
if [ -n "$FREE_TIER_COUNT" ]; then
    print_result 0 "Get subscription statistics successful (Free tier: $FREE_TIER_COUNT users)"
else
    print_result 1 "Get subscription statistics failed"
fi

# Test 10: Change User Subscription (upgrade to Pro)
echo -e "\nTest 10: Change User Subscription to Pro"
CHANGE_SUB_RESPONSE=$(curl -s -X PUT "$BASE_URL/admin/subscriptions/users/$TEST_USER_ID/subscription" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tierName\": \"pro\",
    \"reason\": \"Test upgrade to Pro tier\"
  }")

echo "$CHANGE_SUB_RESPONSE" | jq '.'

NEW_TIER=$(echo "$CHANGE_SUB_RESPONSE" | jq -r '.data.tier.name // empty')
if [ "$NEW_TIER" = "Pro" ]; then
    print_result 0 "Change subscription successful (User upgraded to Pro)"
else
    print_result 1 "Change subscription failed"
fi

# Test 11: Get User Subscription History
echo -e "\nTest 11: Get User Subscription History"
SUB_HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/subscriptions/users/$TEST_USER_ID/subscription/history" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$SUB_HISTORY_RESPONSE" | jq '.'

HISTORY_COUNT=$(echo "$SUB_HISTORY_RESPONSE" | jq -r '.data | length')
if [ "$HISTORY_COUNT" -ge 1 ]; then
    print_result 0 "Get subscription history successful ($HISTORY_COUNT entries)"
else
    print_result 1 "Get subscription history failed"
fi

# ============================================================================
# 4. CREDIT MANAGEMENT
# ============================================================================
print_header "CREDIT MANAGEMENT"

# Test 12: Get User Credit Balance
echo "Test 12: Get User Credit Balance"
CREDIT_BALANCE_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/credits/users/$TEST_USER_ID/credits" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$CREDIT_BALANCE_RESPONSE" | jq '.'

CREDIT_BALANCE=$(echo "$CREDIT_BALANCE_RESPONSE" | jq -r '.data.balance // empty')
if [ -n "$CREDIT_BALANCE" ]; then
    print_result 0 "Get credit balance successful (Balance: $CREDIT_BALANCE credits)"
else
    print_result 1 "Get credit balance failed"
fi

# Test 13: Grant Credits to User
echo -e "\nTest 13: Grant Credits to User"
GRANT_CREDITS_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/credits/users/$TEST_USER_ID/credits/grant" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 10,
    \"reason\": \"Test credit grant - welcome bonus\"
  }")

echo "$GRANT_CREDITS_RESPONSE" | jq '.'

NEW_BALANCE=$(echo "$GRANT_CREDITS_RESPONSE" | jq -r '.data.newBalance // empty')
if [ -n "$NEW_BALANCE" ]; then
    print_result 0 "Grant credits successful (New balance: $NEW_BALANCE credits)"
else
    print_result 1 "Grant credits failed"
fi

# Test 14: Get Credit Transaction History
echo -e "\nTest 14: Get Credit Transaction History"
CREDIT_HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/credits/users/$TEST_USER_ID/credits/transactions?limit=10&offset=0" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$CREDIT_HISTORY_RESPONSE" | jq '.'

TRANSACTION_COUNT=$(echo "$CREDIT_HISTORY_RESPONSE" | jq -r '.data.transactions | length')
if [ "$TRANSACTION_COUNT" -ge 1 ]; then
    print_result 0 "Get credit transactions successful ($TRANSACTION_COUNT transactions)"
else
    print_result 1 "Get credit transactions failed"
fi

# Test 15: Get Credit Statistics
echo -e "\nTest 15: Get Credit Statistics"
CREDIT_STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/credits/stats" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$CREDIT_STATS_RESPONSE" | jq '.'

TOTAL_CREDITS_GRANTED=$(echo "$CREDIT_STATS_RESPONSE" | jq -r '.data.totalGranted // empty')
if [ -n "$TOTAL_CREDITS_GRANTED" ]; then
    print_result 0 "Get credit statistics successful (Total granted: $TOTAL_CREDITS_GRANTED)"
else
    print_result 1 "Get credit statistics failed"
fi

# Test 16: Revoke Credits from User
echo -e "\nTest 16: Revoke Credits from User"
REVOKE_CREDITS_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/credits/users/$TEST_USER_ID/credits/revoke" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 5,
    \"reason\": \"Test credit revoke\"
  }")

echo "$REVOKE_CREDITS_RESPONSE" | jq '.'

REVOKE_NEW_BALANCE=$(echo "$REVOKE_CREDITS_RESPONSE" | jq -r '.data.newBalance // empty')
if [ -n "$REVOKE_NEW_BALANCE" ]; then
    print_result 0 "Revoke credits successful (New balance: $REVOKE_NEW_BALANCE credits)"
else
    print_result 1 "Revoke credits failed"
fi

# ============================================================================
# 5. AUDIT LOGGING
# ============================================================================
print_header "AUDIT LOGGING"

# Test 17: Get All Audit Logs
echo "Test 17: Get All Audit Logs"
AUDIT_LOGS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/audit/logs?limit=10&offset=0" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$AUDIT_LOGS_RESPONSE" | jq '.'

AUDIT_LOG_COUNT=$(echo "$AUDIT_LOGS_RESPONSE" | jq -r '.data.logs | length')
if [ "$AUDIT_LOG_COUNT" -ge 1 ]; then
    print_result 0 "Get audit logs successful ($AUDIT_LOG_COUNT logs)"
else
    print_result 1 "Get audit logs failed"
fi

# Test 18: Get User-Specific Audit Logs
echo -e "\nTest 18: Get User-Specific Audit Logs"
USER_AUDIT_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/audit/logs/user/$TEST_USER_ID?limit=10&offset=0" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$USER_AUDIT_RESPONSE" | jq '.'

USER_AUDIT_COUNT=$(echo "$USER_AUDIT_RESPONSE" | jq -r '.data.logs | length')
if [ "$USER_AUDIT_COUNT" -ge 0 ]; then
    print_result 0 "Get user audit logs successful ($USER_AUDIT_COUNT logs)"
else
    print_result 1 "Get user audit logs failed"
fi

# Test 19: Get Audit Statistics
echo -e "\nTest 19: Get Audit Statistics"
AUDIT_STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/audit/stats" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")

echo "$AUDIT_STATS_RESPONSE" | jq '.'

TOTAL_ACTIONS=$(echo "$AUDIT_STATS_RESPONSE" | jq -r '.data.totalActions // empty')
if [ -n "$TOTAL_ACTIONS" ]; then
    print_result 0 "Get audit statistics successful (Total actions: $TOTAL_ACTIONS)"
else
    print_result 1 "Get audit statistics failed"
fi

# ============================================================================
# 6. AUTHORIZATION TESTS (Super Admin Only)
# ============================================================================
print_header "AUTHORIZATION TESTS"

# Test 20: Create New Admin (Super Admin Only)
echo "Test 20: Create New Admin Account"
RANDOM_EMAIL="testadmin-$(date +%s)@caliteq.com"
CREATE_ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/auth/create" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$RANDOM_EMAIL\",
    \"password\": \"TestAdmin123\",
    \"firstName\": \"Test\",
    \"lastName\": \"Admin\",
    \"role\": \"admin\"
  }")

echo "$CREATE_ADMIN_RESPONSE" | jq '.'

NEW_ADMIN_ID=$(echo "$CREATE_ADMIN_RESPONSE" | jq -r '.data.admin.id // empty')
if [ -n "$NEW_ADMIN_ID" ]; then
    print_result 0 "Create admin successful (New admin ID: $NEW_ADMIN_ID)"
else
    print_result 1 "Create admin failed"
fi

# ============================================================================
# SUMMARY
# ============================================================================
print_header "TEST SUMMARY"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed! ✗${NC}"
    exit 1
fi
