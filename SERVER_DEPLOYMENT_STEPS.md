# 🚀 Server Deployment - Step by Step

## ✅ Already Done:
- [x] Webhook created in Stripe
- [x] Webhook secret added to .env
- [x] Code committed to Git
- [x] Code pushed to GitHub

---

## 🎯 Now Do This on Your Server:

### Method 1: Using Script (Easiest)

```bash
# 1. SSH to your server
ssh your-server

# 2. Navigate to project directory
cd /path/to/icemanz

# 3. Upload and run deployment script
# (Upload DEPLOY_NOW.sh first, then:)
chmod +x DEPLOY_NOW.sh
./DEPLOY_NOW.sh
```

---

### Method 2: Manual Steps (If script doesn't work)

#### Step 1: SSH to Server
```bash
ssh your-server-ip
# or
ssh username@your-server-ip
```

#### Step 2: Navigate to Project
```bash
cd /path/to/icemanz
# Example: cd /var/www/icemanz
# or: cd ~/icemanz
```

#### Step 3: Check Current Status
```bash
git status
```

#### Step 4: Pull Latest Code
```bash
git pull origin main
```

**If you see conflicts:**
```bash
# Backup current changes
git stash

# Pull again
git pull origin main

# Apply your changes back (if needed)
git stash pop
```

#### Step 5: Install Dependencies (if any new)
```bash
npm install
```

#### Step 6: Build Application
```bash
npm run build
```

**This will take 1-2 minutes. Wait for it to complete.**

#### Step 7: Restart Server
```bash
pm2 restart icemanz
```

**Or if that doesn't work:**
```bash
pm2 stop icemanz
pm2 start icemanz
```

**Or restart all:**
```bash
pm2 restart all
```

#### Step 8: Check Status
```bash
pm2 status
```

**Should show:**
```
┌────┬────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id │ name       │ mode        │ ↺       │ status  │ cpu      │
├────┼────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0  │ icemanz    │ fork        │ 15      │ online  │ 0%       │
└────┴────────────┴─────────────┴─────────┴─────────┴──────────┘
```

**Status should be "online" ✅**

#### Step 9: Check Logs
```bash
pm2 logs icemanz --lines 50
```

**Look for:**
- No error messages
- Server started successfully
- Port listening (usually 3000)

---

## 🔍 Verification Checklist

After deployment, verify:

### 1. Check .env File
```bash
cat .env | grep STRIPE_WEBHOOK_SECRET
```

**Should show:**
```
STRIPE_WEBHOOK_SECRET="whsec_50fbbc1701125b1bd1603d28b1241e6cd55d51547f52aa8736a6ac341d04a7b0"
```

✅ Correct - Secret is set
❌ If commented or missing - Update .env and restart

### 2. Check Server Status
```bash
pm2 status icemanz
```

**Should show "online"**

### 3. Check Logs for Errors
```bash
pm2 logs icemanz --err --lines 20
```

**Should not show recent errors**

### 4. Test Website Access
```bash
curl https://icemanz.com
```

**Should return HTML (website is accessible)**

### 5. Test Webhook Endpoint
```bash
curl -X POST https://icemanz.com/api/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

**Expected response:**
```json
{"error":"Webhook Error: No signatures found matching the expected signature"}
```

This is actually GOOD! It means:
- ✅ Endpoint is accessible
- ✅ Server is running
- ✅ Webhook handler is working
- ✅ Just needs proper Stripe signature (which will come from real webhooks)

---

## 🧪 Testing After Deployment

### Test 1: Stripe Webhook Test

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/webhooks
2. Click your webhook endpoint
3. Click "Send test webhook"
4. Select event: `payment_intent.succeeded`
5. Click "Send test webhook"

**Expected Result:**
- Response: 200 OK
- Status: Success ✅

### Test 2: Real Checkout Test

1. Go to: https://icemanz.com
2. Add a product to cart
3. Go to checkout
4. Fill in details:
   - Email: test@example.com
   - Name: Test Customer
   - Shipping address (if ship)
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
5. Complete payment

**Expected Results:**
- ✅ Payment succeeds
- ✅ Redirect to success page
- ✅ Success message shows
- ✅ Order appears in admin dashboard
- ✅ Email sent to customer

### Test 3: Check Admin Dashboard

1. Login to admin: https://icemanz.com/admin/login
2. Go to: https://icemanz.com/admin/orders/walk-in-cooler-freezer
3. Should see new order with:
   - ✅ Customer name
   - ✅ Customer email
   - ✅ Amount paid
   - ✅ Shipping address
   - ✅ Status: PAID

---

## 🐛 Troubleshooting

### Issue: Git pull fails with conflicts

**Solution:**
```bash
# See what files have conflicts
git status

# If .env has conflicts (common):
git checkout --ours .env

# Or backup and reset:
cp .env .env.backup
git checkout origin/main .env
# Then manually add your secrets back

# Complete the pull
git pull origin main
```

### Issue: Build fails

**Solution:**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Issue: PM2 not found

**Solution:**
```bash
# Install PM2 globally
npm install -g pm2

# Or use npm directly:
npm run start
```

### Issue: Port already in use

**Solution:**
```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or restart PM2
pm2 restart all
```

### Issue: Webhook still not working

**Check these:**
```bash
# 1. Webhook secret is set
cat .env | grep STRIPE_WEBHOOK_SECRET

# 2. Server restarted after .env change
pm2 restart icemanz

# 3. No errors in logs
pm2 logs icemanz --err

# 4. Stripe webhook URL is correct
# https://icemanz.com/api/webhook/stripe
```

---

## 📊 Success Indicators

After successful deployment:

```bash
# All these should pass:

# 1. Git is up to date
git status
# Output: "Your branch is up to date with 'origin/main'"

# 2. Server is running
pm2 status icemanz
# Output: status "online"

# 3. No recent errors
pm2 logs icemanz --err --lines 10
# Output: No errors

# 4. Webhook secret is set
cat .env | grep STRIPE_WEBHOOK_SECRET
# Output: STRIPE_WEBHOOK_SECRET="whsec_..."

# 5. Website is accessible
curl -I https://icemanz.com
# Output: HTTP/2 200
```

---

## 🎉 Final Checklist

- [ ] SSH to server
- [ ] Navigate to project directory
- [ ] Pull latest code (`git pull origin main`)
- [ ] Install dependencies (`npm install`)
- [ ] Build project (`npm run build`)
- [ ] Check .env has webhook secret
- [ ] Restart server (`pm2 restart icemanz`)
- [ ] Verify server is online (`pm2 status`)
- [ ] Check logs for errors (`pm2 logs icemanz`)
- [ ] Test Stripe webhook (Dashboard → Send test)
- [ ] Test real checkout on website
- [ ] Verify order in admin dashboard
- [ ] Check email was sent

---

## 📞 Need Help?

If any step fails:
1. Copy the error message
2. Check logs: `pm2 logs icemanz --lines 50`
3. Screenshot the issue
4. Let me know!

---

## ⏱️ Time Estimate

- SSH and navigate: 1 minute
- Pull code: 30 seconds
- Build: 1-2 minutes
- Restart: 30 seconds
- Test: 2 minutes

**Total: ~5 minutes** ⚡

Let's do this! 🚀
