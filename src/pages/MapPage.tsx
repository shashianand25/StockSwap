import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Navigation, Phone, ArrowLeft, Store, Package, Clock, CheckCircle2 } from 'lucide-react';
import { categoryProducts } from '../data/categoryProducts';
import { formatReducedPrice } from '../lib/priceUtils';
import { mockWantedItems } from '../lib/mockData';
import { BottomNav } from '../components/BottomNav';
import { BackButton } from '../components/BackButton';

export function MapPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [userLocation] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai default
  
  // Look up a product from categoryProducts, otherwise search mockWantedItems
  const rawProduct = categoryProducts.find(p => p.id === productId);
  const wantedItem = mockWantedItems.find(w => w.id === productId);
  const isWanted = !rawProduct && !!wantedItem;

  // Normalize into a common `product` object for rendering
  const product = rawProduct || (wantedItem ? {
    id: wantedItem.id,
    title: wantedItem.itemWanted,
    category: 'Wanted',
    type: 'wanted',
    price: wantedItem.willingToPay,
    condition: '',
    quantity: wantedItem.quantity,
    location: '',
    shopName: wantedItem.shopName,
    description: wantedItem.willingToExchange || '',
    urgency: 'Medium',
    verified: wantedItem.verified,
    distance: `${wantedItem.distance} km`,
    postedDate: wantedItem.timePosted,
    views: 0
  } : undefined as any);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl mb-2">Product not found</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Simulate destination location based on product
  const destination = {
    lat: userLocation.lat + (Math.random() - 0.5) * 0.05,
    lng: userLocation.lng + (Math.random() - 0.5) * 0.05,
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0FDF4] pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-4 py-6 shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <BackButton className="text-white border border-white/30 hover:bg-white/10" />
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl mb-1">{isWanted ? 'Route to Buyer' : 'Route to Seller'}</h1>
                <p className="text-sm text-gray-300">Navigate to {product.shopName}</p>
              </div>
              <MapPin className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Map Container */}
          <Card className="overflow-hidden border-2">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-96 flex items-center justify-center">
              {/* Simulated Map View */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Grid lines to simulate map */}
                  {[...Array(20)].map((_, i) => (
                    <React.Fragment key={i}>
                      <line x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="#CBD5E1" strokeWidth="1" />
                      <line x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="#CBD5E1" strokeWidth="1" />
                    </React.Fragment>
                  ))}
                  {/* Route line */}
                  <path
                    d="M 100 300 Q 150 200, 200 150 T 300 100"
                    stroke="#10B981"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="8 4"
                  />
                </svg>
              </div>

              {/* Your Location Marker */}
              <div className="absolute bottom-20 left-20 flex flex-col items-center">
                <div className="bg-blue-500 rounded-full p-3 shadow-lg animate-pulse">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div className="mt-2 bg-white px-3 py-1 rounded-lg shadow-md text-xs">
                  Your Location
                </div>
              </div>

              {/* Destination Marker */}
              <div className="absolute top-20 right-20 flex flex-col items-center">
                <div className="bg-[#10B981] rounded-full p-3 shadow-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="mt-2 bg-white px-3 py-1 rounded-lg shadow-md text-xs">
                  {product.shopName}
                </div>
              </div>

              {/* Distance Badge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-white text-[#0F172A] border-2 border-[#10B981] px-4 py-2 text-lg shadow-lg">
                  📍 {product.distance}
                </Badge>
              </div>
            </div>

            {/* Navigate Button */}
            <div className="p-6 bg-gradient-to-r from-[#10B981] to-[#059669]">
              <Button
                onClick={openGoogleMaps}
                className="w-full bg-white text-[#10B981] hover:bg-gray-100 h-14 text-lg font-semibold shadow-lg"
                size="lg"
              >
                <Navigation className="w-6 h-6 mr-3" />
                Open in Google Maps
              </Button>
            </div>
          </Card>

          {/* Product Details */}
          <Card className="p-6 border-2">
            <h3 className="text-xl mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#10B981]" />
              {isWanted ? 'Sourcing Request Details' : 'Product Details'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Item</p>
                <p className="text-lg text-[#0F172A]">{product.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Condition</p>
                  <Badge variant="outline">{product.condition}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                <p className="text-base">{product.quantity}</p>
              </div>

              {product.price && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-xl text-[#10B981] font-semibold">{formatReducedPrice(product.price)}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Seller Details */}
          <Card className="p-6 border-2">
            <h3 className="text-xl mb-4 flex items-center gap-2">
              <Store className="w-6 h-6 text-[#10B981]" />
              {isWanted ? 'Buyer Information' : 'Seller Information'}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-lg text-[#0F172A] mb-1">{product.shopName}</p>
                  {product.verified && (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {isWanted ? 'Verified Buyer' : 'Verified Seller'}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </p>
                <p className="text-base">{product.location || 'Location not available'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Posted
                </p>
                <p className="text-base">{product.postedDate}</p>
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
                  size="lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {isWanted ? 'Contact Buyer' : 'Contact Seller'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Directions Info */}
          <Card className="p-6 border-2 bg-blue-50 border-blue-200">
            <div className="flex gap-4">
              <div className="bg-blue-500 rounded-full p-3 h-fit">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg mb-2 text-[#0F172A]">Getting There</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Click "Open in Google Maps" above to get turn-by-turn navigation to the seller's location.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Distance: {product.distance}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Estimated time: ~{Math.ceil(parseFloat(product.distance) * 5)} mins
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Best visited during: 9 AM - 8 PM
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
