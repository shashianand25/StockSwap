import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  User, Mail, Phone, MapPin, FileText, Store, TrendingUp, 
  Package, IndianRupee, Clock, CheckCircle2, AlertCircle, Edit
} from 'lucide-react';
import { getCurrentUser } from '../lib/auth';
import { LocationMap } from '../components/LocationMap';
import { EditProfileModal } from '../components/EditProfileModal';

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get user's real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Unable to get your location. Please enable location services.');
          console.error(error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, [user, navigate]);

  const handleSaveProfile = (updatedUser: any) => {
    setUser(updatedUser);
  };

  if (!user) return null;

  // Calculate real analytics from user's products
  const [analytics, setAnalytics] = useState({
    totalInventory: 0,
    valueRecovered: 0,
    valueAtRisk: 0,
    activeListings: 0,
    completedSwaps: 0,
    savedFromExpiry: 0,
  });

  useEffect(() => {
    const calculateAnalytics = () => {
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      const currentUserEmail = user?.email || '';
      
      // Filter user's products
      const myProducts = userProducts.filter((p: any) => {
        if (currentUserEmail) {
          return p.userId === currentUserEmail;
        }
        return !p.userId || p.userId === 'guest@example.com';
      });
      
      // Calculate analytics
      const totalInventory = myProducts.length;
      const totalValue = myProducts.reduce((sum: number, p: any) => {
        const price = parseFloat(p.asking_price || p.sellingPrice || '0');
        const qty = parseFloat(p.quantity?.toString().split(' ')[0] || '1');
        return sum + (price * qty);
      }, 0);
      
      const atRiskProducts = myProducts.filter((p: any) => {
        const days = p.days_until_expiry || parseInt(p.daysUntilExpiry) || 999;
        return days <= 10;
      });
      
      const valueAtRisk = atRiskProducts.reduce((sum: number, p: any) => {
        const price = parseFloat(p.asking_price || p.sellingPrice || '0');
        const qty = parseFloat(p.quantity?.toString().split(' ')[0] || '1');
        return sum + (price * qty);
      }, 0);
      
      setAnalytics({
        totalInventory,
        valueRecovered: totalValue * 0.3, // Estimate 30% recovery
        valueAtRisk,
        activeListings: myProducts.filter((p: any) => p.status === 'active' || !p.status).length,
        completedSwaps: 0, // Would need separate tracking
        savedFromExpiry: atRiskProducts.length,
      });
    };
    
    if (user) {
      calculateAnalytics();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E0F2FE] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#0F172A] mb-2">Profile & Analytics</h1>
          <p className="text-muted-foreground">
            Manage your account and view your performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 p-8 shadow-xl border-2 bg-white/80 backdrop-blur-sm animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-2xl text-[#0F172A] mb-1">{user.name}</h2>
              <p className="text-muted-foreground mb-3">{user.shopName}</p>
              {user.verified ? (
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  GST Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Not Verified
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-100">
                <Mail className="w-5 h-5 text-[#10B981] mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-[#0F172A]">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-100">
                <Phone className="w-5 h-5 text-[#10B981] mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-[#0F172A]">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-100">
                <Store className="w-5 h-5 text-[#10B981] mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Shop Name</p>
                  <p className="text-sm text-[#0F172A]">{user.shopName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-100">
                <MapPin className="w-5 h-5 text-[#10B981] mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm text-[#0F172A]">{user.location}</p>
                </div>
              </div>

              {user.gstNumber && (
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border-2 border-blue-100">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">GST Number</p>
                    <p className="text-sm text-[#0F172A] font-mono">{user.gstNumber}</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full mt-6 border-2 hover:border-[#10B981] hover:bg-[#10B981]/5 transition-all"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Card>

          {/* Analytics & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Card className="p-6 shadow-lg border-2 border-[#10B981]/20 bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all hover:scale-105 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-10 h-10 text-[#10B981]" />
                  <Badge className="bg-[#10B981]/20 text-[#10B981]">Active</Badge>
                </div>
                <h3 className="text-3xl text-[#0F172A] mb-1">{analytics.totalInventory}</h3>
                <p className="text-sm text-muted-foreground">Total Inventory Items</p>
              </Card>

              <Card className="p-6 shadow-lg border-2 border-[#10B981]/20 bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all hover:scale-105 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <IndianRupee className="w-10 h-10 text-[#10B981]" />
                  <TrendingUp className="w-6 h-6 text-[#10B981]" />
                </div>
                <h3 className="text-3xl text-[#10B981] mb-1">₹{analytics.valueRecovered.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">Value Recovered</p>
              </Card>

              <Card className="p-6 shadow-lg border-2 border-[#EF4444]/20 bg-gradient-to-br from-white to-red-50 hover:shadow-xl transition-all hover:scale-105 duration-300 animate-pulse-slow">
                <div className="flex items-center justify-between mb-3">
                  <AlertCircle className="w-10 h-10 text-[#EF4444]" />
                  <Badge className="bg-[#EF4444] text-white">Urgent</Badge>
                </div>
                <h3 className="text-3xl text-[#EF4444] mb-1">₹{analytics.valueAtRisk.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">Value at Risk</p>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Card className="p-5 shadow-md border-2 hover:shadow-lg transition-all bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl text-[#0F172A]">{analytics.activeListings}</h4>
                    <p className="text-xs text-muted-foreground">Active Listings</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 shadow-md border-2 hover:shadow-lg transition-all bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl text-[#0F172A]">{analytics.completedSwaps}</h4>
                    <p className="text-xs text-muted-foreground">Completed Swaps</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 shadow-md border-2 hover:shadow-lg transition-all bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl text-[#0F172A]">{analytics.savedFromExpiry}</h4>
                    <p className="text-xs text-muted-foreground">Saved from Expiry</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Location Map */}
            <Card className="p-6 shadow-xl border-2 bg-white animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl text-[#0F172A] mb-1">Your Location & Nearby Stores</h3>
                  <p className="text-sm text-muted-foreground">
                    Find retailers within 5km radius
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-[#10B981]" />
              </div>

              {locationError ? (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <p className="text-sm text-yellow-800">{locationError}</p>
                  <p className="text-xs text-yellow-600 mt-2">
                    Please enable location permissions in your browser settings
                  </p>
                </div>
              ) : location ? (
                <LocationMap userLocation={location} />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Getting your location...</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        user={user}
      />
    </div>
  );
}