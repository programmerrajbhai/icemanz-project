# 🎯 Stripe Webhook তৈরি করার সম্পূর্ণ Guide (Step by Step Screenshots সহ)

## 📋 Step 1: Stripe Dashboard এ যান

### Test Mode এর জন্য:
```
https://dashboard.stripe.com/test/webhooks
```

### Live/Production Mode এর জন্য:
```
https://dashboard.stripe.com/webhooks
```

**Note**: প্রথমে Test Mode দিয়ে শুরু করুন, সব কিছু ঠিক কাজ করলে Live Mode এ করবেন।

---

## 📋 Step 2: "Add endpoint" Button Click করুন

Dashboard এ উপরের দিকে একটা button দেখবেন:
```
+ Add endpoint
```
এটাতে click করুন।

---

## 📋 Step 3: Endpoint URL দিন

একটা form খুলবে। এখানে:

### "Endpoint URL" field এ আপনার website URL দিন:
```
https://icemanz.com/api/webhook/stripe
```

**Important**: 
- `https://` দিয়ে শুরু হতে হবে
- শেষে `/api/webhook/stripe` থাকতে হবে
- কোনো trailing slash (/) দেবেন না

### "Description" (Optional):
```
Order creation webhook for checkout
```

---

## 📋 Step 4: Events Select করুন

Form এ নিচে "Select events to listen to" section দেখবেন।

### দুইটা option দেখাবে:
1. **"Listen to all events"** - এটা select করবেন না
2. **"Select events"** - এটা select করুন ✅

### "Select events" button click করার পর:

একটা modal খুলবে যেখানে অনেক events দেখাবে।

#### Search করুন:
Search box এ type করুন: `payment_intent`

#### এই event select করুন (checkbox tick দিন):
- ✅ **`payment_intent.succeeded`** - এটা অবশ্যই লাগবে

#### Optional (ভবিষ্যতের জন্য):
আপনি চাইলে এগুলোও select করতে পারেন:
- `checkout.session.completed`
- `payment_intent.payment_failed`

### "Add events" button click করুন

---

## 📋 Step 5: Endpoint Create করুন

Form এর নিচে "Add endpoint" button দেখবেন।

Click করুন: **"Add endpoint"**

---

## 📋 Step 6: Signing Secret Copy করুন

Endpoint create হওয়ার পর একটা page খুলবে।

### "Signing secret" section দেখুন:

```
Signing secret
whsec_••••••••••••••••••••••••••••••
```

### Secret reveal করুন:
- "Click to reveal" অথবা eye icon এ click করুন
- অথবা "Copy" button এ click করুন

### Secret কপি করুন:
Secret এরকম দেখাবে:
```
whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

**এই secret টা safe জায়গায় রাখুন!**

---

## 📋 Step 7: .env File এ Secret Add করুন

### Local এ (আপনার computer):

1. `.env` file খুলুন
2. এই line খুঁজুন:
   ```env
   # STRIPE_WEBHOOK_SECRET="whsec_..." # Required for production webhooks
   ```

3. এটাকে এভাবে replace করুন (# সরিয়ে):
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_1234567890abcdefghijklmnopqrstuvwxyz"
   ```
   (আপনার actual secret paste করুন)

4. Save করুন

### Server এ (production):

**Option A: Direct edit:**
```bash
ssh your-server
cd /path/to/icemanz
nano .env
# or
vim .env

# Add this line:
STRIPE_WEBHOOK_SECRET="whsec_your_actual_secret"

# Save and exit
```

**Option B: Using script:**
```bash
# Upload add-webhook-secret.sh to server
./add-webhook-secret.sh whsec_your_actual_secret
```

---

## 📋 Step 8: Server Restart করুন

.env file change করার পর **অবশ্যই** restart করতে হবে:

```bash
pm2 restart icemanz
```

---

## ✅ Step 9: Verify করুন

### 1. Stripe Dashboard এ check করুন:

Webhooks page এ আপনার endpoint দেখাবে:

```
✓ https://icemanz.com/api/webhook/stripe
  Events: payment_intent.succeeded
  Status: Active
```

### 2. Test webhook send করুন:

Stripe Dashboard এ:
1. আপনার webhook endpoint click করুন
2. উপরে "Send test webhook" button দেখবেন
3. Click করুন
4. Event select করুন: `payment_intent.succeeded`
5. "Send test webhook" click করুন

**Response দেখুন:**
- Status: `200 OK` (success)
- Response body: `{"received":true}`

### 3. Real checkout test করুন:

1. Website এ যান: `https://icemanz.com`
2. Product add করুন cart এ
3. Checkout করুন
4. Test card use করুন: `4242 4242 4242 4242`
5. Payment complete করুন
6. Admin dashboard check করুন: order আছে কিনা

---

## 🔍 Troubleshooting

### Problem 1: "Add endpoint" button দেখছি না

**Solution**: 
- নিশ্চিত করুন আপনি Stripe account এ logged in
- Account এ payment enable করা আছে কিনা check করুন
- Page refresh করুন

### Problem 2: Endpoint URL এ error দেখাচ্ছে

**Check করুন:**
- URL `https://` দিয়ে শুরু হচ্ছে কিনা
- Domain name সঠিক আছে কিনা
- Path `/api/webhook/stripe` ঠিক আছে কিনা
- Trailing slash নেই তো?

**Correct ✅:**
```
https://icemanz.com/api/webhook/stripe
```

**Wrong ❌:**
```
http://icemanz.com/api/webhook/stripe  (http instead of https)
https://icemanz.com/webhook/stripe     (wrong path)
https://icemanz.com/api/webhook/stripe/ (trailing slash)
```

### Problem 3: Test webhook 500 error দিচ্ছে

**Reason**: Server এ webhook secret set করা নেই

**Solution**:
1. .env file check করুন
2. `STRIPE_WEBHOOK_SECRET` uncommented আছে কিনা
3. Server restart করেছেন কিনা

### Problem 4: Test webhook timeout হচ্ছে

**Check করুন:**
- Server running আছে কিনা: `pm2 status`
- Firewall block করছে না তো?
- URL accessible আছে কিনা browser থেকে test করুন

---

## 📊 সফল Setup এর লক্ষণ

✅ Webhook endpoint created in Stripe
✅ Status: "Active" 
✅ Events: payment_intent.succeeded selected
✅ Signing secret copied
✅ .env file updated with secret
✅ Server restarted
✅ Test webhook returns 200 OK
✅ Real checkout creates order in dashboard

---

## 🎥 Visual Guide

### Dashboard দেখতে এরকম হবে:

```
┌────────────────────────────────────────────────────────┐
│  Webhooks                                   + Add endpoint │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Endpoint URL: https://icemanz.com/api/webhook/stripe │
│  Events: 1 event type                                 │
│  Status: ● Active                                     │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ Signing secret                               │    │
│  │ whsec_•••••••••••••••••••       [Reveal]    │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Recent events                                        │
│  ├─ payment_intent.succeeded    ✓ 200    Just now   │
│  └─ payment_intent.succeeded    ✓ 200    2m ago     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Command Reference

```bash
# 1. Create webhook in Stripe Dashboard
# (follow steps above)

# 2. Copy signing secret
# whsec_xxxxxxxxxxxxxxxxxxxxx

# 3. Add to .env (local)
echo 'STRIPE_WEBHOOK_SECRET="whsec_your_secret"' >> .env

# 4. Add to .env (server)
ssh your-server
cd /path/to/icemanz
echo 'STRIPE_WEBHOOK_SECRET="whsec_your_secret"' >> .env

# 5. Restart server
pm2 restart icemanz

# 6. Test
# Complete a checkout on website
```

---

## 💡 Pro Tips

1. **Test Mode First**: সবসময় test mode এ প্রথমে setup করুন
2. **Keep Secret Safe**: Webhook secret কাউকে share করবেন না
3. **Different Secrets**: Test ও Live mode এ different secrets হবে
4. **Monitor Events**: প্রথম কয়েকদিন webhook events monitor করুন
5. **Backup**: .env file এর backup রাখুন

---

## 📞 Need Help?

যদি কোনো step এ আটকে যান:

1. Screenshot নিন
2. Error message কপি করুন
3. Server logs check করুন: `pm2 logs icemanz`
4. আমাকে জানান

---

## ✨ Summary

আপনাকে করতে হবে:

1. ✅ Stripe Dashboard → Webhooks
2. ✅ Add endpoint
3. ✅ URL: `https://icemanz.com/api/webhook/stripe`
4. ✅ Event: `payment_intent.succeeded`
5. ✅ Copy signing secret
6. ✅ Add to .env file
7. ✅ Restart server
8. ✅ Test!

**এত সহজ! চলুন করি!** 🎉
