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
    
    // Call our edge function to create the BasePay invoice
    const response = await fetch('https://zsjsgxjihmampbcdkzmw.supabase.co/functions/v1/create-basepay-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzanNneGppaG1hbXBiY2Rrem13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MzIyMjIsImV4cCI6MjA3MTQwODIyMn0.T3Hp0keiACOcfSdT6ZgzW00rFhcmcpDXcpsrY58EsJA'
      },
      body: JSON.stringify(data)
    })

    console.log('📡 BasePay Edge function response status:', response.status)
    const responseText = await response.text()
    console.log('📡 BasePay Edge function response body:', responseText)

    if (!response.ok) {
      console.error(`BasePay Edge function HTTP error: ${response.status} - ${responseText}`)
      // Fallback to local payment creation
      const ethAmount = (parseFloat(data.amount) / 2500).toFixed(6)
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
      console.log('✅ Fallback Base payment created:', payment)
      return payment
    }

    const result = JSON.parse(responseText)
    console.log('📦 Parsed BasePay edge function result:', result)
    
    if (result.success && result.invoice) {
      console.log('✅ BasePay invoice created successfully:', result.invoice.id)
      return {
        id: result.invoice.id,
        order_id: result.invoice.order_id,
        amount: result.invoice.amount,
        currency: result.invoice.currency,
        recipient_address: result.invoice.recipient_address || BASE_WALLET_ADDRESS,
        network: result.invoice.network || 'base',
        payment_url: result.invoice.url,
        status: result.invoice.status
      }
    } else {
      console.error(`BasePay Edge function error: ${result.error || 'Unknown error'}`)
      // Fallback to local payment creation
      const ethAmount = (parseFloat(data.amount) / 2500).toFixed(6)
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
      console.log('✅ Fallback Base payment created:', payment)
      return payment
    }
  } catch (error) {
    console.error('❌ Error creating Base payment:', error)
    // Fallback to local payment creation
    const ethAmount = (parseFloat(data.amount) / 2500).toFixed(6)
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
    console.log('✅ Fallback Base payment created:', payment)
    return payment
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