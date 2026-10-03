#!/bin/bash

echo "🚀 Deploying to VPS..."

rsync -avz --progress \
  --exclude='.env' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='data' \
  /Users/user/Desktop/icemanz/ \
  root@2.25.175.36:/var/www/html/ICEMANZV2/

echo "✅ Deploy complete!"
