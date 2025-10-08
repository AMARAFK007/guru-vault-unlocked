# 🚀 Backend Deployment Guide - Complete Setup

## ✅ What's Already Done

1. ✅ **Database Tables Created**
   - `orders` table - tracks all payments
   - `webhook_logs` table - tracks payment notifications
   - Row Level Security enabled

2. ✅ **Supabase Connected**
   - Frontend connected to: `vttnpbucjgaddyyukbog.supabase.co`
   - Database ready and configured

3. ✅ **Webhook Handler Code Ready**
   - File: `supabase/functions/cryptomus-webhook/index.ts`
   - Handles payment confirmations
   - Updates order status automatically

---

## 🔧 **What You Need to Deploy Now**

### **Step 1: Deploy Webhook Function to Supabase**

Since Supabase CLI can't be installed globally on Windows, use one of these methods:

#### **Method A: Using Supabase Dashboard (Easiest)** ⭐

1. **Go to Supabase Dashboard:**
   - Visit: [https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog)

2. **Navigate to Edge Functions:**
   - Click "Edge Functions" in the left sidebar
   - Click "Create a new function"

3. **Create Function:**
   - Name: `cryptomus-webhook`
   - Copy the code from: `supabase/functions/cryptomus-webhook/index.ts`
   - Paste into the editor
   - Click "Deploy"

4. **Your Webhook URL will be:**
   ```
   https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
   ```

#### **Method B: Using npx (Alternative)**

```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref vttnpbucjgaddyyukbog

# Deploy function
npx supabase functions deploy cryptomus-webhook
```

---

### **Step 2: Configure Cryptomus Webhook**

1. **Login to Cryptomus:**
   - Go to: [https://cryptomus.com/dashboard](https://cryptomus.com/dashboard)

2. **Navigate to API Settings:**
   - Click "Settings" or "API"
   - Find "Webhooks" section

3. **Add Webhook URL:**
   ```
   https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
   ```

4. **Select Events:**
   - ✅ `payment.paid` - Payment completed
   - ✅ `payment.paid_over` - Overpayment
   - ✅ `payment.failed` - Payment failed
   - ✅ `payment.cancel` - Payment cancelled
   - ✅ `payment.process` - Payment processing
   - ✅ `payment.check` - Payment checking

5. **Save Configuration**

---

### **Step 3: Test Webhook (Important!)**

After deploying the webhook, test it:

1. **Create a test order:**
   - Run your site locally: `npm run dev`
   - Go to checkout: `http://localhost:5173/checkout`
   - Enter email and click "Buy Now"

2. **Check webhook logs:**
   - Go to Supabase Dashboard
   - Click "Table Editor"
   - Select "webhook_logs" table
   - You should see entries when payments are made

3. **Verify order updates:**
   - Check "orders" table
   - Status should change from "pending" → "completed" after payment

---

## 🌐 **Alternative: Manual Webhook Processing (Temporary)**

If you can't deploy the webhook function right now, you can manually update orders:

### **Manual Order Completion:**

1. **User makes payment on Cryptomus**

2. **Check Cryptomus Dashboard:**
   - Go to [Cryptomus Dashboard](https://cryptomus.com/dashboard)
   - View "Payments" or "Transactions"
   - Find the payment with matching order_id

3. **Manually Update Order in Supabase:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog)
   - Click "Table Editor"
   - Select "orders" table
   - Find the order by email or payment_id
   - Change status from "pending" to "completed"
   - Click "Save"

4. **User can now access download:**
   - User visits success page
   - Download link appears

**Note:** This is temporary - you should deploy the webhook for automatic processing!

---

## 🔐 **Webhook Function Code**

Here's what the webhook does (already created in your project):

```typescript
// File: supabase/functions/cryptomus-webhook/index.ts

serve(async (req) => {
  // 1. Receive webhook from Cryptomus
  const payload = await req.json()
  
  // 2. Log webhook to database
  await supabase.from('webhook_logs').insert({
    provider: 'cryptomus',
    event_type: payload.status,
    payload: payload
  })
  
  // 3. Update order status based on payment
  if (payload.status === 'paid' || payload.status === 'paid_over') {
    // Payment successful
    await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('payment_id', payload.uuid)
  }
  
  return { success: true }
})
```

---

## 📊 **Verify Backend is Working**

### **Check Database Tables:**

1. **Orders Table:**
   ```sql
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
   ```
   - Should show all orders
   - Status should update after payment

2. **Webhook Logs Table:**
   ```sql
   SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;
   ```
   - Should show webhook events from Cryptomus
   - Processed = true means webhook handled successfully

### **Check in Supabase Dashboard:**

1. Go to: [https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog)
2. Click "Table Editor"
3. View "orders" and "webhook_logs" tables

---

## 🎯 **Backend Deployment Checklist**

- [x] Database tables created (orders, webhook_logs)
- [x] Row Level Security enabled
- [x] Frontend connected to Supabase
- [x] Webhook handler code written
- [ ] **Webhook function deployed to Supabase** ← DO THIS
- [ ] **Webhook URL configured in Cryptomus** ← DO THIS
- [ ] Test webhook with real payment
- [ ] Verify automatic order updates

---

## 🚀 **Quick Deploy Steps (Do This Now)**

### **Option 1: Supabase Dashboard (5 minutes)**

1. Open: [https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/functions](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/functions)
2. Click "Create Function"
3. Name: `cryptomus-webhook`
4. Copy code from `supabase/functions/cryptomus-webhook/index.ts`
5. Click "Deploy"
6. Copy webhook URL
7. Add to Cryptomus dashboard

### **Option 2: Using npx (Command Line)**

```bash
# From your project directory
npx supabase login
npx supabase link --project-ref vttnpbucjgaddyyukbog
npx supabase functions deploy cryptomus-webhook
```

---

## 📞 **Support Links**

- **Supabase Dashboard**: [https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog)
- **Cryptomus Dashboard**: [https://cryptomus.com/dashboard](https://cryptomus.com/dashboard)
- **Supabase Edge Functions Docs**: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

## ⚡ **After Deployment**

Once webhook is deployed:

1. ✅ Payments will automatically update order status
2. ✅ Users get instant access after payment
3. ✅ No manual work needed
4. ✅ Everything is automated

**Your backend will be LIVE and fully functional!** 🎉

---

## 🎯 **Current Status**

```
Database: ✅ LIVE
Tables: ✅ CREATED
Security: ✅ ENABLED
Webhook Code: ✅ READY
Webhook Deployed: ❌ PENDING (DO THIS NOW)
Cryptomus Config: ❌ PENDING (DO THIS AFTER WEBHOOK)
```

**Next Action:** Deploy the webhook function using one of the methods above!

