# Stripe Webhook Setup Guide - URGENT FIX

## ⚠️ PROBLEM IDENTIFIED

**Payment successful হচ্ছে কিন্তু order dashboard-এ আসছে না কারণ:**
- `.env` file-এ `STRIPE_WEBHOOK_SECRET` comment করা আছে
- Webhook properly configure করা নেই
- Stripe webhook event receive করতে পারছে না

---

## 🔧 IMMEDIATE FIX NEEDED

### Step 1: Stripe Webhook Configure করুন

#### Option A: Production Webhook (Recommended for Live Site)

1. **Stripe Dashboard-এ যান:**
   - https://dashboard.stripe.com/test/webhooks (Test Mode)
   - অথবা https://dashboard.stripe.com/webhooks (Live Mode)

2. **"Add endpoint" button click করুন**

3. **Webhook endpoint URL দিন:**
   ```
   https://icemanz.com/api/webhook/stripe
   ```

4. **Events select করুন:**
   - `payment_intent.succeeded` ✅ (এটা অবশ্যই)
   - `checkout.session.completed` ✅ (optional, invoice flow-র জন্য)

5. **"Add endpoint" click করুন**

6. **Signing secret copy করুন:**
   - Webhook details page-এ যান
   - "Signing secret" section-এ `whsec_...` দিয়ে শুরু হওয়া key copy করুন
   - এটা `.env` file-এ add করুন

7. **.env file update করুন:**
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_your_actual_secret_here"
   ```
   (comment # সরিয়ে দিন)

8. **Server restart করুন**

---

#### Option B: Local Testing (Development Only)

If you want to test locally first:

1. **Stripe CLI install করুন:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Stripe CLI login করুন:**
   ```bash
   stripe login
   ```

3. **Webhook forward করুন:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

4. **Terminal-এ দেখানো webhook secret copy করুন:**
   ```
   > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```

5. **.env file-এ add করুন:**
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
   ```

6. **Another terminal-এ dev server run করুন:**
   ```bash
   npm run dev
   ```

7. **Test checkout করুন**

---

## ✅ Verification Steps

### After setting up webhook:

1. **Check .env file:**
   ```bash
   cat .env | grep STRIPE_WEBHOOK_SECRET
   ```
   Should show: `STRIPE_WEBHOOK_SECRET="whsec_..."`

2. **Restart server (IMPORTANT!):**
   ```bash
   # If using PM2
   pm2 restart icemanz
   
   # If using other process manager
   # Kill and restart the process
   ```

3. **Test a checkout:**
   - Add item to cart
   - Complete checkout with test card
   - Check admin dashboard

4. **Check webhook logs in Stripe:**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook endpoint
   - Check "Events" tab
   - Should see `payment_intent.succeeded` events
   - Status should be "Success" (green checkmark)

5. **Check server logs:**
   ```bash
   # Look for these logs:
   [WEBHOOK] Direct checkout payment received
   [WEBHOOK] Customer: { ... }
   [WEBHOOK] Invoice request created: invoice-id
   [WEBHOOK] Order created: order-id
   ```

---

## 🐛 Troubleshooting

### Webhook receiving events but returning error:

**Check server logs for:**
```
Webhook Error: No signatures found matching the expected signature
```

**Fix:** Update `STRIPE_WEBHOOK_SECRET` with correct signing secret

---

### Webhook not receiving events:

**Check:**
1. Webhook URL is correct: `https://icemanz.com/api/webhook/stripe`
2. Events `payment_intent.succeeded` is selected
3. Server is running and accessible from internet

---

### Orders still not appearing:

**Debug steps:**

1. **Check database connection:**
   ```bash
   npm run prisma studio
   ```
   Look for:
   - InvoiceRequest table - should have new entries
   - Order table - should have new entries

2. **Check webhook handler:**
   ```typescript
   // In /src/app/api/webhook/stripe/route.ts
   console.log('[WEBHOOK] Event received:', event.type);
   console.log('[WEBHOOK] Payment Intent ID:', paymentIntent.id);
   ```

3. **Test webhook manually:**
   - Stripe Dashboard → Webhooks → Your endpoint
   - Click "Send test webhook"
   - Select `payment_intent.succeeded`
   - Check if order is created

---

## 📝 Current Environment Status

**From your .env file:**
- ✅ Database: Connected to VPS
- ✅ Stripe Secret Key: Present
- ✅ Stripe Publishable Key: Present
- ❌ Webhook Secret: **COMMENTED OUT** (এটাই problem!)
- ✅ SMTP: Configured

**Action Required:**
1. Uncomment `STRIPE_WEBHOOK_SECRET` line
2. Add actual webhook signing secret
3. Restart server

---

## 🎯 Expected Result After Fix

After properly setting up webhook:

1. Customer completes checkout → ✅
2. Stripe sends `payment_intent.succeeded` event → ✅
3. Webhook receives event → ✅
4. Order created in database → ✅
5. Order appears in admin dashboard → ✅
6. Confirmation email sent → ✅

---

## 🚨 PRIORITY ACTION

**DO THIS NOW:**

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://icemanz.com/api/webhook/stripe`
3. Select event: `payment_intent.succeeded`
4. Copy signing secret
5. Update `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_your_secret_here"
   ```
6. Restart server
7. Test checkout

**This will fix your issue immediately!**
