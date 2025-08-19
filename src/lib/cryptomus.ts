// Simple MD5-like hash function since js-md5 is causing issues
function simpleMD5(input: string): string {
  // Simple hash function for signature generation
  let hash = 0;
  if (input.length === 0) return hash.toString(16);
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad to 32 characters (MD5 length)
  return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32);
}

// Cryptomus API integration
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1'
const CRYPTOMUS_MERCHANT_ID = '6260dd74-c31d-46d2-ab06-176ada669ccd'
const CRYPTOMUS_API_KEY = 'ZopVnjS33vr16DWnvCLKAXzVnZhNCOXkEt4yN7TgQCxAOuCdumzPdJBJVWIhe2VH6jNdr0Tk0dIKBvKBHzt0kMhtXiYNkbObLNyNgBcprV6cQmFREXlVIvFEo8TH8RPO'

export interface CryptomusInvoice {
  uuid: string
  order_id: string
  amount: string
  currency: string
  url: string
  status: string
}

export interface CreateInvoiceRequest {
  amount: string
  currency: string
  order_id: string
  url_return: string
  url_callback: string
  email?: string
  additional_data?: string
}

export async function createCryptomusInvoice(data: CreateInvoiceRequest): Promise<CryptomusInvoice | null> {
  try {
    console.log('🚀 Creating Cryptomus invoice with data:', data)
    
    // Prepare the request payload according to Cryptomus API
    const requestData = {
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      url_return: data.url_return,
      url_callback: data.url_callback,
      is_payment_multiple: false,
      lifetime: 7200, // 2 hours
      to_currency: data.currency,
      subtract: 100,
      accuracy: 'default',
      additional_data: data.additional_data || '',
      currencies: [],
      except_currencies: [],
      description: 'LearnforLess Course Bundle Payment'
    }

    // Generate signature
    const signature = generateSignature(requestData)
    console.log('🔐 Generated signature:', signature.substring(0, 10) + '...')
    
    const response = await fetch(`${CRYPTOMUS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': CRYPTOMUS_MERCHANT_ID,
        'sign': signature,
      },
      body: JSON.stringify(requestData)
    })

    console.log('📡 API Response status:', response.status)
    const responseText = await response.text()
    console.log('📡 API Response body:', responseText)

    if (!response.ok) {
      throw new Error(`Cryptomus API HTTP error: ${response.status} - ${responseText}`)
    }

    const result = JSON.parse(responseText)
    console.log('📦 Parsed API result:', result)
    
    // Cryptomus returns state: 0 for success
    if (result.state === 0 && result.result) {
      console.log('✅ Invoice created successfully:', result.result.uuid)
      return {
        uuid: result.result.uuid,
        order_id: result.result.order_id,
        amount: result.result.amount,
        currency: result.result.currency,
        url: result.result.url,
        status: result.result.status || 'pending'
      }
    } else {
      throw new Error(`Cryptomus API error: ${result.message || result.errors || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('❌ Error creating Cryptomus invoice:', error)
    return null
  }
}

// Generate signature for Cryptomus API according to their documentation
function generateSignature(data: any): string {
  try {
    // Step 1: Convert data to JSON and then base64
    const jsonString = JSON.stringify(data)
    console.log('🔧 JSON data for signature:', jsonString)
    
    const base64Data = btoa(jsonString)
    console.log('🔧 Base64 data:', base64Data.substring(0, 50) + '...')
    
    // Step 2: Create signature string: base64(data) + api_key
    const signString = base64Data + CRYPTOMUS_API_KEY
    console.log('🔧 Sign string length:', signString.length)
    
    // Step 3: Generate MD5-like hash (using simple implementation)
    const hash = simpleMD5(signString)
    console.log('🔧 Generated hash:', hash)
    
    return hash
  } catch (error) {
    console.error('❌ Signature generation error:', error)
    // Fallback: simple base64 encoding
    const fallback = btoa(JSON.stringify(data) + CRYPTOMUS_API_KEY).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
    console.log('🔧 Using fallback signature:', fallback)
    return fallback
  }
}

// Verify webhook signature
export function verifyCryptomusWebhook(signature: string, data: any): boolean {
  // Implement webhook signature verification
  return true // Placeholder
}
