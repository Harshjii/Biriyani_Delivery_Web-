import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, User, Phone, MessageCircle, QrCode, Sparkles, Gift, Check, Star, Zap } from 'lucide-react';
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
  
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: ''
  });
  const [draggedSlot, setDraggedSlot] = useState<string>('');
  const [showQR, setShowQR] = useState<boolean>(false);
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<boolean>(false);
  const [pulsingButton, setPulsingButton] = useState<string>('');

  const timeSlots = [
    { time: '10:00 AM', label: 'Early Bird', icon: '🌅', popular: false },
    { time: '11:00 AM', label: 'Peak Time', icon: '⚡', popular: true },
    { time: '12:00 PM', label: 'Lunch Rush', icon: '🍽️', popular: false },
    { time: '1:00 PM', label: 'Afternoon', icon: '☀️', popular: false }
  ];

  useEffect(() => {
    const complete = selectedSlot && userDetails.name && userDetails.phone;
    setIsFormComplete(Boolean(complete));
  }, [selectedSlot, userDetails.name, userDetails.phone]);

  // Celebration animation when form is complete
  useEffect(() => {
    if (isFormComplete) {
      setShowSuccessAnimation(true);
      const timer = setTimeout(() => setShowSuccessAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isFormComplete]);

  const handleDragStart = (e: React.DragEvent, slot: string) => {
    setDraggedSlot(slot);
    setPulsingButton(slot);
  };

  const handleDragEnd = () => {
    setPulsingButton('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setSelectedSlot(draggedSlot);
    setPulsingButton('');
    
    toast({
      title: "🎯 Time Slot Selected!",
      description: (
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span>Perfect choice for {draggedSlot}!</span>
        </div>
      ),
    });
  };

  const handleSubmit = () => {
    if (!selectedSlot || !userDetails.name || !userDetails.phone) {
      toast({
        title: "🚨 Missing Information",
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
      title: "✅ Details Saved Successfully!",
      description: (
        <div className="flex items-center space-x-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>Your information has been recorded</span>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
      ),
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedSlot || !userDetails.name || !userDetails.phone) {
      toast({
        title: "🔔 Complete the form first",
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
    
    const whatsappUrl = `https://wa.me/919027723883?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "🚀 Order Sent!",
      description: "Redirecting to WhatsApp for payment...",
    });
  };

  const generateQRCode = () => {
    setShowQR(true);
  };

  if (!cartItems) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 sticky top-0 z-10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="animate-bounce text-2xl">🍛</div>
              <h1 className="text-xl font-bold">Complete Your Order</h1>
              {isFormComplete && (
                <Sparkles className="h-5 w-5 text-yellow-300 animate-spin" />
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateQRCode}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110"
          >
            <QrCode className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="animate-scale-in">
            <div className="bg-green-500 text-white p-6 rounded-full shadow-2xl animate-bounce">
              <Check className="h-12 w-12" />
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowQR(false)}>
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4 animate-scale-in shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Download APK</span>
            </h3>
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center text-center hover:scale-105 transition-transform duration-300">
                <div>
                  <QrCode className="h-16 w-16 mx-auto mb-3 text-blue-600 animate-pulse" />
                  <p className="text-sm text-gray-700 font-medium">QR Code for APK Download</p>
                  <p className="text-xs text-gray-500 mt-2">Point your camera here to download</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowQR(false)} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Enhanced Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span>Order Summary</span>
          </h2>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 px-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🍛</div>
                  <span className="font-medium">{item.name} x{item.quantity}</span>
                </div>
                <span className="font-bold text-orange-600">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          {couponApplied && (
            <div className="border-t pt-4 mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 animate-scale-in">
              <div className="flex items-center space-x-2 text-green-600 font-medium">
                <Gift className="h-5 w-5 animate-bounce" />
                <span>🎉 Free Gift Included!</span>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="text-sm text-gray-600 mt-1">You get a complimentary dessert!</div>
            </div>
          )}
          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Enhanced Time Slot Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Clock className="h-6 w-6 text-blue-500" />
            <span>Select Delivery Time</span>
            <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
          </h3>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                draggable
                onDragStart={(e) => handleDragStart(e, slot.time)}
                onDragEnd={handleDragEnd}
                className={`relative bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-dashed border-blue-300 rounded-xl p-4 text-center cursor-move hover:from-blue-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 ${
                  pulsingButton === slot.time ? 'animate-pulse scale-105' : ''
                } ${slot.popular ? 'ring-2 ring-yellow-400' : ''}`}
              >
                {slot.popular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 animate-bounce">
                    <Star className="h-3 w-3" />
                    <span>Popular</span>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-3xl animate-pulse">{slot.icon}</span>
                  <div>
                    <div className="font-bold text-lg text-gray-800">{slot.time}</div>
                    <div className="text-sm text-gray-600">{slot.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              selectedSlot 
                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 animate-scale-in' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {selectedSlot ? (
              <div className="text-green-700 font-bold text-lg flex items-center justify-center space-x-2">
                <Check className="h-6 w-6 animate-bounce" />
                <span>Selected: {selectedSlot}</span>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
            ) : (
              <div className="text-gray-500 flex items-center justify-center space-x-2">
                <Clock className="h-6 w-6" />
                <span>Drag and drop your preferred time slot here</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced User Details Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <User className="h-6 w-6 text-green-500" />
            <span>Your Details</span>
            {userDetails.name && userDetails.phone && (
              <Check className="h-5 w-5 text-green-500 animate-bounce" />
            )}
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Name</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={userDetails.name}
                onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                className="transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {userDetails.name && (
                <Check className="absolute right-3 top-10 h-5 w-5 text-green-500 animate-bounce" />
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={userDetails.phone}
                onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                className="transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {userDetails.phone && (
                <Check className="absolute right-3 top-10 h-5 w-5 text-green-500 animate-bounce" />
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleSubmit}
            className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isFormComplete 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg animate-pulse' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isFormComplete}
          >
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-5 w-5" />
              <span>Submit Details</span>
              {isFormComplete && <Sparkles className="h-5 w-5 animate-spin" />}
            </div>
          </Button>
          
          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="h-6 w-6" />
              <span>Place Order & Pay via WhatsApp</span>
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Order Progress</span>
            <span>{isFormComplete ? '100%' : '50%'} Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ${
                isFormComplete ? 'w-full' : 'w-1/2'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotSelection;
