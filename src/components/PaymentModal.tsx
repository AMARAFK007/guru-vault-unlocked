import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Bitcoin, Lock, Shield, CheckCircle, Clock, Users, Star, TrendingDown, Gift } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: 'gumroad' | 'cryptomus';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  acceptedMethods: string[];
  processingTime: string;
  url: string;
  badge?: string;
}

const GUMROAD_URL = "https://learnforless.gumroad.com/l/dzhwd";
const CRYPTOMUS_URL = "https://cryptomus.com/"; // Replace with your actual Cryptomus payment link

const paymentMethods: PaymentMethod[] = [
  {
    id: 'gumroad',
    name: 'Gumroad Checkout',
    description: 'Credit/debit cards, PayPal, and more',
    icon: CreditCard,
    acceptedMethods: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
    processingTime: 'Instant',
    url: GUMROAD_URL
  },
  {
    id: 'cryptomus',
    name: 'Cryptomus',
    description: 'Cryptocurrency payments - Save $2 + Get FREE Bonus',
    icon: Bitcoin,
    acceptedMethods: ['Bitcoin', 'Ethereum', 'USDT', 'USDC', 'BNB', '+ 100 more'],
    processingTime: 'Instant',
    url: CRYPTOMUS_URL,
    badge: 'RECOMMENDED'
  }
];

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('cryptomus'); // Default to crypto
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 1 hour countdown

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 3600; // Reset to 1 hour
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedMethod(method.id);
    
    // Track payment method selection (optional analytics)
    console.log(`Payment method selected: ${method.name}`);
    
    // Redirect to payment gateway
    window.open(method.url, '_blank', 'noopener,noreferrer');
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
      setSelectedMethod('cryptomus'); // Reset to crypto default
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/60 z-50" aria-hidden="true" />
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl relative z-50">
        <DialogHeader className="space-y-4 pb-6">
          <div className="text-center space-y-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-sm font-semibold">
              ⏰ LIMITED TIME OFFER - ENDS IN {formatTime(timeLeft)}
            </Badge>
            <DialogTitle className="text-3xl font-bold text-slate-800">
              Unlock Lifetime Access
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your payment method below. 
              <span className="font-semibold text-blue-600"> Save $2 and get a $47 bonus eBook when you pay with Cryptomus.</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Mobile: Cryptomus first, Desktop: Gumroad left, Cryptomus spans 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Cryptomus Card - Mobile First, Desktop Right */}
          <Card 
            className={`relative cursor-pointer transition-all duration-300 lg:col-span-2 lg:order-2 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl shadow-lg ${
              selectedMethod === 'cryptomus' ? 'ring-4 ring-blue-500/50 shadow-2xl border-blue-400' : 'hover:border-blue-300'
            }`}
            onClick={() => handlePaymentSelect(paymentMethods[1])}
          >
            {/* Recommended Badge */}
            <Badge className="absolute -top-3 left-6 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-sm font-bold shadow-lg">
              ✓ RECOMMENDED
            </Badge>
            
            <CardContent className="p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <Bitcoin className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-800">Cryptomus Payment</h3>
                  <p className="text-blue-600 font-semibold">Save $2.01 + Get FREE $47 Bonus</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6 p-4 bg-white rounded-xl border border-blue-200">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl lg:text-4xl font-bold text-blue-600">$14.99</span>
                  <div className="text-right">
                    <span className="text-lg text-slate-400 line-through block">$17.00</span>
                    <Badge className="bg-red-500 text-white text-xs font-bold">SAVE $2.01</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Best price available</p>
              </div>

              {/* FREE Bonus */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">FREE BONUS INCLUDED</span>
                </div>
                <p className="text-sm text-green-700 font-medium">
                  "Looksmaxxing Life-Changing" eBook (normally $47)
                  <br />
                  <span className="text-xs">+ Priority Support + VIP Access</span>
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">Instant processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">Lowest fees (0.5%)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">256-bit SSL encrypted</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">Priority support & VIP access</span>
                </div>
              </div>

              {/* Accepted Cryptos */}
              <div className="space-y-2 mb-6">
                <div className="text-sm font-semibold text-slate-700">Accepted cryptocurrencies:</div>
                <div className="flex flex-wrap gap-2">
                  {['Bitcoin', 'Ethereum', 'USDT', 'USDC', 'BNB'].map((crypto) => (
                    <Badge 
                      key={crypto} 
                      variant="secondary" 
                      className={`text-xs ${
                        crypto === 'USDT' 
                          ? 'bg-green-100 text-green-800 border-green-300 font-bold' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {crypto}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                    +100 more
                  </Badge>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                disabled={selectedMethod !== null && selectedMethod !== 'cryptomus'}
              >
                {selectedMethod === 'cryptomus' ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Get Crypto Deal Now
                  </>
                )}
              </Button>

              {/* Social Proof */}
              <div className="text-center mt-4 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-700">4.9/5 rating</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                  <Users className="w-3 h-3" />
                  <span className="font-medium">47 people chose crypto in the last hour</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gumroad Card - Desktop Left, Mobile Second */}
          <Card 
            className={`relative cursor-pointer transition-all duration-300 lg:order-1 border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:shadow-lg ${
              selectedMethod === 'gumroad' ? 'ring-2 ring-slate-400' : ''
            }`}
            onClick={() => handlePaymentSelect(paymentMethods[0])}
          >
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Gumroad Checkout</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-slate-600">$17.00</span>
                </div>
                <p className="text-sm text-slate-500">Standard pricing</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Processing: Instant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="w-4 h-4" />
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>Trusted by 10,000+ customers</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="text-xs font-medium text-slate-600 mb-2">Accepted payments:</div>
                <div className="flex flex-wrap gap-1">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((payment) => (
                    <Badge key={payment} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                      {payment}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-slate-500 hover:bg-slate-600 text-white font-medium py-3"
                disabled={selectedMethod !== null && selectedMethod !== 'gumroad'}
              >
                {selectedMethod === 'gumroad' ? 'Processing...' : 'Pay $17 with Gumroad'}
              </Button>
              
              <p className="text-xs text-slate-400 text-center mt-2 italic">
                No bonus eBook • $2 higher price
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-800">30-Day Money-Back Guarantee</span>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Both payment methods are secure and encrypted. Choose Cryptomus to save $2 and get exclusive bonuses, 
              or stick with Gumroad for standard pricing.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                SSL Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Trusted by 10,000+
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Instant Access
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
