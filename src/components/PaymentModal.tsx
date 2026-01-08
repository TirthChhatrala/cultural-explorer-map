import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, CreditCard, Smartphone, Building2, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    type: string;
    title: string;
    amount: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    startDate: string;
    endDate: string;
    travelers?: number;
    accommodationType?: string;
    transportMode?: string;
  };
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess
}) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // UPI details
  const [upiId, setUpiId] = useState('');

  const handlePayment = async () => {
    // Validate payment details
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        toast({
          title: 'Missing Details',
          description: 'Please fill in all card details',
          variant: 'destructive'
        });
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast({
          title: 'Invalid Card',
          description: 'Please enter a valid 16-digit card number',
          variant: 'destructive'
        });
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast({
          title: 'Invalid UPI ID',
          description: 'Please enter a valid UPI ID (e.g., name@upi)',
          variant: 'destructive'
        });
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate transaction ID
    const txnId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTransactionId(txnId);
    
    // Save receipt to localStorage
    const receipt = {
      id: txnId,
      date: new Date().toISOString(),
      userId: bookingDetails.guestEmail,
      amount: bookingDetails.amount,
      description: `${bookingDetails.type} - ${bookingDetails.title}`,
      paymentMethod,
      bookingDetails,
      downloadedAt: new Date().toISOString()
    };
    
    const existingReceipts = JSON.parse(localStorage.getItem('tripReceipts') || '[]');
    existingReceipts.push(receipt);
    localStorage.setItem('tripReceipts', JSON.stringify(existingReceipts));

    setIsProcessing(false);
    setPaymentSuccess(true);

    toast({
      title: 'Payment Successful!',
      description: `Transaction ID: ${txnId}`,
    });
  };

  const downloadReceipt = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Header
    pdf.setFillColor(255, 152, 0);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Indian Cultural Explorer', pageWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Payment Receipt', pageWidth / 2, 32, { align: 'center' });
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    
    // Transaction details
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Transaction Details', 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const transactionDetails = [
      `Transaction ID: ${transactionId}`,
      `Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`,
      `Time: ${new Date().toLocaleTimeString('en-IN')}`,
      `Payment Method: ${paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}`,
      `Status: SUCCESSFUL`
    ];
    
    let yPos = 65;
    transactionDetails.forEach(detail => {
      pdf.text(detail, 20, yPos);
      yPos += 8;
    });
    
    // Booking details
    pdf.setFont('helvetica', 'bold');
    pdf.text('Booking Details', 20, yPos + 10);
    yPos += 20;
    
    pdf.setFont('helvetica', 'normal');
    const bookingInfo = [
      `Booking Type: ${bookingDetails.type}`,
      `Package/Service: ${bookingDetails.title}`,
      `Guest Name: ${bookingDetails.guestName}`,
      `Email: ${bookingDetails.guestEmail}`,
      `Phone: ${bookingDetails.guestPhone}`,
      `Travel Date: ${new Date(bookingDetails.startDate).toLocaleDateString('en-IN')} to ${new Date(bookingDetails.endDate).toLocaleDateString('en-IN')}`,
      bookingDetails.travelers ? `Number of Travelers: ${bookingDetails.travelers}` : '',
      bookingDetails.accommodationType ? `Accommodation: ${bookingDetails.accommodationType}` : '',
      bookingDetails.transportMode ? `Transport: ${bookingDetails.transportMode}` : ''
    ].filter(Boolean);
    
    bookingInfo.forEach(info => {
      pdf.text(info, 20, yPos);
      yPos += 8;
    });
    
    // Payment summary
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Summary', 20, yPos + 10);
    yPos += 20;
    
    const taxAmount = Math.round(bookingDetails.amount * 0.05);
    const convenienceFee = 99;
    const totalAmount = bookingDetails.amount + taxAmount + convenienceFee;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Base Amount: Rs. ${bookingDetails.amount.toLocaleString('en-IN')}`, 20, yPos);
    yPos += 8;
    pdf.text(`GST (5%): Rs. ${taxAmount.toLocaleString('en-IN')}`, 20, yPos);
    yPos += 8;
    pdf.text(`Convenience Fee: Rs. ${convenienceFee}`, 20, yPos);
    yPos += 12;
    
    pdf.setDrawColor(200);
    pdf.line(20, yPos - 5, pageWidth - 20, yPos - 5);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(`Total Paid: Rs. ${totalAmount.toLocaleString('en-IN')}`, 20, yPos + 5);
    
    // Footer
    yPos = 250;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    pdf.text('Thank you for choosing Indian Cultural Explorer!', pageWidth / 2, yPos, { align: 'center' });
    pdf.text('For any queries, contact: support@indianculturalexplorer.com', pageWidth / 2, yPos + 8, { align: 'center' });
    pdf.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, yPos + 16, { align: 'center' });
    
    pdf.save(`receipt-${transactionId}.pdf`);
    
    toast({
      title: 'Receipt Downloaded',
      description: 'Your payment receipt has been downloaded as PDF',
    });
  };

  const handleClose = () => {
    if (paymentSuccess) {
      onPaymentSuccess();
    }
    onClose();
    // Reset state
    setPaymentSuccess(false);
    setIsProcessing(false);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setUpiId('');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <AnimatePresence mode="wait">
          {paymentSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">Your booking has been confirmed</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{transactionId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold">₹{(bookingDetails.amount + Math.round(bookingDetails.amount * 0.05) + 99).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking</span>
                  <span className="font-medium">{bookingDetails.title}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={downloadReceipt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button
                  className="flex-1 bg-india-orange hover:bg-orange-600"
                  onClick={handleClose}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
                <DialogDescription>
                  Pay ₹{(bookingDetails.amount + Math.round(bookingDetails.amount * 0.05) + 99).toLocaleString()} for {bookingDetails.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Payment method selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Select Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-3">
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-india-orange cursor-pointer"
                      >
                        <CreditCard className="mb-1 h-5 w-5" />
                        <span className="text-xs">Card</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                      <Label
                        htmlFor="upi"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-india-orange cursor-pointer"
                      >
                        <Smartphone className="mb-1 h-5 w-5" />
                        <span className="text-xs">UPI</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="netbanking" id="netbanking" className="peer sr-only" />
                      <Label
                        htmlFor="netbanking"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-india-orange cursor-pointer"
                      >
                        <Building2 className="mb-1 h-5 w-5" />
                        <span className="text-xs">Bank</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card payment form */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPI payment form */}
                {paymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </motion.div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <p className="text-muted-foreground">
                      You will be redirected to your bank's website to complete the payment.
                    </p>
                  </motion.div>
                )}

                {/* Order summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Base Amount</span>
                      <span>₹{bookingDetails.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span>₹{Math.round(bookingDetails.amount * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Convenience Fee</span>
                      <span>₹99</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{(bookingDetails.amount + Math.round(bookingDetails.amount * 0.05) + 99).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-india-orange hover:bg-orange-600"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ₹${(bookingDetails.amount + Math.round(bookingDetails.amount * 0.05) + 99).toLocaleString()}`
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
