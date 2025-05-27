
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, MessageCircle } from 'lucide-react';
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
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken',
      price: 320,
      image: '🍛'
    },
    {
      id: '2',
      name: 'Mutton Biryani',
      description: 'Premium mutton with fragrant rice',
      price: 450,
      image: '🍛'
    },
    {
      id: '3',
      name: 'Vegetable Biryani',
      description: 'Mixed vegetables with aromatic rice',
      price: 250,
      image: '🍛'
    },
    {
      id: '4',
      name: 'Prawns Biryani',
      description: 'Fresh prawns with premium basmati',
      price: 380,
      image: '🍛'
    },
    {
      id: '5',
      name: 'Egg Biryani',
      description: 'Boiled eggs with spiced rice',
      price: 200,
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

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart first",
        variant: "destructive"
      });
      return;
    }

    const orderDetails = cartItems.map(item => 
      `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');
    
    const message = `🍛 *New Biryani Order*\n\n${orderDetails}\n\n*Total: ₹${totalAmount}*\n\nPlease confirm the order and share payment details.`;
    
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
      </div>

      {/* Cart Summary & Order Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{totalItems} items</p>
              <p className="text-lg font-bold text-gray-800">Total: ₹{totalAmount}</p>
            </div>
          </div>
          <Button
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Order via WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
