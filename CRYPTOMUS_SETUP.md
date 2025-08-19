# Cryptomus Payment Gateway Setup Guide

## 🚀 Current Status
✅ **Frontend Integration**: Dynamic URL generation implemented  
✅ **Database Integration**: Order tracking in Supabase  
✅ **Webhook Handlers**: Ready for payment verification  
❌ **Cryptomus API Keys**: Need to be configured  

## 🔧 What You Need to Do

### 1. Get Your Cryptomus Credentials
1. Go to [Cryptomus Dashboard](https://cryptomus.com/)
2. Sign up/Login to your merchant account
3. Get these values:
   - **Merchant ID** 
   - **API Key**
   - **Webhook Secret** (for signature verification)

### 2. Update Your Configuration
Replace these placeholders in your code:

**In `src/pages/Checkout.tsx`:**
```typescript
const CRYPTOMUS_MERCHANT_ID = "your-actual-merchant-id"; // Replace this
```

**In `src/lib/cryptomus.ts`:**
```typescript
const CRYPTOMUS_MERCHANT_ID = 'your-actual-merchant-id' // Replace this
const CRYPTOMUS_API_KEY = 'your-actual-api-key' // Replace this
```

### 3. Set Up Webhooks in Cryptomus Dashboard
1. Go to your Cryptomus dashboard
2. Navigate to **Webhooks** or **API Settings**
3. Add webhook URL: `https://your-project.supabase.co/functions/v1/payment-webhook?provider=cryptomus`
4. Select events: `payment.paid`, `payment.failed`

### 4. Deploy Supabase Functions
Run these commands in your project:

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref qmltjekfuciwtnnkvjfi

# Deploy the webhook function
supabase functions deploy payment-webhook
```

### 5. Run Database Setup
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/qmltjekfuciwtnnkvjfi/sql/new)
2. Copy and paste the contents of `supabase-functions/payment-webhooks.sql`
3. Run the query to create webhook functions

### 6. Test Payment Flow
1. Go to `http://localhost:8080/checkout`
2. Enter your email
3. Select Cryptomus payment
4. Click "Buy Now"
5. Check the generated URL in browser console

## 🔍 Current Implementation

### What's Working:
- ✅ Dynamic URL generation with order ID and email
- ✅ Order creation in Supabase database
- ✅ User authentication with magic links
- ✅ Webhook handlers ready for deployment

### What Needs Your Cryptomus Account:
- ❌ Real merchant ID instead of placeholder
- ❌ API key for invoice creation
- ❌ Webhook secret for signature verification
- ❌ Webhook URL configuration in Cryptomus dashboard

## 🚨 Important Notes

1. **Current URL Format**: The system generates URLs like:
   ```
   https://pay.cryptomus.com/pay?merchant=your-merchant-id&amount=12.99&currency=USD&order_id=order-123&email=user@example.com
   ```

2. **Production Ready**: Once you add your real credentials, the system will:
   - Create proper invoices via Cryptomus API
   - Handle webhook verification
   - Automatically grant course access upon payment
   - Send confirmation emails

3. **Testing**: You can test the flow right now - it will generate URLs and create orders, but payments won't work until you add real Cryptomus credentials.

## 🎯 Next Steps

1. **Get Cryptomus account and credentials**
2. **Replace placeholder values in code**
3. **Deploy webhook functions to Supabase**
4. **Configure webhook URL in Cryptomus dashboard**
5. **Test complete payment flow**

Once you provide your Cryptomus credentials, I can help you complete the final configuration!
