
import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import BackToAdmin from '../../components/BackToAdmin';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, CheckCircle, XCircle, AlertTriangle, Search, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { PaymentRecord } from '@/components/PaymentModal';
import jsPDF from 'jspdf';

const ManagePayments = () => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
    const records: PaymentRecord[] = JSON.parse(localStorage.getItem('paymentRecords') || '[]');
    setPayments(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [isAdmin]);

  const filtered = payments.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = search === '' || 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: payments.length,
    success: payments.filter(p => p.status === 'success').length,
    failed: payments.filter(p => p.status === 'failed').length,
    cancelled: payments.filter(p => p.status === 'cancelled').length,
    revenue: payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0),
    uniqueUsers: new Set(payments.map(p => p.userId)).size,
  };

  const exportAllPDF = () => {
    const pdf = new jsPDF('landscape');
    const pw = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(33, 37, 41); pdf.rect(0, 0, pw, 25, 'F');
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(16); pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Records - Indian Cultural Explorer', pw / 2, 16, { align: 'center' });

    let y = 35;
    pdf.setTextColor(33, 37, 41); pdf.setFontSize(8);

    // Table header
    pdf.setFillColor(248, 249, 250); pdf.rect(10, y, pw - 20, 10, 'F');
    pdf.setFont('helvetica', 'bold');
    const cols = [12, 55, 95, 130, 165, 195, 220, 250];
    ['TXN ID', 'Customer', 'Email', 'Service', 'Amount', 'Method', 'Status', 'Date'].forEach((h, i) => pdf.text(h, cols[i], y + 7));

    y += 14;
    pdf.setFont('helvetica', 'normal');
    filtered.forEach(p => {
      if (y > 185) { pdf.addPage('landscape'); y = 20; }
      pdf.text(p.transactionId.slice(0, 18), cols[0], y);
      pdf.text(p.userName.slice(0, 18), cols[1], y);
      pdf.text(p.userEmail.slice(0, 18), cols[2], y);
      pdf.text(p.title.slice(0, 18), cols[3], y);
      pdf.text(`₹${p.amount.toLocaleString()}`, cols[4], y);
      pdf.text(p.paymentMethod, cols[5], y);
      pdf.text(p.status.toUpperCase(), cols[6], y);
      pdf.text(new Date(p.date).toLocaleDateString('en-IN'), cols[7], y);
      y += 7;
    });

    pdf.save('all-payment-records.pdf');
    toast({ title: 'Exported', description: 'All payment records exported as PDF' });
  };

  const statusIcon = (s: string) => {
    if (s === 'success') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (s === 'failed') return <XCircle className="h-4 w-4 text-red-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AdminHeader />
      <BackToAdmin />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">Payment Management</h1>
              <p className="text-muted-foreground">View and manage all payment transactions</p>
            </div>
            <Button onClick={exportAllPDF} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Download className="h-4 w-4 mr-2" /> Export All PDF
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Transactions', value: stats.total, icon: TrendingUp, color: 'text-foreground' },
            { label: 'Successful', value: stats.success, icon: CheckCircle, color: 'text-green-600' },
            { label: 'Failed', value: stats.failed, icon: XCircle, color: 'text-red-600' },
            { label: 'Unique Customers', value: stats.uniqueUsers, icon: Users, color: 'text-blue-600' },
            { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: 'text-orange-500' },
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or transaction ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Tabs value={filter} onValueChange={v => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="success">Success ({stats.success})</TabsTrigger>
              <TabsTrigger value="failed">Failed ({stats.failed})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({stats.cancelled})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Payment Records */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <IndianRupee className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No payment records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((payment, index) => (
              <motion.div key={payment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {statusIcon(payment.status)}
                          <h3 className="font-semibold">{payment.title}</h3>
                          <Badge className={
                            payment.status === 'success' ? 'bg-green-100 text-green-800' :
                            payment.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }>{payment.status.toUpperCase()}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-muted-foreground">
                          <span title={payment.transactionId}>ID: {payment.transactionId.slice(0, 12)}...</span>
                          <span>👤 {payment.userName}</span>
                          <span>📧 {payment.userEmail}</span>
                          <span className="capitalize">{payment.paymentMethod}</span>
                          <span>{new Date(payment.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        {payment.failureReason && <p className="text-red-500 text-sm mt-1">⚠ {payment.failureReason}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-lg font-bold ${payment.status === 'success' ? 'text-green-600' : 'text-muted-foreground line-through'}`}>
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{payment.type}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;
