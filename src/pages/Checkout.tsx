import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Shield, CreditCard, Bitcoin, ArrowLeft, CheckCircle, Star, Sparkles } from "lucide-react";
import gumroadLogo from "@/assets/gumroad-logo.ico";

interface PaymentMethod {
  id: 'gumroad' | 'cryptomus';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  logo?: string;
}

const GUMROAD_URL = "https://learnforless.gumroad.com/l/dzhwd";
const CRYPTOMUS_URL = "https://pay.cryptomus.com/pay/YOUR_INVOICE_ID"; // Replace YOUR_INVOICE_ID with actual invoice ID from Cryptomus

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
    url: CRYPTOMUS_URL
  }
];

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<'gumroad' | 'cryptomus'>('cryptomus');
  const [isProcessing, setIsProcessing] = useState(false);

  // Animated gradient background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setIsProcessing(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      window.open(method.url, '_blank', 'noopener,noreferrer');
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden" style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              rgba(59, 130, 246, 0.15) 0%, 
              rgba(147, 51, 234, 0.1) 35%, 
              rgba(16, 185, 129, 0.05) 70%, 
              transparent 100%
            ),
            conic-gradient(from 0deg at 50% 50%, 
              rgba(59, 130, 246, 0.1) 0deg, 
              rgba(147, 51, 234, 0.05) 120deg, 
              rgba(16, 185, 129, 0.1) 240deg, 
              rgba(59, 130, 246, 0.1) 360deg
            )
          `
        }}
      />
      
      {/* Enhanced floating orbs with more variation */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-3000" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-pink-500/8 rounded-full blur-3xl animate-pulse delay-4000" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-white/60 font-medium">Encrypted & Protected Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Complete Your Purchase Securely
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-6">
              Fast, safe checkout powered by Gumroad & Cryptomus
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/50 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-transparent via-black/20 to-transparent pointer-events-none" />
            
            <CardContent className="p-6 sm:p-8 md:p-12 relative z-10">
              <form className="space-y-8">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/10 focus:border-blue-400/50 transition-all duration-300"
                    required
                  />
                  {!email.trim() && (
                    <p className="text-white/60 text-sm mt-1">
                      Enter your email to continue with checkout
                    </p>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <Label className="text-white font-medium">
                    Choose Payment Method
                  </Label>
                  
                  <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`relative cursor-pointer transition-all duration-300 rounded-2xl ${
                          selectedMethod === method.id
                            ? 'ring-2 ring-blue-400/50 bg-white/10 shadow-2xl shadow-blue-500/20'
                            : 'bg-white/5 hover:bg-white/8 hover:shadow-xl hover:shadow-white/5'
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        {selectedMethod === method.id && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                        )}
                        <div className="p-6 rounded-2xl border border-white/10 backdrop-blur-sm relative z-10">
                          <div className="flex items-center gap-4">
                            {/* Payment method icon/logo */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 relative overflow-hidden">
                              {method.id === 'gumroad' && method.logo ? (
                                <img 
                                  src={method.logo} 
                                  alt="Gumroad" 
                                  className="w-6 h-6 object-contain filter brightness-0 invert"
                                />
                              ) : (
                                <method.icon className={`w-6 h-6 ${method.id === 'cryptomus' ? 'text-orange-400' : 'text-white'}`} />
                              )}
                              {method.id === 'cryptomus' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10" />
                              )}
                            </div>
                            
                            {/* Method details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-semibold text-lg">
                                  {method.name}
                                </h3>
                                {method.id === 'cryptomus' && (
                                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                    BEST DEAL
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-white/60 text-sm">
                                  {method.id === 'gumroad' ? 'Credit/debit cards, PayPal, and more' : 'Cryptocurrency payments'}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-semibold">
                                    {method.id === 'gumroad' ? '$14.99' : '$12.99'}
                                  </span>
                                  {method.id === 'gumroad' && (
                                    <span className="text-white/40 text-sm">Standard price</span>
                                  )}
                                  {method.id === 'cryptomus' && (
                                    <span className="text-emerald-400 text-sm font-medium">Save $2.00</span>
                                  )}
                                </div>
                                {method.id === 'cryptomus' && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    <span className="text-yellow-400 text-sm font-medium">
                                      FREE Looksmaxxing Life-Changing eBook (Worth $47)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Selection indicator */}
                            <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
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
                    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
                    if (selectedPaymentMethod && email.trim()) {
                      handlePaymentSelect(selectedPaymentMethod);
                    } else if (!email.trim()) {
                      // Focus on email field if empty
                      document.getElementById('email')?.focus();
                    }
                  }}
                  disabled={!email.trim() || isProcessing}
                  className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hover:from-blue-600 hover:via-purple-600 hover:to-emerald-600 text-white border-0 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 group relative overflow-hidden"
                >
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    {isProcessing ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : !email.trim() ? (
                      <>
                        <Lock className="w-6 h-6" />
                        <span>Enter Email to Continue</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-6 h-6" />
                        <span>Buy Now - {selectedMethod === 'gumroad' ? '$14.99' : '$12.99'}</span>
                      </>
                    )}
                  </div>
                </Button>

                {/* Security Notice */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-white/60">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium">Encrypted & Protected Checkout</span>
                  </div>
                  
                  <p className="text-xs text-white/40 max-w-md mx-auto">
                    Your payment information is processed securely. We don't store credit card details and follow industry standards for data protection.
                  </p>
                  
                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
                      SSL Secured
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
                      30-Day Guarantee
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
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
