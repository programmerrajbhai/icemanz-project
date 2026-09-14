#!/bin/bash

# Import all Astra products in batches
echo "🚀 Starting batch import of all Astra products..."

BATCH_SIZE=100
TOTAL_PRODUCTS=642
START=0

while [ $START -lt $TOTAL_PRODUCTS ]; do
  echo ""
  echo "=================================================="
  echo "📦 Importing batch starting at index: $START"
  echo "=================================================="
  
  npm run import:astra $START $BATCH_SIZE
  
  if [ $? -ne 0 ]; then
    echo "❌ Error occurred at batch $START"
    exit 1
  fi
  
  START=$((START + BATCH_SIZE))
  
  # Small delay between batches
  sleep 2
done

echo ""
echo "🎉 All batches completed!"
echo "Running verification..."
npm run verify:astra
