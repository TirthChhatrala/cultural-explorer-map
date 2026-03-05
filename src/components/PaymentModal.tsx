
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, CreditCard, Smartphone, Building2, Download, Loader2, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

export interface PaymentRecord {
  id: string;
  transactionId: string;
  date: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: number;
  baseAmount: number;
  tax: number;
  convenienceFee: number;
  description: string;
  type: string;
  title: string;
  paymentMethod: string;
  status: 'success' | 'failed' | 'cancelled';
  bookingDetails: any;
  failureReason?: string;
}

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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed' | 'cancelled'>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [failureReason, setFailureReason] = useState('');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  const taxAmount = Math.round(bookingDetails.amount * 0.05);
  const convenienceFee = 99;
  const totalAmount = bookingDetails.amount + taxAmount + convenienceFee;

  const savePaymentRecord = (status: 'success' | 'failed' | 'cancelled', txnId: string, reason?: string) => {
    const record: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      transactionId: txnId,
      date: new Date().toISOString(),
      userId: bookingDetails.guestEmail,
      userName: bookingDetails.guestName,
      userEmail: bookingDetails.guestEmail,
      userPhone: bookingDetails.guestPhone,
      amount: totalAmount,
      baseAmount: bookingDetails.amount,
      tax: taxAmount,
      convenienceFee,
      description: `${bookingDetails.type} - ${bookingDetails.title}`,
      type: bookingDetails.type,
      title: bookingDetails.title,
      paymentMethod,
      status,
      bookingDetails,
      failureReason: reason,
    };
    const records = JSON.parse(localStorage.getItem('paymentRecords') || '[]');
    records.push(record);
    localStorage.setItem('paymentRecords', JSON.stringify(records));
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        toast({ title: 'Missing Details', description: 'Please fill in all card details', variant: 'destructive' });
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast({ title: 'Invalid Card', description: 'Please enter a valid 16-digit card number', variant: 'destructive' });
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast({ title: 'Invalid UPI ID', description: 'Please enter a valid UPI ID', variant: 'destructive' });
        return;
      }
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));

    const txnId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTransactionId(txnId);

    // Simulate: 85% success, 10% failed, 5% cancelled
    const rand = Math.random();
    if (rand < 0.85) {
      savePaymentRecord('success', txnId);
      setPaymentStatus('success');
      toast({ title: 'Payment Successful!', description: `Transaction ID: ${txnId}` });
    } else if (rand < 0.95) {
      const reason = 'Payment declined by bank. Please try again or use a different payment method.';
      setFailureReason(reason);
      savePaymentRecord('failed', txnId, reason);
      setPaymentStatus('failed');
      toast({ title: 'Payment Failed', description: reason, variant: 'destructive' });
    } else {
      const reason = 'Transaction was cancelled due to timeout.';
      setFailureReason(reason);
      savePaymentRecord('cancelled', txnId, reason);
      setPaymentStatus('cancelled');
      toast({ title: 'Payment Cancelled', description: reason, variant: 'destructive' });
    }

    setIsProcessing(false);
  };

  const generateProfessionalPDF = () => {
    const pdf = new jsPDF();
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();

    // Top accent bar
    pdf.setFillColor(255, 136, 0);
    pdf.rect(0, 0, pw, 8, 'F');

    // Header section
    pdf.setFillColor(33, 37, 41);
    pdf.rect(0, 8, pw, 45, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INDIAN CULTURAL EXPLORER', pw / 2, 28, { align: 'center' });
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Official Payment Receipt', pw / 2, 38, { align: 'center' });
    pdf.setFontSize(9);
    pdf.text('www.indianculturalexplorer.com | support@indianculturalexplorer.com | +91-800-123-4567', pw / 2, 47, { align: 'center' });

    // Status badge
    const statusY = 62;
    const isSuccess = paymentStatus === 'success';
    if (isSuccess) {
      pdf.setFillColor(34, 197, 94);
    } else if (paymentStatus === 'failed') {
      pdf.setFillColor(239, 68, 68);
    } else {
      pdf.setFillColor(234, 179, 8);
    }
    const statusText = paymentStatus.toUpperCase();
    const statusW = pdf.getTextWidth(statusText) + 20;
    pdf.roundedRect((pw - statusW - 10) / 2, statusY - 5, statusW + 10, 12, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(statusText, pw / 2, statusY + 3, { align: 'center' });

    let y = statusY + 18;
    pdf.setTextColor(33, 37, 41);

    // Receipt Info Box
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(15, y, pw - 30, 30, 3, 3, 'F');
    pdf.setDrawColor(222, 226, 230);
    pdf.roundedRect(15, y, pw - 30, 30, 3, 3, 'S');

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(108, 117, 125);
    pdf.text('RECEIPT NO.', 25, y + 10);
    pdf.text('DATE', 80, y + 10);
    pdf.text('PAYMENT METHOD', 135, y + 10);

    pdf.setTextColor(33, 37, 41);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(transactionId, 25, y + 20);
    pdf.text(new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }), 80, y + 20);
    const methodLabel = paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking';
    pdf.text(methodLabel, 135, y + 20);

    y += 40;

    // Customer Details Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 136, 0);
    pdf.text('CUSTOMER DETAILS', 15, y);
    pdf.setDrawColor(255, 136, 0);
    pdf.setLineWidth(0.5);
    pdf.line(15, y + 2, pw - 15, y + 2);

    y += 12;
    pdf.setFontSize(10);
    pdf.setTextColor(33, 37, 41);
    const customerInfo = [
      ['Name', bookingDetails.guestName],
      ['Email', bookingDetails.guestEmail],
      ['Phone', bookingDetails.guestPhone],
    ];
    customerInfo.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${label}:`, 20, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value || 'N/A', 65, y);
      y += 8;
    });

    y += 5;

    // Booking Details Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 136, 0);
    pdf.text('BOOKING DETAILS', 15, y);
    pdf.setDrawColor(255, 136, 0);
    pdf.line(15, y + 2, pw - 15, y + 2);

    y += 12;
    pdf.setFontSize(10);
    pdf.setTextColor(33, 37, 41);
    const bookingInfo = [
      ['Type', bookingDetails.type],
      ['Service', bookingDetails.title],
      ['Travel Period', `${new Date(bookingDetails.startDate).toLocaleDateString('en-IN')} to ${new Date(bookingDetails.endDate).toLocaleDateString('en-IN')}`],
      ...(bookingDetails.travelers ? [['Travelers', String(bookingDetails.travelers)]] : []),
      ...(bookingDetails.accommodationType ? [['Accommodation', bookingDetails.accommodationType]] : []),
      ...(bookingDetails.transportMode ? [['Transport', bookingDetails.transportMode]] : []),
    ];
    bookingInfo.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${label}:`, 20, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value || 'N/A', 75, y);
      y += 8;
    });

    y += 5;

    // Payment Summary Table
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 136, 0);
    pdf.text('PAYMENT SUMMARY', 15, y);
    pdf.setDrawColor(255, 136, 0);
    pdf.line(15, y + 2, pw - 15, y + 2);

    y += 10;

    // Table header
    pdf.setFillColor(248, 249, 250);
    pdf.rect(15, y, pw - 30, 10, 'F');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(108, 117, 125);
    pdf.text('DESCRIPTION', 20, y + 7);
    pdf.text('AMOUNT (₹)', pw - 20, y + 7, { align: 'right' });

    y += 14;
    pdf.setTextColor(33, 37, 41);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const items = [
      ['Base Amount', `₹${bookingDetails.amount.toLocaleString('en-IN')}`],
      ['GST (5%)', `₹${taxAmount.toLocaleString('en-IN')}`],
      ['Convenience Fee', `₹${convenienceFee}`],
    ];

    items.forEach(([desc, amt]) => {
      pdf.text(desc, 20, y);
      pdf.text(amt, pw - 20, y, { align: 'right' });
      y += 8;
    });

    // Total line
    pdf.setDrawColor(33, 37, 41);
    pdf.setLineWidth(0.8);
    pdf.line(15, y, pw - 15, y);
    y += 8;

    pdf.setFillColor(255, 136, 0);
    pdf.roundedRect(pw / 2 - 10, y - 5, pw / 2 - 5, 14, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`TOTAL PAID: ₹${totalAmount.toLocaleString('en-IN')}`, pw - 20, y + 5, { align: 'right' });

    // Failure reason if applicable
    if (paymentStatus !== 'success' && failureReason) {
      y += 22;
      pdf.setFillColor(254, 242, 242);
      pdf.roundedRect(15, y - 5, pw - 30, 16, 3, 3, 'F');
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Reason: ${failureReason}`, 20, y + 5);
    }

    // Footer
    const footerY = ph - 30;
    pdf.setDrawColor(222, 226, 230);
    pdf.setLineWidth(0.3);
    pdf.line(15, footerY, pw - 15, footerY);

    pdf.setTextColor(108, 117, 125);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('This is a computer-generated receipt and does not require a signature.', pw / 2, footerY + 8, { align: 'center' });
    pdf.text('For queries: support@indianculturalexplorer.com | +91-800-123-4567', pw / 2, footerY + 14, { align: 'center' });
    pdf.text(`Generated on ${new Date().toLocaleString('en-IN')}`, pw / 2, footerY + 20, { align: 'center' });

    pdf.save(`receipt-${transactionId}.pdf`);
    toast({ title: 'Receipt Downloaded', description: 'Professional PDF receipt has been saved' });
  };

  const handleClose = () => {
    if (paymentStatus === 'success') {
      onPaymentSuccess();
    }
    onClose();
    setPaymentStatus('idle');
    setIsProcessing(false);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setUpiId('');
    setFailureReason('');
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setFailureReason('');
    setTransactionId('');
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {paymentStatus === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">Your booking has been confirmed</p>
              <div className="bg-muted rounded-lg p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Transaction ID</span><span className="font-mono font-medium text-sm">{transactionId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Amount Paid</span><span className="font-bold">₹{totalAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Booking</span><span className="font-medium text-sm">{bookingDetails.title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Date</span><span className="text-sm">{new Date().toLocaleDateString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Method</span><span className="text-sm capitalize">{paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}</span></div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={generateProfessionalPDF}>
                  <Download className="w-4 h-4 mr-2" /> Download Receipt
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleClose}>Continue</Button>
              </div>
            </motion.div>
          ) : paymentStatus === 'failed' || paymentStatus === 'cancelled' ? (
            <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${paymentStatus === 'failed' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                {paymentStatus === 'failed' ? <XCircle className="w-12 h-12 text-red-600" /> : <AlertTriangle className="w-12 h-12 text-yellow-600" />}
              </motion.div>
              <h2 className={`text-2xl font-bold mb-2 ${paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                Payment {paymentStatus === 'failed' ? 'Failed' : 'Cancelled'}!
              </h2>
              <p className="text-muted-foreground mb-4">{failureReason}</p>
              <div className="bg-muted rounded-lg p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Transaction ID</span><span className="font-mono font-medium text-sm">{transactionId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Attempted Amount</span><span className="font-bold">₹{totalAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Status</span>
                  <span className={`text-sm font-medium ${paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>{paymentStatus.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={generateProfessionalPDF}>
                  <Download className="w-4 h-4 mr-2" /> Download Details
                </Button>
                <Button className="flex-1" onClick={handleRetry}>Try Again</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
                <DialogDescription>Pay ₹{totalAmount.toLocaleString()} for {bookingDetails.title}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Select Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'card', icon: CreditCard, label: 'Card' },
                      { value: 'upi', icon: Smartphone, label: 'UPI' },
                      { value: 'netbanking', icon: Building2, label: 'Bank' },
                    ].map(m => (
                      <div key={m.value}>
                        <RadioGroupItem value={m.value} id={m.value} className="peer sr-only" />
                        <Label htmlFor={m.value}
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 cursor-pointer">
                          <m.icon className="mb-1 h-5 w-5" />
                          <span className="text-xs">{m.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {paymentMethod === 'card' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div><Label>Cardholder Name</Label><Input placeholder="Name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} /></div>
                    <div><Label>Card Number</Label><Input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Expiry</Label><Input placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} maxLength={5} /></div>
                      <div><Label>CVV</Label><Input placeholder="123" type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} maxLength={4} /></div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'upi' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Label>UPI ID</Label><Input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  </motion.div>
                )}

                {paymentMethod === 'netbanking' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
                    <p className="text-muted-foreground">You will be redirected to your bank's website to complete the payment.</p>
                  </motion.div>
                )}

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Base Amount</span><span>₹{bookingDetails.amount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>GST (5%)</span><span>₹{taxAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Convenience Fee</span><span>₹{convenienceFee}</span></div>
                    <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>₹{totalAmount.toLocaleString()}</span></div>
                  </div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing Payment...</>) : (`Pay ₹${totalAmount.toLocaleString()}`)}
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
