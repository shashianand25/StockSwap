import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, X, Grid3x3 } from 'lucide-react';
import { categories } from '../components/CategoryIcons';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';
import { BackButton } from '../components/BackButton';

export function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  React.useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery]);

  return (
    <>
      <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0FDF4] min-h-screen pb-20 md:pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton />
          </div>
          
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-[#10B981] to-[#059669] p-3 rounded-2xl shadow-lg">
                <Grid3x3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-[#0F172A]">Browse Categories</h1>
                <p className="text-muted-foreground">Explore products by category</p>
              </div>
            </div>
            <Badge className="bg-[#10B981] text-white px-4 py-2">
              {filteredCategories.length} Categories Available
            </Badge>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search categories..."
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
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredCategories.map((category, index) => {
              const IconComponent = category.Icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={`/category/${category.id}`}>
                    <Card className="p-4 md:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-[#10B981] bg-white group">
                      <div className="flex flex-col items-center text-center gap-3">
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="w-16 h-16 md:w-20 md:h-20" />
                        </motion.div>
                        <div>
                          <h3 className="text-sm md:text-base text-[#0F172A] group-hover:text-[#10B981] transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            View Products
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Grid3x3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-[#0F172A] mb-2">No categories found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </motion.div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}