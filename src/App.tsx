import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { EnhancedLoginPage } from './components/EnhancedLoginPage';
import { CartPage } from './pages/CartPage';
import { LuxurySofaConfigurator } from './components/LuxurySofaConfigurator';
import { CartFooter } from './components/CartFooter';
import { CartProvider } from './components/CartManager';
import { ErrorBoundary, DataErrorFallback } from './components/ErrorBoundary';
import { CategoryCardSkeleton } from './components/LoadingSpinner';
import { useFurnitureCategories } from './hooks/useSupabase';
import { useAuth } from './components/AuthProvider';
import { ArrowLeft, User, Settings } from 'lucide-react';

// Main App Component
const App: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-forest-green font-display text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <EnhancedLoginPage onSuccess={() => window.location.reload()} />;
  }

  return (
    <CartProvider>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-ivory-white">
            
            {/* Header */}
            <header className="relative bg-ivory-white/95 backdrop-blur-md border-b border-gold-500/30 shadow-luxury-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-display text-forest-green tracking-wide font-bold">
                      Estre
                    </h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-forest-green">
                      {profile?.user_type === 'customer' ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Settings className="w-5 h-5" />
                      )}
                      <span className="font-body font-medium">Welcome, {profile?.full_name || user.email}</span>
                      <span className="text-forest-green/60 text-sm font-body">#{user.id.slice(-6)}</span>
                    </div>
                    <button
                      onClick={signOut}
                      className="text-forest-green/60 hover:text-gold-500 transition-colors duration-200 text-sm font-body font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="relative">
              <Routes>
                <Route path="/" element={<CategoryPage />} />
                <Route path="/configure/:categorySlug" element={<ConfiguratorPage />} />
                <Route path="/cart" element={<CartPage onBack={() => window.history.back()} onCheckout={() => console.log('Checkout')} customerData={{ name: profile?.full_name || user.email || 'User', email: user.email || '', id: user.id.slice(-6) }} />} />
              </Routes>
            </main>

            {/* Cart Footer */}
            <CartFooter onViewCart={() => window.location.href = '/cart'} />
          </div>
        </ErrorBoundary>
      </Router>
    </CartProvider>
  );
};

// Category Page Component
const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useFurnitureCategories();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('₹', '');
  };

  const CategoryCard = React.memo(({ category }: { category: any }) => (
    <div
      onClick={() => navigate(`/configure/${category.slug}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl animate-fade-in bg-ivory-white border border-gold-500/30 shadow-luxury"
    >
      <div className="bg-ivory-white border border-gold-500/30 rounded-2xl overflow-hidden h-full shadow-luxury">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-green/60 via-forest-green/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
          
          <div className="absolute top-4 right-4 bg-ivory-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gold-500/50">
            <span className="text-forest-green font-body font-semibold text-sm">From ₹{formatPrice(category.base_price)}</span>
          </div>

          {category.priority === 1 && (
            <div className="absolute top-4 left-4 bg-gold-500 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-ivory-white font-body font-semibold text-xs tracking-wide">POPULAR</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-forest-green font-display text-xl font-bold mb-2 group-hover:text-gold-500 transition-colors">
            {category.name}
          </h3>
          <p className="text-forest-green/60 font-body text-sm mb-4 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-forest-green/60 font-body text-xs font-medium">
              Available Models
            </span>
            <div className="w-8 h-8 bg-gold-500/20 rounded-full flex items-center justify-center group-hover:bg-gold-500 group-hover:text-ivory-white transition-all duration-300 ease-in-out">
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <DataErrorFallback 
          error={error} 
          title="Failed to load furniture categories"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-luxury-gradient min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-display text-forest-green mb-6 font-bold tracking-tight">
          Luxury Furniture Collection
        </h2>
        <p className="text-forest-green/70 font-body text-lg max-w-3xl mx-auto leading-relaxed">
          Discover our premium collections designed for every lifestyle and space. 
          From elegant sofas to comfortable beds, each piece is crafted with meticulous attention to detail.
        </p>
      </div>

      {/* Sofa Categories Section */}
      <div className="mb-16">
        <h3 className="text-3xl font-display text-forest-green mb-8 text-center font-bold">
          Premium Sofa Collection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          ) : (
            categories.filter(cat => cat.priority === 1).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </div>

      {/* Other Furniture Categories */}
      <div>
        <h3 className="text-3xl font-display text-forest-green mb-8 text-center font-bold">
          Complete Furniture Range
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CategoryCardSkeleton key={`other-${index}`} />
            ))
          ) : (
            categories.filter(cat => cat.priority === 2).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Configurator Page Component
const ConfiguratorPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { categories } = useFurnitureCategories();
  
  const category = categories.find(cat => 
    cat.slug === categorySlug?.toLowerCase().replace(/\s+/g, '-')
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-ivory-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display text-forest-green mb-4">Category not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-gold-500 hover:text-gold-600 font-body"
          >
            Return to categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-white">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-forest-green/60 hover:text-gold-500 transition-colors duration-200 font-body font-medium ml-8 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </button>
      </div>
      <LuxurySofaConfigurator categoryId={category.id} categoryName={category.name} />
    </div>
  );
};

export default App;