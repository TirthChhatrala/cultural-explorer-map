
import React from 'react';
import { FileText } from 'lucide-react';

interface ReceiptProps {
  receipt: {
    id: string;
    date: string;
    userId: string;
    amount: number;
    description: string;
    items?: Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
  };
}

export const ReceiptGenerator = ({ receipt }: ReceiptProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate subtotal if items present
  const subtotal = receipt.items 
    ? receipt.items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0)
    : receipt.amount;
  
  // Calculate tax (assuming 5% GST)
  const taxRate = 0.05;
  const taxAmount = subtotal * taxRate;
  
  // Calculate total
  const totalAmount = receipt.amount;
  
  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-md mx-auto" id="receipt-content">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Receipt</h2>
          <p className="text-gray-600">#{receipt.id}</p>
        </div>
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-1" />
          <span className="font-semibold">Indian Cultural Explorer</span>
        </div>
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Date:</span>
          <span>{formatDate(receipt.date)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">User ID:</span>
          <span>{receipt.userId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Description:</span>
          <span>{receipt.description}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Services</h3>
        
        {receipt.items ? (
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">{item.name}</td>
                  <td className="text-right py-2">{item.quantity || 1}</td>
                  <td className="text-right py-2">₹{item.price.toLocaleString()}</td>
                  <td className="text-right py-2">₹{(item.price * (item.quantity || 1)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="border rounded p-3 mb-4">
            <p className="font-medium">{receipt.description}</p>
            <p className="text-right mt-2 font-semibold">₹{receipt.amount.toLocaleString()}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST ({(taxRate * 100).toFixed(0)}%):</span>
            <span>₹{taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-600 text-sm mt-8">
        <p>Thank you for choosing Indian Cultural Explorer!</p>
        <p className="mt-1">For any queries, please contact support@indianculturalexplorer.com</p>
      </div>
    </div>
  );
};
