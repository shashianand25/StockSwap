import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BottomNav } from '../components/BottomNav';
import { categories } from '../components/CategoryIcons';
import { categoryProducts, filterProducts, CategoryProduct } from '../data/categoryProducts';
import { formatReducedPrice } from '../lib/priceUtils';
import { 
  Filter, Search, MapPin, TrendingDown, RefreshCw, Package, 
  X, ChevronDown, Star, Eye, Clock, ShoppingBag, CheckCircle2,
  AlertTriangle, ArrowLeft, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackButton } from '../components/BackButton';

export function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const category = categories.find(c => c.id === parseInt(categoryId || '1'));
  const IconComponent = category?.Icon;

  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CategoryProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState<'all' | 'swap' | 'sell' | 'wanted'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedUrgency, setSelectedUrgency] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'popular'>('recent');

  useEffect(() => {
    if (categoryId) {
      const catProducts = categoryProducts.filter(
        p => p.categoryId === parseInt(categoryId)
      );
      setProducts(catProducts);
      setFilteredProducts(catProducts);
    }
  }, [categoryId]);

  useEffect(() => {
    applyFilters();
  }, [selectedType, priceRange, selectedConditions, selectedUrgency, verifiedOnly, locationFilter, searchQuery, sortBy, products]);

  const applyFilters = () => {
    let filtered = filterProducts(products, {
      type: selectedType,
      priceRange: selectedType === 'sell' ? priceRange : undefined,
      condition: selectedConditions,
      urgency: selectedUrgency,
      verified: verifiedOnly || undefined,
      location: locationFilter,
    });

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
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
    setSelectedType('all');
    setPriceRange([0, 10000]);
    setSelectedConditions([]);
    setSelectedUrgency([]);
    setVerifiedOnly(false);
    setLocationFilter('');
    setSearchQuery('');
    setSortBy('recent');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'sell': return 'bg-green-100 text-green-700 border-green-300';
      case 'wanted': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap': return <RefreshCw className="w-4 h-4" />;
      case 'sell': return <TrendingDown className="w-4 h-4" />;
      case 'wanted': return <Package className="w-4 h-4" />;
      default: return null;
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-[#0F172A] mb-4">Category not found</h2>
          <Button onClick={() => navigate('/categories')}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0FDF4] min-h-screen pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white px-4 py-6 shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/categories')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              {IconComponent && <IconComponent className="w-12 h-12 md:w-14 md:h-14" />}
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl mb-1">{category.name}</h1>
                <p className="text-sm text-gray-300">
                  {filteredProducts.length} items available
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
                placeholder={`Search in ${category.name}...`}
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
          {/* Type Tabs */}
          <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-white border-2">
              <TabsTrigger value="all" className="text-sm md:text-base">
                All ({products.length})
              </TabsTrigger>
              <TabsTrigger value="sell" className="text-sm md:text-base">
                <TrendingDown className="w-4 h-4 mr-1" />
                Sell ({products.filter(p => p.type === 'sell').length})
              </TabsTrigger>
              <TabsTrigger value="swap" className="text-sm md:text-base">
                <RefreshCw className="w-4 h-4 mr-1" />
                Swap ({products.filter(p => p.type === 'swap').length})
              </TabsTrigger>
              <TabsTrigger value="wanted" className="text-sm md:text-base">
                <Package className="w-4 h-4 mr-1" />
                Wanted ({products.filter(p => p.type === 'wanted').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
                    {/* Price Range - Only for Sell */}
                    {selectedType === 'sell' && (
                      <div>
                        <Label className="mb-2 block">Price Range (₹)</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="h-10"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                            className="h-10"
                          />
                        </div>
                      </div>
                    )}

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
                        {selectedType === 'sell' && (
                          <>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Summary */}
          {(selectedConditions.length > 0 || selectedUrgency.length > 0 || verifiedOnly || locationFilter) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedConditions.map(condition => (
                <Badge key={condition} className="bg-[#10B981] text-white">
                  {condition}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => toggleCondition(condition)}
                  />
                </Badge>
              ))}
              {selectedUrgency.map(urgency => (
                <Badge key={urgency} className="bg-orange-500 text-white">
                  {urgency} Urgency
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => toggleUrgency(urgency)}
                  />
                </Badge>
              ))}
              {verifiedOnly && (
                <Badge className="bg-blue-500 text-white">
                  Verified Only
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setVerifiedOnly(false)}
                  />
                </Badge>
              )}
              {locationFilter && (
                <Badge className="bg-purple-500 text-white">
                  {locationFilter}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setLocationFilter('')}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-xl transition-all duration-300 border-2 hover:border-[#10B981] cursor-pointer group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getTypeColor(product.type)} border flex items-center gap-1`}>
                        {getTypeIcon(product.type)}
                        {product.type.toUpperCase()}
                      </Badge>
                      {product.verified && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg text-[#0F172A] mb-2 group-hover:text-[#10B981] transition-colors line-clamp-2">
                      {product.title}
                    </h3>

                    {/* Price/Swap Info */}
                    {product.type === 'sell' && product.price && (
                      <div className="mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl text-[#10B981]">
                            {formatReducedPrice(product.price)}
                          </span>
                          {product.discount && (
                            <Badge className="bg-[#F43F5E] text-white">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {product.type === 'swap' && product.swapFor && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                          <strong>Swap for:</strong> {product.swapFor}
                        </p>
                      </div>
                    )}

                    {product.type === 'wanted' && product.wantedFor && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                          <strong>Needed for:</strong> {product.wantedFor}
                        </p>
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{product.quantity}</span>
                        <Badge variant="outline" className="ml-auto">
                          {product.condition}
                        </Badge>
                      </div>

                      {product.expiryDate && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span>Expires in {product.expiryDate}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{product.location}</span>
                        <span className="ml-auto">{product.distance}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShoppingBag className="w-4 h-4" />
                        <span>{product.shopName}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Urgency Badge */}
                    {product.urgency && (
                      <div className="mb-3">
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
                          {product.urgency} Urgency
                        </Badge>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {product.postedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {product.views}
                        </span>
                      </div>
                      <Button size="sm" className="bg-[#10B981] hover:bg-[#059669]">
                        Contact
                      </Button>
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
              <h3 className="text-xl text-[#0F172A] mb-2">No products found</h3>
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
    </>
  );
}