import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Filter, Search, Package, X, Flame, ShoppingCart, MapPin, Clock, TrendingDown } from 'lucide-react';
import { mockMarketItems, type MarketItem } from '../lib/mockData';
import { BottomNav } from '../components/BottomNav';
import { categories } from '../components/CategoryIcons';

export function LiquidationPage() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('price-low');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<string>('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  // Load products from localStorage on mount and when window gains focus
  useEffect(() => {
    const loadProducts = () => {
      // Load from localStorage
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Filter for 'sell' type products
      const sellProducts = userProducts.filter((p: any) => {
        const listingType = p.listing_type || p.actionType || 'sell';
        return listingType === 'sell' || listingType === 'both';
      });
      
      // Convert to MarketItem format and filter out test items
      const convertedItems: MarketItem[] = sellProducts
        .filter((p: any) => {
          const itemName = (p.item_name || p.productName || '').toLowerCase().trim();
          // Filter out test items with names "dd", "rr", "22", "eee"
          return itemName !== 'dd' && itemName !== 'rr' && itemName !== '22' && itemName !== 'eee';
        })
        .map((p: any) => ({
          id: p.id || Date.now().toString(),
          shopName: p.shop_name || p.shopName || 'My Shop',
          ownerName: p.owner_name || p.ownerName || 'Me',
          sellerRating: 4.5,
          verified: false,
          itemName: p.item_name || p.productName || 'Unknown Item',
          quantity: typeof p.quantity === 'string' && !p.quantity.includes(' ') 
            ? `${p.quantity} ${p.unit || 'Pieces'}` 
            : p.quantity || '1',
          category: p.category || 'Other',
          expiryDate: p.expiry_date || p.expiryDate || '',
          daysUntilExpiry: p.days_until_expiry || parseInt(p.daysUntilExpiry) || 0,
          askingPrice: p.asking_price || parseFloat(p.sellingPrice) || 0,
          willingToSwapFor: null,
          timeOnPlatform: p.createdAt ? 'Just now' : 'Recently',
          distance: 1.2,
          image: p.backImage || p.image_url || 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&q=80&w=400',
          condition: (p.condition || 'New') as any,
          listingType: (p.listing_type || p.actionType || 'sell') as any,
        }));
      
      // Combine with mock data
      const mockSellItems = mockMarketItems.filter(item => item.listingType === 'sell' || item.listingType === 'both');
      setItems([...convertedItems, ...mockSellItems]);
    };
    
    loadProducts();
    
    // Reload when window gains focus (when navigating back to this page)
    const handleFocus = () => {
      loadProducts();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => {
        // Match category name (case-insensitive, partial match for flexibility)
        const itemCategory = (item.category || '').toLowerCase();
        const selectedCat = selectedCategory.toLowerCase();
        return itemCategory === selectedCat || itemCategory.includes(selectedCat) || selectedCat.includes(itemCategory);
      });
    }

    // Distance filter
    if (selectedDistance !== 'all') {
      const maxDistance = parseFloat(selectedDistance);
      filtered = filtered.filter(item => item.distance <= maxDistance);
    }

    // Urgent only filter
    if (showUrgentOnly) {
      filtered = filtered.filter(item => item.daysUntilExpiry <= 7);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.askingPrice - b.askingPrice);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.askingPrice - a.askingPrice);
    } else if (sortBy === 'expiry') {
      filtered.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
    } else if (sortBy === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    }

    setFilteredItems(filtered);
  }, [searchQuery, sortBy, selectedCategory, selectedDistance, showUrgentOnly, items]);

  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('price-low');
    setSelectedCategory('all');
    setSelectedDistance('all');
    setShowUrgentOnly(false);
  };

  const activeFiltersCount = [selectedCategory, selectedDistance].filter(f => f !== 'all').length + (showUrgentOnly ? 1 : 0);

  return (
    <>
      <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#FEF2F2] min-h-screen pb-20 md:pb-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] p-3 rounded-2xl shadow-lg">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-[#0F172A]">Liquidation Deals</h1>
                <p className="text-muted-foreground">Clear dead stock at unbeatable prices</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge className="bg-[#EF4444] text-white px-4 py-2">
                <Flame className="w-4 h-4 mr-2" />
                {filteredItems.filter(i => i.daysUntilExpiry <= 7).length} Urgent Deals
              </Badge>
              <Badge className="bg-[#10B981] text-white px-4 py-2">
                {filteredItems.length} Items Available
              </Badge>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-3">Browse by Category</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                    : 'border-gray-200 hover:border-[#10B981]/50'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => {
                const IconComponent = category.Icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedCategory === category.name
                        ? 'border-[#10B981] bg-[#10B981]/10'
                        : 'border-gray-200 hover:border-[#10B981]/50'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs text-center max-w-[80px]">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Sort Bar */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search liquidation items..."
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-14 border-2 md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Sort by: Lowest Price</SelectItem>
                <SelectItem value="price-high">Sort by: Highest Price</SelectItem>
                <SelectItem value="expiry">Sort by: Expiring Soon</SelectItem>
                <SelectItem value="distance">Sort by: Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <Card className="p-6 sticky top-20 shadow-lg border-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#0F172A]" />
                    <h3 className="text-[#0F172A]">Filters</h3>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-[#EF4444] text-white">{activeFiltersCount}</Badge>
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

                  {/* Urgent Only Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showUrgentOnly}
                        onChange={(e) => setShowUrgentOnly(e.target.checked)}
                        className="w-4 h-4 accent-[#EF4444]"
                      />
                      <span className="text-sm">Show Urgent Only (&lt;7 days)</span>
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

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {filteredItems.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-[#0F172A] mb-2">No items found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map(item => (
                    <LiquidationCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

interface LiquidationCardProps {
  item: MarketItem;
}

function LiquidationCard({ item }: LiquidationCardProps) {
  const isExpiringSoon = item.daysUntilExpiry <= 7;
  const isExpiringUrgent = item.daysUntilExpiry <= 3;
  
  // Calculate discount percentage (assuming original price would be higher)
  const originalPrice = Math.round(item.askingPrice * 2.5);
  const discountPercent = Math.round(((originalPrice - item.askingPrice) / originalPrice) * 100);

  return (
    <Card className={`overflow-hidden shadow-md border-2 hover:shadow-xl transition-all duration-200 ${
      isExpiringUrgent ? 'border-[#EF4444] bg-gradient-to-br from-red-50 to-white' : 
      isExpiringSoon ? 'border-[#F59E0B] bg-gradient-to-br from-orange-50 to-white' : 
      'hover:border-[#EF4444] bg-white'
    }`}>
      {/* Product Image with Overlay Badge */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={item.image}
          alt={item.itemName}
          className="w-full h-full object-cover"
        />
        {/* Red Overlay Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-2xl">{discountPercent}% OFF</span>
        </div>
        
        {/* Urgency Badge */}
        {isExpiringSoon && (
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#EF4444]" />
            <span className="text-sm">Expiring in {item.daysUntilExpiry} days</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-[#0F172A] text-xl mb-3">{item.itemName}</h3>

        {/* Typography with Large Green Font for Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl text-[#10B981]">₹{item.askingPrice.toLocaleString()}</span>
            <span className="text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">MRP: ₹{originalPrice.toLocaleString()}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium text-[#0F172A]">{item.quantity}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Condition:</span>
            <Badge variant="outline" className="text-xs">{item.condition}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expires:</span>
            <span className={isExpiringSoon ? 'text-[#EF4444] font-medium' : 'text-[#0F172A]'}>{item.expiryDate}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-sm">
            {item.shopName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0F172A]">{item.shopName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {item.distance} km away
            </div>
          </div>
          <Link to={`/map/${item.id}`}>
            <Button size="sm" variant="outline" className="flex items-center gap-1 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white">
              <MapPin className="w-3 h-3" />
              Map
            </Button>
          </Link>
        </div>

        {/* Buy Button */}
        <Button className="w-full h-12 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white shadow-lg">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Buy Now (Cash)
        </Button>
      </div>
    </Card>
  );
}