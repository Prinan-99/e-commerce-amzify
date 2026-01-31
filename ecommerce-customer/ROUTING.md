# Ecommerce Customer App - Routing Structure

## Overview
The ecommerce-customer app now uses React Router for proper navigation between the shop and seller dashboard.

## Routes

### `/` - Shop Page (Default)
- **Component**: `ShopPage`
- **Features**: 
  - Product catalog with categories
  - Search functionality
  - Shopping cart
  - Product modals
  - AI search assistant
  - Feedback system

### `/seller` - Seller Dashboard
- **Component**: `SellerPage` → `SellerDashboard`
- **Features**:
  - Sales analytics
  - Marketing campaigns
  - Automation tools
  - Customer management
  - Order tracking

## Navigation

### From Shop to Seller
- Desktop: Click the briefcase icon in the header
- Mobile: Click "Studio" in the bottom navigation

### From Seller to Shop
- Click "Back to Shop" button in the seller header
- Click the Lumina logo

## State Management

### Cart Context
- **Provider**: `CartProvider` wraps the entire app
- **Hook**: `useCart()` provides cart functionality
- **Features**: Add, remove, update quantities, clear cart
- **Persistence**: Cart state is maintained across route changes

## File Structure

```
src/
├── pages/
│   ├── ShopPage.tsx      # Main shopping experience
│   ├── SellerPage.tsx    # Seller dashboard wrapper
│   └── index.ts          # Page exports
├── context/
│   ├── CartContext.tsx   # Cart state management
│   └── index.ts          # Context exports
├── components/
│   ├── SellerDashboard.tsx  # Seller dashboard component
│   └── ...               # Other components
└── App.tsx               # Route definitions
```

## Key Features

### Proper Routing
- ✅ URL-based navigation (`/` and `/seller`)
- ✅ Browser back/forward button support
- ✅ Direct URL access to seller dashboard

### State Persistence
- ✅ Cart state maintained across routes
- ✅ Context-based state management
- ✅ No state loss when switching between shop/seller

### Clean Architecture
- ✅ Separated concerns (pages vs components)
- ✅ Reusable cart context
- ✅ Proper TypeScript types
- ✅ Interview-ready code structure

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3003` (or next available port).

## Navigation Examples

- Visit `/` for the main shop
- Visit `/seller` for the seller dashboard
- Use browser navigation (back/forward buttons)
- Bookmark specific routes