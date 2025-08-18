import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Bitcoin, ExternalLink, Shield, Clock } from "lucide-react";

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
    url: GUMROAD_URL,
    badge: 'Most Popular'
  },
  {
    id: 'cryptomus',
    name: 'Cryptomus',
    description: 'Pay with cryptocurrency - Bitcoin, Ethereum, USDT & 100+ more',
    icon: Bitcoin,
    acceptedMethods: ['Bitcoin', 'Ethereum', 'USDT', 'USDC', 'Litecoin', '+ 100 more'],
    processingTime: '5-15 minutes',
    url: CRYPTOMUS_URL
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
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Payment Method
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Get lifetime access to 50TB+ premium courses for just $15
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {paymentMethods.map((method) => (
            <Card 
              key={method.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedMethod === method.id 
                  ? 'border-primary shadow-lg' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handlePaymentSelect(method)}
            >
              {method.badge && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 left-4 z-10 bg-primary text-primary-foreground"
                >
                  {method.badge}
                </Badge>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Processing: {method.processingTime}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>Secure & Encrypted</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Accepted:</div>
                    <div className="flex flex-wrap gap-1">
                      {method.acceptedMethods.slice(0, 3).map((payment) => (
                        <Badge key={payment} variant="secondary" className="text-xs">
                          {payment}
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
                  className="w-full mt-4 group"
                  variant={selectedMethod === method.id ? "default" : "outline"}
                  disabled={selectedMethod !== null && selectedMethod !== method.id}
                >
                  {selectedMethod === method.id ? 'Opening...' : `Pay with ${method.name}`}
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>30-day money-back guarantee</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Both payment methods are secure and provide instant access to your courses
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
