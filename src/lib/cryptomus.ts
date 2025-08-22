import CryptoJS from 'crypto-js';

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
    
    // Call our edge function to create the invoice (avoids CORS issues)
    const response = await fetch('https://zsjsgxjihmampbcdkzmw.supabase.co/functions/v1/create-cryptomus-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    console.log('📡 Edge function response status:', response.status)
    const responseText = await response.text()
    console.log('📡 Edge function response body:', responseText)

    if (!response.ok) {
      throw new Error(`Edge function HTTP error: ${response.status} - ${responseText}`)
    }

    const result = JSON.parse(responseText)
    console.log('📦 Parsed edge function result:', result)
    
    if (result.success && result.invoice) {
      console.log('✅ Invoice created successfully:', result.invoice.uuid)
      return result.invoice
    } else {
      throw new Error(`Edge function error: ${result.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('❌ Error creating Cryptomus invoice:', error)
    return null
  }
}

// Generate signature for Cryptomus API according to their documentation
// Formula: MD5(base64(JSON_data) + API_KEY)
function generateSignature(data: any): string {
  try {
    // Step 1: Convert data to JSON string
    const jsonString = JSON.stringify(data)
    console.log('🔧 JSON data for signature:', jsonString)
    
    // Step 2: Encode to base64
    const base64Data = btoa(jsonString)
    console.log('🔧 Base64 data:', base64Data.substring(0, 50) + '...')
    
    // Step 3: Combine base64 data with API key
    const signString = base64Data + CRYPTOMUS_API_KEY
    console.log('🔧 Sign string length:', signString.length)
    
    // Step 4: Generate MD5 hash using crypto-js
    const hash = CryptoJS.MD5(signString).toString()
    console.log('🔧 Generated MD5 hash:', hash)
    
    return hash
  } catch (error) {
    console.error('❌ Signature generation error:', error)
    throw error
  }
}

// Verify webhook signature
export function verifyCryptomusWebhook(signature: string, data: any): boolean {
  try {
    const expectedSignature = generateSignature(data)
    return signature === expectedSignature
  } catch (error) {
    console.error('❌ Webhook signature verification error:', error)
    return false
  }
}
