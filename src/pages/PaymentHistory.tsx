
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Download, CheckCircle, XCircle, AlertTriangle, CreditCard, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { PaymentRecord } from '@/components/PaymentModal';
import jsPDF from 'jspdf';

const PaymentHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const allRecords: PaymentRecord[] = JSON.parse(localStorage.getItem('paymentRecords') || '[]');
    const userRecords = allRecords.filter(r => r.userId === user?.email);
    setPayments(userRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [isAuthenticated, user]);

  const filtered = payments.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totals = {
    all: payments.length,
    success: payments.filter(p => p.status === 'success').length,
    failed: payments.filter(p => p.status === 'failed').length,
    cancelled: payments.filter(p => p.status === 'cancelled').length,
    totalSpent: payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0),
  };

  const downloadReceipt = (payment: PaymentRecord) => {
    const pdf = new jsPDF();
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(255, 136, 0); pdf.rect(0, 0, pw, 8, 'F');
    pdf.setFillColor(33, 37, 41); pdf.rect(0, 8, pw, 40, 'F');
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(20); pdf.setFont('helvetica', 'bold');
    pdf.text('INDIAN CULTURAL EXPLORER', pw / 2, 26, { align: 'center' });
    pdf.setFontSize(10); pdf.setFont('helvetica', 'normal');
    pdf.text('Payment Receipt', pw / 2, 36, { align: 'center' });
    pdf.setFontSize(8); pdf.text('support@indianculturalexplorer.com | +91-800-123-4567', pw / 2, 44, { align: 'center' });

    let y = 60;
    pdf.setTextColor(33, 37, 41);

    // Status
    if (payment.status === 'success') pdf.setFillColor(34, 197, 94);
    else if (payment.status === 'failed') pdf.setFillColor(239, 68, 68);
    else pdf.setFillColor(234, 179, 8);
    pdf.roundedRect(pw / 2 - 25, y - 5, 50, 12, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold');
    pdf.text(payment.status.toUpperCase(), pw / 2, y + 3, { align: 'center' });

    y += 18;
    pdf.setTextColor(33, 37, 41);

    const addSection = (title: string, items: [string, string][]) => {
      pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(255, 136, 0);
      pdf.text(title, 15, y); pdf.setDrawColor(255, 136, 0); pdf.line(15, y + 2, pw - 15, y + 2);
      y += 10;
      pdf.setFontSize(10); pdf.setTextColor(33, 37, 41);
      items.forEach(([k, v]) => {
        pdf.setFont('helvetica', 'bold'); pdf.text(`${k}:`, 20, y);
        pdf.setFont('helvetica', 'normal'); pdf.text(v, 75, y);
        y += 7;
      });
      y += 5;
    };

    addSection('TRANSACTION DETAILS', [
      ['Transaction ID', payment.transactionId],
      ['Date', new Date(payment.date).toLocaleDateString('en-IN', { dateStyle: 'full' })],
      ['Time', new Date(payment.date).toLocaleTimeString('en-IN')],
      ['Method', payment.paymentMethod === 'card' ? 'Card' : payment.paymentMethod === 'upi' ? 'UPI' : 'Net Banking'],
    ]);

    addSection('CUSTOMER', [['Name', payment.userName], ['Email', payment.userEmail], ['Phone', payment.userPhone]]);
    addSection('BOOKING', [['Type', payment.type], ['Service', payment.title]]);

    addSection('PAYMENT', [
      ['Base Amount', `₹${payment.baseAmount.toLocaleString('en-IN')}`],
      ['GST (5%)', `₹${payment.tax.toLocaleString('en-IN')}`],
      ['Convenience Fee', `₹${payment.convenienceFee}`],
      ['Total', `₹${payment.amount.toLocaleString('en-IN')}`],
    ]);

    if (payment.failureReason) {
      pdf.setFillColor(254, 242, 242); pdf.roundedRect(15, y, pw - 30, 12, 3, 3, 'F');
      pdf.setTextColor(220, 38, 38); pdf.setFontSize(9); pdf.setFont('helvetica', 'bold');
      pdf.text(`Reason: ${payment.failureReason}`, 20, y + 8); y += 18;
    }

    pdf.setTextColor(108, 117, 125); pdf.setFontSize(8); pdf.setFont('helvetica', 'normal');
    pdf.text('Computer-generated receipt. No signature required.', pw / 2, ph - 15, { align: 'center' });

    pdf.save(`receipt-${payment.transactionId}.pdf`);
    toast({ title: 'Receipt Downloaded' });
  };

  const statusIcon = (s: string) => {
    if (s === 'success') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (s === 'failed') return <XCircle className="h-4 w-4 text-red-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  const statusBadge = (s: string) => {
    const colors = { success: 'bg-green-100 text-green-800 border-green-300', failed: 'bg-red-100 text-red-800 border-red-300', cancelled: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return <Badge className={colors[s as keyof typeof colors] || ''}>{statusIcon(s)} <span className="ml-1 capitalize">{s}</span></Badge>;
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <section className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm font-medium mb-4">Payment History</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">My Payment History</h1>
            <p className="text-muted-foreground">Track all your transactions and download receipts</p>
          </section>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Transactions', value: totals.all, color: 'text-foreground' },
            { label: 'Successful', value: totals.success, color: 'text-green-600' },
            { label: 'Failed/Cancelled', value: totals.failed + totals.cancelled, color: 'text-red-600' },
            { label: 'Total Spent', value: `₹${totals.totalSpent.toLocaleString()}`, color: 'text-orange-500' },
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or transaction ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Tabs value={filter} onValueChange={v => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All ({totals.all})</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Payment List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No payment records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((payment, index) => (
              <motion.div key={payment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{payment.title}</h3>
                          {statusBadge(payment.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <span>ID: {payment.transactionId.slice(0, 15)}...</span>
                          <span>{new Date(payment.date).toLocaleDateString('en-IN')}</span>
                          <span className="capitalize">{payment.type}</span>
                          <span className="capitalize">{payment.paymentMethod === 'card' ? 'Card' : payment.paymentMethod}</span>
                        </div>
                        {payment.failureReason && <p className="text-red-500 text-sm mt-1">{payment.failureReason}</p>}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xl font-bold ${payment.status === 'success' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          ₹{payment.amount.toLocaleString()}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => downloadReceipt(payment)}>
                          <Download className="h-4 w-4 mr-1" /> Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentHistory;
