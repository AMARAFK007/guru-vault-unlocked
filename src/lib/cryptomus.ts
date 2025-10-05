import CryptoJS from 'crypto-js';

// Cryptomus API Configuration
const CRYPTOMUS_API_KEY = '7QAbZ2GAggH5j3zejuZbkHnlzjLTktjkh6zYeeKPyzIv7moDGagKCnLGQC31ZMuE4rJcifjzVbFQlY6sXllmw4nY2kfCKzdi5SEPTAJwooslZx7rNSVcHk9rhvfDxPcS';
const CRYPTOMUS_MERCHANT_ID = '6260dd74-c31d-46d2-ab06-176ada669ccd';
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1';

interface CreateInvoiceParams {
  amount: string;
  currency: string;
  order_id: string;
  url_return?: string;
  url_callback?: string;
  is_payment_multiple?: boolean;
  lifetime?: number;
  to_currency?: string;
}

interface CryptomusInvoiceResponse {
  state: number;
  result: {
    uuid: string;
    order_id: string;
    amount: string;
    payment_amount: string;
    payer_amount: string;
    discount_percent: number;
    discount: string;
    payer_currency: string;
    currency: string;
    merchant_amount: string;
    network: string;
    address: string;
    from: string;
    txid: string;
    payment_status: string;
    url: string;
    expired_at: number;
    status: string;
    is_final: boolean;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Generate signature for Cryptomus API request
 */
function generateSignature(data: any): string {
  const jsonString = JSON.stringify(data);
  const base64Data = btoa(jsonString);
  const signature = CryptoJS.MD5(base64Data + CRYPTOMUS_API_KEY).toString();
  return signature;
}

/**
 * Create a payment invoice with Cryptomus
 */
export async function createCryptomusInvoice(params: CreateInvoiceParams): Promise<CryptomusInvoiceResponse> {
  const requestData = {
    amount: params.amount,
    currency: params.currency,
    order_id: params.order_id,
    url_return: params.url_return || `${window.location.origin}/success`,
    url_callback: params.url_callback,
    is_payment_multiple: params.is_payment_multiple || false,
    lifetime: params.lifetime || 3600, // 1 hour default
    to_currency: params.to_currency || 'USDT', // Default to USDT
  };

  const signature = generateSignature(requestData);

  try {
    const response = await fetch(`${CRYPTOMUS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': CRYPTOMUS_MERCHANT_ID,
        'sign': signature,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cryptomus API Error:', errorData);
      throw new Error(`Cryptomus API error: ${errorData.message || response.statusText}`);
    }

    const data: CryptomusInvoiceResponse = await response.json();
    
    if (data.state !== 0) {
      throw new Error('Failed to create invoice');
    }

    return data;
  } catch (error) {
    console.error('Error creating Cryptomus invoice:', error);
    throw error;
  }
}

/**
 * Verify webhook signature from Cryptomus
 */
export function verifyCryptomusWebhook(signature: string, data: any): boolean {
  const expectedSignature = generateSignature(data);
  return signature === expectedSignature;
}

/**
 * Get payment status from Cryptomus
 */
export async function getCryptomusPaymentStatus(uuid: string): Promise<any> {
  const requestData = {
    uuid: uuid,
    order_id: uuid,
  };

  const signature = generateSignature(requestData);

  try {
    const response = await fetch(`${CRYPTOMUS_API_URL}/payment/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': CRYPTOMUS_MERCHANT_ID,
        'sign': signature,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
}

export const CRYPTOMUS_CONFIG = {
  MERCHANT_ID: CRYPTOMUS_MERCHANT_ID,
  API_KEY: CRYPTOMUS_API_KEY,
  API_URL: CRYPTOMUS_API_URL,
};
