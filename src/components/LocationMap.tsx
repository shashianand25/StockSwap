import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Store, Navigation } from 'lucide-react';
import { Badge } from './ui/badge';

interface LocationMapProps {
  userLocation: { lat: number; lng: number };
}

// Mock nearby stores based on user location
const generateNearbyStores = (userLat: number, userLng: number) => {
  const stores = [
    { name: 'Kumar Traders', distance: 0.5, verified: true },
    { name: 'Patel General Store', distance: 0.8, verified: true },
    { name: 'Shah Enterprises', distance: 1.2, verified: false },
    { name: 'Verma Kirana', distance: 1.5, verified: true },
    { name: 'Singh Electronics', distance: 2.3, verified: true },
  ];

  // Add random offsets to create nearby coordinates
  return stores.map((store, index) => ({
    ...store,
    lat: userLat + (Math.random() - 0.5) * 0.02 * (index + 1),
    lng: userLng + (Math.random() - 0.5) * 0.02 * (index + 1),
  }));
};

export function LocationMap({ userLocation }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [nearbyStores] = useState(generateNearbyStores(userLocation.lat, userLocation.lng));
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  useEffect(() => {
    // Initialize Leaflet map
    const loadMap = async () => {
      // @ts-ignore - Leaflet will be loaded from CDN
      if (typeof window !== 'undefined' && window.L) {
        // @ts-ignore
        const L = window.L;
        
        if (mapRef.current) {
          const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 14);

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(map);

          // Add user marker (green)
          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `<div style="background: #10B981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
          });

          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Your Location</b><br>You are here');

          // Add nearby store markers (blue)
          nearbyStores.forEach((store, index) => {
            const storeIcon = L.divIcon({
              className: 'custom-store-marker',
              html: `<div style="background: ${store.verified ? '#3B82F6' : '#9CA3AF'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
              iconSize: [20, 20],
            });

            L.marker([store.lat, store.lng], { icon: storeIcon })
              .addTo(map)
              .bindPopup(`<b>${store.name}</b><br>${store.distance} km away${store.verified ? '<br>✓ Verified' : ''}`);
          });

          // Add circle showing 5km radius
          L.circle([userLocation.lat, userLocation.lng], {
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.1,
            radius: 5000, // 5km in meters
          }).addTo(map);
        }
      }
    };

    // Load Leaflet CSS and JS
    const loadLeaflet = () => {
      // Add Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add Leaflet JS
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = loadMap;
        document.body.appendChild(script);
      } else {
        loadMap();
      }
    };

    loadLeaflet();
  }, [userLocation, nearbyStores]);

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-xl border-2 border-gray-200 shadow-inner overflow-hidden"
      />

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 flex-wrap bg-gray-50 p-4 rounded-lg border-2 border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#10B981] border-2 border-white shadow-md"></div>
          <span className="text-sm text-muted-foreground">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] border-2 border-white shadow-md"></div>
          <span className="text-sm text-muted-foreground">Verified Stores</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#9CA3AF] border-2 border-white shadow-md"></div>
          <span className="text-sm text-muted-foreground">Unverified Stores</span>
        </div>
      </div>

      {/* Nearby Stores List */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-[#10B981]" />
          <h4 className="text-[#0F172A]">Nearby Retailers ({nearbyStores.length})</h4>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {nearbyStores.map((store, index) => (
            <div
              key={index}
              onClick={() => setSelectedStore(index === selectedStore ? null : index)}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedStore === index
                  ? 'border-[#10B981] bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${store.verified ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center`}>
                  <Store className={`w-5 h-5 ${store.verified ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#0F172A]">{store.name}</p>
                    {store.verified && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Navigation className="w-3 h-3" />
                    {store.distance} km away
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                View
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
