import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { MessageCircle, Star, CheckCircle2, Clock, MapPin, Filter, Search, Package, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { mockMarketItems, mockWantedItems, type MarketItem } from '../lib/mockData';
import { formatReducedPrice } from '../lib/priceUtils';
import SwapCalculatorModal from '../components/SwapCalculatorModal';
import { BackButton } from '../components/BackButton';

export function MarketplacePage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState<MarketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExpiry, setSelectedExpiry] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [currentTab, setCurrentTab] = useState(initialTab);

  // Fetch items from Supabase
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        // Fallback to mock data on error for demo purposes
        setItems(mockMarketItems);
        return;
      }

      if (data) {
        // Map Supabase data to MarketItem interface
        const mappedItems: MarketItem[] = data.map((item: any) => ({
          id: item.id,
          shopName: item.shop_name || 'Unknown Shop',
          ownerName: item.owner_name || 'Unknown Owner',
          sellerRating: 4.5, // Default rating
          verified: true,
          itemName: item.item_name,
          quantity: item.quantity,
          category: item.category,
          expiryDate: item.expiry_date,
          daysUntilExpiry: item.days_until_expiry,
          askingPrice: item.asking_price,
          willingToSwapFor: item.willing_to_swap_for,
          timeOnPlatform: 'Just now', // Simplified
          distance: 1.2, // Default distance
          image: item.image_url || 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&q=80&w=400',
          condition: item.condition as any,
          listingType: item.listing_type as any || 'both',
        }));

        // Combine with mock data for populated feel if empty
        if (mappedItems.length === 0) {
          setItems(mockMarketItems);
        } else {
          setItems([...mappedItems, ...mockMarketItems]); // Show both for hackathon fullness
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setItems(mockMarketItems);
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  useEffect(() => {
    let filtered = [...items];

    // Tab filter
    if (currentTab === 'swap') {
      filtered = filtered.filter(item => item.willingToSwapFor);
    } else if (currentTab === 'sell') {
      filtered = filtered.filter(item => item.listingType === 'sell' || item.listingType === 'both');
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Distance filter
    if (selectedDistance !== 'all') {
      const maxDistance = parseFloat(selectedDistance);
      filtered = filtered.filter(item => item.distance <= maxDistance);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Expiry filter
    if (selectedExpiry !== 'all') {
      const maxDays = parseInt(selectedExpiry);
      filtered = filtered.filter(item => item.daysUntilExpiry <= maxDays);
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    // Verified filter
    if (showVerifiedOnly) {
      filtered = filtered.filter(item => item.verified);
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedDistance, selectedCategory, selectedExpiry, selectedCondition, showVerifiedOnly, items, currentTab]);

  const handleChatClick = (itemName: string) => {
    alert(`Opening chat for ${itemName}`);
  };

  const handleSwapCalculator = (item: MarketItem) => {
    setSelectedItem(item);
    setShowCalculator(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDistance('all');
    setSelectedCategory('all');
    setSelectedExpiry('all');
    setSelectedCondition('all');
    setShowVerifiedOnly(false);
  };

  const categories = ['Food', 'FMCG', 'Pharma', 'Electronics', 'Cosmetics'];
  const activeFiltersCount = [selectedDistance, selectedCategory, selectedExpiry, selectedCondition]
    .filter(f => f !== 'all').length + (showVerifiedOnly ? 1 : 0);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton />
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#0F172A] mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse inventory from verified retailers near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by product, shop name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 border-2 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-white border-2">
            <TabsTrigger value="all" className="text-base">
              <Package className="w-4 h-4 mr-2" />
              All Items
            </TabsTrigger>
            <TabsTrigger value="swap" className="text-base">
              Swap Only
            </TabsTrigger>
            <TabsTrigger value="wanted" className="text-base">
              Wanted
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <Card className="p-6 sticky top-20 shadow-lg border-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#0F172A]" />
                    <h3 className="text-[#0F172A]">Filters</h3>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-[#10B981] text-white">{activeFiltersCount}</Badge>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Distance Filter */}
                  <div>
                    <Label className="mb-2 block text-sm">Distance</Label>
                    <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Distances</SelectItem>
                        <SelectItem value="1">&lt; 1 km</SelectItem>
                        <SelectItem value="2">&lt; 2 km</SelectItem>
                        <SelectItem value="5">&lt; 5 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <Label className="mb-2 block text-sm">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Expiry Date Filter */}
                  <div>
                    <Label className="mb-2 block text-sm">Expiry Date</Label>
                    <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Time</SelectItem>
                        <SelectItem value="7">&lt; 7 days (Urgent)</SelectItem>
                        <SelectItem value="30">&lt; 30 days</SelectItem>
                        <SelectItem value="90">&lt; 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Condition Filter */}
                  <div>
                    <Label className="mb-2 block text-sm">Condition</Label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Verified Only Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showVerifiedOnly}
                        onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                        className="w-4 h-4 accent-[#10B981]"
                      />
                      <span className="text-sm">Verified Sellers Only</span>
                    </label>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-2"
                    onClick={resetFilters}
                    disabled={activeFiltersCount === 0 && !searchQuery}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <TabsContent value="all" className="mt-0">
                <ProductGrid
                  items={filteredItems}
                  onChat={handleChatClick}
                  onSwapCalculator={handleSwapCalculator}
                />
              </TabsContent>

              <TabsContent value="swap" className="mt-0">
                <ProductGrid
                  items={filteredItems}
                  onChat={handleChatClick}
                  onSwapCalculator={handleSwapCalculator}
                />
              </TabsContent>

              <TabsContent value="wanted" className="mt-0">
                <WantedGrid onChat={handleChatClick} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Swap Calculator Modal */}
      {showCalculator && selectedItem && (
        <SwapCalculatorModal
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
          theirItem={selectedItem}
        />
      )}
    </div>
  );
}

interface ProductGridProps {
  items: MarketItem[];
  onChat: (itemName: string) => void;
  onSwapCalculator: (item: MarketItem) => void;
}

function ProductGrid({ items, onChat, onSwapCalculator }: ProductGridProps) {
  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-[#0F172A] mb-2">No items found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search query</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {items.map(item => (
        <ProductCard
          key={item.id}
          item={item}
          onChat={onChat}
          onSwapCalculator={onSwapCalculator}
        />
      ))}
    </div>
  );
}

interface ProductCardProps {
  item: MarketItem;
  onChat: (itemName: string) => void;
  onSwapCalculator: (item: MarketItem) => void;
}

function ProductCard({ item, onChat, onSwapCalculator }: ProductCardProps) {
  const isExpiringSoon = item.daysUntilExpiry <= 7;
  const isExpiringUrgent = item.daysUntilExpiry <= 3;

  return (
    <Card className={`p-6 shadow-md border-2 hover:shadow-xl transition-all duration-200 ${isExpiringUrgent ? 'border-[#EF4444] animate-pulse-slow bg-gradient-to-br from-red-50 to-white' :
        isExpiringSoon ? 'border-[#F59E0B] bg-gradient-to-br from-orange-50 to-white' :
          'hover:border-[#10B981] bg-white'
      }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-[#0F172A] text-white w-12 h-12 rounded-full flex items-center justify-center text-lg">
            {item.shopName.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm">{item.shopName}</h4>
            <p className="text-xs text-muted-foreground mb-1">{item.ownerName}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{item.sellerRating}</span>
              </div>
              {item.verified && (
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
        {isExpiringSoon && (
          <Badge variant="destructive" className="text-xs animate-pulse">
            <Clock className="w-3 h-3 mr-1" />
            {item.daysUntilExpiry}d left!
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="flex gap-4 mb-4">
        <img
          src={item.image}
          alt={item.itemName}
          className="w-28 h-28 object-cover rounded-lg border-2 border-border"
        />
        <div className="flex-1">
          <h3 className="text-[#0F172A] text-lg mb-2">{item.itemName}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
              <Badge variant="outline" className="text-xs">{item.condition}</Badge>
            </div>
            <p className="text-muted-foreground">
              <span className="font-medium">Qty:</span> {item.quantity}
            </p>
            <p className={isExpiringSoon ? 'text-[#F43F5E]' : 'text-muted-foreground'}>
              <span className="font-medium">Exp:</span> {item.expiryDate}
            </p>
          </div>
        </div>
      </div>

      {/* Price & Swap Info */}
      <div className="bg-gradient-to-r from-[#10B981]/5 to-[#10B981]/10 rounded-lg p-4 mb-4 border-2 border-[#10B981]/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Asking Price</p>
            <p className="text-2xl text-[#10B981]">{formatReducedPrice(item.askingPrice)}</p>
          </div>
          {item.willingToSwapFor && (
            <Badge className="bg-[#0F172A] text-white">Can Swap</Badge>
          )}
        </div>
        {item.willingToSwapFor && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Willing to Swap For:</p>
            <p className="text-sm text-[#0F172A]">{item.willingToSwapFor}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.distance} km
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.timeOnPlatform}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSwapCalculator(item)}
            className="border-2"
          >
            Check Value
          </Button>
          <Button
            size="sm"
            className="bg-[#0F172A] hover:bg-[#0F172A]/90"
            onClick={() => onChat(item.itemName)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>
    </Card>
  );
}

function WantedGrid({ onChat }: { onChat: (itemName: string) => void }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {mockWantedItems.map(wanted => (
        <Card key={wanted.id} className="p-6 shadow-md border-2 hover:shadow-xl transition-all duration-200 hover:border-blue-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg">
                {wanted.shopName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm">{wanted.shopName}</h4>
                <p className="text-xs text-muted-foreground">by {wanted.buyerName}</p>
                {wanted.verified && (
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 mt-1">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
              Buying Request
            </Badge>
          </div>

          <h3 className="text-[#0F172A] text-lg mb-4">
            <span className="text-muted-foreground text-sm">Looking for:</span><br />
            {wanted.itemWanted}
          </h3>

          <div className="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Quantity Needed</p>
                <p className="text-sm">{wanted.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Willing to Pay</p>
                <p className="text-lg text-[#10B981]">₹{wanted.willingToPay.toLocaleString()}</p>
              </div>
            </div>
            {wanted.willingToExchange && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Or Exchange For:</p>
                <p className="text-sm text-[#0F172A]">{wanted.willingToExchange}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {wanted.distance} km
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {wanted.timePosted}
              </span>
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onChat(wanted.itemWanted)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Respond
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}