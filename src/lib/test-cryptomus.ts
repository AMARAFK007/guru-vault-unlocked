// Test file for Cryptomus API integration
import { createCryptomusInvoice } from './cryptomus'

export async function testCryptomusAPI() {
  console.log('🧪 Testing Cryptomus API integration...')
  
  const testData = {
    amount: '12.99',
    currency: 'USD',
    order_id: `test-${Date.now()}`,
    url_return: 'https://example.com/success',
    url_callback: 'https://example.com/webhook',
    additional_data: JSON.stringify({ 
      test: true,
      platform: 'LearnforLess' 
    })
  }

  try {
    const result = await createCryptomusInvoice(testData)
    
    if (result) {
      console.log('✅ Test successful! Invoice created:', {
        uuid: result.uuid,
        url: result.url,
        amount: result.amount,
        currency: result.currency
      })
      return result
    } else {
      console.log('❌ Test failed: No result returned')
      return null
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error)
    return null
  }
}

// Export for testing in console
if (typeof window !== 'undefined') {
  (window as any).testCryptomusAPI = testCryptomusAPI
}
