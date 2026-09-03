# 🔐 Stripe Webhook Secret Setup - Step by Step

## আপনি যেহেতু Stripe webhook already setup করেছেন, এখন শুধু secret add করতে হবে।

---

## 📋 Step 1: Stripe Dashboard থেকে Webhook Secret নিন

### Test Mode Webhook:
1. যান: https://dashboard.stripe.com/test/webhooks
2. আপনার webhook endpoint click করুন
3. "Signing secret" section দেখুন
4. "Reveal" button click করুন অথবা copy করুন
5. Secret এরকম দেখাবে: `whsec_xxxxxxxxxxxxxxxxxxxxxx`

### Live Mode Webhook (যদি production এ থাকে):
1. যান: https://dashboard.stripe.com/webhooks
2. Same process follow করুন

---

## 📝 Step 2: .env File Update করুন

Current .env file এ line 19 এ আছে:
```env
# STRIPE_WEBHOOK_SECRET="whsec_..." # Required for production webhooks
```

### এটাকে এভাবে change করুন:

```env
STRIPE_WEBHOOK_SECRET="whsec_your_actual_secret_here"
```

**Important**: 
- `#` (comment) সরিয়ে দিন
- আপনার actual secret paste করুন
- Quotes এর মধ্যে রাখুন

### Complete Example:

```env
# Stripe (Required for all payments)
STRIPE_SECRET_KEY="sk_test_51SJFMCFEpcWMShKN8wDOU2ZbTv9tUiXtdloyNDLIGwe5GqurWPUqwtAQgHawI4tFbwW2mto92COvFAJ8G4SVwZrN00zJ2ki2NS"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51SJFMCFEpcWMShKNl6iIbD8dj23iHZWQcugxMTx7mg4ogJn83fbP3cPvUYuW0kxmU043RS62h5uPgkk6GG10VRH100UxXm8ZXf"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## 🔄 Step 3: Server Restart করুন

.env file change করার পর **অবশ্যই** server restart করতে হবে:

```bash
# PM2 use করলে:
pm2 restart icemanz

# অথবা stop করে start:
pm2 stop icemanz
pm2 start icemanz

# অথবা সব process restart:
pm2 restart all
```

---

## ✅ Step 4: Verify Webhook Configuration

### Stripe Dashboard এ check করুন:

1. **Endpoint URL verify করুন:**
   ```
   https://icemanz.com/api/webhook/stripe
   ```

2. **Events check করুন - এই events select করা থাকতে হবে:**
   - ✅ `payment_intent.succeeded` (অবশ্যই)
   - ✅ `checkout.session.completed` (optional)

3. **Status check করুন:**
   - Endpoint status: "Active" or "Enabled"

---

## 🧪 Step 5: Test Webhook

### Option A: Stripe Dashboard থেকে Test

1. Webhook endpoint এ যান
2. "Send test webhook" button click করুন
3. Event select করুন: `payment_intent.succeeded`
4. "Send test webhook" click করুন
5. Response দেখুন - Should be 200 OK

### Option B: Real Checkout Test

1. Website এ যান: https://icemanz.com
2. Product cart এ add করুন
3. Checkout complete করুন (test card: 4242 4242 4242 4242)
4. Success page দেখুন
5. Admin dashboard check করুন: `/admin/orders/walk-in-cooler-freezer`

---

## 🔍 Check Webhook Logs

### Stripe Dashboard এ:
1. Webhooks → Your endpoint
2. "Recent events" tab
3. Latest event click করুন
4. দেখুন:
   - Status: ✅ Success (green checkmark)
   - Response code: 200
   - Response body: `{"received":true}`

### Server Logs:
```bash
pm2 logs icemanz --lines 50

# Look for:
[WEBHOOK] payment_intent.succeeded received
[WEBHOOK] Direct checkout payment received
[WEBHOOK] Customer: {...}
[WEBHOOK] Invoice request created: xxx
[WEBHOOK] Order created: xxx
```

---

## ❌ Common Issues & Solutions

### Issue 1: Webhook returning 500 error

**Reason**: Webhook secret not set properly

**Solution**:
```bash
# Check .env
cat .env | grep STRIPE_WEBHOOK_SECRET

# Should show:
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# NOT:
# STRIPE_WEBHOOK_SECRET="whsec_..." (commented)
```

### Issue 2: "No signatures found matching"

**Reason**: Wrong webhook secret

**Solution**:
- Get fresh secret from Stripe dashboard
- Update .env
- Restart server

### Issue 3: Webhook receives event but order not created

**Reason**: Database connection or code error

**Solution**:
```bash
# Check server logs for errors
pm2 logs icemanz --lines 100 --err

# Check database connection
npx prisma studio
```

---

## 🎯 Expected Behavior After Fix

### When customer completes checkout:

1. **Stripe sends webhook** to your endpoint
   ```
   POST https://icemanz.com/api/webhook/stripe
   Event: payment_intent.succeeded
   ```

2. **Your webhook handler:**
   - ✅ Validates signature with webhook secret
   - ✅ Extracts payment intent
   - ✅ Gets customer info from billing details
   - ✅ Gets shipping info (if applicable)
   - ✅ Creates InvoiceRequest in database
   - ✅ Creates Order in database
   - ✅ Sends confirmation email

3. **Result:**
   - ✅ Order appears in dashboard
   - ✅ Customer receives email
   - ✅ All data properly saved

---

## 🔐 Security Note

**আপনার webhook secret কাউকে share করবেন না!**

- এটা `.env` file এ রাখুন
- Git এ commit করবেন না (already .gitignore এ আছে)
- Production ও development এ different secret use করুন

---

## 📞 Quick Reference

```bash
# 1. Get webhook secret from Stripe
https://dashboard.stripe.com/test/webhooks

# 2. Update .env
nano .env  # or vim, or any editor

# 3. Add this line (uncommented):
STRIPE_WEBHOOK_SECRET="whsec_your_secret_here"

# 4. Save and restart
pm2 restart icemanz

# 5. Test checkout
# Go to https://icemanz.com and complete a purchase

# 6. Verify
# Check dashboard: /admin/orders/walk-in-cooler-freezer
```

---

## 🎉 That's It!

এই steps follow করলেই webhook কাজ করবে এবং order dashboard এ আসবে!

**Both solutions (webhook + direct API) থাকবে - double backup! 💪**
