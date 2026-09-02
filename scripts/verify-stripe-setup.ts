#!/usr/bin/env tsx

/**
 * Stripe Setup Verification Script
 * Run with: npx tsx scripts/verify-stripe-setup.ts
 */

import Stripe from 'stripe';
import { config } from 'dotenv';

// Load environment variables
config();

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
];

const OPTIONAL_ENV_VARS = [
  'STRIPE_WEBHOOK_SECRET',
];

console.log('🔍 Verifying Stripe Setup...\n');

// Check environment variables
console.log('📋 Environment Variables:');
let hasErrors = false;

for (const envVar of REQUIRED_ENV_VARS) {
  const value = process.env[envVar];
  if (!value) {
    console.log(`   ❌ ${envVar}: Missing`);
    hasErrors = true;
  } else {
    const masked = value.substring(0, 12) + '...' + value.substring(value.length - 4);
    console.log(`   ✅ ${envVar}: ${masked}`);
  }
}

for (const envVar of OPTIONAL_ENV_VARS) {
  const value = process.env[envVar];
  if (!value) {
    console.log(`   ⚠️  ${envVar}: Not set (optional)`);
  } else {
    const masked = value.substring(0, 12) + '...';
    console.log(`   ✅ ${envVar}: ${masked}`);
  }
}

if (hasErrors) {
  console.log('\n❌ Missing required environment variables!');
  console.log('   Please add them to your .env file\n');
  process.exit(1);
}

// Verify Stripe keys
console.log('\n🔑 Verifying Stripe Keys...');

const secretKey = process.env.STRIPE_SECRET_KEY!;
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

// Check if keys are in test mode
const isTestMode = secretKey.includes('_test_');
console.log(`   Mode: ${isTestMode ? '🧪 Test Mode' : '🚀 Live Mode'}`);

if (!isTestMode) {
  console.log('   ⚠️  WARNING: Using LIVE keys! Be careful with real payments.\n');
}

// Initialize Stripe and test connection
try {
  const stripe = new Stripe(secretKey, {
    apiVersion: '2026-03-25.dahlia',
    typescript: true,
  });

  console.log('\n🌐 Testing Stripe API Connection...');

  // Try to list payment methods to test connection
  const paymentMethods = await stripe.paymentMethods.list({
    limit: 1,
  });

  console.log(`   ✅ Successfully connected to Stripe API`);
  console.log(`   Test Mode: ${isTestMode ? 'Yes' : 'No'}`);

  // Test creating a payment intent
  console.log('\n🧪 Testing Payment Intent Creation...');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: false,
    },
    payment_method_types: ['card'],
  });

  console.log(`   ✅ Test Payment Intent created: ${paymentIntent.id}`);
  console.log(`   Client Secret: ${paymentIntent.client_secret?.substring(0, 20)}...`);

  console.log('\n✨ All checks passed! Your Stripe setup is ready.\n');
  console.log('📚 Next Steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Visit test page: http://localhost:3000/test-checkout');
  console.log('   3. Try checkout: http://localhost:3000/checkout');
  console.log('   4. Use test card: 4242 4242 4242 4242\n');

} catch (error) {
  console.log('\n❌ Stripe API Error:');

  if (error instanceof Stripe.errors.StripeError) {
    console.log(`   Error Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);

    if (error.type === 'StripeAuthenticationError') {
      console.log('\n   💡 Your API key appears to be invalid.');
      console.log('   Please check your .env file and verify the key.\n');
    }
  } else {
    console.log(`   ${error instanceof Error ? error.message : 'Unknown error'}\n`);
  }

  process.exit(1);
}

// Check webhook setup
console.log('🪝 Webhook Configuration:');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.log('   ⚠️  Webhook secret not configured');
  console.log('   This is optional for local development');
  console.log('   Required for production webhook verification\n');
  console.log('   To set up webhooks:');
  console.log('   1. Go to https://dashboard.stripe.com/webhooks');
  console.log('   2. Create endpoint: /api/webhooks/stripe');
  console.log('   3. Copy signing secret to STRIPE_WEBHOOK_SECRET\n');
} else {
  console.log('   ✅ Webhook secret configured');
  console.log(`   Secret: ${webhookSecret.substring(0, 12)}...\n`);
}

console.log('🎉 Setup verification complete!\n');
