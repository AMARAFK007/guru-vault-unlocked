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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzanNneGppaG1hbXBiY2Rrem13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MzIyMjIsImV4cCI6MjA3MTQwODIyMn0.T3Hp0keiACOcfSdT6ZgzW00rFhcmcpDXcpsrY58EsJA'
      },
      body: JSON.stringify(data)
    })

    console.log('📡 Edge function response status:', response.status)
    const responseText = await response.text()
    console.log('📡 Edge function response body:', responseText)

    if (!response.ok) {
      console.error(`Edge function HTTP error: ${response.status} - ${responseText}`)
      return null
    }

    const result = JSON.parse(responseText)
    console.log('📦 Parsed edge function result:', result)
    
    if (result.success && result.invoice) {
      console.log('✅ Invoice created successfully:', result.invoice.uuid)
      return result.invoice
    } else {
      console.error(`Edge function error: ${result.error || 'Unknown error'}`)
      return null
    }
  } catch (error) {
    console.error('❌ Error creating Cryptomus invoice:', error)
    return null
  }
}

// Note: Signature generation and webhook verification are now handled in the edge function
// where we have secure access to API keys through Supabase Secrets
