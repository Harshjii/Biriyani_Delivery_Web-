import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, ArrowRight, Gift, Star, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
  tags?: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [pulsingItems, setPulsingItems] = useState<Set<string>>(new Set());
  const [showSpecialOffer, setShowSpecialOffer] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Veg Biryani',
      description: 'Aromatic basmati rice with mixed vegetables',
      price: 60,
      image: '🍛',
      rating: 4.5,
      tags: ['Popular', 'Vegetarian']
    },
    {
      id: '2',
      name: 'Chaap Biryani',
      description: 'Delicious soya chaap with fragrant rice',
      price: 80,
      image: '🍛',
      rating: 4.7,
      tags: ['Chef\'s Special', 'Protein Rich']
    }
  ];

  // Show special offer animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpecialOffer(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    // Add pulsing animation to the item
    setPulsingItems(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setPulsingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 600);

    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    toast({
      title: "🎉 Added to cart!",
      description: (
        <div className="flex items-center space-x-2">
          <span>{item.name} added successfully</span>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
      ),
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.id !== itemId);
      }
    });
  };

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Coupon system - free gift when quantity is above 3
  const couponApplied = totalItems > 3;

  const handleNext = () => {
    if (cartItems.length === 0) {
      toast({
        title: "🛒 Cart is empty",
        description: "Please add some delicious biryani to your cart first!",
        variant: "destructive"
      });
      return;
    }

    navigate('/slot-selection', {
      state: {
        cartItems,
        totalAmount,
        totalItems,
        couponApplied
      }
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 pb-20 sm:pb-4">
      {/* Header with enhanced mobile styling */}
      <header className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-3 sm:p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="animate-bounce text-lg sm:text-xl">🍛</div>
            <h1 className="text-lg sm:text-xl font-bold">BiryaniExpress</h1>
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 animate-pulse" />
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-sm relative">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">{totalItems}</span>
            {totalItems > 0 && (
              <div className="animate-ping absolute inline-flex h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-400 opacity-75 -top-1 -right-1"></div>
            )}
          </div>
        </div>
      </header>

      {/* Special Offer Banner */}
      {showSpecialOffer && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 sm:p-4 mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-xl shadow-lg animate-slide-in-right">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            <span className="font-bold text-base sm:text-lg">⚡ Limited Time Offer!</span>
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          </div>
          <p className="text-center text-xs sm:text-sm mt-1">Free delivery on orders above ₹100! 🚀</p>
        </div>
      )}

      {/* Coupon Banner */}
      {couponApplied && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 sm:p-4 mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-xl shadow-lg animate-scale-in">
          <div className="flex items-center justify-center space-x-2">
            <Gift className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
            <span className="font-bold text-base sm:text-lg">🎉 Congratulations!</span>
          </div>
          <p className="text-center text-xs sm:text-sm mt-1 flex items-center justify-center space-x-1">
            <span>You get a complimentary dessert with your order!</span>
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300" />
          </p>
        </div>
      )}

      {/* Menu Items */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Fresh Biryani</h2>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
        
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 ${
              pulsingItems.has(item.id) ? 'animate-pulse bg-green-50' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="text-4xl sm:text-5xl animate-pulse text-center sm:text-left">{item.image}</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">{item.name}</h3>
                  {item.tags?.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant={tag === 'Popular' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        tag === 'Popular' ? 'bg-orange-500 hover:bg-orange-600' : ''
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {item.rating && (
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex space-x-0.5">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">{item.rating}</span>
                  </div>
                )}
                
                <p className="text-xs sm:text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                  <p className="text-lg sm:text-xl font-bold text-orange-600">₹{item.price}</p>
                  <span className="text-xs text-gray-500 line-through">₹{item.price + 20}</span>
                  <Badge variant="destructive" className="text-xs">25% OFF</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end">
                {getItemQuantity(item.id) > 0 ? (
                  <div className="flex items-center space-x-2 sm:space-x-3 bg-orange-50 rounded-full p-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                    </Button>
                    <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center text-orange-600">
                      {getItemQuantity(item.id)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 transform hover:scale-110"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Coupon Info */}
        {!couponApplied && totalItems > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mt-4 sm:mt-6 animate-fade-in">
            <div className="flex items-center space-x-2 sm:space-x-3 text-orange-800">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">
                Order {4 - totalItems} more items to unlock a free gift! 🎁
              </span>
            </div>
            <div className="mt-2 bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(totalItems / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Cart Summary & Next Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-3 sm:p-4 animate-slide-in-right">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center space-x-1">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{totalItems} items in cart</span>
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">Total: ₹{totalAmount}</p>
              {couponApplied && (
                <div className="flex items-center space-x-1">
                  <p className="text-xs sm:text-sm text-green-600 font-medium">+ Free Gift</p>
                  <Gift className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 animate-bounce" />
                </div>
              )}
              {totalAmount >= 100 && (
                <p className="text-xs sm:text-sm text-blue-600 font-medium flex items-center space-x-1">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Free Delivery Unlocked!</span>
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 animate-pulse" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
