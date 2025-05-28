import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, User, Phone, MessageCircle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface LocationState {
  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;
  couponApplied: boolean;
}

const SlotSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { cartItems, totalAmount, totalItems, couponApplied } = location.state as LocationState || {};
  
  const [selectedSlot, setSelectedSlot] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: ''
  });
  const [draggedSlot, setDraggedSlot] = useState('');
  const [showQR, setShowQR] = useState(false);

  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM'];

  const handleDragStart = (e: React.DragEvent, slot: string) => {
    setDraggedSlot(slot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setSelectedSlot(draggedSlot);
  };

  const handleSubmit = () => {
    if (!selectedSlot || !userDetails.name || !userDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all details and select a time slot",
        variant: "destructive"
      });
      return;
    }

    // Create Excel data structure
    const orderData = {
      timestamp: new Date().toLocaleString(),
      customerName: userDetails.name,
      phone: userDetails.phone,
      timeSlot: selectedSlot,
      items: cartItems.map(item => `${item.name} x${item.quantity}`).join(', '),
      totalAmount: totalAmount,
      totalItems: totalItems,
      couponApplied: couponApplied ? 'Yes' : 'No'
    };

    // Store in localStorage (simulating Excel sheet storage)
    const existingOrders = JSON.parse(localStorage.getItem('biryaniOrders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('biryaniOrders', JSON.stringify(existingOrders));

    toast({
      title: "Order Details Saved",
      description: "Your information has been recorded successfully",
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedSlot || !userDetails.name || !userDetails.phone) {
      toast({
        title: "Complete the form first",
        description: "Please submit your details before placing order",
        variant: "destructive"
      });
      return;
    }

    const orderDetails = cartItems.map(item => 
      `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');
    
    const giftMessage = couponApplied ? '\n🎁 *Free Gift Included!*' : '';
    
    const message = `🍛 *New Biryani Order*\n\n*Customer Details:*\nName: ${userDetails.name}\nPhone: ${userDetails.phone}\nTime Slot: ${selectedSlot}\n\n*Order:*\n${orderDetails}${giftMessage}\n\n*Total: ₹${totalAmount}*\n\nPlease confirm the order and share payment details.`;
    
    const whatsappUrl = `https://wa.me/917454958772?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateQRCode = () => {
    setShowQR(true);
  };

  if (!cartItems) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-biryani-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-biryani-700 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Complete Your Order</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateQRCode}
            className="text-white hover:bg-biryani-700"
          >
            <QrCode className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQR(false)}>
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-center">Download APK</h3>
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-center">
                <div>
                  <QrCode className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-600">QR Code for APK Download</p>
                  <p className="text-xs text-gray-500 mt-2">Point your camera here to download the APK</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowQR(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2">
              <span>{item.name} x{item.quantity}</span>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
          {couponApplied && (
            <div className="border-t pt-2 mt-2">
              <div className="text-green-600 font-medium">🎁 Free Gift Included!</div>
              <div className="text-sm text-gray-600">You get a complimentary dessert!</div>
            </div>
          )}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Time Slot Selection */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Select Delivery Time
          </h3>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                draggable
                onDragStart={(e) => handleDragStart(e, slot)}
                className="bg-biryani-100 border-2 border-dashed border-biryani-300 rounded-lg p-3 text-center cursor-move hover:bg-biryani-200 transition-colors"
              >
                {slot}
              </div>
            ))}
          </div>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              selectedSlot 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {selectedSlot ? (
              <div className="text-green-700 font-medium">
                ✓ Selected: {selectedSlot}
              </div>
            ) : (
              <div className="text-gray-500">
                Drag and drop your preferred time slot here
              </div>
            )}
          </div>
        </div>

        {/* User Details Form */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Your Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={userDetails.name}
                onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={userDetails.phone}
                onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            className="w-full bg-biryani-500 hover:bg-biryani-600 text-white py-3"
            disabled={!selectedSlot || !userDetails.name || !userDetails.phone}
          >
            Submit Details
          </Button>
          
          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Place Order & Pay via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlotSelection;
