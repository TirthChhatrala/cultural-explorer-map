import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { trips, CustomTripRequest, Trip } from '../../data/tripData';
import { 
  Calendar, 
  Check, 
  X, 
  Loader, 
  Percent, 
  Edit, 
  Image as ImageIcon,
  Receipt,
  FileText,
  Download,
  Trash2 as Trash,
  BarChart3,
  Users,
  TrendingUp,
  FileDown
} from 'lucide-react';

interface TripReceipt {
  id: string;
  date: string;
  userId: string;
  amount: number;
  description: string;
  downloadedAt: string;
}

interface UserTripHistory {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  tripId: string;
  tripTitle: string;
  bookingDate: string;
  totalAmount: number;
  basePrice: number;
  taxes: number;
  profit: number;
  status: 'completed' | 'ongoing' | 'cancelled';
}

interface WebsiteStatistics {
  totalUsers: number;
  totalTrips: number;
  totalRevenue: number;
  monthlyGrowth: number;
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
  trafficStats: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
  };
}

const ManageTrips = () => {
  const { theme } = useTheme();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState<'requests' | 'packages' | 'images' | 'receipts' | 'statistics' | 'history'>('requests');
  const [customRequests, setCustomRequests] = useState<CustomTripRequest[]>([
    {
      id: "req1",
      userId: "user123",
      userDetails: {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        address: "123 Main St, City, State, 12345"
      },
      memberDetails: [
        { name: "Jane Doe", age: 30, relation: "Spouse" }
      ],
      startDate: "2025-06-15",
      endDate: "2025-06-22",
      travelers: 4,
      transportMode: "car",
      states: ["rajasthan", "delhi"],
      budget: 60000,
      preferences: ["heritage", "cuisine", "photography"],
      status: "pending",
      createdAt: "2025-05-15"
    },
    {
      id: "req2",
      userId: "user456",
      userDetails: {
        name: "Alice Smith",
        email: "alice@example.com",
        phone: "0987654321",
        address: "456 Another St, City, State, 54321"
      },
      memberDetails: [
        { name: "Bob Smith", age: 35, relation: "Husband" }
      ],
      startDate: "2025-07-10",
      endDate: "2025-07-17",
      travelers: 2,
      transportMode: "train",
      states: ["kerala"],
      budget: 40000,
      preferences: ["nature", "ayurveda"],
      status: "approved",
      createdAt: "2025-05-10"
    }
  ]);
  
  const [packageTrips, setPackageTrips] = useState<Trip[]>(trips);
  const [selectedRequest, setSelectedRequest] = useState<CustomTripRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1564507592333-c60657eea523",
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
    "https://images.unsplash.com/photo-1561361058-c24e01901c1c"
  ]);
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [receipts, setReceipts] = useState<TripReceipt[]>([]);
  const [receiptDetailsOpen, setReceiptDetailsOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TripReceipt | null>(null);
  const [userTripHistory, setUserTripHistory] = useState<UserTripHistory[]>([
    {
      id: "hist1",
      userId: "user123",
      userName: "John Doe",
      userEmail: "john@example.com",
      tripId: "trip1",
      tripTitle: "Golden Triangle Tour",
      bookingDate: "2025-05-01",
      totalAmount: 65000,
      basePrice: 55000,
      taxes: 5000,
      profit: 5000,
      status: "completed"
    },
    {
      id: "hist2",
      userId: "user456",
      userName: "Alice Smith",
      userEmail: "alice@example.com",
      tripId: "trip2",
      tripTitle: "Kerala Backwaters",
      bookingDate: "2025-05-15",
      totalAmount: 42000,
      basePrice: 35000,
      taxes: 3500,
      profit: 3500,
      status: "ongoing"
    }
  ]);
  const [websiteStats, setWebsiteStats] = useState<WebsiteStatistics>({
    totalUsers: 1250,
    totalTrips: 89,
    totalRevenue: 2850000,
    monthlyGrowth: 15.8,
    userEngagement: {
      dailyActiveUsers: 125,
      weeklyActiveUsers: 450,
      monthlyActiveUsers: 850
    },
    trafficStats: {
      pageViews: 15420,
      uniqueVisitors: 8950,
      bounceRate: 32.5
    }
  });
  
  // Load receipt data on component mount
  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem('tripReceipts') || '[]');
    setReceipts(storedReceipts);
  }, []);

  // Request handling functions with real-time sync
  const handleStatusChange = (requestId: string, newStatus: CustomTripRequest['status']) => {
    setCustomRequests(requests => 
      requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
    
    const allRequests = JSON.parse(localStorage.getItem('customTripRequests') || '[]');
    const updatedRequests = allRequests.map((req: CustomTripRequest) => 
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    localStorage.setItem('customTripRequests', JSON.stringify(updatedRequests));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'customTripRequests',
      newValue: JSON.stringify(updatedRequests)
    }));
    
    toast({
      title: `Request ${newStatus}`,
      description: `Trip request has been ${newStatus}`,
      variant: newStatus === 'rejected' ? "destructive" : "default"
    });
  };
  
  const viewRequestDetails = (request: CustomTripRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };
  
  const viewReceiptDetails = (receipt: TripReceipt) => {
    setSelectedReceipt(receipt);
    setReceiptDetailsOpen(true);
  };

  const downloadReceipt = (receipt: TripReceipt) => {
    const receiptContent = `
TRIP RECEIPT
------------------
Receipt ID: ${receipt.id}
Date: ${new Date(receipt.date).toLocaleDateString()}
User: ${receipt.userId}
Description: ${receipt.description}
Amount: ₹${receipt.amount.toLocaleString()}
Downloaded: ${new Date().toLocaleString()}
------------------
Thank you for choosing Indian Cultural Explorer!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receipt.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt Downloaded",
      description: `Receipt ${receipt.id} has been downloaded`
    });
  };

  const exportUserTripHistory = () => {
    const csvContent = [
      'User ID,User Name,User Email,Trip Title,Booking Date,Total Amount,Base Price,Taxes,Profit,Status',
      ...userTripHistory.map(trip => 
        `${trip.userId},${trip.userName},${trip.userEmail},${trip.tripTitle},${trip.bookingDate},${trip.totalAmount},${trip.basePrice},${trip.taxes},${trip.profit},${trip.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-trip-history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "User trip history has been exported as CSV"
    });
  };
  
  // Discount handling functions
  const openDiscountDialog = (trip: Trip) => {
    setSelectedTrip(trip);
    setDiscountAmount(trip.discountedPrice 
      ? Math.round((1 - trip.discountedPrice / trip.price) * 100) 
      : 0);
    setDiscountOpen(true);
  };
  
  const applyDiscount = () => {
    if (!selectedTrip) return;
    
    const updatedTrips = packageTrips.map(trip => {
      if (trip.id === selectedTrip.id) {
        if (discountAmount <= 0) {
          const { discountedPrice, ...tripWithoutDiscount } = trip;
          return tripWithoutDiscount as Trip;
        } else {
          const discountedPrice = trip.price - (trip.price * (discountAmount / 100));
          return { ...trip, discountedPrice };
        }
      }
      return trip;
    });
    
    setPackageTrips(updatedTrips);
    setDiscountOpen(false);
    
    toast({
      title: "Discount Updated",
      description: discountAmount > 0 
        ? `${discountAmount}% discount applied to ${selectedTrip.title}`
        : `Discount removed from ${selectedTrip.title}`
    });
  };
  
  // Image gallery functions
  const addImageToGallery = () => {
    if (newImageUrl && !galleryImages.includes(newImageUrl)) {
      setGalleryImages([...galleryImages, newImageUrl]);
      setNewImageUrl("");
      
      toast({
        title: "Image Added",
        description: "New image has been added to the gallery"
      });
    }
  };
  
  const removeImageFromGallery = (imageUrl: string) => {
    setGalleryImages(galleryImages.filter(img => img !== imageUrl));
    
    toast({
      title: "Image Removed",
      description: "Image has been removed from the gallery",
      variant: "destructive"
    });
  };
  
  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-8">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </Layout>
    );
  }

  // Helper function to map state IDs to names
  const getStateNames = (stateIds: string[]) => {
    const stateMap: { [key: string]: string } = {
      'rajasthan': 'Rajasthan',
      'kerala': 'Kerala',
      'himachalpradesh': 'Himachal Pradesh',
      'uttarakhand': 'Uttarakhand',
      'goa': 'Goa',
      'delhi': 'Delhi',
      'uttarpradesh': 'Uttar Pradesh',
      'tamil_nadu': 'Tamil Nadu',
      'karnataka': 'Karnataka',
      'punjab': 'Punjab'
    };
    
    return stateIds.map(id => stateMap[id] || id).join(', ');
  };

  // Render status badge based on status value
  const renderStatusBadge = (status: CustomTripRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            <Loader size={12} className="mr-1 animate-spin" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            <Check size={12} className="mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
            <X size={12} className="mr-1" />
            Rejected
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
            <Loader size={12} className="mr-1 animate-spin" />
            In Progress
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="mb-8">
          <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium mb-4">
            Admin Controls
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Trip Management
          </h1>
          <p className="text-muted-foreground">
            Manage trip packages, requests, statistics and user history
          </p>
        </section>
        
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center whitespace-nowrap">
                  <Calendar className="h-5 w-5 mr-2" />
                  Trip Requests
                </div>
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'packages'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center whitespace-nowrap">
                  <Percent className="h-5 w-5 mr-2" />
                  Package Discounts
                </div>
              </button>
              <button
                onClick={() => setActiveTab('receipts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'receipts'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center whitespace-nowrap">
                  <Receipt className="h-5 w-5 mr-2" />
                  Booking Receipts
                </div>
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'statistics'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center whitespace-nowrap">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Website Statistics
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center whitespace-nowrap">
                  <Users className="h-5 w-5 mr-2" />
                  User Trip History
                </div>
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'images'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center whitespace-nowrap">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Image Gallery
                </div>
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'requests' && (
          <div className="rounded-xl border mb-8 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>User Details</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Destinations</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Trip Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{request.userDetails?.name || 'N/A'}</p>
                        <p className="text-muted-foreground">{request.userDetails?.email || request.userId}</p>
                        <p className="text-muted-foreground">{request.travelers} travelers</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStateNames(request.states)}</TableCell>
                    <TableCell>₹{request.budget.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
                        Custom Trip
                      </span>
                    </TableCell>
                    <TableCell>{renderStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewRequestDetails(request)}
                        >
                          View Details
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-500 border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleStatusChange(request.id, 'approved')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleStatusChange(request.id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {activeTab === 'packages' && (
          <div className="rounded-xl border mb-8 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Regular Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packageTrips.map(trip => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{trip.title}</TableCell>
                    <TableCell>{trip.duration} days</TableCell>
                    <TableCell>{trip.category}</TableCell>
                    <TableCell>₹{trip.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {trip.discountedPrice ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                          {Math.round((1 - trip.discountedPrice / trip.price) * 100)}% Off
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDiscountDialog(trip)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Set Discount
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'receipts' && (
          <div className="rounded-xl border mb-8 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No booking receipts available yet
                    </TableCell>
                  </TableRow>
                ) : (
                  receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.id}</TableCell>
                      <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                      <TableCell>{receipt.userId}</TableCell>
                      <TableCell>{receipt.description}</TableCell>
                      <TableCell>₹{receipt.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => viewReceiptDetails(receipt)}
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => downloadReceipt(receipt)}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{websiteStats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                    <p className="text-2xl font-bold">{websiteStats.totalTrips}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{(websiteStats.totalRevenue / 100000).toFixed(1)}L</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-india-orange" />
                </div>
              </div>
              
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Growth</p>
                    <p className="text-2xl font-bold">{websiteStats.monthlyGrowth}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Active Users</span>
                    <span className="font-medium">{websiteStats.userEngagement.dailyActiveUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weekly Active Users</span>
                    <span className="font-medium">{websiteStats.userEngagement.weeklyActiveUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Active Users</span>
                    <span className="font-medium">{websiteStats.userEngagement.monthlyActiveUsers}</span>
                  </div>
                </div>
              </div>
              
              <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <h3 className="text-lg font-semibold mb-4">Traffic Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Page Views</span>
                    <span className="font-medium">{websiteStats.trafficStats.pageViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unique Visitors</span>
                    <span className="font-medium">{websiteStats.trafficStats.uniqueVisitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bounce Rate</span>
                    <span className="font-medium">{websiteStats.trafficStats.bounceRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Trip History</h2>
              <Button onClick={exportUserTripHistory} className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
            
            <div className="rounded-xl border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Trip</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Taxes</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userTripHistory.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{trip.userName}</p>
                          <p className="text-muted-foreground">{trip.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{trip.tripTitle}</TableCell>
                      <TableCell>{new Date(trip.bookingDate).toLocaleDateString()}</TableCell>
                      <TableCell>₹{trip.basePrice.toLocaleString()}</TableCell>
                      <TableCell>₹{trip.taxes.toLocaleString()}</TableCell>
                      <TableCell>₹{trip.profit.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">₹{trip.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trip.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                            : trip.status === 'ongoing'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                        }`}>
                          {trip.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{userTripHistory.reduce((sum, trip) => sum + trip.totalAmount, 0).toLocaleString()}</p>
              </div>
              <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <p className="text-sm text-muted-foreground">Total Taxes</p>
                <p className="text-2xl font-bold">₹{userTripHistory.reduce((sum, trip) => sum + trip.taxes, 0).toLocaleString()}</p>
              </div>
              <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold">₹{userTripHistory.reduce((sum, trip) => sum + trip.profit, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'images' && (
          <div className="rounded-xl border mb-8 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Image Gallery</h2>
              <Button onClick={() => setGalleryOpen(true)}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Images
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img 
                    src={image} 
                    alt={`Gallery image ${index + 1}`} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImageFromGallery(image)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Trip Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Request ID</h4>
                  <p>{selectedRequest.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <p>{renderStatusBadge(selectedRequest.status)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h4>
                  <p>{new Date(selectedRequest.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">End Date</h4>
                  <p>{new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Travelers</h4>
                  <p>{selectedRequest.travelers}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Transport</h4>
                  <p className="capitalize">{selectedRequest.transportMode}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Destinations</h4>
                <p>{getStateNames(selectedRequest.states)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Budget</h4>
                <p>₹{selectedRequest.budget.toLocaleString()}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.preferences.map(pref => (
                    <span 
                      key={pref} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            {selectedRequest && selectedRequest.status === 'pending' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, 'rejected');
                    setDetailsOpen(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, 'approved');
                    setDetailsOpen(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={discountOpen} onOpenChange={setDiscountOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Discount for {selectedTrip?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Regular Price</Label>
              <Input 
                id="price" 
                value={`₹${selectedTrip?.price.toLocaleString() || ''}`} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage</Label>
              <div className="flex items-center">
                <Input 
                  id="discount" 
                  type="number" 
                  min="0"
                  max="90"
                  value={discountAmount} 
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                />
                <span className="ml-2">%</span>
              </div>
            </div>
            
            {discountAmount > 0 && selectedTrip && (
              <div className="space-y-2">
                <Label htmlFor="discounted-price">Discounted Price</Label>
                <Input 
                  id="discounted-price" 
                  value={`₹${Math.round(selectedTrip.price - (selectedTrip.price * (discountAmount / 100))).toLocaleString()}`} 
                  disabled 
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscountOpen(false)}>Cancel</Button>
            <Button onClick={applyDiscount}>Apply Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={receiptDetailsOpen} onOpenChange={setReceiptDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Receipt ID</h4>
                  <p>{selectedReceipt.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                  <p>{new Date(selectedReceipt.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">User</h4>
                <p>{selectedReceipt.userId}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p>{selectedReceipt.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Amount</h4>
                <p className="font-semibold">₹{selectedReceipt.amount.toLocaleString()}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Downloaded At</h4>
                <p>{new Date(selectedReceipt.downloadedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptDetailsOpen(false)}>Close</Button>
            <Button 
              onClick={() => {
                if (selectedReceipt) {
                  downloadReceipt(selectedReceipt);
                  setReceiptDetailsOpen(false);
                }
              }}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Sheet open={galleryOpen} onOpenChange={setGalleryOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Images to Gallery</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="image-url" 
                  placeholder="Enter image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button onClick={addImageToGallery}>Add</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Preview</Label>
              {newImageUrl ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={newImageUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                    }} 
                  />
                </div>
              ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-muted-foreground">
                  No image URL provided
                </div>
              )}
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setGalleryOpen(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default ManageTrips;
