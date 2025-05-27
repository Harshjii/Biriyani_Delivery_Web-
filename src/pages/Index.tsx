import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Veg Biryani',
      description: 'Aromatic basmati rice with mixed vegetables',
      price: 60,
      image: '🍛'
    },
    {
      id: '2',
      name: 'Chaap Biryani',
      description: 'Delicious soya chaap with fragrant rice',
      price: 80,
      image: '🍛'
    }
  ];

  const handleAddToCart = (item: MenuItem) => {
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
      title: "Added to cart",
      description: `${item.name} added successfully`,
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
  
  // Coupon system - free gift when quantity is above 4
  const couponApplied = totalItems > 4;

  const handleNext = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart first",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-biryani-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">BiryaniExpress</h1>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">{totalItems}</span>
          </div>
        </div>
      </header>

      {/* Coupon Banner */}
      {couponApplied && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 mx-4 mt-4 rounded-lg shadow-md animate-pulse">
          <div className="flex items-center justify-center space-x-2">
            <Gift className="h-5 w-5" />
            <span className="font-bold">🎉 Congratulations! Free Gift Unlocked!</span>
          </div>
          <p className="text-center text-sm mt-1">You get a complimentary dessert with your order!</p>
        </div>
      )}

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Fresh Biryani</h2>
        
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{item.image}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-lg font-bold text-biryani-600">₹{item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getItemQuantity(item.id) > 0 ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-8 text-center">{getItemQuantity(item.id)}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="h-8 w-8 p-0 bg-biryani-500 hover:bg-biryani-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-biryani-500 hover:bg-biryani-600 text-white"
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Coupon Info */}
        {!couponApplied && totalItems > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">
                Order {5 - totalItems} more items to get a free gift! 🎁
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cart Summary & Next Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{totalItems} items</p>
              <p className="text-lg font-bold text-gray-800">Total: ₹{totalAmount}</p>
              {couponApplied && (
                <p className="text-sm text-green-600 font-medium">+ Free Gift 🎁</p>
              )}
            </div>
          </div>
          <Button
            onClick={handleNext}
            className="w-full bg-biryani-500 hover:bg-biryani-600 text-white py-3 text-lg"
          >
            Next <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
