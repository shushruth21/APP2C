# Supabase Setup Guide for Estre Furniture App

This guide will walk you through setting up Supabase for the Estre luxury furniture configuration application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Basic understanding of SQL and database concepts

## Step 1: Create a New Supabase Project

1. Log in to your Supabase dashboard
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `estre-furniture` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (usually 2-3 minutes)

## Step 2: Get Your Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Project API Keys** → **anon public** key

## Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit your `.env` file to version control. Add it to your `.gitignore`.

## Step 4: Set Up the Database Schema

### Option A: Using the SQL Editor (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/migrations/create_complete_furniture_schema.sql`
4. Click "Run" to execute the schema creation
5. Create another new query
6. Copy and paste the contents of `supabase/migrations/seed_furniture_data.sql`
7. Click "Run" to populate the database with sample data

### Option B: Using the Migration Files

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure the following settings:

### Email Settings
- **Enable email confirmations**: Disabled (for development)
- **Enable email change confirmations**: Enabled
- **Enable secure email change**: Enabled

### Password Settings
- **Minimum password length**: 6 characters
- **Password strength**: Enabled

### Advanced Settings
- **Enable custom SMTP**: Optional (for production)
- **Site URL**: `http://localhost:5173` (for development)

## Step 6: Set Up Row Level Security Policies

The migration scripts automatically set up RLS policies, but here's what they do:

### User Profiles
- Users can view and update their own profile
- Staff can view all profiles

### Product Catalog (Public Access)
- Anyone can read furniture categories
- Anyone can read sofa models
- Anyone can read configuration attributes
- Anyone can read fabric inventory

### Orders and Configurations
- Users can only access their own orders and configurations
- Staff can access all orders for management

## Step 7: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Use the `SupabaseTest` component to verify connectivity:
   ```typescript
   import { SupabaseTest } from './components/SupabaseTest';
   
   // Add this to your app temporarily
   <SupabaseTest />
   ```

3. Check the browser console for any connection errors

## Step 8: Create Test Users

### Option A: Through the Application
1. Use the sign-up form in your application
2. Create both customer and staff accounts for testing

### Option B: Through Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter email and password
4. After creation, go to **Table Editor** → **user_profiles**
5. Add a profile record linking to the auth user

## Database Tables Overview

### Core Tables Created

1. **user_profiles** - Extended user information
   - Links to Supabase Auth users
   - Stores user type (customer/staff/admin)
   - Additional profile information

2. **furniture_categories** - Product categories
   - Sofas, beds, chairs, etc.
   - Base pricing and images
   - Priority ordering

3. **sofa_models** - Individual furniture models
   - Model names (Dale, Decker, Crave, etc.)
   - Base prices and descriptions
   - Feature lists

4. **configuration_attributes** - Configurable options
   - Seats, wood type, fabric plan, etc.
   - Dependency relationships
   - Display order

5. **attribute_options** - Available values
   - Specific options for each attribute
   - Price modifiers
   - Display labels

6. **fabric_inventory** - Fabric catalog
   - Comprehensive fabric database
   - Pricing and availability
   - Care instructions

7. **orders** - Customer orders
   - Order tracking and status
   - Customer information
   - Delivery details

8. **order_items** - Individual order items
   - Full configuration data
   - Pricing breakdown
   - Quantity information

9. **configurations** - Saved configurations
   - Reusable furniture configurations
   - User favorites
   - Pricing snapshots

## Sample Data Included

The seed script includes:
- 4 furniture categories (Luxury Sofas, Premium Recliners, Luxury Beds, Designer Chairs)
- 5 sofa models (Dale, Decker, Crave, Dapper, Conrad)
- 19 configuration attributes with dependencies
- 100+ attribute options with pricing
- 15 fabric samples across different categories

## Security Best Practices

1. **Environment Variables**
   - Never expose your service role key in client-side code
   - Use only the anon key in your frontend application
   - Store sensitive keys in server environment variables

2. **Row Level Security**
   - All tables have RLS enabled
   - Policies restrict data access appropriately
   - Regular security audits recommended

3. **Authentication**
   - Use strong passwords
   - Enable email verification for production
   - Consider implementing MFA for staff accounts

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify your environment variables are correct
   - Check that your Supabase project is active
   - Ensure your API keys haven't expired

2. **Permission Errors**
   - Check RLS policies are correctly configured
   - Verify user authentication status
   - Ensure user profiles are created after signup

3. **Data Not Loading**
   - Run the seed script to populate sample data
   - Check table names match your queries
   - Verify foreign key relationships

### Getting Help

1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review the application logs in your browser console
3. Use the Supabase dashboard logs for server-side issues
4. Check the GitHub issues for common problems

## Production Deployment

When deploying to production:

1. **Update Environment Variables**
   - Set production Supabase URL and keys
   - Configure proper site URLs in Supabase Auth settings

2. **Email Configuration**
   - Set up custom SMTP for email delivery
   - Enable email confirmations
   - Configure proper email templates

3. **Security Review**
   - Audit all RLS policies
   - Review user permissions
   - Enable additional security features

4. **Performance Optimization**
   - Add database indexes for frequently queried columns
   - Configure connection pooling if needed
   - Monitor query performance

## Backup and Maintenance

1. **Regular Backups**
   - Supabase provides automatic backups
   - Consider additional backup strategies for critical data

2. **Database Maintenance**
   - Monitor table sizes and performance
   - Regular cleanup of old orders/configurations
   - Update fabric inventory as needed

3. **Security Updates**
   - Keep Supabase client libraries updated
   - Review and update RLS policies as needed
   - Monitor for security advisories

This completes the Supabase setup for your Estre furniture application. The database is now ready to handle user authentication, product catalogs, order management, and all the features of your luxury furniture configuration system.