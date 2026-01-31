
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ShopPage, SellerPage } from './pages';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ShopPage />} />
      <Route path="/seller" element={<SellerPage />} />
    </Routes>
  );
};

export default App;
