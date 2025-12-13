// Mock product data for all categories
export interface CategoryProduct {
  id: string;
  title: string;
  category: string;
  categoryId: number;
  type: 'swap' | 'sell' | 'wanted';
  price?: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  quantity: string;
  expiryDate?: string;
  location: string;
  shopName: string;
  description: string;
  discount?: number;
  urgency?: 'High' | 'Medium' | 'Low';
  image?: string;
  wantedFor?: string; // For wanted items
  swapFor?: string; // For swap items
  verified: boolean;
  distance: string;
  postedDate: string;
  views: number;
}

export const categoryProducts: CategoryProduct[] = [
  // Fruits & Vegetables (Category 1)
  {
    id: 'fv-1',
    title: 'Fresh Apples - Premium Quality',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    type: 'sell',
    price: 120,
    condition: 'New',
    quantity: '50kg',
    location: 'Andheri West, Mumbai',
    shopName: 'Fresh Fruits Corner',
    description: 'Premium Kashmiri apples, fresh stock. Slightly overstocked.',
    discount: 25,
    urgency: 'High',
    verified: true,
    distance: '2.3 km',
    postedDate: '2 hours ago',
    views: 145
  },
  {
    id: 'fv-2',
    title: 'Organic Tomatoes Bulk',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    type: 'swap',
    quantity: '100kg',
    condition: 'Like New',
    location: 'Koramangala, Bangalore',
    shopName: 'Green Valley Store',
    description: 'Fresh organic tomatoes, looking to swap for potatoes or onions.',
    swapFor: 'Potatoes, Onions, or Green Vegetables',
    verified: true,
    distance: '1.8 km',
    postedDate: '5 hours ago',
    views: 89
  },
  {
    id: 'fv-3',
    title: 'Looking for Fresh Bananas',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    type: 'wanted',
    quantity: '200kg',
    location: 'Connaught Place, Delhi',
    shopName: 'Metro Kirana',
    description: 'Need fresh bananas for retail. Urgent requirement.',
    wantedFor: 'Regular retail supply',
    urgency: 'High',
    verified: false,
    distance: '3.5 km',
    postedDate: '1 day ago',
    views: 234
  },
  {
    id: 'fv-4',
    title: 'Seasonal Mangoes - Alphonso',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    type: 'sell',
    price: 280,
    condition: 'New',
    quantity: '30kg',
    expiryDate: '7 days',
    location: 'Juhu, Mumbai',
    shopName: 'Fruit Paradise',
    description: 'Premium Alphonso mangoes from Ratnagiri. Need quick sale.',
    discount: 30,
    urgency: 'High',
    verified: true,
    distance: '4.2 km',
    postedDate: '3 hours ago',
    views: 312
  },
  {
    id: 'fv-5',
    title: 'Mixed Vegetables Bundle',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    type: 'swap',
    quantity: '80kg',
    condition: 'Good',
    location: 'Whitefield, Bangalore',
    shopName: 'Daily Fresh Mart',
    description: 'Carrots, beans, cabbage mix. Looking to swap for fruits.',
    swapFor: 'Any seasonal fruits',
    verified: true,
    distance: '5.1 km',
    postedDate: '8 hours ago',
    views: 156
  },

  // Dairy & Refrigerated (Category 2)
  {
    id: 'dr-1',
    title: 'Amul Butter - 500g Packs',
    category: 'Dairy & Refrigerated',
    categoryId: 2,
    type: 'sell',
    price: 210,
    condition: 'New',
    quantity: '100 packs',
    expiryDate: '45 days',
    location: 'Saket, Delhi',
    shopName: 'Daily Dairy Hub',
    description: 'Overstocked Amul butter. Selling at discounted price.',
    discount: 15,
    urgency: 'Medium',
    verified: true,
    distance: '1.5 km',
    postedDate: '6 hours ago',
    views: 267
  },
  {
    id: 'dr-2',
    title: 'Looking for Paneer - Fresh',
    category: 'Dairy & Refrigerated',
    categoryId: 2,
    type: 'wanted',
    quantity: '50kg',
    location: 'Indiranagar, Bangalore',
    shopName: 'Fresh Foods Market',
    description: 'Need fresh paneer daily supply. Long-term requirement.',
    wantedFor: 'Daily retail supply',
    urgency: 'High',
    verified: true,
    distance: '2.8 km',
    postedDate: '4 hours ago',
    views: 198
  },
  {
    id: 'dr-3',
    title: 'Mother Dairy Milk - 1L',
    category: 'Dairy & Refrigerated',
    categoryId: 2,
    type: 'swap',
    quantity: '200 packets',
    condition: 'New',
    expiryDate: '3 days',
    location: 'Powai, Mumbai',
    shopName: 'Quick Mart',
    description: 'Excess stock of milk. Looking to swap for curd or yogurt.',
    swapFor: 'Curd, Yogurt, or Cheese',
    verified: true,
    distance: '3.2 km',
    postedDate: '2 hours ago',
    views: 421
  },
  {
    id: 'dr-4',
    title: 'Amul Cheese Slices - 400g',
    category: 'Dairy & Refrigerated',
    categoryId: 2,
    type: 'sell',
    price: 165,
    condition: 'New',
    quantity: '75 packs',
    expiryDate: '60 days',
    location: 'Malleswaram, Bangalore',
    shopName: 'Cheese Corner',
    description: 'Bulk cheese slices available. Good margins.',
    discount: 20,
    urgency: 'Low',
    verified: true,
    distance: '6.7 km',
    postedDate: '1 day ago',
    views: 134
  },

  // Bakery & Bread (Category 3)
  {
    id: 'bk-1',
    title: 'Britannia Bread - White & Brown',
    category: 'Bakery & Bread',
    categoryId: 3,
    type: 'sell',
    price: 32,
    condition: 'New',
    quantity: '150 loaves',
    expiryDate: '5 days',
    location: 'Chembur, Mumbai',
    shopName: 'Bakery World',
    description: 'Fresh bread stock. Need to clear inventory.',
    discount: 18,
    urgency: 'High',
    verified: true,
    distance: '2.1 km',
    postedDate: '5 hours ago',
    views: 289
  },
  {
    id: 'bk-2',
    title: 'Parle Rusk - All Variants',
    category: 'Bakery & Bread',
    categoryId: 3,
    type: 'swap',
    quantity: '200 packs',
    condition: 'New',
    location: 'HSR Layout, Bangalore',
    shopName: 'Morning Bites',
    description: 'Excess rusk stock. Looking to swap for biscuits.',
    swapFor: 'Biscuits, Cookies, or Cakes',
    verified: true,
    distance: '4.5 km',
    postedDate: '1 day ago',
    views: 167
  },
  {
    id: 'bk-3',
    title: 'Need Fresh Pav Bread Daily',
    category: 'Bakery & Bread',
    categoryId: 3,
    type: 'wanted',
    quantity: '100 packets',
    location: 'Dadar, Mumbai',
    shopName: 'Street Food Junction',
    description: 'Looking for daily pav bread supply for vada pav business.',
    wantedFor: 'Daily business requirement',
    urgency: 'High',
    verified: false,
    distance: '1.9 km',
    postedDate: '3 hours ago',
    views: 345
  },

  // Eggs, Meat & Frozen (Category 4)
  {
    id: 'em-1',
    title: 'Farm Fresh Eggs - Brown',
    category: 'Eggs, Meat & Frozen',
    categoryId: 4,
    type: 'sell',
    price: 6,
    condition: 'New',
    quantity: '500 pieces',
    location: 'Whitefield, Bangalore',
    shopName: 'Protein Hub',
    description: 'Fresh brown eggs from local farms. Daily stock available.',
    discount: 10,
    urgency: 'Medium',
    verified: true,
    distance: '3.8 km',
    postedDate: '4 hours ago',
    views: 456
  },
  {
    id: 'em-2',
    title: 'Looking for Frozen Chicken',
    category: 'Eggs, Meat & Frozen',
    categoryId: 4,
    type: 'wanted',
    quantity: '200kg',
    location: 'Bandra, Mumbai',
    shopName: 'Non-Veg Corner',
    description: 'Need frozen chicken for restaurant supply.',
    wantedFor: 'Restaurant supply',
    urgency: 'High',
    verified: true,
    distance: '5.2 km',
    postedDate: '2 hours ago',
    views: 234
  },

  // Staples (Category 5)
  {
    id: 'st-1',
    title: 'Tata Premium Rice - 25kg',
    category: 'Staples',
    categoryId: 5,
    type: 'sell',
    price: 1450,
    condition: 'New',
    quantity: '200 bags',
    location: 'Nehru Place, Delhi',
    shopName: 'Grain Godown',
    description: 'Premium basmati rice. Bulk quantity available.',
    discount: 12,
    urgency: 'Low',
    verified: true,
    distance: '7.3 km',
    postedDate: '2 days ago',
    views: 567
  },
  {
    id: 'st-2',
    title: 'Aashirvaad Atta - 10kg',
    category: 'Staples',
    categoryId: 5,
    type: 'swap',
    quantity: '150 bags',
    condition: 'New',
    location: 'Jayanagar, Bangalore',
    shopName: 'Flour Mill Store',
    description: 'Excess wheat flour stock. Looking to swap for rice or pulses.',
    swapFor: 'Rice, Dal, or other staples',
    verified: true,
    distance: '4.1 km',
    postedDate: '1 day ago',
    views: 298
  },
  {
    id: 'st-3',
    title: 'Toor Dal - Premium Quality',
    category: 'Staples',
    categoryId: 5,
    type: 'sell',
    price: 145,
    condition: 'New',
    quantity: '500kg',
    location: 'Thane, Mumbai',
    shopName: 'Dal Bazar',
    description: 'Premium toor dal at wholesale rates.',
    discount: 8,
    urgency: 'Low',
    verified: true,
    distance: '8.9 km',
    postedDate: '3 days ago',
    views: 423
  },

  // Oils & Ghee (Category 6)
  {
    id: 'og-1',
    title: 'Fortune Sunflower Oil - 5L',
    category: 'Oils & Ghee',
    categoryId: 6,
    type: 'sell',
    price: 685,
    condition: 'New',
    quantity: '100 cans',
    location: 'Marathahalli, Bangalore',
    shopName: 'Oil Depot',
    description: 'Refined sunflower oil. Bulk discount available.',
    discount: 15,
    urgency: 'Medium',
    verified: true,
    distance: '5.6 km',
    postedDate: '1 day ago',
    views: 378
  },
  {
    id: 'og-2',
    title: 'Looking for Pure Ghee',
    category: 'Oils & Ghee',
    categoryId: 6,
    type: 'wanted',
    quantity: '50kg',
    location: 'Karol Bagh, Delhi',
    shopName: 'Pure Foods',
    description: 'Need pure cow ghee for festive season.',
    wantedFor: 'Festive season stock',
    urgency: 'High',
    verified: true,
    distance: '3.4 km',
    postedDate: '6 hours ago',
    views: 267
  },

  // Masala, Salt & Sugar (Category 7)
  {
    id: 'ms-1',
    title: 'MDH Masala - Mixed Pack',
    category: 'Masala, Salt & Sugar',
    categoryId: 7,
    type: 'sell',
    price: 85,
    condition: 'New',
    quantity: '300 packs',
    expiryDate: '180 days',
    location: 'Goregaon, Mumbai',
    shopName: 'Spice Hub',
    description: 'Assorted MDH masala boxes. Great for retail.',
    discount: 22,
    urgency: 'Medium',
    verified: true,
    distance: '4.7 km',
    postedDate: '8 hours ago',
    views: 512
  },
  {
    id: 'ms-2',
    title: 'Tata Salt - 1kg Packs',
    category: 'Masala, Salt & Sugar',
    categoryId: 7,
    type: 'swap',
    quantity: '500 packs',
    condition: 'New',
    location: 'Electronic City, Bangalore',
    shopName: 'Daily Needs Store',
    description: 'Excess salt stock. Looking to swap for sugar or masala.',
    swapFor: 'Sugar, Masala, or Tea/Coffee',
    verified: true,
    distance: '9.2 km',
    postedDate: '2 days ago',
    views: 189
  },

  // Packaged Snacks (Category 8)
  {
    id: 'sn-1',
    title: 'Lays Chips - All Flavors',
    category: 'Packaged Snacks',
    categoryId: 8,
    type: 'sell',
    price: 10,
    condition: 'New',
    quantity: '1000 packs',
    expiryDate: '90 days',
    location: 'Linking Road, Mumbai',
    shopName: 'Snack Attack',
    description: 'Popular flavors available. Bulk pricing.',
    discount: 18,
    urgency: 'Low',
    verified: true,
    distance: '2.8 km',
    postedDate: '1 day ago',
    views: 678
  },
  {
    id: 'sn-2',
    title: 'Kurkure - Family Pack',
    category: 'Packaged Snacks',
    categoryId: 8,
    type: 'swap',
    quantity: '400 packs',
    condition: 'New',
    location: 'Koramangala, Bangalore',
    shopName: 'Munch Time',
    description: 'Looking to swap for biscuits or namkeen.',
    swapFor: 'Biscuits, Namkeen, or Chocolates',
    verified: true,
    distance: '3.5 km',
    postedDate: '12 hours ago',
    views: 234
  },
  {
    id: 'sn-3',
    title: 'Need Haldirams Namkeen',
    category: 'Packaged Snacks',
    categoryId: 8,
    type: 'wanted',
    quantity: '200kg',
    location: 'Vasant Kunj, Delhi',
    shopName: 'Party Snacks',
    description: 'Urgent requirement for event. All variants welcome.',
    wantedFor: 'Event catering',
    urgency: 'High',
    verified: false,
    distance: '6.1 km',
    postedDate: '5 hours ago',
    views: 445
  },

  // Beverages & Mixers (Category 9)
  {
    id: 'bv-1',
    title: 'Coca Cola - 2L Bottles',
    category: 'Beverages & Mixers',
    categoryId: 9,
    type: 'sell',
    price: 85,
    condition: 'New',
    quantity: '200 bottles',
    expiryDate: '120 days',
    location: 'Malad, Mumbai',
    shopName: 'Cool Drinks Corner',
    description: 'Chilled stock available. Summer clearance.',
    discount: 20,
    urgency: 'High',
    verified: true,
    distance: '5.4 km',
    postedDate: '4 hours ago',
    views: 589
  },
  {
    id: 'bv-2',
    title: 'Tropicana Juice - Mixed',
    category: 'Beverages & Mixers',
    categoryId: 9,
    type: 'swap',
    quantity: '150 packs',
    condition: 'New',
    expiryDate: '30 days',
    location: 'Indiranagar, Bangalore',
    shopName: 'Fresh Juice Bar',
    description: 'Looking to swap for soft drinks or energy drinks.',
    swapFor: 'Soft drinks, Energy drinks',
    verified: true,
    distance: '4.2 km',
    postedDate: '1 day ago',
    views: 312
  },

  // Cleaning & Consumables (Category 10)
  {
    id: 'cl-1',
    title: 'Surf Excel - 1kg Packs',
    category: 'Cleaning & Consumables',
    categoryId: 10,
    type: 'sell',
    price: 165,
    condition: 'New',
    quantity: '300 packs',
    location: 'Rajouri Garden, Delhi',
    shopName: 'Clean Home',
    description: 'Premium detergent powder. Bulk stock available.',
    discount: 16,
    urgency: 'Medium',
    verified: true,
    distance: '7.8 km',
    postedDate: '2 days ago',
    views: 234
  },
  {
    id: 'cl-2',
    title: 'Harpic Toilet Cleaner',
    category: 'Cleaning & Consumables',
    categoryId: 10,
    type: 'swap',
    quantity: '200 bottles',
    condition: 'New',
    location: 'Bellandur, Bangalore',
    shopName: 'Hygiene Store',
    description: 'Looking to swap for other cleaning products.',
    swapFor: 'Floor cleaner, Dish wash, or Detergent',
    verified: true,
    distance: '6.3 km',
    postedDate: '1 day ago',
    views: 178
  },

  // Personal Care & Wellness (Category 11)
  {
    id: 'pc-1',
    title: 'Dove Shampoo - 400ml',
    category: 'Personal Care & Wellness',
    categoryId: 11,
    type: 'sell',
    price: 285,
    condition: 'New',
    quantity: '150 bottles',
    location: 'Andheri East, Mumbai',
    shopName: 'Beauty Bazaar',
    description: 'Premium hair care products. Great margins.',
    discount: 25,
    urgency: 'Low',
    verified: true,
    distance: '3.9 km',
    postedDate: '3 days ago',
    views: 467
  },
  {
    id: 'pc-2',
    title: 'Looking for Dettol Soap',
    category: 'Personal Care & Wellness',
    categoryId: 11,
    type: 'wanted',
    quantity: '500 bars',
    location: 'Whitefield, Bangalore',
    shopName: 'Health First',
    description: 'Need Dettol soap bars for retail.',
    wantedFor: 'Retail stock',
    urgency: 'Medium',
    verified: true,
    distance: '8.1 km',
    postedDate: '1 day ago',
    views: 289
  },

  // Baby & Family Essentials (Category 12)
  {
    id: 'bf-1',
    title: 'Pampers Diapers - M Size',
    category: 'Baby & Family Essentials',
    categoryId: 12,
    type: 'sell',
    price: 899,
    condition: 'New',
    quantity: '80 packs',
    location: 'Vasant Vihar, Delhi',
    shopName: 'Baby Care Center',
    description: 'Premium baby diapers. Fast-moving stock.',
    discount: 18,
    urgency: 'Low',
    verified: true,
    distance: '5.7 km',
    postedDate: '2 days ago',
    views: 534
  },
  {
    id: 'bf-2',
    title: 'Johnson Baby Products',
    category: 'Baby & Family Essentials',
    categoryId: 12,
    type: 'swap',
    quantity: '100 units',
    condition: 'New',
    location: 'JP Nagar, Bangalore',
    shopName: 'Little Angels',
    description: 'Mixed baby care products. Looking to swap.',
    swapFor: 'Baby food, Wipes, or Diapers',
    verified: true,
    distance: '4.8 km',
    postedDate: '1 day ago',
    views: 223
  },

  // Packaging & Store Supplies (Category 13)
  {
    id: 'pk-1',
    title: 'Plastic Carry Bags - Biodegradable',
    category: 'Packaging & Store Supplies',
    categoryId: 13,
    type: 'sell',
    price: 450,
    condition: 'New',
    quantity: '10,000 pieces',
    location: 'Saki Naka, Mumbai',
    shopName: 'Pack & Store',
    description: 'Eco-friendly carry bags. Bulk available.',
    discount: 12,
    urgency: 'Low',
    verified: true,
    distance: '9.5 km',
    postedDate: '4 days ago',
    views: 345
  },
  {
    id: 'pk-2',
    title: 'Need Packaging Boxes',
    category: 'Packaging & Store Supplies',
    categoryId: 13,
    type: 'wanted',
    quantity: '500 boxes',
    location: 'MG Road, Bangalore',
    shopName: 'Quick Delivery',
    description: 'Need corrugated boxes for packaging.',
    wantedFor: 'Delivery packaging',
    urgency: 'High',
    verified: false,
    distance: '2.3 km',
    postedDate: '8 hours ago',
    views: 189
  },

  // Clearance / Near-Expiry (Category 14)
  {
    id: 'ce-1',
    title: 'Mixed Biscuits - Near Expiry',
    category: 'Clearance / Near-Expiry',
    categoryId: 14,
    type: 'sell',
    price: 8,
    condition: 'Good',
    quantity: '1000 packs',
    expiryDate: '15 days',
    location: 'Ghatkopar, Mumbai',
    shopName: 'Discount Mart',
    description: 'Assorted biscuits expiring soon. Deep discount.',
    discount: 60,
    urgency: 'High',
    verified: true,
    distance: '7.2 km',
    postedDate: '1 hour ago',
    views: 892
  },
  {
    id: 'ce-2',
    title: 'Maggi Noodles - Short Expiry',
    category: 'Clearance / Near-Expiry',
    categoryId: 14,
    type: 'sell',
    price: 10,
    condition: 'Good',
    quantity: '600 packs',
    expiryDate: '20 days',
    location: 'Koramangala, Bangalore',
    shopName: 'Quick Sale Store',
    description: 'Popular instant noodles. Must sell fast.',
    discount: 50,
    urgency: 'High',
    verified: true,
    distance: '3.1 km',
    postedDate: '3 hours ago',
    views: 1023
  },
];

// Helper function to get products by category
export function getProductsByCategory(categoryId: number): CategoryProduct[] {
  return categoryProducts.filter(product => product.categoryId === categoryId);
}

// Helper function to get products by type
export function getProductsByType(type: 'swap' | 'sell' | 'wanted'): CategoryProduct[] {
  return categoryProducts.filter(product => product.type === type);
}

// Helper function to filter products
export function filterProducts(
  products: CategoryProduct[],
  filters: {
    type?: 'swap' | 'sell' | 'wanted' | 'all';
    priceRange?: [number, number];
    condition?: string[];
    urgency?: string[];
    location?: string;
    verified?: boolean;
  }
): CategoryProduct[] {
  let filtered = [...products];

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(p => p.type === filters.type);
  }

  if (filters.priceRange && filters.priceRange[0] > 0) {
    filtered = filtered.filter(p => 
      p.price && p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
    );
  }

  if (filters.condition && filters.condition.length > 0) {
    filtered = filtered.filter(p => filters.condition!.includes(p.condition));
  }

  if (filters.urgency && filters.urgency.length > 0) {
    filtered = filtered.filter(p => p.urgency && filters.urgency!.includes(p.urgency));
  }

  if (filters.location) {
    filtered = filtered.filter(p => 
      p.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  if (filters.verified !== undefined) {
    filtered = filtered.filter(p => p.verified === filters.verified);
  }

  return filtered;
}
