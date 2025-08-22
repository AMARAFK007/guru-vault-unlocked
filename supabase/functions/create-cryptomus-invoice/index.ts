import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cryptomus API configuration
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1';
const CRYPTOMUS_MERCHANT_ID = '6260dd74-c31d-46d2-ab06-176ada669ccd';
const CRYPTOMUS_API_KEY = 'ZopVnjS33vr16DWnvCLKAXzVnZhNCOXkEt4yN7TgQCxAOuCdumzPdJBJVWIhe2VH6jNdr0Tk0dIKBvKBHzt0kMhtXiYNkbObLNyNgBcprV6cQmFREXlVIvFEo8TH8RPO';

// Generate MD5 hash using a simple implementation
function generateMD5(data: string): string {
  // Simple MD5 implementation for Deno
  function md5(str: string): string {
    function rotateLeft(value: number, amount: number): number {
      const lbits = (value << amount) | (value >>> (32 - amount));
      return lbits;
    }

    function addUnsigned(x: number, y: number): number {
      const x4 = (x & 0x40000000);
      const y4 = (y & 0x40000000);
      const x8 = (x & 0x80000000);
      const y8 = (y & 0x80000000);
      const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
      if (x4 & y4) {
        return (result ^ 0x80000000 ^ x8 ^ y8);
      }
      if (x4 | y4) {
        if (result & 0x40000000) {
          return (result ^ 0xC0000000 ^ x8 ^ y8);
        } else {
          return (result ^ 0x40000000 ^ x8 ^ y8);
        }
      } else {
        return (result ^ x8 ^ y8);
      }
    }

    function f(x: number, y: number, z: number): number {
      return (x & y) | ((~x) & z);
    }
    function g(x: number, y: number, z: number): number {
      return (x & z) | (y & (~z));
    }
    function h(x: number, y: number, z: number): number {
      return (x ^ y ^ z);
    }
    function i(x: number, y: number, z: number): number {
      return (y ^ (x | (~z)));
    }

    function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(str: string): number[] {
      let wordArray: number[] = [];
      let wordCount = 0;
      for (let i = 0; i < str.length; i++) {
        const bytePosition = (i % 4) * 8;
        const byteValue = str.charCodeAt(i) << bytePosition;
        wordArray[Math.floor(i / 4)] |= byteValue;
        wordCount = Math.floor(i / 4);
      }
      return wordArray;
    }

    function wordToHex(value: number): string {
      let hex = "";
      for (let i = 0; i <= 3; i++) {
        const byte = (value >>> (i * 8)) & 255;
        hex += ("0" + byte.toString(16)).slice(-2);
      }
      return hex;
    }

    let x: number[] = [];
    let k: number, aa: number, bb: number, cc: number, dd: number, a: number, b: number, c: number, d: number;
    const s11 = 7, s12 = 12, s13 = 17, s14 = 22;
    const s21 = 5, s22 = 9, s23 = 14, s24 = 20;
    const s31 = 4, s32 = 11, s33 = 16, s34 = 23;
    const s41 = 6, s42 = 10, s43 = 15, s44 = 21;

    str = unescape(encodeURIComponent(str));
    x = convertToWordArray(str);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    const len = str.length;
    x[len >> 2] |= 0x80 << ((len % 4) * 8);
    x[((len + 8) >> 6) * 16 + 14] = len;

    for (let i = 0; i < x.length; i += 16) {
      aa = a; bb = b; cc = c; dd = d;

      a = ff(a, b, c, d, x[i + 0], s11, 0xD76AA478);
      d = ff(d, a, b, c, x[i + 1], s12, 0xE8C7B756);
      c = ff(c, d, a, b, x[i + 2], s13, 0x242070DB);
      b = ff(b, c, d, a, x[i + 3], s14, 0xC1BDCEEE);
      a = ff(a, b, c, d, x[i + 4], s11, 0xF57C0FAF);
      d = ff(d, a, b, c, x[i + 5], s12, 0x4787C62A);
      c = ff(c, d, a, b, x[i + 6], s13, 0xA8304613);
      b = ff(b, c, d, a, x[i + 7], s14, 0xFD469501);
      a = ff(a, b, c, d, x[i + 8], s11, 0x698098D8);
      d = ff(d, a, b, c, x[i + 9], s12, 0x8B44F7AF);
      c = ff(c, d, a, b, x[i + 10], s13, 0xFFFF5BB1);
      b = ff(b, c, d, a, x[i + 11], s14, 0x895CD7BE);
      a = ff(a, b, c, d, x[i + 12], s11, 0x6B901122);
      d = ff(d, a, b, c, x[i + 13], s12, 0xFD987193);
      c = ff(c, d, a, b, x[i + 14], s13, 0xA679438E);
      b = ff(b, c, d, a, x[i + 15], s14, 0x49B40821);

      a = gg(a, b, c, d, x[i + 1], s21, 0xF61E2562);
      d = gg(d, a, b, c, x[i + 6], s22, 0xC040B340);
      c = gg(c, d, a, b, x[i + 11], s23, 0x265E5A51);
      b = gg(b, c, d, a, x[i + 0], s24, 0xE9B6C7AA);
      a = gg(a, b, c, d, x[i + 5], s21, 0xD62F105D);
      d = gg(d, a, b, c, x[i + 10], s22, 0x2441453);
      c = gg(c, d, a, b, x[i + 15], s23, 0xD8A1E681);
      b = gg(b, c, d, a, x[i + 4], s24, 0xE7D3FBC8);
      a = gg(a, b, c, d, x[i + 9], s21, 0x21E1CDE6);
      d = gg(d, a, b, c, x[i + 14], s22, 0xC33707D6);
      c = gg(c, d, a, b, x[i + 3], s23, 0xF4D50D87);
      b = gg(b, c, d, a, x[i + 8], s24, 0x455A14ED);
      a = gg(a, b, c, d, x[i + 13], s21, 0xA9E3E905);
      d = gg(d, a, b, c, x[i + 2], s22, 0xFCEFA3F8);
      c = gg(c, d, a, b, x[i + 7], s23, 0x676F02D9);
      b = gg(b, c, d, a, x[i + 12], s24, 0x8D2A4C8A);

      a = hh(a, b, c, d, x[i + 5], s31, 0xFFFA3942);
      d = hh(d, a, b, c, x[i + 8], s32, 0x8771F681);
      c = hh(c, d, a, b, x[i + 11], s33, 0x6D9D6122);
      b = hh(b, c, d, a, x[i + 14], s34, 0xFDE5380C);
      a = hh(a, b, c, d, x[i + 1], s31, 0xA4BEEA44);
      d = hh(d, a, b, c, x[i + 4], s32, 0x4BDECFA9);
      c = hh(c, d, a, b, x[i + 7], s33, 0xF6BB4B60);
      b = hh(b, c, d, a, x[i + 10], s34, 0xBEBFBC70);
      a = hh(a, b, c, d, x[i + 13], s31, 0x289B7EC6);
      d = hh(d, a, b, c, x[i + 0], s32, 0xEAA127FA);
      c = hh(c, d, a, b, x[i + 3], s33, 0xD4EF3085);
      b = hh(b, c, d, a, x[i + 6], s34, 0x4881D05);
      a = hh(a, b, c, d, x[i + 9], s31, 0xD9D4D039);
      d = hh(d, a, b, c, x[i + 12], s32, 0xE6DB99E5);
      c = hh(c, d, a, b, x[i + 15], s33, 0x1FA27CF8);
      b = hh(b, c, d, a, x[i + 2], s34, 0xC4AC5665);

      a = ii(a, b, c, d, x[i + 0], s41, 0xF4292244);
      d = ii(d, a, b, c, x[i + 7], s42, 0x432AFF97);
      c = ii(c, d, a, b, x[i + 14], s43, 0xAB9423A7);
      b = ii(b, c, d, a, x[i + 5], s44, 0xFC93A039);
      a = ii(a, b, c, d, x[i + 12], s41, 0x655B59C3);
      d = ii(d, a, b, c, x[i + 3], s42, 0x8F0CCC92);
      c = ii(c, d, a, b, x[i + 10], s43, 0xFFEFF47D);
      b = ii(b, c, d, a, x[i + 1], s44, 0x85845DD1);
      a = ii(a, b, c, d, x[i + 8], s41, 0x6FA87E4F);
      d = ii(d, a, b, c, x[i + 15], s42, 0xFE2CE6E0);
      c = ii(c, d, a, b, x[i + 6], s43, 0xA3014314);
      b = ii(b, c, d, a, x[i + 13], s44, 0x4E0811A1);
      a = ii(a, b, c, d, x[i + 4], s41, 0xF7537E82);
      d = ii(d, a, b, c, x[i + 11], s42, 0xBD3AF235);
      c = ii(c, d, a, b, x[i + 2], s43, 0x2AD7D2BB);
      b = ii(b, c, d, a, x[i + 9], s44, 0xEB86D391);

      a = addUnsigned(a, aa);
      b = addUnsigned(b, bb);
      c = addUnsigned(c, cc);
      d = addUnsigned(d, dd);
    }

    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
  }

  return md5(data);
}

// Generate signature for Cryptomus API
function generateSignature(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    console.log('🔧 JSON data for signature:', jsonString);
    
    const base64Data = btoa(jsonString);
    console.log('🔧 Base64 data:', base64Data.substring(0, 50) + '...');
    
    const signString = base64Data + CRYPTOMUS_API_KEY;
    console.log('🔧 Sign string length:', signString.length);
    
    const hash = generateMD5(signString);
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
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    console.log('🔍 Parsed request data:', JSON.stringify(requestData, null, 2));

    // Prepare Cryptomus API payload
    const cryptomusPayload = {
      amount: requestData.amount,
      currency: requestData.currency,
      order_id: requestData.order_id,
      url_return: requestData.url_return,
      url_callback: requestData.url_callback,
      is_payment_multiple: false,
      lifetime: 7200, // 2 hours
      to_currency: requestData.currency,
      subtract: 100,
      accuracy: 'default',
      additional_data: requestData.additional_data || '',
      currencies: [],
      except_currencies: [],
      description: 'LearnforLess Course Bundle Payment'
    };

    console.log('🚀 Creating Cryptomus invoice with payload:', cryptomusPayload);

    // Generate signature
    const signature = generateSignature(cryptomusPayload);
    console.log('🔐 Generated signature:', signature.substring(0, 10) + '...');

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
    
    // Cryptomus returns state: 0 for success
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
      throw new Error(`Cryptomus API error: ${result.message || result.errors || 'Unknown error'}`);
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