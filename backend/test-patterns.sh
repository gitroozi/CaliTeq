#!/bin/bash
echo "Movement Pattern Exercise Summary:"
echo "=================================="
for pattern in horizontal_push horizontal_pull vertical_push vertical_pull squat hinge core_stability; do
  count=$(curl -s "http://localhost:3000/api/exercises?pattern=$pattern&limit=100" | jq '.data | length')
  echo "$pattern: $count exercises"
done
