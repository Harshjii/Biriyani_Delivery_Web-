
import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  cuisine: string;
  image: string;
  speciality: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewMenu: (restaurantId: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onViewMenu }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-r from-biryani-200 to-spice-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">🍛</div>
        </div>
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-sm font-medium">{restaurant.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{restaurant.name}</h3>
        <p className="text-biryani-600 font-medium mb-2">{restaurant.speciality}</p>
        <p className="text-gray-600 text-sm mb-3">{restaurant.cuisine}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{restaurant.distance}</span>
          </div>
        </div>
        
        <Button
          onClick={() => onViewMenu(restaurant.id)}
          className="w-full bg-biryani-500 hover:bg-biryani-600 text-white"
        >
          View Menu
        </Button>
      </div>
    </div>
  );
};

export default RestaurantCard;
