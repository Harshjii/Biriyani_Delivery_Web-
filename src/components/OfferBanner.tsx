
import React from 'react';
import { Percent, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
  minOrder?: number;
}

interface OfferBannerProps {
  offers: Offer[];
  onApplyCoupon: (code: string) => void;
}

const OfferBanner: React.FC<OfferBannerProps> = ({ offers, onApplyCoupon }) => {
  return (
    <section className="py-8 bg-gradient-to-r from-spice-100 to-biryani-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-6">
          <Percent className="h-6 w-6 text-biryani-600 mr-2" />
          <h2 className="text-2xl font-bold text-biryani-800">Special Offers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-biryani-500 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{offer.title}</h3>
                  <p className="text-biryani-600 font-semibold text-2xl">{offer.discount}</p>
                </div>
                <div className="bg-biryani-100 px-3 py-1 rounded-full">
                  <span className="text-biryani-700 font-medium text-sm">{offer.code}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{offer.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Until {offer.validUntil}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => onApplyCoupon(offer.code)}
                  className="bg-biryani-500 hover:bg-biryani-600 text-white"
                >
                  Apply
                </Button>
              </div>
              
              {offer.minOrder && (
                <p className="text-xs text-gray-500 mt-2">
                  *Min order ₹{offer.minOrder}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
