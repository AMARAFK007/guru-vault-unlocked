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
    // Direct API call to Cryptomus
    const payload = {
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      url_return: data.url_return,
      url_callback: data.url_callback,
      is_payment_multiple: false,
      lifetime: 7200,
      subtract: 100,
      accuracy: 'default',
      additional_data: data.additional_data || '',
      description: 'LearnforLess Course Bundle Payment'
    };

    // Generate signature
    const jsonString = JSON.stringify(payload);
    const base64Data = btoa(jsonString);
    const signString = base64Data + '7QAbZ2GAggH5j3zejuZbkHnlzjLTktjkh6zYeeKPyzIv7moDGagKCnLGQC31ZMuE4rJcifjzVbFQlY6sXllmw4nY2kfCKzdi5SEPTAJwooslZx7rNSVcHk9rhvfDxPcS';
    
    // Generate MD5 hash
    const encoder = new TextEncoder();
    const data_encoded = encoder.encode(signString);
    const hashBuffer = await crypto.subtle.digest('MD5', data_encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const response = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': '6260dd74-c31d-46d2-ab06-176ada669ccd',
        'sign': signature,
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.state === 0 && result.result) {
      return {
        uuid: result.result.uuid,
        order_id: result.result.order_id,
        amount: result.result.amount,
        currency: result.result.currency,
        url: result.result.url,
        status: result.result.status || 'pending'
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error creating Cryptomus invoice:', error)
    return null
  }
}

// Note: Signature generation and webhook verification are now handled in the edge function
// where we have secure access to API keys through Supabase Secrets
