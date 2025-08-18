import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Bitcoin, ExternalLink, Shield, Clock, Gift, Zap, TrendingDown, Users, Star, DollarSign } from "lucide-react";
import gumroadLogo from "@/assets/gumroad-logo.ico";

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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Limited Time Offer
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-medium">
            <span className="text-purple-600 font-bold">Save $2 + Get FREE Bonus with Crypto</span>
            <br />
            <span className="text-muted-foreground">Get lifetime access to 50TB+ premium courses</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {paymentMethods.map((method) => {
            const isCrypto = method.id === 'cryptomus';
            const price = isCrypto ? '$14.99' : '$17.00';
            const savings = isCrypto ? 'SAVE $2.01!' : '';
            
            return (
              <Card 
                key={method.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isCrypto
                    ? 'border-2 border-purple-400 shadow-xl shadow-purple-500/20 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 hover:shadow-purple-500/30'
                    : 'border border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-85'
                } ${
                  selectedMethod === method.id 
                    ? 'ring-4 ring-purple-500/50 shadow-2xl' 
                    : isCrypto ? 'hover:shadow-xl' : 'hover:shadow-lg'
                }`}
                onClick={() => handlePaymentSelect(method)}
              >
                {method.badge && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-3 left-4 z-10 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 text-xs font-bold shadow-lg"
                  >
                    BEST VALUE + FREE BONUS
                  </Badge>
                )}
                
                {isCrypto && (
                  <div className="absolute -top-2 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg">
                      PREMIUM
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
                    <div className={`relative flex items-center justify-center w-14 h-14 rounded-xl ${
                      isCrypto 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {isCrypto ? (
                        <div className="relative">
                          <method.icon className="w-7 h-7 text-white" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <DollarSign className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <method.icon className="w-7 h-7 text-white opacity-80" />
                          <img src={gumroadLogo} alt="Gumroad" className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full p-0.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold text-xl ${isCrypto ? 'text-purple-700' : 'text-gray-600'}`}>{method.name}</h3>
                      <p className={`text-sm ${isCrypto ? 'text-purple-600' : 'text-muted-foreground'}`}>{method.description}</p>
                    </div>
                  </div>

                  {/* Special Crypto Benefits */}
                  {isCrypto && (
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg mb-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-purple-800">EXCLUSIVE CRYPTO BONUS</span>
                      </div>
                      <p className="text-sm text-purple-700 font-medium">
                        FREE "Looksmaxxing Life Changing" eBook ($47 Value) 
                        <br />
                        <span className="text-xs">+ Priority Support + VIP Access</span>
                      </p>
                    </div>
                  )}

                    <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className={`w-4 h-4 ${isCrypto ? 'text-purple-500' : 'text-muted-foreground'}`} />
                      <span className={isCrypto ? 'text-purple-600 font-bold' : 'text-muted-foreground'}>
                        Processing: {method.processingTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className={isCrypto ? 'text-purple-600' : 'text-muted-foreground'}>256-bit SSL Encrypted</span>
                    </div>

                    {isCrypto && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingDown className="w-4 h-4 text-purple-500" />
                        <span className="text-purple-600 font-medium">Lowest Fees (0.5%)</span>
                      </div>
                    )}

                      <div className="space-y-2">
                      <div className={`text-sm font-medium ${isCrypto ? 'text-purple-700' : 'text-muted-foreground'}`}>Accepted:</div>
                      <div className="flex flex-wrap gap-1">
                        {method.acceptedMethods.slice(0, 3).map((payment) => (
                          <Badge 
                            key={payment} 
                            variant="secondary" 
                            className={`text-xs ${
                              payment === 'USDT' ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold' : 
                              isCrypto ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {payment === 'USDT' ? 'USDT' : payment}
                          </Badge>
                        ))}
                        {method.acceptedMethods.length > 3 && (
                          <Badge variant="secondary" className={`text-xs ${isCrypto ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            +{method.acceptedMethods.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full mt-6 group font-bold text-lg py-6 transition-all duration-300 ${
                      isCrypto 
                        ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 opacity-60 hover:opacity-75'
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
                        {isCrypto ? 'GET CRYPTO DEAL NOW' : `Pay ${price} with ${method.name}`}
                        <ExternalLink className={`w-4 h-4 ml-2 transition-transform ${isCrypto ? 'group-hover:translate-x-1' : ''}`} />
                      </>
                    )}
                  </Button>

                  {isCrypto && (
                    <div className="text-center mt-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-purple-600">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">47 people chose crypto in the last hour</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guarantee */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="font-medium">30-day money-back guarantee + Lifetime access</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Both payment methods are secure. Choose crypto to save money and get exclusive bonuses.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
