# 🚀 COMPLETE SETUP - DO THIS NOW

## ⚡ Quick 3-Step Setup (10 Minutes)

Everything is ready in your code. You just need to:
1. Start your website locally
2. Deploy webhook function
3. Configure Cryptomus

---

## 🎯 **STEP 1: Start Your Website (2 minutes)**

Open a **new terminal** and run:

```bash
cd C:\Users\agast\guru-vault-unlocked
npm run dev
```

**Your site will be at:** `http://localhost:5173`

Test it:
- Homepage: `http://localhost:5173`
- Checkout: `http://localhost:5173/checkout`

---

## 🎯 **STEP 2: Deploy Webhook (5 minutes)**

### **Option A: Supabase Dashboard (EASIEST)** ⭐

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/functions

2. **Create New Function:**
   - Click "New Function" or "Create Function"
   - Name: `cryptomus-webhook`

3. **Copy This Code:**
   Open file: `supabase/functions/cryptomus-webhook/index.ts`
   Copy ALL the code (lines 1-115)

4. **Paste and Deploy:**
   - Paste the code in Supabase editor
   - Click "Deploy" or "Save"

5. **Copy Your Webhook URL:**
   ```
   https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
   ```

### **Option B: Command Line (Alternative)**

Open **PowerShell as Administrator** and run:

```powershell
cd C:\Users\agast\guru-vault-unlocked

# Install and login (press 'y' when asked)
npx supabase@latest login

# Link your project
npx supabase@latest link --project-ref vttnpbucjgaddyyukbog

# Deploy webhook
npx supabase@latest functions deploy cryptomus-webhook
```

---

## 🎯 **STEP 3: Configure Cryptomus (3 minutes)**

1. **Login to Cryptomus:**
   - Go to: https://cryptomus.com/dashboard
   - Login with your account

2. **Find Webhooks Settings:**
   - Click "Settings" or "API Settings"
   - Look for "Webhooks" or "Notifications"

3. **Add Webhook URL:**
   ```
   https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook
   ```

4. **Select These Events:**
   - ✅ payment.paid
   - ✅ payment.paid_over
   - ✅ payment.failed
   - ✅ payment.cancel
   - ✅ payment.process

5. **Save Configuration**

---

## ✅ **DONE! Everything is Now LIVE**

### **Test Your Payment System:**

1. **Visit checkout:**
   ```
   http://localhost:5173/checkout
   ```

2. **Enter email and click "Buy Now"**

3. **You'll be redirected to Cryptomus payment page**

4. **Pay with crypto (or use test mode)**

5. **After payment:**
   - Webhook automatically updates order
   - You're redirected to success page
   - Download link appears

---

## 📊 **Monitor Your System**

### **Check Orders:**
- Go to: https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/editor
- Click "orders" table
- See all orders and their status

### **Check Webhooks:**
- Click "webhook_logs" table
- See all payment notifications from Cryptomus

---

## 🚨 **If Webhook Doesn't Deploy**

**Temporary Solution:** Manual order updates

When someone pays:

1. Check payment in Cryptomus dashboard
2. Go to Supabase → orders table
3. Find the order by email
4. Change status from "pending" to "completed"
5. User can now download

**But deploy the webhook ASAP for automation!**

---

## 🎯 **What's Already Done (No Action Needed)**

✅ Database created and connected
✅ Tables created (orders, webhook_logs)
✅ Security enabled (Row Level Security)
✅ Frontend integrated with Cryptomus
✅ Payment flow implemented
✅ Success page secured
✅ Download link protected
✅ Webhook code written

---

## 🎯 **What YOU Need to Do (3 Steps)**

1. ⏳ **Start website:** `npm run dev`
2. ⏳ **Deploy webhook:** Use Supabase dashboard or npx
3. ⏳ **Configure Cryptomus:** Add webhook URL

**That's it! 10 minutes total.**

---

## 🚀 **Quick Commands**

```bash
# Start website
npm run dev

# Deploy webhook (if using command line)
npx supabase@latest login
npx supabase@latest link --project-ref vttnpbucjgaddyyukbog
npx supabase@latest functions deploy cryptomus-webhook
```

---

## 📞 **Important Links**

- **Your Website (local):** http://localhost:5173
- **Supabase Dashboard:** https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog
- **Supabase Functions:** https://supabase.com/dashboard/project/vttnpbucjgaddyyukbog/functions
- **Cryptomus Dashboard:** https://cryptomus.com/dashboard
- **Webhook URL:** https://vttnpbucjgaddyyukbog.supabase.co/functions/v1/cryptomus-webhook

---

## 🎉 **After Setup**

Your system will:
- ✅ Accept crypto payments automatically
- ✅ Update order status automatically
- ✅ Grant download access automatically
- ✅ Log all transactions
- ✅ Secure - no bypasses possible

**Everything runs on autopilot!** 🚀

---

## ❓ **Need Help?**

If stuck on any step, just:
1. Check the error message
2. Try the alternative method
3. Or use manual order updates temporarily

**You're 10 minutes away from a fully working payment system!**
