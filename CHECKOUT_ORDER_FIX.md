# Checkout Order Creation Fix

## Problem
After completing checkout at `/checkout`, orders were not appearing in the admin order dashboard. The checkout success page was only clearing the cart but not creating order entries in the database.

## Root Cause
The checkout flow uses Stripe Payment Element (not Checkout Session), which means when the webhook receives `payment_intent.succeeded` event, it needs to:
1. Extract customer information from the payment method's billing details
2. Extract shipping information from the payment intent's shipping property
3. Create an InvoiceRequest record (required for the Order model)
4. Create an Order record linked to the invoice

The webhook handler was missing logic to properly extract customer and shipping information from Payment Intent events (as opposed to Checkout Session events).

## Changes Made

### 1. Updated Webhook Handler (`/src/app/api/webhook/stripe/route.ts`)

#### Enhanced Payment Intent Processing
- Added logic to retrieve full PaymentIntent with expanded payment_method and shipping data
- Extract customer information from `payment_method.billing_details`:
  - Customer name
  - Customer email
  - Customer phone
- Extract shipping information from `paymentIntent.shipping`:
  - Shipping name
  - Full shipping address
  - City, State, ZIP, Country
- Automatically infer delivery method (ship vs pickup) based on presence of shipping address

#### Improved Direct Checkout Flow
- For direct checkout orders (without pre-existing invoice):
  1. Parse cart items from payment metadata
  2. Create InvoiceRequest record with:
     - Customer details
     - Payment amount
     - Cart items as JSON
     - Shipping address (if ship) or pickup notes
     - Status: PAID
  3. Create Order record linked to the new invoice
  4. Send confirmation email with order details

#### Added Detailed Logging
```typescript
console.log('[WEBHOOK] Direct checkout payment received (no invoiceId)');
console.log('[WEBHOOK] Customer:', { customerName, customerEmail, customerPhone });
console.log('[WEBHOOK] Shipping:', { deliveryMethod, shippingName, shippingAddress, ... });
console.log('[WEBHOOK] Cart items:', cartItemsData.length, 'items');
console.log('[WEBHOOK] Invoice request created:', tempInvoice.id);
console.log('[WEBHOOK] Order created:', newOrder.id);
```

## How It Works Now

### Checkout Flow
1. **Customer completes checkout** at `/checkout`
2. **Stripe confirms payment** and triggers `payment_intent.succeeded` webhook
3. **Webhook handler receives event** and:
   - Retrieves full payment intent with billing and shipping details
   - Extracts customer information from billing details
   - Extracts shipping information (if ship delivery)
   - Creates InvoiceRequest with status PAID
   - Creates Order record
   - Sends confirmation email
4. **Order appears in admin dashboard** at `/admin/orders`

### Data Flow
```
Checkout Page (Payment Element)
    ↓ (Stripe Payment)
Payment Intent Created
    ↓ (payment_intent.succeeded)
Webhook Handler
    ↓ (Extract data)
Customer Info + Shipping Info + Cart Items
    ↓ (Create records)
InvoiceRequest (PAID) + Order (PAID)
    ↓ (Display)
Admin Orders Dashboard
```

## Testing Checklist

- [ ] Complete a checkout with shipping address
- [ ] Verify order appears in `/admin/orders` (Walk-in Cooler & Freezer section)
- [ ] Check order has correct customer name and email
- [ ] Check order has correct shipping address
- [ ] Check order amount matches payment
- [ ] Complete a checkout with pickup
- [ ] Verify pickup order shows "pickup" as delivery method
- [ ] Check confirmation email is sent
- [ ] Verify invoice request is created with correct data

## Files Modified

1. `/src/app/api/webhook/stripe/route.ts` - Enhanced webhook handler
2. `/src/app/api/create-payment-intent/route.ts` - Minor comment update

## Database Structure

### InvoiceRequest
```prisma
model InvoiceRequest {
  id            String   @id @default(uuid())
  email         String
  fullName      String
  phone         String?
  status        String   @default("PENDING")
  products      Json?    // Cart items stored as JSON
  totalAmount   Float?
  totalWithTax  Float?
  category      String?
  address       String?
  deliveryNotes String?
  // ... other fields
}
```

### Order
```prisma
model Order {
  id              String   @id @default(uuid())
  invoiceId       String   @unique
  customerName    String
  customerEmail   String
  customerPhone   String?
  amountPaid      Float
  shippingName    String?
  shippingAddress String?
  shippingCity    String?
  shippingState   String?
  shippingZip     String?
  shippingCountry String?
  deliveryMethod  String?  // "ship" or "pickup"
  status          String   @default("PAID")
  category        String?
  // ... other fields
}
```

## Important Notes

- Orders require an associated InvoiceRequest (foreign key constraint)
- Direct checkout orders automatically create a "temporary" invoice record
- Category is automatically determined from cart items
- Delivery method is inferred from shipping address presence
- All customer and shipping data comes from Stripe Payment Intent

## Next Steps

1. Test the checkout flow end-to-end
2. Monitor webhook logs for any errors
3. Verify email notifications are being sent
4. Check that orders display correctly in admin dashboard


## Webhook Setup

### Environment Variables Required
```env
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Local Testing
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
3. Copy the webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`
4. Complete a test checkout

### Production Setup
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select event: `payment_intent.succeeded`
4. Copy webhook signing secret to production environment variables

### Webhook Events Handled
- `checkout.session.completed` - For invoice checkout flow
- `payment_intent.succeeded` - For direct cart checkout flow

## Troubleshooting

### Orders Not Appearing
1. Check webhook is configured and receiving events
2. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
3. Check server logs for webhook errors
4. Ensure PaymentIntent has billing_details populated

### Missing Customer Information
- Customer info comes from Stripe Payment Element form
- Ensure billing address collection is enabled
- Check that email field is filled in checkout form

### Missing Shipping Information
- Shipping info only available if delivery method is "ship"
- Verify AddressElement is properly submitting data
- Check Stripe Payment Intent has `shipping` property

### Console Logs to Check
```
[WEBHOOK] Direct checkout payment received (no invoiceId)
[WEBHOOK] Customer: { customerName, customerEmail, customerPhone }
[WEBHOOK] Shipping: { deliveryMethod, shippingAddress, ... }
[WEBHOOK] Cart items: X items
[WEBHOOK] Invoice request created: invoice-id
[WEBHOOK] Order created: order-id
```
