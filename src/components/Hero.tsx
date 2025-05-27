
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Star, Truck } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-biryani-600 to-biryani-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Authentic <span className="text-spice-300">Biryani</span> Delivered Fresh
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
            From the nearest kitchens to your doorstep. Order now and taste the tradition!
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-spice-300" />
              <span>30 min delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-spice-300" />
              <span>4.8★ rated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-spice-300" />
              <span>Free delivery</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-spice-500 hover:bg-spice-600 text-black font-semibold px-8 py-4 text-lg animate-fade-in"
          >
            Order Now
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-spice-400 rounded-full opacity-10 -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-biryani-300 rounded-full opacity-10 translate-y-24 -translate-x-24"></div>
    </section>
  );
};

export default Hero;
