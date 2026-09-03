# ✅ Quick Setup Checklist

## আপনার Order Dashboard Fix এর জন্য সম্পূর্ণ Checklist

---

## 🎯 Option 1: Webhook Setup (Recommended)

### করতে হবে:

- [ ] **Step 1**: Stripe Dashboard এ যান
  - Test: https://dashboard.stripe.com/test/webhooks
  - Live: https://dashboard.stripe.com/webhooks

- [ ] **Step 2**: "+ Add endpoint" click করুন

- [ ] **Step 3**: এই URL দিন:
  ```
  https://icemanz.com/api/webhook/stripe
  ```

- [ ] **Step 4**: Event select করুন:
  - [x] `payment_intent.succeeded`

- [ ] **Step 5**: "Add endpoint" click করুন

- [ ] **Step 6**: Signing secret copy করুন
  ```
  whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx
  ```

- [ ] **Step 7**: .env file update করুন:
  ```bash
  # Line 19 এ এটা আছে:
  # STRIPE_WEBHOOK_SECRET="whsec_..."
  
  # এভাবে change করুন (# সরান):
  STRIPE_WEBHOOK_SECRET="whsec_your_actual_secret"
  ```

- [ ] **Step 8**: Save .env file

- [ ] **Step 9**: Server restart করুন:
  ```bash
  pm2 restart icemanz
  ```

- [ ] **Step 10**: Test করুন:
  - Stripe Dashboard → Send test webhook
  - অথবা real checkout complete করুন

- [ ] **Step 11**: Verify করুন:
  - Admin dashboard এ order দেখা যাচ্ছে কিনা
  - Email confirmation গেছে কিনা

---

## 🎯 Option 2: Direct API (Already Done - Backup)

আমি already একটা alternative solution implement করেছি যেটা webhook ছাড়াই কাজ করবে।

### Files Created:
- [x] `/src/app/api/create-order-from-payment/route.ts`
- [x] Updated `/src/app/checkout/success/page.tsx`

### কিভাবে কাজ করে:
- Success page automatically order create করে
- Payment verify করে Stripe API দিয়ে
- Webhook এর উপর depend করে না

### Deployment:
- [ ] Git commit & push করুন:
  ```bash
  git add .
  git commit -m "Fix: Order creation with webhook + backup API"
  git push
  ```

- [ ] Server এ pull করুন:
  ```bash
  ssh your-server
  cd /path/to/icemanz
  git pull
  ```

- [ ] Build & restart:
  ```bash
  npm run build
  pm2 restart icemanz
  ```

---

## 🎯 Recommended Approach

**উভয়টাই করুন!**

1. ✅ Webhook setup করুন (primary method)
2. ✅ Direct API deploy করুন (backup method)

**এতে double guarantee থাকবে যে order create হবে!**

---

## 📊 Testing Checklist

- [ ] Local test করুন (optional):
  ```bash
  npm run dev
  # Test on localhost:3000
  ```

- [ ] Production এ deploy করুন

- [ ] Test checkout complete করুন:
  - [ ] Card: 4242 4242 4242 4242
  - [ ] Fill customer info
  - [ ] Fill shipping address (if ship)
  - [ ] Complete payment

- [ ] Verify results:
  - [ ] Redirect to success page ✅
  - [ ] Success message দেখাচ্ছে ✅
  - [ ] Admin dashboard এ order আছে ✅
  - [ ] Order details সঠিক আছে ✅
  - [ ] Email confirmation গেছে ✅
  - [ ] Cart clear হয়েছে ✅

---

## 🔍 Verification Commands

```bash
# Check .env has webhook secret
cat .env | grep STRIPE_WEBHOOK_SECRET

# Check server is running
pm2 status

# Check server logs
pm2 logs icemanz --lines 50

# Check database
npx prisma studio
# Look for Order and InvoiceRequest tables

# Check Stripe webhook logs
# Go to: dashboard.stripe.com/test/webhooks
# Click your endpoint
# Check recent events
```

---

## ❌ Troubleshooting Quick Fixes

### Webhook returns error:
```bash
# Check webhook secret is set
cat .env | grep STRIPE_WEBHOOK_SECRET

# Should show:
STRIPE_WEBHOOK_SECRET="whsec_xxx"  ✅

# NOT:
# STRIPE_WEBHOOK_SECRET="whsec_..." ❌

# Fix: Update .env and restart
pm2 restart icemanz
```

### Order not appearing:
```bash
# Check server logs
pm2 logs icemanz --err

# Check if API was called (browser console)
# Look for: [SUCCESS] Order created

# Check database
npx prisma studio
```

### Duplicate orders:
```
Don't worry! Already handled.
Both webhook and API check for duplicates.
```

---

## 📞 Quick Help

### যদি Stripe webhook create করতে না পারেন:
- Screenshot পাঠান
- Account type check করুন (business vs personal)
- Payment methods activated আছে কিনা check করুন

### যদি .env update করতে সমস্যা হয়:
- File permission check করুন: `ls -la .env`
- Backup নিন: `cp .env .env.backup`
- Use script: `./add-webhook-secret.sh whsec_your_secret`

### যদি server restart করতে সমস্যা হয়:
```bash
# Try these:
pm2 restart icemanz
pm2 restart all
pm2 stop icemanz && pm2 start icemanz
pm2 delete icemanz && pm2 start npm --name icemanz -- start
```

---

## 🎉 Success Criteria

সব কিছু ঠিক হয়েছে যদি:

✅ Stripe webhook endpoint created
✅ Webhook secret added to .env
✅ Server restarted successfully
✅ New code deployed (API backup)
✅ Test checkout completes
✅ Order appears in dashboard
✅ Customer receives email
✅ No errors in logs

**Congratulations! 🎊**

---

## 📋 Time Estimate

- Webhook Setup: 5-10 minutes
- Code Deployment: 5 minutes
- Testing: 5 minutes
- **Total: 15-20 minutes**

**চলুন শুরু করি!** 💪
