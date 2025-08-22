import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Shield, CreditCard, Bitcoin, ArrowLeft, CheckCircle, Star, Sparkles } from "lucide-react";
import gumroadLogo from "@/assets/gumroad-logo.ico";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { createCryptomusInvoice } from "@/lib/cryptomus";

interface PaymentMethod {
  id: 'gumroad' | 'cryptomus';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  logo?: string;
}

const GUMROAD_URL = "https://learnforless.gumroad.com/l/dzhwd";

// Cryptomus configuration
const CRYPTOMUS_MERCHANT_ID = "6260dd74-c31d-46d2-ab06-176ada669ccd";
const CRYPTOMUS_BASE_URL = "https://pay.cryptomus.com/pay";

// Generate fallback Cryptomus payment URL (if API fails)
const generateFallbackCryptomusURL = (email: string, amount: number, orderId: string) => {
  // Fallback URL in case API invoice creation fails
  const params = new URLSearchParams({
    merchant: CRYPTOMUS_MERCHANT_ID,
    amount: amount.toString(),
    currency: 'USD',
    order_id: orderId,
    email: email,
    description: 'LearnforLess Course Bundle'
  });
  
  return `${CRYPTOMUS_BASE_URL}?${params.toString()}`;
};

// Payment methods - URLs will be generated at payment time
const paymentMethods: PaymentMethod[] = [
  {
    id: 'gumroad',
    name: 'Gumroad',
    description: 'Credit/debit cards, PayPal, and more - $14.99',
    icon: CreditCard,
    url: GUMROAD_URL,
    logo: gumroadLogo
  },
  {
    id: 'cryptomus',
    name: 'Cryptomus',
    description: 'Cryptocurrency payments - $12.99 + FREE Looksmaxxing eBook',
    icon: Bitcoin,
    url: '' // Will be generated dynamically
  }
];

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<'gumroad' | 'cryptomus'>('cryptomus');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, signInWithMagicLink } = useAuth();

  // Removed test function to avoid import issues

  // Simple mobile-optimized effect
  useEffect(() => {
    // Only add mouse effect on non-touch devices for better performance
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handlePaymentSelect = async (methodId: 'gumroad' | 'cryptomus') => {
    if (!email.trim()) {
      document.getElementById('email')?.focus();
      return;
    }

    setIsProcessing(true);
    
    try {
      const method = paymentMethods.find(m => m.id === methodId);
      
      if (!method) {
        throw new Error('Payment method not found');
      }

      // Create order record in Supabase
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            email: email,
            payment_provider: method.id,
            amount: method.id === 'gumroad' ? 14.99 : 12.99,
            status: 'pending',
            metadata: { order_id: orderId }
          }
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error('Failed to create order');
      }

      console.log('Order created:', orderData);
      let paymentUrl = method.url;
      
      if (method.id === 'cryptomus') {
        console.log('Setting up Cryptomus payment...');
        
        // Try to create invoice via API first
        try {
          const cryptomusInvoice = await createCryptomusInvoice({
            amount: '12.99',
            currency: 'USD',
            order_id: orderId,
            url_return: `${window.location.origin}/success?order_id=${orderData.id}`,
            url_callback: `https://zsjsgxjihmampbcdkzmw.supabase.co/functions/v1/payment-webhook`,
            email: email,
            additional_data: JSON.stringify({ 
              platform: 'LearnforLess',
              package: 'Complete Course Bundle',
              order_db_id: orderData.id
            })
          });

          if (cryptomusInvoice && cryptomusInvoice.url) {
            paymentUrl = cryptomusInvoice.url;
            console.log('✅ Cryptomus invoice created:', cryptomusInvoice.uuid);
            
            // Update order with payment ID
            await supabase
              .from('orders')
              .update({ 
                payment_id: cryptomusInvoice.uuid,
                metadata: { 
                  ...((orderData.metadata as Record<string, any>) || {}), 
                  cryptomus_invoice: {
                    uuid: cryptomusInvoice.uuid,
                    order_id: cryptomusInvoice.order_id,
                    amount: cryptomusInvoice.amount,
                    currency: cryptomusInvoice.currency,
                    url: cryptomusInvoice.url,
                    status: cryptomusInvoice.status
                  }
                }
              })
              .eq('id', orderData.id);
          } else {
            throw new Error('Invalid invoice response');
          }
        } catch (apiError) {
          console.warn('Cryptomus API failed, using fallback URL:', apiError);
          // Use fallback URL if API fails
          paymentUrl = generateFallbackCryptomusURL(email, 12.99, orderId);
        }
      }

      if (!paymentUrl) {
        throw new Error('Could not generate payment URL');
      }

      console.log('Opening payment URL:', paymentUrl);
      
      // Open payment page
      setTimeout(() => {
        window.open(paymentUrl, '_blank', 'noopener,noreferrer');
        setIsProcessing(false);
      }, 500);
      
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      alert('Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Simplified mobile-optimized background */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: `
            radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              rgba(59, 130, 246, 0.1) 0%, 
              rgba(147, 51, 234, 0.08) 35%, 
              rgba(16, 185, 129, 0.05) 70%, 
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(59, 130, 246, 0.05) 0%, 
              rgba(147, 51, 234, 0.03) 50%, 
              rgba(16, 185, 129, 0.05) 100%
            )
          `
        }}
      />
      
      {/* Simplified floating orbs for better mobile performance */}
      <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-blue-500/8 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 sm:w-80 h-48 sm:h-80 bg-purple-500/8 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-32 sm:w-60 h-32 sm:h-60 bg-emerald-500/6 rounded-full blur-xl sm:blur-3xl" />

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 text-white/70 hover:text-white transition-colors duration-200 group active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base font-medium">Back</span>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm text-white/60 font-medium">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-6 sm:py-8">
        <div className="max-w-lg mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
              Complete Your Purchase
            </h1>
            <p className="text-base sm:text-lg text-white/70 mb-4 sm:mb-6 px-2">
              Fast, secure checkout
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-white/50 flex-wrap">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden relative">
            {/* Simplified inner glow for mobile performance */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/8 via-transparent to-white/4 pointer-events-none" />
            
            <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
              <form className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 sm:h-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/10 focus:border-blue-400/50 transition-all duration-200 text-base"
                    required
                  />
                  {!email.trim() && (
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      Enter your email to continue with checkout
                    </p>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label className="text-white font-medium text-sm">
                    Choose Payment Method
                  </Label>
                  
                  <div className="grid gap-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`relative cursor-pointer transition-all duration-200 rounded-xl sm:rounded-2xl active:scale-[0.98] ${
                          selectedMethod === method.id
                            ? 'ring-2 ring-blue-400/50 bg-white/10 shadow-xl shadow-blue-500/20'
                            : 'bg-white/5 hover:bg-white/8 active:bg-white/10'
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        {selectedMethod === method.id && (
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/8 via-transparent to-purple-500/8 pointer-events-none" />
                        )}
                        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-sm relative z-10">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {/* Payment method icon/logo */}
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 relative overflow-hidden">
                              {method.id === 'gumroad' && method.logo ? (
                                <img 
                                  src={method.logo} 
                                  alt="Gumroad" 
                                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter brightness-0 invert"
                                />
                              ) : (
                                <method.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${method.id === 'cryptomus' ? 'text-orange-400' : 'text-white'}`} />
                              )}
                              {method.id === 'cryptomus' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10" />
                              )}
                            </div>
                            
                            {/* Method details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start sm:items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-white font-semibold text-base sm:text-lg">
                                  {method.name}
                                </h3>
                                {method.id === 'cryptomus' && (
                                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                    BEST DEAL
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-white/60 text-xs sm:text-sm">
                                  {method.id === 'gumroad' ? 'Credit/debit cards, PayPal, and more' : 'Cryptocurrency payments'}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-white font-semibold text-sm sm:text-base">
                                    {method.id === 'gumroad' ? '$14.99' : '$12.99'}
                                  </span>
                                  {method.id === 'gumroad' && (
                                    <span className="text-white/40 text-xs">Standard price</span>
                                  )}
                                  {method.id === 'cryptomus' && (
                                    <span className="text-emerald-400 text-xs sm:text-sm font-medium">Save $2.00</span>
                                  )}
                                </div>
                                {method.id === 'cryptomus' && (
                                  <div className="flex items-start gap-2 mt-2">
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-yellow-400 text-xs sm:text-sm font-medium leading-tight">
                                      FREE Looksmaxxing eBook (Worth $47)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Selection indicator */}
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${
                              selectedMethod === method.id
                                ? 'border-blue-400 bg-blue-400'
                                : 'border-white/30'
                            }`}>
                              {selectedMethod === method.id && (
                                <CheckCircle className="w-full h-full text-black" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button */}
                <Button
                  type="button"
                  onClick={() => {
                    if (email.trim()) {
                      handlePaymentSelect(selectedMethod);
                    } else {
                      // Focus on email field if empty
                      document.getElementById('email')?.focus();
                    }
                  }}
                  disabled={!email.trim() || isProcessing}
                  className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hover:from-blue-600 hover:via-purple-600 hover:to-emerald-600 text-white border-0 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 group relative overflow-hidden touch-manipulation"
                >
                  {/* Simplified glow for mobile */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl sm:rounded-2xl" />
                  
                  <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : !email.trim() ? (
                      <>
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Enter Email to Continue</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Buy Now - {selectedMethod === 'gumroad' ? '$14.99' : '$12.99'}</span>
                      </>
                    )}
                  </div>
                </Button>

                {/* Security Notice */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-white/60">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm font-medium">Secure Checkout</span>
                  </div>
                  
                  <p className="text-xs text-white/40 max-w-sm mx-auto px-4 leading-relaxed">
                    Secure payment processing. We don't store card details.
                  </p>
                  
                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-2 sm:gap-4 pt-2 flex-wrap">
                    <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20 text-xs px-2 py-1">
                      SSL Secured
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20 text-xs px-2 py-1">
                      Instant Access
                    </Badge>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>


    </div>
  );
}
