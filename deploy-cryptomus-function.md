# Manual Cryptomus Function Deployment

Since you don't have Supabase CLI installed, here are the steps to manually deploy the Cryptomus edge function:

## Option 1: Install Supabase CLI (Recommended)

### Windows Installation:
```powershell
# Using npm (if you have Node.js)
npm install -g supabase

# Or using Chocolatey
choco install supabase

# Or using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### After Installation:
```bash
# Login to Supabase
supabase login

# Deploy the function
supabase functions deploy create-cryptomus-invoice --project-ref zsjsgxjihmampbcdkzmw
```

## Option 2: Manual Deployment via Supabase Dashboard

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/zsjsgxjihmampbcdkzmw/functions

2. **Create New Function**:
   - Click "Create a new function"
   - Name: `create-cryptomus-invoice`
   - Copy the content from `supabase/functions/create-cryptomus-invoice-fixed/index.ts`

3. **Deploy the Function**:
   - Paste the code
   - Click "Deploy function"

## Option 3: Test Current Function

The function might already be deployed. Test it by opening `test-cryptomus.html` in your browser and clicking the test button.

## Current Issues to Check:

### 1. **API Credentials**
Your current Cryptomus credentials:
- Merchant ID: `6260dd74-c31d-46d2-ab06-176ada669ccd`
- API Key: `7QAbZ2GAggH5j3zejuZbkHnlzjLTktjkh6zYeeKPyzIv7moDGagKCnLGQC31ZMuE4rJcifjzVbFQlY6sXllmw4nY2kfCKzdi5SEPTAJwooslZx7rNSVcHk9rhvfDxPcS`

**Verify these are correct** in your Cryptomus dashboard.

### 2. **Function URL**
Your function should be accessible at:
`https://zsjsgxjihmampbcdkzmw.supabase.co/functions/v1/create-cryptomus-invoice`

### 3. **Test the Function**
Open `test-cryptomus.html` in your browser to test if the function is working.

## Common Issues:

### Issue 1: Function Not Deployed
**Solution**: Deploy using one of the methods above

### Issue 2: Wrong API Credentials
**Solution**: Check your Cryptomus dashboard for correct credentials

### Issue 3: CORS Issues
**Solution**: The function includes proper CORS headers

### Issue 4: Signature Generation
**Solution**: The fixed function has improved signature generation

## Quick Test:

Run this in your browser console on any page:

```javascript
fetch('https://zsjsgxjihmampbcdkzmw.supabase.co/functions/v1/create-cryptomus-invoice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: '14.99',
    currency: 'USD',
    order_id: 'test_' + Date.now(),
    url_return: window.location.origin + '/success',
    url_callback: 'https://zsjsgxjihmampbcdkzmw.supabase.co/functions/v1/payment-webhook',
    additional_data: '{"test": true}'
  })
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
```

This will tell you if the function is working or what error you're getting.