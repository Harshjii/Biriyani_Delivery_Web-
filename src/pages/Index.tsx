
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import OfferBanner from '@/components/OfferBanner';
import RestaurantCard from '@/components/RestaurantCard';
import MenuCard, { MenuItem } from '@/components/MenuCard';
import Cart from '@/components/Cart';

interface CartItem extends MenuItem {
  quantity: number;
}

const Index = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discount, setDiscount] = useState(0);

  const offers = [
    {
      id: '1',
      title: 'First Order Special',
      description: 'Get 30% off on your first biryani order',
      discount: '30% OFF',
      code: 'FIRST30',
      validUntil: 'Dec 31',
      minOrder: 200
    },
    {
      id: '2',
      title: 'Weekend Feast',
      description: 'Free delivery + 20% off on weekend orders',
      discount: '20% OFF',
      code: 'WEEKEND20',
      validUntil: 'This Weekend',
      minOrder: 300
    },
    {
      id: '3',
      title: 'Family Pack',
      description: 'Order for 4+ people and save big',
      discount: '25% OFF',
      code: 'FAMILY25',
      validUntil: 'Dec 25',
      minOrder: 800
    }
  ];

  const restaurants = [
    {
      id: '1',
      name: 'Hyderabadi House',
      rating: 4.8,
      deliveryTime: '25-30 min',
      distance: '1.2 km',
      cuisine: 'Hyderabadi, North Indian',
      image: '',
      speciality: 'Authentic Hyderabadi Biryani'
    },
    {
      id: '2',
      name: 'Biryani Palace',
      rating: 4.6,
      deliveryTime: '30-35 min',
      distance: '2.1 km',
      cuisine: 'Mughlai, Biryani',
      image: '',
      speciality: 'Royal Mughlai Biryani'
    },
    {
      id: '3',
      name: 'Kolkata Biryani Corner',
      rating: 4.7,
      deliveryTime: '20-25 min',
      distance: '0.8 km',
      cuisine: 'Bengali, Biryani',
      image: '',
      speciality: 'Traditional Kolkata Biryani'
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice cooked with tender chicken pieces and authentic spices',
      price: 320,
      image: '',
      category: 'Non-Veg Biryani',
      spiceLevel: 'Medium',
      isVeg: false
    },
    {
      id: '2',
      name: 'Mutton Biryani',
      description: 'Premium mutton pieces slow-cooked with fragrant rice and traditional masalas',
      price: 450,
      image: '',
      category: 'Non-Veg Biryani',
      spiceLevel: 'Spicy',
      isVeg: false
    },
    {
      id: '3',
      name: 'Vegetable Biryani',
      description: 'Mixed vegetables and paneer cooked with aromatic rice and mild spices',
      price: 250,
      image: '',
      category: 'Veg Biryani',
      spiceLevel: 'Mild',
      isVeg: true
    },
    {
      id: '4',
      name: 'Prawns Biryani',
      description: 'Fresh prawns marinated and cooked with premium basmati rice',
      price: 380,
      image: '',
      category: 'Seafood Biryani',
      spiceLevel: 'Medium',
      isVeg: false
    },
    {
      id: '5',
      name: 'Egg Biryani',
      description: 'Boiled eggs cooked with spiced rice and caramelized onions',
      price: 200,
      image: '',
      category: 'Egg Biryani',
      spiceLevel: 'Mild',
      isVeg: false
    },
    {
      id: '6',
      name: 'Paneer Biryani',
      description: 'Cottage cheese cubes cooked with aromatic rice and mild spices',
      price: 280,
      image: '',
      category: 'Veg Biryani',
      spiceLevel: 'Mild',
      isVeg: true
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
      description: `${item.name} has been added to your cart`,
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

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleApplyCoupon = (code: string) => {
    const offer = offers.find(o => o.code === code);
    if (offer) {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (offer.minOrder && subtotal < offer.minOrder) {
        toast({
          title: "Minimum order not met",
          description: `Minimum order of ₹${offer.minOrder} required for this coupon`,
          variant: "destructive",
        });
        return;
      }
      
      setAppliedCoupon(code);
      setDiscount(parseInt(offer.discount.replace('% OFF', '')));
      toast({
        title: "Coupon applied!",
        description: `${offer.discount} discount applied to your order`,
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is not valid",
        variant: "destructive",
      });
    }
  };

  const handleViewMenu = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItems={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onOffersClick={() => {
          const offersSection = document.getElementById('offers');
          offersSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      
      <Hero />
      
      <div id="offers">
        <OfferBanner offers={offers} onApplyCoupon={handleApplyCoupon} />
      </div>
      
      {!selectedRestaurant ? (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Restaurants Near You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onViewMenu={handleViewMenu}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="text-biryani-600 hover:text-biryani-700 font-medium"
              >
                ← Back to Restaurants
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedCoupon={appliedCoupon}
        discount={discount}
      />
    </div>
  );
};

export default Index;
