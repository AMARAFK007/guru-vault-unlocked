import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📥 Webhook received:', req.method);
    
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const body = await req.text();
    console.log('📦 Webhook body:', body);

    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (error) {
      console.error('❌ Invalid JSON in webhook:', error);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    console.log('🔍 Parsed webhook data:', JSON.stringify(webhookData, null, 2));

    // Cryptomus webhook structure
    const { 
      status, 
      order_id,
      uuid,
      amount,
      currency,
      type
    } = webhookData;

    console.log(`💰 Payment status: ${status}, Order ID: ${order_id}, UUID: ${uuid}`);

    if (!order_id) {
      console.error('❌ No order_id in webhook data');
      return new Response('No order_id provided', { status: 400, headers: corsHeaders });
    }

    // Find the order by order_id in metadata
    const { data: orders, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('metadata->>order_id', order_id);

    if (findError) {
      console.error('❌ Error finding order:', findError);
      return new Response('Database error', { status: 500, headers: corsHeaders });
    }

    if (!orders || orders.length === 0) {
      console.error('❌ Order not found for order_id:', order_id);
      return new Response('Order not found', { status: 404, headers: corsHeaders });
    }

    const order = orders[0];
    console.log('📋 Found order:', order.id);

    // Update order status based on Cryptomus webhook
    let newStatus = 'pending';
    if (status === 'paid') {
      newStatus = 'completed';
    } else if (status === 'fail' || status === 'cancelled') {
      newStatus = 'failed';
    }

    console.log(`🔄 Updating order status from ${order.status} to ${newStatus}`);

    // Update the order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        payment_id: uuid,
        metadata: {
          ...order.metadata,
          webhook_data: webhookData,
          updated_at: new Date().toISOString()
        }
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Error updating order:', updateError);
      return new Response('Failed to update order', { status: 500, headers: corsHeaders });
    }

    console.log('✅ Order updated successfully');

    // Return success response to Cryptomus
    return new Response(JSON.stringify({ 
      success: true, 
      order_id: order.id,
      status: newStatus 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});