import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Download, Mail, ArrowRight, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Success() {
  const [searchParams] = useSearchParams()
  const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading')
  const [orderData, setOrderData] = useState<any>(null)

  const DOWNLOAD_URL = "https://drive.google.com/file/d/1CDjpMw15UiLq4cEnJiCFVSu7v3J9L_TM/view?usp=sharing"

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get order ID or payment ID from URL params
        const orderId = searchParams.get('order_id')
        const paymentId = searchParams.get('payment_id')
        
        if (orderId || paymentId) {
          // Check order status in database
          let query = supabase.from('orders').select('*')
          
          if (orderId) {
            query = query.eq('id', orderId)
          } else if (paymentId) {
            query = query.eq('payment_id', paymentId)
          }
          
          const { data, error } = await query.single()
          
          if (error) {
            console.error('Error fetching order:', error)
            setOrderStatus('error')
          } else if (data) {
            setOrderData(data)
            setOrderStatus(data.status === 'completed' ? 'success' : 'pending')
          } else {
            setOrderStatus('error')
          }
        } else {
          // No order info in URL, show generic success
          setOrderStatus('success')
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        setOrderStatus('error')
      }
    }

    checkPaymentStatus()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader>
            {orderStatus === 'loading' && (
              <>
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <CardTitle>Checking Payment Status...</CardTitle>
                <CardDescription>Please wait while we verify your payment</CardDescription>
              </>
            )}
            
            {orderStatus === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <CardTitle className="text-green-700">Payment Successful!</CardTitle>
                <CardDescription>
                  Thank you for your purchase. Your course is ready for download.
                </CardDescription>
              </>
            )}
            
            {orderStatus === 'pending' && (
              <>
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <CardTitle className="text-yellow-700">Payment Pending</CardTitle>
                <CardDescription>
                  Your payment is being processed. You'll receive access once confirmed.
                </CardDescription>
              </>
            )}
            
            {orderStatus === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <CardTitle className="text-red-700">Payment Issue</CardTitle>
                <CardDescription>
                  There was an issue with your payment. Please contact support.
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {orderData && (
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold mb-2">Order Details</h4>
                <div className="text-sm space-y-1">
                  <div>Email: {orderData.email}</div>
                  <div>Amount: ${orderData.amount}</div>
                  <div>Status: <span className="capitalize">{orderData.status}</span></div>
                  <div>Date: {new Date(orderData.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            )}
            
            {orderStatus === 'success' && (
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Download className="w-4 h-4" />
                    <span className="font-semibold">Your Course Bundle</span>
                  </div>
                  <div className="text-sm text-green-600 space-y-1">
                    <div>✅ Complete Course Bundle</div>
                    <div>✅ Bonus Looksmaxxing eBook</div>
                    <div>✅ Lifetime Access</div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(DOWNLOAD_URL, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Your Course Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to Homepage
                  </Link>
                </Button>
              </div>
            )}
            
            {orderStatus === 'pending' && (
              <div className="space-y-3">
                <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-700">
                  <p>Your payment is being processed. This usually takes a few minutes for cryptocurrency payments.</p>
                  <p className="mt-2">You'll receive an email confirmation once the payment is complete.</p>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Back to Homepage</Link>
                </Button>
              </div>
            )}
            
            {orderStatus === 'error' && (
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg text-sm text-red-700">
                  <p>If you believe this is an error, please contact our support team with your order details.</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/">Homepage</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="mailto:support@learnforless.com">Contact Support</a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}