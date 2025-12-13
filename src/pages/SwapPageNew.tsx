import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Filter, Search, Package, X, Zap, ArrowRightLeft, MapPin, Clock, RefreshCw, Eye, ShoppingBag, CheckCircle2, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { categoryProducts, filterProducts, CategoryProduct } from '../data/categoryProducts';
import { BottomNav } from '../components/BottomNav';
import ProposeSwapModal from '../components/ProposeSwapModal';
import { motion, AnimatePresence } from 'motion/react';

export function SwapPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<CategoryProduct[]>(
    categoryProducts.filter(p => p.type === 'swap')
  );
  const [filteredProducts, setFilteredProducts] = useState<CategoryProduct[]>(products);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CategoryProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedUrgency, setSelectedUrgency] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    applyFilters();
  }, [selectedConditions, selectedUrgency, verifiedOnly, locationFilter, searchQuery, sortBy, selectedCategory]);

  const applyFilters = () => {
    let filtered = categoryProducts.filter(p => p.type === 'swap');

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    filtered = filterProducts(filtered, {
      condition: selectedConditions,
      urgency: selectedUrgency,
      verified: verifiedOnly || undefined,
      location: locationFilter,
    });

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.swapFor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'recent':
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const toggleUrgency = (urgency: string) => {
    setSelectedUrgency(prev =>
      prev.includes(urgency)
        ? prev.filter(u => u !== urgency)
        : [...prev, urgency]
    );
  };

  const clearAllFilters = () => {
    setSelectedConditions([]);
    setSelectedUrgency([]);
    setVerifiedOnly(false);
    setLocationFilter('');
    setSearchQuery('');
    setSortBy('recent');
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0FDF4] min-h-screen pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-4 py-6 shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <RefreshCw className="w-12 h-12 md:w-14 md:h-14" />
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl mb-1">Swap Market</h1>
                <p className="text-sm text-gray-300">
                  {filteredProducts.length} swap opportunities available
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-white border border-white/30 hover:bg-white/10"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search swap items or what they're seeking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white text-black"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <Card className="p-6 border-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-[#0F172A] flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Advanced Filters
                    </h3>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Condition */}
                    <div>
                      <Label className="mb-2 block">Condition</Label>
                      <div className="flex flex-wrap gap-2">
                        {['New', 'Like New', 'Good', 'Fair'].map(condition => (
                          <Badge
                            key={condition}
                            variant={selectedConditions.includes(condition) ? 'default' : 'outline'}
                            className={`cursor-pointer ${
                              selectedConditions.includes(condition)
                                ? 'bg-[#10B981] text-white'
                                : ''
                            }`}
                            onClick={() => toggleCondition(condition)}
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Urgency */}
                    <div>
                      <Label className="mb-2 block">Urgency</Label>
                      <div className="flex flex-wrap gap-2">
                        {['High', 'Medium', 'Low'].map(urgency => (
                          <Badge
                            key={urgency}
                            variant={selectedUrgency.includes(urgency) ? 'default' : 'outline'}
                            className={`cursor-pointer ${
                              selectedUrgency.includes(urgency)
                                ? urgency === 'High'
                                  ? 'bg-red-500 text-white'
                                  : urgency === 'Medium'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : ''
                            }`}
                            onClick={() => toggleUrgency(urgency)}
                          >
                            {urgency}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <Label className="mb-2 block">Location</Label>
                      <Input
                        placeholder="Enter city or area"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="h-10"
                      />
                    </div>

                    {/* Verified Only */}
                    <div>
                      <Label className="mb-2 block">Seller Status</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="verified"
                          checked={verifiedOnly}
                          onChange={(e) => setVerifiedOnly(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="verified" className="text-sm cursor-pointer">
                          Verified sellers only
                        </label>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <Label className="mb-2 block">Sort By</Label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full h-10 border rounded-lg px-3"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products List - Horizontal Cards */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-4 md:p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-[#10B981] cursor-pointer group bg-white">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Left Section - Product Info */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl text-[#0F172A] group-hover:text-[#10B981] transition-colors mb-1">
                              {product.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              SWAP
                            </Badge>
                            {product.verified && (
                              <Badge className="bg-green-100 text-green-700 border-green-300">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Swap Details */}
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Willing to swap for:</p>
                            <p className="text-sm text-blue-900">{product.swapFor}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{product.quantity}</span>
                          </div>
                          <div>
                            <Badge variant="outline">{product.condition}</Badge>
                          </div>
                          {product.urgency && (
                            <Badge
                              className={
                                product.urgency === 'High'
                                  ? 'bg-red-100 text-red-700 border-red-300'
                                  : product.urgency === 'Medium'
                                  ? 'bg-orange-100 text-orange-700 border-orange-300'
                                  : 'bg-blue-100 text-blue-700 border-blue-300'
                              }
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {product.urgency}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            {product.views} views
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Right Section - Location & Actions */}
                      <div className="md:w-64 flex flex-col justify-between gap-3 md:border-l md:pl-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-[#10B981]" />
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="text-sm">{product.location}</p>
                              <p className="text-xs text-[#10B981]">{product.distance}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Shop</p>
                              <p className="text-sm">{product.shopName}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{product.postedDate}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => navigate(`/map/${product.id}`)}
                            variant="outline"
                            className="w-full border-2 hover:border-[#10B981]"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            View on Map
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProposeModal(true);
                            }}
                            className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
                          >
                            Propose Swap
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl text-[#0F172A] mb-2">No swap opportunities found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      <BottomNav />
      <ProposeSwapModal isOpen={showProposeModal} onClose={() => setShowProposeModal(false)} product={selectedProduct} />
    </>
  );
}