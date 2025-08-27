// Supabase Edge Function for creating BasePay invoices
// Deploy this to Supabase: supabase functions deploy create-basepay-invoice

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get BasePay credentials from Supabase Secrets
    const BASEPAY_API_KEY = Deno.env.get('BASEPAY_API_KEY')
    const BASEPAY_MERCHANT_ID = Deno.env.get('BASEPAY_MERCHANT_ID')
    const BASEPAY_API_URL = Deno.env.get('BASEPAY_API_URL') || 'https://api.basepay.com'

    if (!BASEPAY_API_KEY || !BASEPAY_MERCHANT_ID) {
      console.error('Missing BasePay credentials')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'BasePay credentials not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const requestData = await req.json()
    console.log('BasePay invoice request:', requestData)

    // Prepare BasePay API request
    const basePayPayload = {
      merchant_id: BASEPAY_MERCHANT_ID,
      amount: requestData.amount,
      currency: requestData.currency,
      order_id: requestData.order_id,
      return_url: requestData.return_url,
      webhook_url: requestData.webhook_url,
      email: requestData.email,
      metadata: requestData.metadata,
      network: 'base', // Base network
      description: 'LearnforLess Course Bundle'
    }

    console.log('Calling BasePay API with payload:', basePayPayload)

    // Call BasePay API
    const basePayResponse = await fetch(`${BASEPAY_API_URL}/v1/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BASEPAY_API_KEY}`,
        'X-Merchant-ID': BASEPAY_MERCHANT_ID
      },
      body: JSON.stringify(basePayPayload)
    })

    const basePayResult = await basePayResponse.json()
    console.log('BasePay API response:', basePayResult)

    if (!basePayResponse.ok) {
      throw new Error(`BasePay API error: ${basePayResult.message || 'Unknown error'}`)
    }

    // Return the invoice data
    const invoice = {
      id: basePayResult.id,
      order_id: basePayResult.order_id,
      amount: basePayResult.amount,
      currency: basePayResult.currency,
      url: basePayResult.payment_url,
      status: basePayResult.status,
      network: basePayResult.network || 'base'
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        invoice: invoice 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('BasePay invoice creation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})