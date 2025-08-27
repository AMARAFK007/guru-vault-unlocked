import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cryptomus API configuration
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1';
const CRYPTOMUS_MERCHANT_ID = '6260dd74-c31d-46d2-ab06-176ada669ccd';
const CRYPTOMUS_API_KEY = '7QAbZ2GAggH5j3zejuZbkHnlzjLTktjkh6zYeeKPyzIv7moDGagKCnLGQC31ZMuE4rJcifjzVbFQlY6sXllmw4nY2kfCKzdi5SEPTAJwooslZx7rNSVcHk9rhvfDxPcS';

// Generate MD5 hash
async function generateMD5(data: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('MD5', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate signature for Cryptomus API
async function generateSignature(data: any): Promise<string> {
  try {
    // Create clean data object excluding empty values
    const cleanData: any = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        cleanData[key] = value;
      }
    });
    
    // Convert to JSON string without spaces
    const jsonString = JSON.stringify(cleanData);
    console.log('🔧 JSON data for signature:', jsonString);
    
    // Encode to base64
    const base64Data = btoa(jsonString);
    console.log('🔧 Base64 data:', base64Data.substring(0, 50) + '...');
    
    // Combine base64 data with API key
    const signString = base64Data + CRYPTOMUS_API_KEY;
    
    // Generate MD5 hash
    const hash = await generateMD5(signString);
    console.log('🔧 Generated signature:', hash);
    
    return hash;
  } catch (error) {
    console.error('❌ Signature generation error:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📥 Cryptomus invoice request received');
    
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const requestData = await req.json();
    console.log('📦 Request data:', JSON.stringify(requestData, null, 2));

    // Prepare Cryptomus API payload
    const cryptomusPayload = {
      amount: requestData.amount,
      currency: requestData.currency,
      order_id: requestData.order_id,
      url_return: requestData.url_return,
      url_callback: requestData.url_callback,
      is_payment_multiple: false,
      lifetime: 7200,
      subtract: 100,
      accuracy: 'default',
      additional_data: requestData.additional_data || '',
      description: 'LearnforLess Course Bundle Payment'
    };

    console.log('🚀 Creating Cryptomus invoice with payload:', cryptomusPayload);

    // Generate signature
    const signature = await generateSignature(cryptomusPayload);

    // Make API call to Cryptomus
    const response = await fetch(`${CRYPTOMUS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': CRYPTOMUS_MERCHANT_ID,
        'sign': signature,
      },
      body: JSON.stringify(cryptomusPayload)
    });

    console.log('📡 Cryptomus API Response status:', response.status);
    const responseText = await response.text();
    console.log('📡 Cryptomus API Response body:', responseText);

    if (!response.ok) {
      throw new Error(`Cryptomus API HTTP error: ${response.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('📦 Parsed API result:', result);
    
    // Check for successful response
    if (result.state === 0 && result.result) {
      console.log('✅ Invoice created successfully:', result.result.uuid);
      
      const invoice = {
        uuid: result.result.uuid,
        order_id: result.result.order_id,
        amount: result.result.amount,
        currency: result.result.currency,
        url: result.result.url,
        status: result.result.status || 'pending'
      };

      return new Response(JSON.stringify({ 
        success: true, 
        invoice 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Handle API errors
      const errorMessage = result.message || result.errors || 'Unknown API error';
      console.error('❌ Cryptomus API error:', errorMessage);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Cryptomus API error: ${errorMessage}`,
        details: result
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Invoice creation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});