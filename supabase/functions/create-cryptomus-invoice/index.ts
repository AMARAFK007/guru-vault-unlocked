import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, currency, order_id, url_return } = await req.json()

    // Get credentials from environment
    const CRYPTOMUS_API_KEY = Deno.env.get('CRYPTOMUS_API_KEY')
    const CRYPTOMUS_MERCHANT_ID = Deno.env.get('CRYPTOMUS_MERCHANT_ID')

    if (!CRYPTOMUS_API_KEY || !CRYPTOMUS_MERCHANT_ID) {
      throw new Error('Cryptomus credentials not configured')
    }

    // Prepare webhook URL
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/cryptomus-webhook`

    // Prepare invoice data
    const invoiceData = {
      amount: amount,
      currency: currency,
      order_id: order_id,
      url_return: url_return,
      url_callback: webhookUrl,
      is_payment_multiple: false,
      lifetime: 3600,
      to_currency: "USDT"
    }

    console.log('Creating invoice with data:', invoiceData)

    // Generate signature
    const dataString = JSON.stringify(invoiceData)
    const encodedData = new TextEncoder().encode(dataString + CRYPTOMUS_API_KEY)
    const hashBuffer = await createHash('md5').update(encodedData).digest()
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    console.log('Generated signature:', signature)

    // Make request to Cryptomus API
    const response = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': CRYPTOMUS_MERCHANT_ID,
        'sign': signature
      },
      body: dataString
    })

    const responseData = await response.json()
    console.log('Cryptomus API response:', responseData)

    if (!response.ok) {
      throw new Error(`Cryptomus API error: ${JSON.stringify(responseData)}`)
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error creating invoice:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to create Cryptomus invoice'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
