import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Bitcoin, ExternalLink, Shield, Clock, Gift, Zap, TrendingDown, Users, Star } from "lucide-react";

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
    name: 'Gumroad',
    description: 'Pay with credit/debit cards, PayPal, and more',
    icon: CreditCard,
    acceptedMethods: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
    processingTime: 'Instant',
    url: GUMROAD_URL
  },
  {
    id: 'cryptomus',
    name: 'Cryptomus',
    description: 'Pay with cryptocurrency - Bitcoin, Ethereum, USDT & 100+ more',
    icon: Bitcoin,
    acceptedMethods: ['Bitcoin', 'Ethereum', 'USDT', 'USDC', 'Litecoin', '+ 100 more'],
    processingTime: 'Instant',
    url: CRYPTOMUS_URL,
    badge: '🎁 BEST VALUE + FREE BONUS'
  }
];

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedMethod(method.id);
    
    // Track payment method selection (optional analytics)
    console.log(`Payment method selected: ${method.name}`);
    
    // Redirect to payment gateway
    window.open(method.url, '_blank', 'noopener,noreferrer');
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
      setSelectedMethod(null);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            🔥 LIMITED TIME OFFER 🔥
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-medium">
            <span className="text-green-600 font-bold">💎 Save $2 + Get FREE Bonus with Crypto!</span>
            <br />
            <span className="text-muted-foreground">Get lifetime access to 50TB+ premium courses</span>
          </DialogDescription>
        </DialogHeader>

        {/* Urgency Banner */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2 px-4 rounded-lg mb-4">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="font-bold text-sm">⚡ Over 1,247 people bought this week!</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {paymentMethods.map((method) => {
            const isCrypto = method.id === 'cryptomus';
            const price = isCrypto ? '$14.99' : '$17.00';
            const savings = isCrypto ? 'SAVE $2.01!' : '';
            
            return (
              <Card 
                key={method.id}
                className={`relative cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  isCrypto
                    ? 'border-green-400 shadow-2xl shadow-green-500/20 bg-gradient-to-br from-green-50/50 to-emerald-50/50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${
                  selectedMethod === method.id 
                    ? 'ring-4 ring-primary/50 shadow-2xl' 
                    : 'hover:shadow-xl'
                }`}
                onClick={() => handlePaymentSelect(method)}
              >
                {method.badge && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-3 left-4 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-xs font-bold animate-pulse"
                  >
                    {method.badge}
                  </Badge>
                )}
                
                {isCrypto && (
                  <div className="absolute -top-2 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold animate-bounce">
                      🔥 HOT DEAL!
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6">
                  {/* Price Section */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">{price}</span>
                      {isCrypto && (
                        <span className="text-lg text-gray-500 line-through">$17.00</span>
                      )}
                    </div>
                    {savings && (
                      <Badge className="bg-red-500 text-white font-bold text-xs">
                        {savings}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${
                      isCrypto 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                      <method.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>

                  {/* Special Crypto Benefits */}
                  {isCrypto && (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg mb-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800">🎁 EXCLUSIVE CRYPTO BONUS!</span>
                      </div>
                      <p className="text-sm text-green-700 font-medium">
                        FREE "Looksmaxxing Life Changing" eBook ($47 Value) 
                        <br />
                        <span className="text-xs">+ Priority Support + VIP Access</span>
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className={`w-4 h-4 ${isCrypto ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <span className={isCrypto ? 'text-green-600 font-bold' : ''}>
                        Processing: {method.processingTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span>256-bit SSL Encrypted</span>
                    </div>

                    {isCrypto && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingDown className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">Lowest Fees (0.5%)</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Accepted:</div>
                      <div className="flex flex-wrap gap-1">
                        {method.acceptedMethods.slice(0, 3).map((payment) => (
                          <Badge 
                            key={payment} 
                            variant="secondary" 
                            className={`text-xs ${
                              payment === 'USDT' ? 'bg-green-100 text-green-800 border-green-300' : ''
                            }`}
                          >
                            {payment === 'USDT' ? '💰 USDT' : payment}
                          </Badge>
                        ))}
                        {method.acceptedMethods.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{method.acceptedMethods.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full mt-6 group font-bold text-lg py-6 ${
                      isCrypto 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    }`}
                    disabled={selectedMethod !== null && selectedMethod !== method.id}
                  >
                    {selectedMethod === method.id ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Opening...
                      </span>
                    ) : (
                      <>
                        {isCrypto ? '🚀 GET CRYPTO DEAL NOW!' : `💳 Pay ${price} with ${method.name}`}
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {isCrypto && (
                    <div className="text-center mt-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">47 people chose crypto in the last hour!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Social Proof & Guarantee */}
        <div className="mt-8 space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-yellow-800">4.9/5 from 15,247+ students</span>
            </div>
            <p className="text-center text-sm text-yellow-700">
              "Best investment I've made! The crypto payment was instant and I got the bonus ebook!" - Sarah M.
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span className="font-medium">30-day money-back guarantee + Lifetime access</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Both payment methods are secure. Choose crypto to save money and get exclusive bonuses!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
