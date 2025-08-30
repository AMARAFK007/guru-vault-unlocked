import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, ArrowLeft, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PayBase() {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);
  
  const recipientAddress = searchParams.get('to') || "0xE1E0c8ADf62f291aD8AECc57BACC02835Ac9fe91";
  const amount = searchParams.get('amount') || "0.006";
  const orderId = searchParams.get('order') || "";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openMetaMask = () => {
    // Try to open MetaMask with pre-filled transaction
    const metamaskUrl = `https://metamask.app.link/send/${recipientAddress}@8453?value=${amount}e18`;
    window.open(metamaskUrl, '_blank');
  };

  const markPaymentSent = async () => {
    setPaymentSent(true);
    
    // Update order status to indicate payment was initiated
    if (orderId) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'payment_initiated',
            metadata: { 
              payment_initiated_at: new Date().toISOString(),
              payment_method: 'base_manual'
            }
          })
          .eq('id', orderId);
          
        if (error) {
          console.error('Error updating order:', error);
        }
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-emerald-500/6 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link 
            to="/checkout" 
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Checkout</span>
          </Link>
          
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Base Network
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Complete Payment on Base
            </h1>
            <p className="text-lg text-white/70 mb-6">
              Send ETH directly to our wallet on the Base network
            </p>
          </div>

          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-3xl overflow-hidden relative mb-6">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/8 via-transparent to-white/4 pointer-events-none" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-white">
                <Wallet className="w-6 h-6 text-blue-400" />
                Payment Details
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Amount to Send</label>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-2xl font-bold text-white">{amount} ETH</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    ≈ $14.99 USD
                  </Badge>
                </div>
              </div>

              {/* Recipient Address */}
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Send to Address</label>
                <div className="flex items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
                  <code className="flex-1 text-white font-mono text-sm break-all">
                    {recipientAddress}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(recipientAddress)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Network Info */}
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Network</label>
                <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white font-medium">Base Mainnet</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    Chain ID: 8453
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="grid gap-4 mb-6">
            {/* MetaMask Option */}
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center border border-white/10">
                      <Wallet className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">MetaMask / Web3 Wallet</h3>
                      <p className="text-white/60 text-sm">Open your wallet with pre-filled transaction</p>
                    </div>
                  </div>
                  <Button
                    onClick={openMetaMask}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Option */}
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                      <Copy className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Manual Transfer</h3>
                      <p className="text-white/60 text-sm">Copy details and send from any wallet</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(`${amount} ETH to ${recipientAddress} on Base network`)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Confirmation */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-2xl overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto" />
                <h3 className="text-white font-semibold text-lg">After Sending Payment</h3>
                <p className="text-white/60 text-sm max-w-md mx-auto">
                  Once you've sent the payment, click the button below. We'll verify the transaction on the blockchain and grant access to your courses.
                </p>
                
                {!paymentSent ? (
                  <Button
                    onClick={markPaymentSent}
                    className="w-full max-w-sm bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hover:from-blue-600 hover:via-purple-600 hover:to-emerald-600 text-white"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    I've Sent the Payment
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Payment Submitted!</span>
                    </div>
                    <p className="text-white/60 text-sm">
                      We're verifying your transaction. You'll receive access once confirmed.
                    </p>
                    <Link to="/success" className="inline-block">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Check Status
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="text-yellow-400 font-medium">Important Notes:</h4>
                <ul className="text-yellow-200/80 text-sm space-y-1">
                  <li>• Make sure you're on the Base network (Chain ID: 8453)</li>
                  <li>• Send exactly {amount} ETH to avoid processing delays</li>
                  <li>• Transaction confirmation may take 1-2 minutes</li>
                  <li>• Keep your transaction hash for reference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}