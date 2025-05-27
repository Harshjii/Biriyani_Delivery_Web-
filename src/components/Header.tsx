
import React from 'react';
import { MapPin, ShoppingCart, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  cartItems: number;
  onCartClick: () => void;
  onOffersClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItems, onCartClick, onOffersClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-biryani-600">BiryaniExpress</h1>
            <div className="hidden md:flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">Delivering to your location</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onOffersClick}
              className="hidden md:flex items-center space-x-1 text-biryani-600 border-biryani-300 hover:bg-biryani-50"
            >
              <Percent className="h-4 w-4" />
              <span>Offers</span>
            </Button>
            
            <Button
              onClick={onCartClick}
              className="relative bg-biryani-500 hover:bg-biryani-600 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Cart</span>
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
