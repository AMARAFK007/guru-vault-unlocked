# 🚀 Quick Start Guide - Guru Vault with Cryptomus

## ✅ Integration Complete!

Your Guru Vault website is now fully integrated with Cryptomus payment gateway and your new Supabase backend.

---

## 🎯 What's Ready

### Backend (Supabase)
- ✅ Database: `vttnpbucjgaddyyukbog.supabase.co`
- ✅ Orders table created
- ✅ Webhook logs table created
- ✅ All indexes optimized

### Frontend
- ✅ Cryptomus payment integration
- ✅ Checkout page updated
- ✅ Success page configured
- ✅ Toast notifications

### Payment Gateway
- ✅ Merchant ID: `6260dd74-c31d-46d2-ab06-176ada669ccd`
- ✅ API Key: Configured
- ✅ Price: $14.99 USD
- ✅ Accepts: USDT, BTC, ETH, and more

---

## 🏃 Run Your Website

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Your site will be at:** `http://localhost:5173`

---

## 🧪 Test Payment Flow

1. **Go to checkout:**
   ```
   http://localhost:5173/checkout
   ```

2. **Enter email and click "Buy Now"**
   - System creates order in database
   - Creates Cryptomus invoice
   - Redirects to payment page

3. **Complete payment on Cryptomus**
   - Choose crypto (USDT recommended)
   - Send payment
   - Get redirected back to success page

---

## 📋 Next Steps

### 1. Set Up Webhooks (Important!)

To automatically update order status when payments complete:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref vttnpbucjgaddyyukbog

# Deploy webhook function
supabase functions deploy cryptomus-webhook
```

**Webhook URL will be:**
```
https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
```

### 2. Configure Cryptomus Dashboard

1. Go to [Cryptomus Dashboard](https://cryptomus.com/dashboard)
2. Navigate to Settings → API → Webhooks
3. Add webhook URL (from step 1)
4. Select events: `paid`, `paid_over`, `failed`, `cancel`
5. Save

### 3. Deploy to Production

When ready to go live:

```bash
# Build for production
npm run build

# Deploy to your hosting (Vercel, Netlify, etc.)
```

---

## 📊 Monitor Your Orders

### View Orders in Supabase:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog)
2. Click "Table Editor"
3. Select "orders" table
4. See all orders and their status

### Check Webhooks:
1. Select "webhook_logs" table
2. View all payment notifications

---

## 🎨 Customize Your Site

### Change Price
Edit `src/pages/Checkout.tsx` line ~103:
```typescript
amount: '29.99', // Change from 14.99 to your price
```

### Change Product Name
Edit checkout page description and success page content.

### Change Crypto Currency
Edit `src/lib/cryptomus.ts` line ~54:
```typescript
to_currency: params.to_currency || 'BTC', // Change from USDT
```

---

## 🔧 Files Modified

- ✅ `src/integrations/supabase/client.ts` - Connected to new backend
- ✅ `src/lib/cryptomus.ts` - Payment integration (NEW)
- ✅ `src/pages/Checkout.tsx` - Updated with Cryptomus
- ✅ `src/pages/Success.tsx` - Updated import
- ✅ `supabase/functions/cryptomus-webhook/index.ts` - Webhook handler (NEW)

---

## 📚 Documentation

- **Full Setup Guide**: See `CRYPTOMUS_SETUP.md`
- **Cryptomus Docs**: [https://doc.cryptomus.com/](https://doc.cryptomus.com/)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)

---

## 🎉 You're Ready!

Everything is set up and ready to accept payments. Just:
1. ✅ Test the payment flow
2. ✅ Set up webhooks
3. ✅ Deploy to production

**Need help?** Check `CRYPTOMUS_SETUP.md` for detailed instructions.

---

## 🚨 Important Reminders

1. **Webhooks**: Set up webhooks to auto-update order status
2. **Environment Variables**: Move API keys to `.env` for production
3. **HTTPS**: Use HTTPS in production (required for webhooks)
4. **Testing**: Test with small amounts first

---

**Happy Selling! 🎊**
