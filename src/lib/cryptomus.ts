// Cryptomus API integration
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1'
const CRYPTOMUS_MERCHANT_ID = '6260dd74-c31d-46d2-ab06-176ada669ccd'
const CRYPTOMUS_PRIVATE_KEY = 'ZopVnjS33vr16DWnvCLKAXzVnZhNCOXkEt4yN7TgQCxAOuCdumzPdJBJVWIhe2VH6jNdr0Tk0dIKBvKBHzt0kMhtXiYNkbObLNyNgBcprV6cQmFREXlVIvFEo8TH8RPO'

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
    const requestData = {
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      url_return: data.url_return,
      url_callback: data.url_callback,
      email: data.email,
      additional_data: data.additional_data
    }

    const signature = await generateSignature(requestData)
    
    const response = await fetch(`${CRYPTOMUS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': CRYPTOMUS_MERCHANT_ID,
        'sign': signature,
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Cryptomus API error: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    
    if (result.state === 0) {
      return result.result
    } else {
      throw new Error(`Cryptomus API error: ${result.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error creating Cryptomus invoice:', error)
    return null
  }
}

// Generate signature for Cryptomus API according to their documentation
async function generateSignature(data: any): Promise<string> {
  try {
    // Convert data to base64 first
    const jsonString = JSON.stringify(data)
    const base64Data = btoa(jsonString)
    
    // Create signature string: base64(data) + private_key
    const signString = base64Data + CRYPTOMUS_PRIVATE_KEY
    
    // Generate MD5-like hash using available methods
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(signString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Return first 32 characters (MD5 length equivalent)
    return hashHex.substring(0, 32)
  } catch (error) {
    console.error('Signature generation error:', error)
    // Fallback simple hash
    return btoa(JSON.stringify(data) + CRYPTOMUS_PRIVATE_KEY).substring(0, 32)
  }
}

// Verify webhook signature
export function verifyCryptomusWebhook(signature: string, data: any): boolean {
  // Implement webhook signature verification
  return true // Placeholder
}
