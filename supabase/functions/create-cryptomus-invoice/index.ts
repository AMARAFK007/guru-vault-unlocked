import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get credentials from environment variables (Supabase Secrets)
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1';
const CRYPTOMUS_MERCHANT_ID = Deno.env.get('CRYPTOMUS_MERCHANT_ID');
const CRYPTOMUS_API_KEY = Deno.env.get('CRYPTOMUS_API_KEY');

// Validate required environment variables
function validateEnvironment() {
  console.log('🔍 Environment variables validation:');
  console.log('🔍 CRYPTOMUS_MERCHANT_ID:', CRYPTOMUS_MERCHANT_ID ? '✅ Present' : '❌ Missing');
  console.log('🔍 CRYPTOMUS_API_KEY:', CRYPTOMUS_API_KEY ? '✅ Present' : '❌ Missing');
  
  if (!CRYPTOMUS_MERCHANT_ID) {
    console.error('❌ CRYPTOMUS_MERCHANT_ID is missing from environment variables');
    throw new Error('CRYPTOMUS_MERCHANT_ID environment variable is required. Please check Supabase secrets configuration.');
  }
  if (!CRYPTOMUS_API_KEY) {
    console.error('❌ CRYPTOMUS_API_KEY is missing from environment variables');
    throw new Error('CRYPTOMUS_API_KEY environment variable is required. Please check Supabase secrets configuration.');
  }
  
  console.log('✅ All environment variables are properly configured');
}

// Generate MD5 hash using Deno's built-in crypto
async function generateMD5(data: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('MD5', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate signature for Cryptomus API - correct implementation
// Formula: MD5(base64(JSON_data) + API_KEY)
async function generateSignature(data: any): Promise<string> {
  try {
    // Step 1: Create clean data object excluding empty values
    const cleanData: any = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      // Only include non-empty values
      if (value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        cleanData[key] = value;
      }
    });
    
    // Step 2: Convert to JSON string without spaces
    const jsonString = JSON.stringify(cleanData);
    console.log('🔧 Clean JSON data for signature:', jsonString);
    
    // Step 3: Encode to base64
    const base64Data = btoa(jsonString);
    console.log('🔧 Base64 data:', base64Data.substring(0, 50) + '...');
    
    // Step 4: Combine base64 data with API key
    const signString = base64Data + CRYPTOMUS_API_KEY;
    console.log('🔧 Sign string preview:', signString.substring(0, 100) + '...');
    
    // Step 5: Generate MD5 hash
    const hash = await generateMD5(signString);
    console.log('🔧 Generated MD5 hash:', hash);
    
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
    console.log('📥 Create invoice request:', req.method);
    
    // Validate environment variables
    validateEnvironment();
    
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const body = await req.text();
    console.log('📦 Request body:', body);

    let requestData;
    try {
      requestData = JSON.parse(body);
    } catch (error) {
      console.error('❌ Invalid JSON in request:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log('🔍 Parsed request data:', JSON.stringify(requestData, null, 2));

    // Prepare Cryptomus API payload - simplified structure
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
    console.log('🔐 Generated signature:', signature.substring(0, 10) + '...');

    // Make API call to Cryptomus
    const response = await fetch(`${CRYPTOMUS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': CRYPTOMUS_MERCHANT_ID!,
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
    
    // Check for successful response (Cryptomus returns state: 0 for success)
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
        error: `Cryptomus API error: ${errorMessage}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Invoice creation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});