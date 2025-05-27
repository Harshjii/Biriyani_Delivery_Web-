
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  isVeg: boolean;
}

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemId: string) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, quantity, onAddToCart, onRemoveFromCart }) => {
  const spiceLevelColors = {
    Mild: 'text-green-600',
    Medium: 'text-yellow-600',
    Spicy: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-r from-biryani-100 to-spice-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">🍛</div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white ${spiceLevelColors[item.spiceLevel]}`}>
            {item.spiceLevel}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-biryani-600">₹{item.price}</span>
          
          {quantity > 0 ? (
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRemoveFromCart(item.id)}
                className="h-8 w-8 p-0 border-biryani-300 text-biryani-600 hover:bg-biryani-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium text-lg min-w-[2ch] text-center">{quantity}</span>
              <Button
                size="sm"
                onClick={() => onAddToCart(item)}
                className="h-8 w-8 p-0 bg-biryani-500 hover:bg-biryani-600 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onAddToCart(item)}
              className="bg-biryani-500 hover:bg-biryani-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
