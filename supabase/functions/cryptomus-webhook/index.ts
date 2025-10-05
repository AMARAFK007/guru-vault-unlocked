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
