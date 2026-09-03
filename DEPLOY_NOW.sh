#!/bin/bash

echo "🚀 Deploying Order Dashboard Fix to Production"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking current status...${NC}"
git status

echo ""
echo -e "${BLUE}Step 2: Pulling latest changes from GitHub...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed! Please fix conflicts and try again.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Code updated successfully!${NC}"

echo ""
echo -e "${BLUE}Step 3: Installing dependencies (if any new)...${NC}"
npm install

echo ""
echo -e "${BLUE}Step 4: Building Next.js application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Check errors above.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"

echo ""
echo -e "${BLUE}Step 5: Checking PM2 status...${NC}"
pm2 status

echo ""
echo -e "${BLUE}Step 6: Restarting application...${NC}"
pm2 restart icemanz

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ PM2 restart failed! Trying alternative...${NC}"
    pm2 stop icemanz
    pm2 start icemanz
fi

echo ""
echo -e "${GREEN}✅ Application restarted successfully!${NC}"

echo ""
echo -e "${BLUE}Step 7: Checking application status...${NC}"
pm2 status icemanz

echo ""
echo -e "${BLUE}Step 8: Tailing logs (press Ctrl+C to exit)...${NC}"
sleep 2
pm2 logs icemanz --lines 20

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Test checkout on https://icemanz.com"
echo "2. Check admin dashboard for new orders"
echo "3. Verify webhook logs in Stripe dashboard"
echo ""
