#!/bin/bash

# Script to add Stripe Webhook Secret to .env file
# Usage: ./add-webhook-secret.sh whsec_your_secret_here

echo "🔐 Stripe Webhook Secret Setup Script"
echo "======================================"
echo ""

# Check if webhook secret is provided
if [ -z "$1" ]; then
    echo "❌ Error: Webhook secret not provided"
    echo ""
    echo "Usage: ./add-webhook-secret.sh whsec_your_secret_here"
    echo ""
    echo "Get your webhook secret from:"
    echo "  Test Mode: https://dashboard.stripe.com/test/webhooks"
    echo "  Live Mode: https://dashboard.stripe.com/webhooks"
    echo ""
    exit 1
fi

WEBHOOK_SECRET=$1

# Validate webhook secret format
if [[ ! $WEBHOOK_SECRET =~ ^whsec_ ]]; then
    echo "⚠️  Warning: Webhook secret should start with 'whsec_'"
    echo "You provided: $WEBHOOK_SECRET"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

echo "📝 Updating .env file..."
echo ""

# Backup .env file
cp .env .env.backup
echo "✅ Backup created: .env.backup"

# Check if STRIPE_WEBHOOK_SECRET already exists (uncommented)
if grep -q "^STRIPE_WEBHOOK_SECRET=" .env; then
    echo "⚠️  STRIPE_WEBHOOK_SECRET already exists in .env"
    echo ""
    read -p "Replace existing secret? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Replace existing
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=\"$WEBHOOK_SECRET\"|" .env
        else
            # Linux
            sed -i "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=\"$WEBHOOK_SECRET\"|" .env
        fi
        echo "✅ Webhook secret updated!"
    else
        echo "❌ Cancelled"
        exit 0
    fi
# Check if commented STRIPE_WEBHOOK_SECRET exists
elif grep -q "^# STRIPE_WEBHOOK_SECRET=" .env; then
    echo "Found commented STRIPE_WEBHOOK_SECRET, uncommenting and updating..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^# STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=\"$WEBHOOK_SECRET\"|" .env
    else
        # Linux
        sed -i "s|^# STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=\"$WEBHOOK_SECRET\"|" .env
    fi
    echo "✅ Webhook secret added!"
else
    # Add new line after NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    echo "Adding new STRIPE_WEBHOOK_SECRET line..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "/^NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=/a\\
STRIPE_WEBHOOK_SECRET=\"$WEBHOOK_SECRET\"
" .env
    else
        # Linux
        sed -i "/^NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=/a STRIPE_WEBHOOK_SECRET=\"$WEBHOOK_SECRET\"" .env
    fi
    echo "✅ Webhook secret added!"
fi

echo ""
echo "📋 Current Stripe configuration:"
echo "================================"
grep "^STRIPE_" .env
echo ""
echo "✅ Done!"
echo ""
echo "⚠️  Important: You MUST restart your server for changes to take effect!"
echo ""
echo "Restart commands:"
echo "  PM2:       pm2 restart icemanz"
echo "  Dev:       npm run dev"
echo "  Prod:      npm run build && pm2 restart icemanz"
echo ""
echo "🧪 Test your webhook:"
echo "  1. Complete a checkout on your website"
echo "  2. Check admin dashboard for new order"
echo "  3. Check Stripe dashboard webhook logs"
echo ""
