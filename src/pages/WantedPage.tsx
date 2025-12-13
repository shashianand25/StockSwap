import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Package, MapPin, Clock, CheckCircle2, Sparkles, Plus, X, Filter, Search } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { mockWantedItems } from '../lib/mockData';
import { categories } from '../components/CategoryIcons';

// Exclusive Color Palette
const COLORS = {
  soapPink: '#EA6CA2',
  insomniaGreen: '#A6D935',
  tylerGold: '#D9AC59',
  fincherOrange: '#DE5626',
  voidBlack: '#030202'
};

interface WantedItem {
  id: string;
  shopName: string;
  buyerName: string;
  verified: boolean;
  itemWanted: string;
  quantity: number;
  willingToPay: number;
  willingToExchange: string | null;
  distance: number;
  timePosted: string;
  urgency: 'low' | 'medium' | 'high';
}

export function WantedPage() {
  const [items, setItems] = useState<WantedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<WantedItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchWantedItems();
  }, []);

  const fetchWantedItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wanted_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wanted items:', error);
        setItems(mockWantedItems);
        return;
      }

      if (data) {
        const mappedItems: WantedItem[] = data.map((item: any) => ({
          id: item.id,
          shopName: item.shop_name || 'Unknown Shop',
          buyerName: item.buyer_name || 'Unknown Buyer',
          verified: true, // Assuming all fetched items are verified for now
          itemWanted: item.item_wanted,
          quantity: item.quantity,
          willingToPay: item.willing_to_pay,
          willingToExchange: item.willing_to_exchange,
          distance: 1.5, // Default distance, can be calculated later
          timePosted: 'Recently', // Can be formatted from created_at
          urgency: item.urgency || 'medium',
        }));

        if (mappedItems.length === 0) {
          setItems(mockWantedItems);
        } else {
          setItems([...mappedItems, ...mockWantedItems]); // Combine fetched with mock
        }
      }
    } catch (err) {
      console.error(err);
      setItems(mockWantedItems); // Fallback to mock data on any error
    } finally {
      setLoading(false);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    let filtered = items.length > 0 ? items : mockWantedItems;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.itemWanted.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shopName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Note: Category filtering would require category field in WantedItem interface
    // For now, we'll just show all items when a category is selected

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  return (
    <>
      <div className="min-h-screen pb-20 md:pb-8 font-sans" style={{ backgroundColor: COLORS.voidBlack, color: '#ffffff' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl shadow-[0_0_15px_rgba(166,217,53,0.5)]" style={{ backgroundColor: COLORS.insomniaGreen }}>
                  <Package className="w-8 h-8" style={{ color: COLORS.voidBlack }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight" style={{ color: COLORS.soapPink }}>Sourcing Requests</h1>
                  <p className="text-gray-400">Help retailers find what they need</p>
                </div>
              </div>

              {/* Floating Action Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="shadow-[0_0_10px_rgba(234,108,162,0.5)] hover:bg-opacity-90 border-none h-14 px-6 text-black font-bold text-lg"
                    style={{ backgroundColor: COLORS.soapPink }}
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    Post Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border-2" style={{ backgroundColor: COLORS.voidBlack, borderColor: COLORS.soapPink, color: 'white' }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: COLORS.soapPink }}>Create Sourcing Request</DialogTitle>
                  </DialogHeader>
                  <PostRequestForm onClose={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Badge className="border-none px-4 py-2 font-medium" style={{ backgroundColor: '#222', color: COLORS.tylerGold }}>
                {filteredItems.length} Active Requests
              </Badge>
              <Badge className="px-4 py-2 font-bold text-black" style={{ backgroundColor: COLORS.insomniaGreen }}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                All Verified Buyers
              </Badge>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: COLORS.soapPink }}>Browse by Category</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap font-medium ${selectedCategory === null
                    ? 'shadow-[0_0_10px_rgba(166,217,53,0.3)]'
                    : 'text-gray-400 border-gray-800 hover:border-gray-600'
                  }`}
                style={selectedCategory === null ? {
                  borderColor: COLORS.insomniaGreen,
                  backgroundColor: 'rgba(166,217,53,0.1)',
                  color: COLORS.insomniaGreen
                } : {}}
              >
                All Categories
              </button>
              {categories.map((category) => {
                const IconComponent = category.Icon;
                const isSelected = selectedCategory === category.name;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${!isSelected ? 'text-gray-400 border-gray-800 hover:border-gray-600' : 'shadow-[0_0_10px_rgba(166,217,53,0.3)]'
                      }`}
                    style={isSelected ? {
                      borderColor: COLORS.insomniaGreen,
                      backgroundColor: 'rgba(166,217,53,0.1)',
                      color: COLORS.insomniaGreen
                    } : {}}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs text-center max-w-[80px]">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.tylerGold }} />
              <Input
                placeholder="Search by item name or shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  backgroundColor: COLORS.voidBlack,
                  borderColor: COLORS.tylerGold,
                  color: 'white'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-500 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Request Tickets List */}
          {filteredItems.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed" style={{ backgroundColor: COLORS.voidBlack, borderColor: '#333' }}>
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.soapPink }} />
              <h3 className="text-xl mb-2" style={{ color: 'white' }}>No requests found</h3>
              <p className="text-gray-500">Try a different search or post a new request</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredItems.map(wanted => (
                <WantedCard key={wanted.id} wanted={wanted} />
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

interface WantedCardProps {
  wanted: any;
}

function WantedCard({ wanted }: WantedCardProps) {
  return (
    <Card
      className="p-6 border-2 transition-all duration-200"
      style={{
        backgroundColor: '#050505',
        borderColor: COLORS.insomniaGreen,
        boxShadow: '0 0 5px rgba(166, 217, 53, 0.1)'
      }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Avatar/Initial */}
        <div className="flex md:flex-col items-start gap-4">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${COLORS.soapPink}, ${COLORS.fincherOrange})`,
              color: COLORS.voidBlack
            }}
          >
            {wanted.shopName.charAt(0)}
          </div>
          {wanted.verified && (
            <Badge className="border-2 hidden md:flex font-bold" style={{ backgroundColor: 'transparent', borderColor: COLORS.insomniaGreen, color: COLORS.insomniaGreen }}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-bold" style={{ color: COLORS.soapPink }}>{wanted.shopName}</h4>
                {wanted.verified && (
                  <Badge className="md:hidden border-2" style={{ backgroundColor: 'transparent', borderColor: COLORS.insomniaGreen, color: COLORS.insomniaGreen }}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400">Posted by <span className="text-white">{wanted.buyerName}</span></p>
            </div>
            <Badge className="border-2 px-3 py-1 w-fit font-bold" style={{ backgroundColor: 'rgba(217, 172, 89, 0.1)', borderColor: COLORS.tylerGold, color: COLORS.tylerGold }}>
              Sourcing Request
            </Badge>
          </div>

          {/* Item Wanted - Bold Text */}
          <div className="mb-4 p-4 rounded-xl border-2" style={{ backgroundColor: '#0a0a0a', borderColor: '#222' }}>
            <p className="text-sm mb-1" style={{ color: COLORS.tylerGold }}>Looking for:</p>
            <h3 className="text-2xl font-bold text-white tracking-wide">{wanted.itemWanted}</h3>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl border border-gray-800" style={{ backgroundColor: '#080808' }}>
              <p className="text-xs text-gray-500 mb-1">Quantity Needed</p>
              <p className="text-lg font-semibold text-white">{wanted.quantity} units</p>
            </div>
            <div className="p-4 rounded-xl border-2" style={{ backgroundColor: 'rgba(222, 86, 38, 0.05)', borderColor: COLORS.fincherOrange }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Target Price</p>
              <p className="text-2xl font-bold" style={{ color: COLORS.fincherOrange }}>₹{wanted.willingToPay.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-800" style={{ backgroundColor: '#080808' }}>
              <p className="text-xs text-gray-500 mb-1">Distance</p>
              <div className="flex items-center gap-2 text-lg text-white font-medium">
                <MapPin className="w-5 h-5" style={{ color: COLORS.insomniaGreen }} />
                {wanted.distance} km away
              </div>
            </div>
          </div>

          {/* Exchange Option */}
          {wanted.willingToExchange && (
            <div className="mb-4 p-4 rounded-xl border-2" style={{ backgroundColor: 'rgba(234, 108, 162, 0.05)', borderColor: COLORS.soapPink }}>
              <p className="text-xs mb-1" style={{ color: COLORS.soapPink }}>Or Exchange For:</p>
              <p className="text-sm text-white font-medium">{wanted.willingToExchange}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {wanted.timePosted}
              </span>
              <Link to={`/map/${wanted.id}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <MapPin className="w-3 h-3" />
                  View Map
                </Button>
              </Link>
            </div>
            <Button
              className="text-black font-bold h-12 px-6 shadow-[0_0_10px_rgba(166,217,53,0.4)] hover:shadow-[0_0_20px_rgba(166,217,53,0.6)] transition-all"
              style={{ backgroundColor: COLORS.insomniaGreen }}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Fulfill Request
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PostRequestForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    targetPrice: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Request posted successfully! (This is a demo)');
    onClose();
  };

  const inputStyle = {
    backgroundColor: '#0a0a0a',
    borderColor: '#333',
    color: 'white'
  };

  const labelStyle = {
    color: COLORS.soapPink,
    fontWeight: 'bold' as const
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="itemName" style={labelStyle}>Item Name *</Label>
        <Input
          id="itemName"
          placeholder="e.g., Britannia Biscuits"
          value={formData.itemName}
          onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
          required
          className="mt-1"
          style={inputStyle}
        />
      </div>

      <div>
        <Label htmlFor="quantity" style={labelStyle}>Quantity Needed *</Label>
        <Input
          id="quantity"
          placeholder="e.g., 50 units"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
          className="mt-1"
          style={inputStyle}
        />
      </div>

      <div>
        <Label htmlFor="targetPrice" style={labelStyle}>Target Price (₹) *</Label>
        <Input
          id="targetPrice"
          type="number"
          placeholder="e.g., 400"
          value={formData.targetPrice}
          onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
          required
          className="mt-1"
          style={inputStyle}
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-400">Additional Details</Label>
        <Textarea
          id="description"
          placeholder="Any specific requirements..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1"
          rows={3}
          style={inputStyle}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 font-bold text-black"
          style={{ backgroundColor: COLORS.tylerGold }}
        >
          Post Request
        </Button>
      </div>
    </form>
  );
}