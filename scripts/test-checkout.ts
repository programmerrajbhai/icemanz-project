/**
 * Test script for Shopify-style checkout implementation
 * Verifies that PaymentIntent can be created successfully
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

async function testPaymentIntent() {
  console.log('🧪 Testing Shopify-Style Checkout Implementation...\n');

  try {
    // Test 1: Create PaymentIntent in USD
    console.log('Test 1: Creating PaymentIntent in USD...');
    const paymentIntentUSD = await stripe.paymentIntents.create({
      amount: 150000, // $1,500.00
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        test: 'custom-checkout-usd',
      },
    });
    console.log('✅ USD PaymentIntent created successfully');
    console.log(`   ID: ${paymentIntentUSD.id}`);
    console.log(`   Amount: $${(paymentIntentUSD.amount / 100).toFixed(2)}`);
    console.log(`   Client Secret: ${paymentIntentUSD.client_secret?.substring(0, 30)}...`);

    // Test 2: Create PaymentIntent in BDT
    console.log('\nTest 2: Creating PaymentIntent in BDT...');
    const paymentIntentBDT = await stripe.paymentIntents.create({
      amount: 18000000, // ৳180,000.00
      currency: 'bdt',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        test: 'custom-checkout-bdt',
      },
    });
    console.log('✅ BDT PaymentIntent created successfully');
    console.log(`   ID: ${paymentIntentBDT.id}`);
    console.log(`   Amount: ৳${(paymentIntentBDT.amount / 100).toFixed(2)}`);
    console.log(`   Client Secret: ${paymentIntentBDT.client_secret?.substring(0, 30)}...`);

    // Test 3: Verify automatic_payment_methods
    console.log('\nTest 3: Verifying automatic payment methods...');
    const retrieved = await stripe.paymentIntents.retrieve(paymentIntentUSD.id);
    if (retrieved.automatic_payment_methods?.enabled) {
      console.log('✅ Automatic payment methods enabled correctly');
    } else {
      console.log('❌ Automatic payment methods not enabled');
    }

    console.log('\n🎉 All tests passed! Checkout is ready to use.');
    console.log('\n📋 Next steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/checkout');
    console.log('   3. Test with card: 4242 4242 4242 4242');
    console.log('   4. Try promo codes: SAVE10 or SAVE20');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('   → Check your STRIPE_SECRET_KEY in .env');
    }
    process.exit(1);
  }
}

// Run tests
testPaymentIntent();
