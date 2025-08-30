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
    // Call the Supabase edge function
    const response = await fetch(`https://zsjsgxjihmampbcdkzmw.supabase.co/functions/v1/create-cryptomus-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    
    if (result.success && result.invoice) {
      console.log('✅ Cryptomus invoice created:', result.invoice);
      return result.invoice;
    } else {
      throw new Error(result.error || 'Failed to create invoice');
    }
  } catch (error) {
    console.error('❌ Error creating Cryptomus invoice:', error);
    return null;
  }
}

// Note: Signature generation and webhook verification are now handled in the edge function
// where we have secure access to API keys through Supabase Secrets
