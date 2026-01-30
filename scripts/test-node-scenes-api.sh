#!/bin/bash
# Test script for /api/node-scenes endpoint

API_URL="http://localhost:3000/api/node-scenes"

echo "Testing /api/node-scenes API endpoint..."
echo ""

# Test 1: London (Q84) - should have 8 appearances
echo "Test 1: London (Q84) - expecting 8 appearances"
curl -s "${API_URL}?wikidataId=Q84" | jq -r '.totalAppearances'
echo ""

# Test 2: Paris (Q90) - should have 7 appearances
echo "Test 2: Paris (Q90) - expecting 7 appearances"
curl -s "${API_URL}?wikidataId=Q90" | jq -r '.totalAppearances'
echo ""

# Test 3: Isaac Newton (Q935) - should have 3 appearances
echo "Test 3: Isaac Newton (Q935) - expecting 3 appearances"
curl -s "${API_URL}?wikidataId=Q935" | jq -r '.totalAppearances'
echo ""

# Test 4: Batch lookup
echo "Test 4: Batch lookup - Q84,Q90,Q935"
curl -s "${API_URL}?wikidataIds=Q84,Q90,Q935" | jq '{
  "Q84": .results.Q84.totalAppearances,
  "Q90": .results.Q90.totalAppearances,
  "Q935": .results.Q935.totalAppearances,
  "notFound": .notFound
}'
echo ""

# Test 5: Not found
echo "Test 5: Not found entity"
curl -s "${API_URL}?wikidataId=Q999999999" | jq -r '.totalAppearances'
echo ""

# Test 6: Wikipedia title lookup
echo "Test 6: Wikipedia title lookup - Isaac_Newton"
curl -s "${API_URL}?wikipediaTitle=Isaac_Newton" | jq -r '.totalAppearances'
echo ""

echo "✅ Tests complete!"
