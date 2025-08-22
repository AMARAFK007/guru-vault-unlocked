// Cryptomus API integration
// All credentials are now stored securely in Supabase Secrets

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

// Note: Signature generation and webhook verification are now handled in the edge function
// where we have secure access to API keys through Supabase Secrets
