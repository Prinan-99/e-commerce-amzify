import React, { useState, useEffect } from 'react';
import { 
  Search, Star, ArrowDown, Plus, ShoppingBag, MessageSquare, 
  Briefcase, Home, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../config/constants';
import { Product } from '../types/types';
import { useCart } from '../hooks';
import CartDrawer from '../components/CartDrawer';
import AISearch from '../components/AISearch';
import ProductModal from '../components/ProductModal';
import PostPurchaseModal from '../components/PostPurchaseModal';
import FeedbackModal from '../components/FeedbackModal';

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Optimization Features State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPostPurchaseOpen, setIsPostPurchaseOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<{id: string, items: typeof cart, total: number} | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = `LX-${Math.floor(Math.random() * 90000) + 10000}`;
    setLastOrder({ id: orderId, items: [...cart], total });
    setIsCartOpen(false);
    clearCart();
    setIsPostPurchaseOpen(true);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Dynamic Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 ${isScrolled ? 'bg-white/80 backdrop-blur-md h-16 border-b' : 'bg-transparent h-24'}`}>
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isScrolled ? 'bg-slate-900 shadow-lg' : 'bg-white shadow-xl'}`}>
                <span className={`font-black text-lg ${isScrolled ? 'text-white' : 'text-slate-900'}`}>L</span>
              </div>
              <h1 className={`text-lg font-black tracking-tighter hidden sm:block ${!isScrolled && 'text-white'}`}>Lumina</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${isScrolled ? 'bg-slate-50 border-slate-100' : 'bg-white/10 border-white/20'}`}>
              <Search className={`w-4 h-4 ${isScrolled ? 'text-slate-400' : 'text-white/60'}`} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent outline-none text-xs font-bold w-32 ${isScrolled ? 'text-slate-900' : 'text-white'}`}
              />
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-3 rounded-2xl transition-all ${isScrolled ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-900 shadow-xl'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setIsFeedbackOpen(true)} className={`p-3 rounded-2xl border transition-all sm:flex hidden ${isScrolled ? 'border-slate-200 text-slate-400' : 'border-white/20 text-white'} hover:bg-white hover:text-slate-900`}>
              <MessageSquare className="w-5 h-5" />
            </button>

            <button onClick={() => navigate('/seller')} className={`p-3 rounded-2xl border transition-all sm:flex hidden ${isScrolled ? 'border-slate-200 text-slate-400' : 'border-white/20 text-white'} hover:bg-white hover:text-slate-900 transition-colors`}>
              <Briefcase className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="relative h-[85vh] flex items-end overflow-hidden bg-slate-950">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920" 
                className="w-full h-full object-cover opacity-60 scale-105"
                alt="Luxury Lifestyle"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 pb-20 relative z-10 w-full">
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-3 animate-in slide-in-from-left duration-700">
                  <span className="h-[1px] w-8 bg-indigo-500"></span>
                  <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Spring/Summer 2024</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter animate-in slide-in-from-left duration-700 delay-100">
                  Art of<br />Living <span className="text-indigo-500">Lux.</span>
                </h2>
                <button 
                  onClick={() => document.getElementById('shop-grid')?.scrollIntoView({behavior:'smooth'})}
                  className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 group active:scale-95 transition-all animate-in slide-in-from-left duration-700 delay-200"
                >
                  Shop Catalog <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Categories Bar */}
        <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-50 py-4 px-6 overflow-x-auto no-scrollbar flex items-center gap-2">
          {['all', 'electronics', 'fashion', 'home', 'accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-xl' 
                  : 'bg-slate-50 text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div id="shop-grid" className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer flex flex-col animate-in fade-in zoom-in-95 duration-500"
              >
                <div className="relative overflow-hidden bg-slate-100 rounded-[2.5rem] aspect-[3/4] mb-6">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 right-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-indigo-600 hover:text-white"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {product.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Featured</span>
                    </div>
                  )}
                </div>
                
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-slate-900">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-base font-black text-slate-950">
                    {formatINR(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-32 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black">No artifacts found</h3>
              <p className="text-slate-400 text-sm">Try broadening your search or choosing another category.</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-4 h-20 flex items-center justify-between shadow-2xl md:hidden">
        <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}); setSelectedCategory('all'); setSearchQuery(''); }} className="flex flex-col items-center gap-1 text-slate-900">
          <Home className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Shop</span>
        </button>
        <button onClick={() => setIsFeedbackOpen(true)} className="flex flex-col items-center gap-1 text-slate-400">
          <MessageSquare className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Feedback</span>
        </button>
        <div className="relative -top-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Heart className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Wish</span>
        </button>
        <button onClick={() => navigate('/seller')} className="flex flex-col items-center gap-1 text-slate-400">
          <Briefcase className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Studio</span>
        </button>
      </nav>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={handleAddToCart} 
      />

      <PostPurchaseModal
        isOpen={isPostPurchaseOpen}
        onClose={() => setIsPostPurchaseOpen(false)}
        orderId={lastOrder?.id || ''}
        items={lastOrder?.items || []}
        total={lastOrder?.total || 0}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={(data) => console.log('Feedback submitted:', data)}
      />

      <AISearch />
    </div>
  );
};

export default ShopPage;