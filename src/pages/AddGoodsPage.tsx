import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  Package, ArrowRight, ArrowLeft, Check, Upload, Camera,
  Calendar, IndianRupee, Hash, Weight, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '../components/CategoryIcons';

interface ProductData {
  actionType: 'swap' | 'sell' | 'wanted' | '';
  productName: string;
  category: string;
  brand: string;
  quantity: string;
  unit: string;
  mrp: string;
  sellingPrice: string;
  expiryDate: string;
  daysUntilExpiry: string;
  condition: string;
  packaging: string;
  description: string;
  backImage: string | null;
}

// Use actual categories from CategoryIcons, plus "Other" as fallback
const CATEGORIES = [...categories.map(cat => cat.name), 'Other'];

const UNITS = ['Pieces', 'Packets', 'Kg', 'Grams', 'Liters', 'ML', 'Boxes', 'Cartons'];
const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair'];
const PACKAGING = ['Sealed', 'Opened but Intact', 'Slightly Damaged', 'Repackaged'];

// Auto-categorization keywords mapping
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Fruits & Vegetables': ['apple', 'banana', 'orange', 'tomato', 'potato', 'onion', 'carrot', 'vegetable', 'fruit', 'mango', 'grapes', 'cucumber', 'brinjal', 'ladies finger', 'cabbage', 'cauliflower', 'spinach', 'coriander', 'mint', 'lemon', 'lime', 'ginger', 'garlic'],
  'Dairy & Refrigerated': ['milk', 'curd', 'yogurt', 'butter', 'cheese', 'paneer', 'ghee', 'cream', 'dairy', 'lassi', 'buttermilk', 'dahi'],
  'Bakery & Bread': ['bread', 'biscuit', 'cake', 'cookie', 'bun', 'pav', 'roti', 'naan', 'bakery', 'pastry', 'muffin', 'croissant'],
  'Eggs, Meat & Frozen': ['egg', 'chicken', 'meat', 'fish', 'frozen', 'ice cream', 'sausage', 'prawn', 'mutton', 'beef'],
  'Staples': ['rice', 'wheat', 'dal', 'pulses', 'atta', 'flour', 'besan', 'chana', 'moong', 'masoor', 'toor', 'urad'],
  'Oils & Ghee': ['oil', 'ghee', 'mustard oil', 'sunflower oil', 'refined oil', 'coconut oil', 'groundnut oil', 'sesame oil'],
  'Masala, Salt & Sugar': ['masala', 'salt', 'sugar', 'spice', 'garam masala', 'turmeric', 'red chilli', 'cumin', 'coriander', 'pepper', 'cardamom', 'cinnamon', 'clove', 'bay leaf'],
  'Packaged Snacks': ['biscuit', 'chips', 'namkeen', 'snack', 'chocolate', 'candy', 'wafers', 'kurkure', 'lays', 'haldiram', 'bikaji'],
  'Beverages & Mixers': ['tea', 'coffee', 'juice', 'soft drink', 'cola', 'pepsi', 'coke', 'water', 'drink', 'beverage', 'nimbu', 'lemon', 'soda', 'energy drink'],
  'Cleaning & Consumables': ['soap', 'detergent', 'cleaner', 'washing', 'shampoo', 'toothpaste', 'brush', 'tissue', 'napkin', 'surf', 'vanish', 'harpic'],
  'Personal Care & Wellness': ['soap', 'shampoo', 'toothpaste', 'cream', 'lotion', 'oil', 'hair', 'face', 'body', 'care', 'wellness', 'sunscreen', 'deodorant'],
  'Baby & Family Essentials': ['baby', 'diaper', 'powder', 'food', 'formula', 'wipes', 'family', 'pampers', 'huggies'],
  'Packaging & Store Supplies': ['packaging', 'bag', 'box', 'container', 'supply', 'store', 'polybag'],
  'Clearance / Near-Expiry': ['clearance', 'expiry', 'near expiry', 'discount', 'sale']
};

// Auto-detect category from product name
function autoDetectCategory(productName: string): string {
  if (!productName) return 'Other';

  const lowerName = productName.toLowerCase().trim();
  let bestMatch = '';
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let matches = 0;
    for (const keyword of keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category;
    }
  }

  return bestMatch || 'Other';
}

export function AddGoodsPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;

  const [productData, setProductData] = useState<ProductData>({
    actionType: '',
    productName: '',
    category: '',
    brand: '',
    quantity: '',
    unit: 'Pieces',
    mrp: '',
    sellingPrice: '',
    expiryDate: '',
    daysUntilExpiry: '',
    condition: 'Brand New',
    packaging: 'Sealed',
    description: '',
    backImage: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!productData.actionType) newErrors.actionType = 'Please select an action';
        break;
      case 2:
        if (!productData.productName) newErrors.productName = 'Product name is required';
        break;
      case 3:
        if (!productData.category) newErrors.category = 'Category is required';
        break;
      case 4:
        if (!productData.brand) newErrors.brand = 'Brand name is required';
        break;
      case 5:
        if (!productData.quantity) newErrors.quantity = 'Quantity is required';
        if (!productData.unit) newErrors.unit = 'Unit is required';
        break;
      case 6:
        if (!productData.mrp) newErrors.mrp = 'MRP is required';
        break;
      case 7:
        if (!productData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
        break;
      case 8:
        if (!productData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        break;
      case 9:
        if (!productData.daysUntilExpiry) newErrors.daysUntilExpiry = 'Days until expiry is required';
        break;
      case 11:
        if (!productData.backImage) newErrors.backImage = 'Product back image is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData({ ...productData, backImage: reader.result as string });
        setErrors({ ...errors, backImage: '' });
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userEmail = currentUser.email || 'guest@example.com';

        // Auto-categorize if category is not set or empty
        let finalCategory = productData.category;
        if (!finalCategory || finalCategory.trim() === '') {
          finalCategory = autoDetectCategory(productData.productName);
        }

        // Prepare product data to save
        const productToSave = {
          user_id: '00000000-0000-0000-0000-000000000000',
          shop_name: currentUser.shopName || 'My Shop',
          owner_name: currentUser.name || 'Me',
          item_name: productData.productName,
          category: finalCategory,
          expiry_date: productData.expiryDate,
          days_until_expiry: parseInt(productData.daysUntilExpiry),
          asking_price: parseFloat(productData.sellingPrice),
          condition: productData.condition,
          listing_type: productData.actionType === 'swap' ? 'swap' : productData.actionType === 'sell' ? 'sell' : 'both',
          image_url: productData.backImage || null,
          backImage: productData.backImage || null,
          status: 'active',
          // Include all original productData fields for compatibility (Dashboard needs these)
          productName: productData.productName,
          quantity: productData.quantity, // Number like "2" - Dashboard needs this
          unit: productData.unit, // Unit like "Pieces" - Dashboard needs this
          sellingPrice: productData.sellingPrice, // Dashboard uses this for value calculation
          daysUntilExpiry: productData.daysUntilExpiry,
          mrp: productData.mrp,
          brand: productData.brand,
          packaging: productData.packaging,
          description: productData.description,
          // Metadata
          id: Date.now().toString(),
          userId: userEmail,
          createdAt: new Date().toISOString()
        };

        // Save to localStorage immediately (no waiting)
        const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
        existingProducts.push(productToSave);
        localStorage.setItem('userProducts', JSON.stringify(existingProducts));

        toast.success('Product added successfully! 🎉');

        // Try database in background (don't wait for it)
        (async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            const dbItem = {
              user_id: user?.id || '00000000-0000-0000-0000-000000000000',
              shop_name: currentUser.shopName || 'My Shop',
              owner_name: currentUser.name || 'Me',
              item_name: productData.productName,
              quantity: `${productData.quantity} ${productData.unit}`,
              category: finalCategory,
              expiry_date: productData.expiryDate,
              days_until_expiry: parseInt(productData.daysUntilExpiry),
              asking_price: parseFloat(productData.sellingPrice),
              condition: productData.condition,
              listing_type: productData.actionType === 'swap' ? 'swap' : productData.actionType === 'sell' ? 'sell' : 'both',
              image_url: null,
              status: 'active'
            };
            await supabase.from('market_items').insert(dbItem);
          } catch (err) {
            // Silently fail - already saved to localStorage
          }
        })();

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('Something went wrong.');
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl text-[#0F172A] mb-2">What would you like to do?</h2>
              <p className="text-muted-foreground">Choose the action for your product</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setProductData({ ...productData, actionType: 'swap' })}
                className={`p-6 rounded-xl border-2 transition-all ${productData.actionType === 'swap'
                  ? 'border-[#10B981] bg-[#10B981]/10 shadow-lg'
                  : 'border-gray-200 hover:border-[#10B981]/50'
                  }`}
              >
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="text-lg mb-2">Swap</h3>
                <p className="text-sm text-muted-foreground">Exchange with other products</p>
              </button>
              <button
                onClick={() => setProductData({ ...productData, actionType: 'sell' })}
                className={`p-6 rounded-xl border-2 transition-all ${productData.actionType === 'sell'
                  ? 'border-[#10B981] bg-[#10B981]/10 shadow-lg'
                  : 'border-gray-200 hover:border-[#10B981]/50'
                  }`}
              >
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-lg mb-2">Sell</h3>
                <p className="text-sm text-muted-foreground">Liquidate for cash</p>
              </button>
              <button
                onClick={() => setProductData({ ...productData, actionType: 'wanted' })}
                className={`p-6 rounded-xl border-2 transition-all ${productData.actionType === 'wanted'
                  ? 'border-[#10B981] bg-[#10B981]/10 shadow-lg'
                  : 'border-gray-200 hover:border-[#10B981]/50'
                  }`}
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg mb-2">Wanted</h3>
                <p className="text-sm text-muted-foreground">Looking to buy</p>
              </button>
            </div>
            {errors.actionType && <p className="text-sm text-red-500 text-center">{errors.actionType}</p>}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">What is the product name?</h2>
              <p className="text-muted-foreground">Enter the exact name of the product</p>
            </div>
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., Parle-G Biscuits, Tata Salt, Maggi Noodles"
                value={productData.productName}
                onChange={(e) => setProductData({ ...productData, productName: e.target.value })}
                className="mt-2"
              />
              {errors.productName && <p className="text-sm text-red-500 mt-1">{errors.productName}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">Which category does it belong to?</h2>
              <p className="text-muted-foreground">Select the most relevant category</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProductData({ ...productData, category: cat })}
                  className={`p-4 rounded-lg border-2 transition-all text-sm ${productData.category === cat
                    ? 'border-[#10B981] bg-[#10B981]/10 shadow-md'
                    : 'border-gray-200 hover:border-[#10B981]/50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-sm text-red-500 text-center mt-2">{errors.category}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">What is the brand?</h2>
              <p className="text-muted-foreground">Enter the manufacturer or brand name</p>
            </div>
            <div>
              <Label htmlFor="brand">Brand Name</Label>
              <Input
                id="brand"
                placeholder="e.g., Parle, Tata, Nestle, Amul"
                value={productData.brand}
                onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                className="mt-2"
              />
              {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">How much quantity do you have?</h2>
              <p className="text-muted-foreground">Specify the quantity and unit</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 50"
                  value={productData.quantity}
                  onChange={(e) => setProductData({ ...productData, quantity: e.target.value })}
                  className="mt-2"
                />
                {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <select
                  id="unit"
                  value={productData.unit}
                  onChange={(e) => setProductData({ ...productData, unit: e.target.value })}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">What is the MRP per unit?</h2>
              <p className="text-muted-foreground">Maximum Retail Price printed on package</p>
            </div>
            <div>
              <Label htmlFor="mrp">MRP (₹)</Label>
              <Input
                id="mrp"
                type="number"
                placeholder="e.g., 20"
                value={productData.mrp}
                onChange={(e) => setProductData({ ...productData, mrp: e.target.value })}
                className="mt-2"
              />
              {errors.mrp && <p className="text-sm text-red-500 mt-1">{errors.mrp}</p>}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">What is your selling price?</h2>
              <p className="text-muted-foreground">Price at which you want to sell/swap</p>
            </div>
            <div>
              <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
              <Input
                id="sellingPrice"
                type="number"
                placeholder="e.g., 15"
                value={productData.sellingPrice}
                onChange={(e) => setProductData({ ...productData, sellingPrice: e.target.value })}
                className="mt-2"
              />
              {errors.sellingPrice && <p className="text-sm text-red-500 mt-1">{errors.sellingPrice}</p>}
              {productData.mrp && productData.sellingPrice && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    Discount: {Math.round(((parseFloat(productData.mrp) - parseFloat(productData.sellingPrice)) / parseFloat(productData.mrp)) * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">When does it expire?</h2>
              <p className="text-muted-foreground">Select the expiry date</p>
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={productData.expiryDate}
                onChange={(e) => setProductData({ ...productData, expiryDate: e.target.value })}
                className="mt-2"
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">How many days until expiry?</h2>
              <p className="text-muted-foreground">This helps us prioritize urgent items</p>
            </div>
            <div>
              <Label htmlFor="daysUntilExpiry">Days Until Expiry</Label>
              <Input
                id="daysUntilExpiry"
                type="number"
                placeholder="e.g., 30"
                value={productData.daysUntilExpiry}
                onChange={(e) => setProductData({ ...productData, daysUntilExpiry: e.target.value })}
                className="mt-2"
              />
              {errors.daysUntilExpiry && <p className="text-sm text-red-500 mt-1">{errors.daysUntilExpiry}</p>}
              {productData.daysUntilExpiry && parseInt(productData.daysUntilExpiry) <= 7 && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Urgent! This item will expire soon. We'll prioritize it for quick swap.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">What is the product condition?</h2>
              <p className="text-muted-foreground">Be honest about the condition</p>
            </div>
            <div className="space-y-3">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setProductData({ ...productData, condition: cond })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${productData.condition === cond
                    ? 'border-[#10B981] bg-[#10B981]/10 shadow-md'
                    : 'border-gray-200 hover:border-[#10B981]/50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{cond}</span>
                    {productData.condition === cond && <Check className="w-5 h-5 text-[#10B981]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">Upload back side of product</h2>
              <p className="text-muted-foreground">We need to verify the expiry date from the package</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#10B981] transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="backImage"
              />
              <label htmlFor="backImage" className="cursor-pointer">
                {productData.backImage ? (
                  <div className="space-y-4">
                    <img
                      src={productData.backImage}
                      alt="Product back"
                      className="max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <Button type="button" variant="outline" className="mt-4">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg text-[#0F172A] mb-2">Click to upload</p>
                      <p className="text-sm text-muted-foreground">Take a clear photo of the back side showing expiry date</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
            {errors.backImage && <p className="text-sm text-red-500 text-center">{errors.backImage}</p>}
          </div>
        );

      case 13:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-[#0F172A] mb-2">Any additional details?</h2>
              <p className="text-muted-foreground">Optional information about the product</p>
            </div>
            <div>
              <Label htmlFor="packaging">Packaging Condition</Label>
              <select
                id="packaging"
                value={productData.packaging}
                onChange={(e) => setProductData({ ...productData, packaging: e.target.value })}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {PACKAGING.map((pack) => (
                  <option key={pack} value={pack}>{pack}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Any additional details about the product..."
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E0F2FE] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-10 h-10 text-[#10B981]" />
            <h1 className="text-[#0F172A]">Add Your Product</h1>
          </div>
          <p className="text-muted-foreground">Answer a few questions to list your product</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-[#10B981]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="p-8 shadow-2xl border-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-[#10B981] hover:bg-[#059669]"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-[#10B981] hover:bg-[#059669]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Submit Product
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
