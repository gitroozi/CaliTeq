#!/bin/bash

echo "🧪 Testing CaliTeq Exercise Library Endpoints"
echo "=============================================="
echo ""

echo "✅ 1. Testing GET /api/movement-patterns..."
PATTERNS_RESPONSE=$(curl -s http://localhost:3000/api/movement-patterns)
echo "$PATTERNS_RESPONSE"
echo ""

echo "✅ 2. Testing GET /api/exercises (all exercises, first page)..."
EXERCISES_RESPONSE=$(curl -s "http://localhost:3000/api/exercises?page=1&limit=5")
echo "$EXERCISES_RESPONSE"
echo ""

echo "✅ 3. Testing GET /api/exercises with filters (push pattern, difficulty 3-5)..."
FILTERED_RESPONSE=$(curl -s "http://localhost:3000/api/exercises?pattern=push&minDifficulty=3&maxDifficulty=5")
echo "$FILTERED_RESPONSE"
echo ""

echo "✅ 4. Testing GET /api/exercises with noEquipment filter..."
NO_EQUIPMENT_RESPONSE=$(curl -s "http://localhost:3000/api/exercises?noEquipment=true")
echo "$NO_EQUIPMENT_RESPONSE"
echo ""

echo "✅ 5. Testing GET /api/exercises/search?q=push..."
SEARCH_RESPONSE=$(curl -s "http://localhost:3000/api/exercises/search?q=push")
echo "$SEARCH_RESPONSE"
echo ""

# Get first exercise ID from the exercises list for detailed testing
FIRST_EXERCISE_ID=$(echo "$EXERCISES_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$FIRST_EXERCISE_ID" ]; then
  echo "✅ 6. Testing GET /api/exercises/:id (ID: $FIRST_EXERCISE_ID)..."
  EXERCISE_DETAIL=$(curl -s "http://localhost:3000/api/exercises/$FIRST_EXERCISE_ID")
  echo "$EXERCISE_DETAIL"
  echo ""

  echo "✅ 7. Testing GET /api/exercises/:id/progression-chain..."
  PROGRESSION_CHAIN=$(curl -s "http://localhost:3000/api/exercises/$FIRST_EXERCISE_ID/progression-chain")
  echo "$PROGRESSION_CHAIN"
  echo ""
else
  echo "⚠️  Skipping exercise detail tests (no exercises found)"
  echo ""
fi

echo "✅ 8. Testing GET /api/movement-patterns/:pattern/exercises (push pattern)..."
PATTERN_EXERCISES=$(curl -s "http://localhost:3000/api/movement-patterns/push/exercises")
echo "$PATTERN_EXERCISES"
echo ""

echo "✅ 9. Testing pagination (page 1 with limit 2)..."
PAGINATION_RESPONSE=$(curl -s "http://localhost:3000/api/exercises?page=1&limit=2")
echo "$PAGINATION_RESPONSE"
echo ""

echo "✅ 10. Testing invalid endpoint (should return 404)..."
NOT_FOUND_RESPONSE=$(curl -s "http://localhost:3000/api/exercises/invalid-id-that-does-not-exist")
echo "$NOT_FOUND_RESPONSE"
echo ""

echo "✅ All exercise tests completed!"
