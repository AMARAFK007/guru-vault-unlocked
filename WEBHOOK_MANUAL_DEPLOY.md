# 🚀 Deploy Webhook - Manual Method (5 Minutes)

Since the Supabase CLI is having issues on Windows, let's deploy the webhook using the **Supabase Dashboard** - it's actually easier!

---

## ✅ **Method 1: Supabase Dashboard (EASIEST)** ⭐

### **Step 1: Open Supabase Dashboard**

Click this link:
👉 **[Open Supabase Functions](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/functions)**

Or manually:
1. Go to: https://supabase.com/dashboard
2. Select your project: `vttnpbucjgaddyyukbog`
3. Click "Edge Functions" in the left sidebar

---

### **Step 2: Create New Function**

1. Click the **"New Function"** or **"Create Function"** button
2. Enter function name: `cryptomus-webhook`
3. You'll see a code editor

---

### **Step 3: Copy the Webhook Code**

The code is in your project at:
```
supabase/functions/cryptomus-webhook/index.ts
```

**Copy this ENTIRE code:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, sign',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get webhook payload and signature
    const payload = await req.json()
    const signature = req.headers.get('sign')
    
    console.log('Received webhook:', {
      status: payload.status,
      uuid: payload.uuid,
      order_id: payload.order_id,
      amount: payload.amount
    })

    // Log webhook to database
    const { error: logError } = await supabase.from('webhook_logs').insert({
      provider: 'cryptomus',
      event_type: payload.status,
      payload: payload,
      signature: signature,
      processed: false
    })

    if (logError) {
      console.error('Error logging webhook:', logError)
    }

    // Process payment status updates
    if (payload.status === 'paid' || payload.status === 'paid_over') {
      // Payment successful - update order status
      const { data: orders, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', payload.uuid)
        .select()
      
      if (updateError) {
        console.error('Error updating order:', updateError)
        throw updateError
      }

      console.log('Order updated successfully:', orders)

      // Mark webhook as processed
      await supabase
        .from('webhook_logs')
        .update({ processed: true })
        .eq('payload->uuid', payload.uuid)
        .eq('provider', 'cryptomus')

    } else if (payload.status === 'cancel' || payload.status === 'fail' || payload.status === 'wrong_amount') {
      // Payment failed or cancelled
      const { data: orders, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', payload.uuid)
        .select()
      
      if (updateError) {
        console.error('Error updating failed order:', updateError)
      }

      console.log('Order marked as failed:', orders)

      // Mark webhook as processed
      await supabase
        .from('webhook_logs')
        .update({ processed: true })
        .eq('payload->uuid', payload.uuid)
        .eq('provider', 'cryptomus')

    } else if (payload.status === 'process' || payload.status === 'check') {
      // Payment is being processed
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', payload.uuid)
      
      if (updateError) {
        console.error('Error updating processing order:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
```

---

### **Step 4: Paste and Deploy**

1. **Paste** the code into the Supabase editor
2. Click **"Deploy"** or **"Save"** button
3. Wait for deployment (usually 10-30 seconds)
4. You'll see "Deployment successful" ✅

---

### **Step 5: Get Your Webhook URL**

After deployment, your webhook URL is:

```
https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
```

**Copy this URL** - you'll need it for Cryptomus!

---

## 🎯 **Method 2: Alternative - Use Supabase SQL Editor**

If Edge Functions aren't available, you can create a database webhook:

### **Step 1: Open SQL Editor**
👉 **[Open SQL Editor](https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/sql/new)**

### **Step 2: Create Webhook Handler Function**

Run this SQL:

```sql
-- Create a function to handle webhooks
CREATE OR REPLACE FUNCTION handle_cryptomus_webhook(webhook_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payment_uuid text;
  payment_status text;
  result jsonb;
BEGIN
  -- Extract data from webhook
  payment_uuid := webhook_data->>'uuid';
  payment_status := webhook_data->>'status';
  
  -- Log webhook
  INSERT INTO webhook_logs (provider, event_type, payload, processed)
  VALUES ('cryptomus', payment_status, webhook_data, false);
  
  -- Update order based on status
  IF payment_status IN ('paid', 'paid_over') THEN
    UPDATE orders 
    SET status = 'completed', updated_at = NOW()
    WHERE payment_id = payment_uuid;
    
    -- Mark webhook as processed
    UPDATE webhook_logs 
    SET processed = true 
    WHERE payload->>'uuid' = payment_uuid 
    AND provider = 'cryptomus';
    
    result := jsonb_build_object('success', true, 'message', 'Order completed');
    
  ELSIF payment_status IN ('cancel', 'fail', 'wrong_amount') THEN
    UPDATE orders 
    SET status = 'failed', updated_at = NOW()
    WHERE payment_id = payment_uuid;
    
    result := jsonb_build_object('success', true, 'message', 'Order failed');
    
  ELSIF payment_status IN ('process', 'check') THEN
    UPDATE orders 
    SET status = 'processing', updated_at = NOW()
    WHERE payment_id = payment_uuid;
    
    result := jsonb_build_object('success', true, 'message', 'Order processing');
  ELSE
    result := jsonb_build_object('success', true, 'message', 'Status logged');
  END IF;
  
  RETURN result;
END;
$$;
```

**Note:** This method requires you to call the function from an external webhook service like Zapier or Make.com

---

## ✅ **After Deployment - Configure Cryptomus**

### **Step 1: Login to Cryptomus**
Go to: https://cryptomus.com/dashboard

### **Step 2: Navigate to Webhooks**
- Click "Settings" or "API"
- Find "Webhooks" or "Notifications" section

### **Step 3: Add Webhook URL**
Enter your webhook URL:
```
https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
```

### **Step 4: Select Events**
Check these boxes:
- ✅ payment.paid
- ✅ payment.paid_over  
- ✅ payment.failed
- ✅ payment.cancel
- ✅ payment.process
- ✅ payment.check

### **Step 5: Save**
Click "Save" or "Update"

---

## 🧪 **Test Your Webhook**

### **Test 1: Manual Test**

1. Go to your checkout: http://localhost:8080/checkout
2. Enter email and click "Buy Now"
3. You'll be redirected to Cryptomus
4. Make a small test payment (or use test mode if available)
5. Check Supabase logs to see webhook received

### **Test 2: Check Webhook Logs**

1. Go to: https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/editor
2. Click "webhook_logs" table
3. You should see entries when payments are made

### **Test 3: Check Order Updates**

1. Click "orders" table
2. Find your test order
3. Status should change from "pending" → "completed" after payment

---

## 📊 **Verify Webhook is Working**

### **Check Function Logs:**
1. Go to: https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/functions
2. Click on "cryptomus-webhook"
3. Click "Logs" tab
4. You'll see all webhook requests and responses

### **Check Database:**
```sql
-- View recent webhook logs
SELECT * FROM webhook_logs 
ORDER BY created_at DESC 
LIMIT 10;

-- View recent orders
SELECT id, email, amount, status, payment_id, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🎉 **Success Indicators**

You'll know it's working when:

✅ **Webhook logs appear** in `webhook_logs` table
✅ **Order status changes** from "pending" to "completed"
✅ **Function logs show** "Webhook processed"
✅ **Users get redirected** to success page with download link

---

## 🚨 **Troubleshooting**

### **Problem: Can't find Edge Functions**
**Solution:** Your Supabase plan might not include Edge Functions. Use Method 2 (SQL function) instead.

### **Problem: Deployment fails**
**Solution:** 
1. Check code for syntax errors
2. Make sure you copied ALL the code
3. Try refreshing the page and deploying again

### **Problem: Webhook not receiving data**
**Solution:**
1. Verify webhook URL in Cryptomus is correct
2. Check Cryptomus webhook logs for errors
3. Make sure events are selected in Cryptomus

### **Problem: Orders not updating**
**Solution:**
1. Check webhook_logs table - are webhooks being received?
2. Check function logs for errors
3. Verify payment_id matches between order and webhook

---

## 📞 **Important Links**

- **Supabase Functions:** https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/functions
- **Supabase SQL Editor:** https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/sql
- **Supabase Table Editor:** https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/editor
- **Cryptomus Dashboard:** https://cryptomus.com/dashboard
- **Your Webhook URL:** https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook

---

## ✅ **Deployment Checklist**

- [ ] Open Supabase Dashboard
- [ ] Create new Edge Function named "cryptomus-webhook"
- [ ] Copy webhook code from project file
- [ ] Paste code into Supabase editor
- [ ] Click "Deploy"
- [ ] Copy webhook URL
- [ ] Login to Cryptomus dashboard
- [ ] Add webhook URL to Cryptomus
- [ ] Select payment events
- [ ] Save Cryptomus configuration
- [ ] Test with small payment
- [ ] Verify webhook logs
- [ ] Verify order updates

---

## 🎯 **You're Almost Done!**

Just follow Method 1 (Supabase Dashboard) - it takes 5 minutes and is the easiest way!

**After deployment, your entire payment system will be automated!** 🚀
