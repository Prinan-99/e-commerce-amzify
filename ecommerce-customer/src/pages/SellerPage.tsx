import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import SellerDashboard from '../components/SellerDashboard';

const SellerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-40 bg-white border-b px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <h1 className="font-black text-sm uppercase tracking-widest">Seller Studio</h1>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <Store className="w-4 h-4" /> Back to Shop
        </button>
      </header>
      <SellerDashboard />
    </div>
  );
};

export default SellerPage;