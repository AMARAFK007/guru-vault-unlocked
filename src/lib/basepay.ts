// BasePay - Direct Base Network Wallet Integration
// Anonymous blockchain payments directly to your wallet

export interface BasePayment {
  id: string
  order_id: string
  amount: string
  currency: string
  recipient_address: string
  network: string
  payment_url: string
  status: string
}

export interface CreateBasePaymentRequest {
  amount: string
  currency: string
  order_id: string
  return_url: string
  email?: string
  metadata?: string
}

// Your Base network wallet address
const BASE_WALLET_ADDRESS = "0xE1E0c8ADf62f291aD8AECc57BACC02835Ac9fe91"

export async function createBasePayment(data: CreateBasePaymentRequest): Promise<BasePayment | null> {
  try {
    console.log('🚀 Creating Base network payment with data:', data)
    
    // Convert USD to ETH (approximate - you might want to use a real price API)
    const ethAmount = (parseFloat(data.amount) / 2500).toFixed(6) // Rough ETH price estimate
    
    // Create payment object
    const payment: BasePayment = {
      id: `base_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      order_id: data.order_id,
      amount: ethAmount,
      currency: 'ETH',
      recipient_address: BASE_WALLET_ADDRESS,
      network: 'base',
      payment_url: generateBasePaymentUrl(BASE_WALLET_ADDRESS, ethAmount, data.order_id),
      status: 'pending'
    }

    console.log('✅ Base payment created:', payment)
    return payment
  } catch (error) {
    console.error('❌ Error creating Base payment:', error)
    return null
  }
}

function generateBasePaymentUrl(address: string, amount: string, orderId: string): string {
  // Create a custom payment page URL
  const customUrl = `${window.location.origin}/pay-base?to=${address}&amount=${amount}&order=${orderId}`
  
  return customUrl
}

// Function to get current ETH price (you might want to implement this)
export async function getETHPrice(): Promise<number> {
  try {
    // You can integrate with CoinGecko, CoinMarketCap, or other price APIs
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    return data.ethereum.usd
  } catch (error) {
    console.error('Error fetching ETH price:', error)
    return 2500 // Fallback price
  }
}