// Supabase Edge Function for handling payment webhooks
// Deploy this to Supabase: supabase functions deploy payment-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const provider = url.searchParams.get('provider') // 'gumroad' or 'cryptomus'
    
    if (!provider || !['gumroad', 'cryptomus', 'basepay'].includes(provider)) {
      return new Response(
        JSON.stringify({ error: 'Invalid provider' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get webhook payload
    const payload = await req.json()
    console.log(`${provider} webhook received:`, payload)

    let result
    
    if (provider === 'gumroad') {
      // Handle Gumroad webhook
      const { data, error } = await supabaseClient.rpc('handle_gumroad_webhook', {
        webhook_payload: payload
      })
      
      if (error) {
        console.error('Gumroad webhook error:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      result = data
    } else if (provider === 'cryptomus') {
      // Handle Cryptomus webhook
      const { data, error } = await supabaseClient.rpc('handle_cryptomus_webhook', {
        webhook_payload: payload
      })
      
      if (error) {
        console.error('Cryptomus webhook error:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      result = data
    } else if (provider === 'basepay') {
      // Handle BasePay webhook
      const { data, error } = await supabaseClient.rpc('handle_basepay_webhook', {
        webhook_payload: payload
      })
      
      if (error) {
        console.error('BasePay webhook error:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      result = data
    }

    console.log(`${provider} webhook processed:`, result)

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
