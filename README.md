# Estre - Luxury Furniture Configuration App

A complete React/TypeScript application for configuring and ordering luxury furniture with Supabase backend integration.

## Features

- **User Authentication**: Email/password authentication with Supabase Auth
- **Furniture Catalog**: Browse categories, models, and configurations
- **Real-time Configuration**: Interactive furniture customization with live pricing
- **Fabric Selection**: Comprehensive fabric inventory with pricing and availability
- **Order Management**: Complete order processing and tracking system
- **Cart System**: Add, modify, and manage configured furniture items
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Luxury Theme**: Green and gold color scheme with premium aesthetics

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS with custom luxury theme
- **State Management**: React Context API
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Database Schema

### Core Tables
- `user_profiles` - Extended user information
- `furniture_categories` - Product categories (sofas, beds, chairs)
- `sofa_models` - Individual furniture models with pricing
- `configuration_attributes` - Configurable options (seats, wood type, etc.)
- `attribute_options` - Available values for each attribute
- `fabric_inventory` - Fabric catalog with pricing and availability
- `orders` - Customer orders with status tracking
- `order_items` - Individual configured items in orders
- `configurations` - Saved configurations for reuse

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

Run the SQL migration files in your Supabase dashboard:

1. Execute `supabase/migrations/create_complete_furniture_schema.sql`
2. Execute `supabase/migrations/seed_furniture_data.sql`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## Key Components

### Authentication
- `EnhancedLoginPage` - Complete sign in/up with validation
- `AuthProvider` - Authentication context and state management

### Configuration
- `LuxurySofaConfigurator` - Interactive furniture customization
- `ConfigurationSection` - Dynamic attribute configuration
- `FabricSelector` - Fabric selection with pricing

### Order Management
- `OrderManager` - Order history and tracking
- `CartManager` - Shopping cart functionality
- `CartFooter` - Persistent cart summary

### Data Management
- `useSupabase` - Custom hooks for all database operations
- `SupabaseTest` - Connection and data testing component

## API Integration

### Authentication
```typescript
import { signIn, signUp, signOut } from './lib/supabase';

// Sign in user
const user = await signIn(email, password);

// Create new account
const newUser = await signUp(email, password, fullName, phone);
```

### Data Fetching
```typescript
import { useFurnitureCategories, useSofaModels } from './hooks/useSupabase';

// Get furniture categories
const { categories, loading, error } = useFurnitureCategories();

// Get models for a category
const { models } = useSofaModels(categoryId);
```

### Order Creation
```typescript
import { createOrder } from './lib/supabase';

const order = await createOrder({
  total_amount: 75000,
  customer_notes: 'Special delivery instructions',
  items: [
    {
      category_id: 'category-uuid',
      model_id: 'model-uuid',
      configuration_data: { seats: '3', fabric: 'leather' },
      item_price: 75000,
      quantity: 1,
      fabric_cost: 15000,
      upgrade_cost: 5000
    }
  ]
});
```

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User-specific data access** - users can only access their own orders/configurations
- **Public catalog access** - furniture categories and models are publicly readable
- **Staff permissions** - staff users can access all orders for management

## Mobile Support

The app includes Capacitor configuration for mobile deployment:

```bash
# Build for Android
npm run build:android

# Run on Android device
npm run android:dev
```

## Testing

Use the `SupabaseTest` component to verify database connectivity:

```typescript
import { SupabaseTest } from './components/SupabaseTest';

// Add to your app for testing
<SupabaseTest />
```

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider** (Netlify, Vercel, etc.)

3. **Set environment variables** in your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
