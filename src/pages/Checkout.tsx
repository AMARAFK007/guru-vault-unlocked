import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Shield, ArrowLeft, CheckCircle, Star, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Checkout() {
  const [email, setEmail] = useState("");
  const { user } = useAuth();

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
              {/* Payment Not Configured Notice */}
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Payment Gateway Not Configured</h3>
                  <p className="text-white/70 text-sm">
                    Please configure a payment provider to enable checkout functionality.
                  </p>
                </div>
              </div>

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
                    disabled
                  />
                  <p className="text-white/60 text-xs sm:text-sm mt-1">
                    Configure payment provider to enable checkout
                  </p>
                </div>

                {/* Purchase Button */}
                <Button
                  type="button"
                  disabled
                  className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 text-white border-0 rounded-xl sm:rounded-2xl shadow-xl opacity-50 cursor-not-allowed"
                >
                  <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Payment Not Available</span>
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
