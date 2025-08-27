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
    // Create a mock invoice for testing
    const mockInvoice: CryptomusInvoice = {
      uuid: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      order_id: data.order_id,
      amount: data.amount,
      currency: data.currency,
      url: `https://pay.cryptomus.com/pay/${data.order_id}?amount=${data.amount}&currency=${data.currency}`,
      status: 'pending'
    };
    
    console.log('✅ Mock Cryptomus invoice created:', mockInvoice);
    return mockInvoice;
  } catch (error) {
    console.error('❌ Error creating Cryptomus invoice:', error)
    return null
  }
}

// Note: Signature generation and webhook verification are now handled in the edge function
// where we have secure access to API keys through Supabase Secrets
