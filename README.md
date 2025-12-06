<h1 align="center">🌸 Daisy and More - Premium Fashion E-Commerce Platform</h1>

<p align="center">
  <img src="/frontend/public/daisy.svg" alt="Daisy and More Logo" width="200"/>
</p>

<p align="center">
  <strong>A sophisticated full-stack e-commerce platform for modern fashion retail</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-documentation">API</a> •
  <a href="#screenshots">Screenshots</a>
</p>

---

## 📸 Screenshots

<p align="center">
  <img src="/frontend/public/screenshots/homepage.png" alt="Homepage" width="800"/>
</p>

<details>
<summary>View More Screenshots</summary>

| Product Details | Shopping Cart | Admin Dashboard |
|:---:|:---:|:---:|
| ![Product Details](/frontend/public/screenshots/product-details.png) | ![Cart](/frontend/public/screenshots/cart.png) | ![Dashboard](/frontend/public/screenshots/dashboard.png) |

</details>

---

## 🎯 About The Project

**Daisy and More** is a modern, enterprise-grade e-commerce platform specialized in fashion retail. Built with the MERN stack and enhanced with Material-UI, it delivers a premium shopping experience with professional UI/UX comparable to high-end brands like Stradivarius, Shein, and ASOS.

### 🛍️ Product Categories

- 👖 Jeans
- 👕 T-Shirts
- 👟 Shoes
- 👓 Glasses
- 🧥 Jackets
- 👔 Suits
- 👜 Bags
- 💍 Accessories

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ Secure JWT-based authentication with refresh tokens
- ✅ HTTP-only cookie session management
- ✅ Role-based access control (Admin/Customer)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Protected routes and API endpoints
- ✅ Automatic token refresh mechanism
- ✅ **Password Reset Functionality**
  - Forgot password feature with email
  - Secure reset token generation (SHA-256 hashed)
  - Token expiration (1 hour)
  - Professional email templates with Nodemailer
  - Reset password confirmation emails

### 🛒 Advanced Shopping Experience
- ✅ **Product Catalog**
  - Multi-image product carousel with Swiper
  - Size and color variant selection with modal
  - Real-time stock tracking per variant
  - Advanced filtering by category, price, size
  - Search functionality with autocomplete
  - Product recommendations ("People Also Bought")

- ✅ **Shopping Cart**
  - Persistent cart across sessions
  - Real-time price calculations
  - Quantity management with stock validation
  - Cart dropdown preview in navbar
  - Size/variant selection for cart items

- ✅ **Wishlist System**
  - Add/remove products to wishlist
  - Move items from wishlist to cart
  - Persistent storage across sessions
  - Wishlist badge counter

- ✅ **Product Reviews & Ratings**
  - 5-star rating system
  - Review with photo uploads (Cloudinary)
  - Edit/delete your own reviews
  - Average rating calculation
  - Review verification system

### 💳 Payment & Checkout
- ✅ **Stripe Integration**
  - Secure payment processing with Stripe Payment Intents
  - Multiple payment methods support
  - Real-time payment status updates
  - Automatic payment confirmation

- ✅ **Order Management**
  - Complete order history tracking
  - Order status updates (Pending, Processing, Shipped, Delivered, Cancelled)
  - Order cancellation functionality
  - Detailed order view with products
  - PDF invoice download
  - Order confirmation emails

- ✅ **Shipping Information**
  - Multiple shipping addresses
  - Address validation
  - Shipping cost calculation

### 🎁 Advanced Coupon System
- ✅ **Coupon Types**
  - Percentage discounts (e.g., 20% OFF)
  - Fixed amount discounts (e.g., $10 OFF)
  - Free shipping coupons
  - Combo coupons (discount + free shipping)

- ✅ **Coupon Rules**
  - Minimum purchase requirements
  - Maximum discount limits
  - Expiration dates
  - Usage limits (one-time use)
  - Public/private coupon visibility
  - User-specific coupons

- ✅ **Gift Coupons**
  - Automatic gift coupon after purchase
  - Personalized coupon codes
  - Email distribution (future feature)

### 👑 Professional Admin Dashboard
- ✅ **Dashboard Overview**
  - Real-time analytics with charts (Recharts)
  - Key metrics cards (Revenue, Orders, Customers, Products)
  - Sales trends visualization (last 7 days)
  - Category distribution pie chart
  - Recent orders summary
  - Export to PDF with jsPDF
  - Export to Excel with XLSX
  - Beautiful stat cards with change indicators

- ✅ **Product Management**
  - Create/Edit/Delete products
  - Bulk product operations
  - Multi-image upload with Cloudinary
  - Variant management (colors, sizes, stock)
  - Feature product toggle
  - Category assignment
  - Real-time inventory tracking

- ✅ **Order Management**
  - View all orders with pagination
  - Update order status
  - Filter by status, date, customer
  - Order details with customer info
  - Bulk status updates
  - Export orders to PDF/Excel

- ✅ **User Management**
  - View all users with stats
  - Create/Edit/Delete users
  - Role management (Admin/Customer)
  - User activity tracking (orders, cart, wishlist)
  - Search and filter users
  - Beautiful user cards with statistics

- ✅ **Coupon Management**
  - Create/Edit/Delete coupons
  - Set coupon rules and restrictions
  - Track coupon usage
  - Coupon analytics
  - Bulk coupon operations

- ✅ **Analytics & Reports**
  - Sales analytics with date filters
  - Revenue trends visualization
  - Top products by sales
  - Top customers by spending
  - Export reports to PDF/Excel

### 🎨 Modern Design & UX
- ✅ **UI Framework**
  - Material-UI (MUI) components
  - Tailwind CSS utility classes
  - Custom brown (#895129) brand colors
  - FontAwesome 7+ icons
  - Responsive mobile-first design

- ✅ **Animations & Interactions**
  - Framer Motion animations
  - Smooth page transitions
  - Loading skeletons
  - Toast notifications (react-hot-toast)
  - Modal image viewing
  - Hover effects and micro-interactions

- ✅ **User Experience**
  - Search overlay with live results
  - Cart dropdown preview
  - Size selection modal
  - Image carousel navigation
  - Logout confirmation modal
  - Error boundary handling
  - Optimistic UI updates
  - **AI-Powered Chatbot**
    - Intelligent product recommendations
    - Order tracking assistance
    - FAQ automation
    - 24/7 customer support
    - Natural language processing

### 🚀 Performance & Optimization
- ✅ **Caching**
  - Redis caching for featured products
  - Browser caching strategies
  - API response caching

- ✅ **Database Optimization**
  - MongoDB indexing
  - Aggregation pipelines
  - Population optimization
  - Query performance tuning

- ✅ **Frontend Optimization**
  - Vite build optimization
  - Code splitting
  - Lazy loading components
  - Image optimization with Cloudinary
  - Bundle size optimization

### 📱 User Account Features
- ✅ My Account page with profile management
- ✅ My Orders page with order history
- ✅ My Coupons page with available coupons
- ✅ Wishlist page with saved items
- ✅ Address book management
- ✅ Order tracking
- ✅ Password reset via email

### 📧 Email Notifications
- ✅ **Professional Email Templates**
  - Branded HTML emails with Daisy and more design
  - Responsive email layout
  - Plain text fallback for compatibility

- ✅ **Email Features**
  - Password reset requests with secure links
  - Password reset confirmation
  - Order confirmations (future)
  - Shipping updates (future)
  - Newsletter subscriptions (future)

- ✅ **Email Service**
  - Nodemailer integration
  - Gmail SMTP support with App Password
  - Easy migration to professional services (SendGrid, Mailgun)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Latest UI library with hooks
- **Vite** - Lightning-fast build tool
- **Material-UI (MUI)** - Professional component library
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Beautiful notifications
- **Stripe Elements** - Secure payment UI
- **Recharts** - Data visualization charts
- **jsPDF** - PDF generation
- **XLSX** - Excel file generation
- **date-fns** - Modern date utility library
- **Swiper** - Touch slider carousel

### Backend
- **Node.js (v18+)** - JavaScript runtime
- **Express.js** - Fast web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Elegant MongoDB ODM
- **Redis (Upstash)** - In-memory caching
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Crypto** - Secure token generation
- **Stripe** - Payment processing API
- **Cloudinary** - Image CDN & management
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Nodemailer** - Email service integration

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Stripe Account** (for payment processing)
- **Cloudinary Account** (for image storage)
- **Gmail Account** (for email notifications via App Password)
- **Redis** (optional, via Upstash for caching)

### 1. Clone the repository

```bash
git clone https://github.com/emnakarray31/E-COMMERCE-MERN.git
cd mern-ecommerce
```

### 2. Install dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Setup environment variables

#### Backend Environment (.env in root directory)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/daisy-and-more?retryWrites=true&w=majority

# Redis (Optional - for caching featured products)
UPSTASH_REDIS_URL=redis://default:your_password@your-redis-url.upstash.io:6379

# JWT Secrets (Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_minimum_32_characters
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_minimum_32_characters

# Cloudinary (Image Storage & CDN)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Configuration (Nodemailer with Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_16_chars
```

### 6. Setup Gmail App Password for Email Notifications

To enable password reset emails and other notifications, you need to create a Gmail App Password:

#### Steps to create Gmail App Password:

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Click on "2-Step Verification" and enable it
   - Follow the setup instructions

2. **Create App Password**
   - Go to https://myaccount.google.com/apppasswords
   - You may need to sign in again
   - Select "Mail" or "Other (Custom name)"
   - Name it "Daisy and more"
   - Click "Generate"
   - **Copy the 16-character password immediately** (it won't be shown again)

3. **Add to .env file**
   ```env
   EMAIL_USER=emnakarray61@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your 16-character App Password
   ```

**Important Notes:**
- Use the App Password (16 characters), NOT your regular Gmail password
- Remove spaces when pasting in .env
- The App Password is different from your Gmail password
- Keep this password secure and never commit it to version control

#### Email Templates

The application sends professional HTML emails with:
- **Password Reset Email**: Secure link to reset password (expires in 1 hour)
- **Password Reset Confirmation**: Notification after successful password change
- Branded design with "Daisy and more" logo
- Responsive layout for all devices
- Security tips and best practices

#### Testing Emails

After configuration:
1. Go to login page and click "Forgot Password?"
2. Enter your email address
3. Check your inbox (and spam folder)
4. Click the reset link in the email
5. Set your new password

In development mode, the reset link is also logged to the server console.

#### Frontend Environment (.env in frontend directory)

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 7. Generate JWT Secrets

```bash
# Run this command twice to generate both secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 8. Setup Stripe Webhook (Optional for production)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/payments/webhook

# Copy the webhook signing secret to your .env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## 🚀 Usage

### Development Mode

**Option 1: Run from root directory (Recommended)**
```bash
# Runs both frontend and backend concurrently
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Admin Dashboard**: `http://localhost:5173` (login as admin)

### Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# The built files will be in frontend/dist
# Serve with your preferred static file server
```

### Default Admin Credentials

For first-time setup, create an admin user via MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.insertOne({
  name: "Admin User",
  email: "admin@daisyandmore.com",
  password: "$2b$10$hashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  cartItems: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or sign up normally and manually change role to "admin" in database.

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/refresh-token` | Refresh access token | Yes |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/auth/forgot-password` | Request password reset email | No |
| POST | `/auth/reset-password/:token` | Reset password with token | No |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/featured` | Get featured products (cached) | No |
| GET | `/products/category/:category` | Get products by category | No |
| GET | `/products/:id` | Get product details | No |
| POST | `/products` | Create product | Admin |
| PATCH | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| PATCH | `/products/:id/toggle-featured` | Toggle featured status | Admin |
| POST | `/products/:id/reviews` | Add review | Yes |
| PUT | `/products/:id/reviews/:reviewId` | Update review | Yes |
| DELETE | `/products/:id/reviews/:reviewId` | Delete review | Yes/Admin |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart` | Add item to cart | Yes |
| PUT | `/cart/:productId` | Update cart item quantity | Yes |
| DELETE | `/cart/:productId` | Remove item from cart | Yes |
| DELETE | `/cart` | Clear entire cart | Yes |

### Wishlist Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/wishlist` | Get user wishlist | Yes |
| POST | `/wishlist` | Add item to wishlist | Yes |
| DELETE | `/wishlist/:productId` | Remove from wishlist | Yes |
| DELETE | `/wishlist` | Clear wishlist | Yes |
| POST | `/wishlist/move-to-cart` | Move item to cart | Yes |
| GET | `/wishlist/check/:productId` | Check if in wishlist | Yes |

### Coupon Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/coupons/my-coupons` | Get user's available coupons | Yes |
| POST | `/coupons/validate` | Validate coupon code | Yes |
| POST | `/coupons/use` | Use/apply coupon | Yes |
| GET | `/coupons/admin/all` | Get all coupons | Admin |
| POST | `/coupons/admin/create` | Create coupon | Admin |
| PUT | `/coupons/admin/:id` | Update coupon | Admin |
| DELETE | `/coupons/admin/:id` | Delete coupon | Admin |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/create-payment-intent` | Create Stripe payment intent | Yes |
| POST | `/payments/confirm-payment` | Confirm payment and create order | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders/my-orders` | Get user's orders | Yes |
| GET | `/orders/:id` | Get order details | Yes |
| PATCH | `/orders/:id/cancel` | Cancel order | Yes |
| GET | `/orders/admin/all` | Get all orders | Admin |
| PATCH | `/orders/admin/:id/status` | Update order status | Admin |
| DELETE | `/orders/admin/:id` | Delete order | Admin |

### User Management Endpoints (Admin)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/admin/all` | Get all users | Admin |
| GET | `/users/admin/:id` | Get user by ID | Admin |
| POST | `/users/admin/create` | Create new user | Admin |
| PUT | `/users/admin/:id` | Update user | Admin |
| DELETE | `/users/admin/:id` | Delete user | Admin |
| PATCH | `/users/admin/:id/role` | Update user role | Admin |
| GET | `/users/admin/stats` | Get user statistics | Admin |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics` | Get analytics dashboard data | Admin |
| GET | `/analytics/sales` | Get sales analytics | Admin |
| GET | `/analytics/products` | Get product analytics | Admin |
| GET | `/analytics/users` | Get user analytics | Admin |

---

## 📂 Project Structure

```
mern-ecommerce/
├── backend/
│   ├── config/
│   │   └── env.js                      # Environment configuration
│   ├── controllers/
│   │   ├── analytics.controller.js     # Analytics & reports logic
│   │   ├── auth.controller.js          # Authentication logic
│   │   ├── cart.controller.js          # Shopping cart logic
│   │   ├── coupon.controller.js        # Coupon management
│   │   ├── order.controller.js         # Order management
│   │   ├── payment.controller.js       # Stripe payment processing
│   │   ├── product.controller.js       # Product CRUD operations
│   │   ├── user.controller.js          # User management (Admin)
│   │   └── Wishlist.controller.js      # Wishlist operations
│   ├── lib/
│   │   ├── cloudinary.js               # Cloudinary config
│   │   ├── db.js                       # MongoDB connection
│   │   ├── email.js                    # Email service (Nodemailer)
│   │   ├── redis.js                    # Redis caching
│   │   └── stripe.js                   # Stripe configuration
│   ├── middleware/
│   │   └── auth.middleware.js          # JWT verification & role check
│   ├── models/
│   │   ├── coupon.model.js            # Coupon schema
│   │   ├── order.model.js             # Order schema
│   │   ├── product.model.js           # Product schema
│   │   ├── user.model.js              # User schema
│   │   └── Wishlist.model.js          # Wishlist schema
│   ├── routes/
│   │   ├── analytics.route.js         # Analytics routes
│   │   ├── auth.route.js              # Auth routes
│   │   ├── cart.route.js              # Cart routes
│   │   ├── coupon.route.js            # Coupon routes
│   │   ├── order.route.js             # Order routes
│   │   ├── payment.route.js           # Payment routes
│   │   ├── product.route.js           # Product routes
│   │   ├── user.route.js              # User management routes
│   │   └── Wishlist.route.js          # Wishlist routes
│   ├── .env                            # Environment variables
│   ├── package.json                    # Backend dependencies
│   └── server.js                       # Express server entry point
│
└── frontend/
    ├── public/
    │   ├── daisy.svg                   # Brand logo
    │   ├── screenshots/                # App screenshots
    │   └── [category images]           # Category banner images
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminAnalytics.jsx      # Analytics charts
    │   │   │   ├── AdminCoupons.jsx        # Coupon management
    │   │   │   ├── AdminDashboard.jsx      # Dashboard overview
    │   │   │   ├── AdminDashboardLayout.jsx # Admin layout wrapper
    │   │   │   ├── AdminOrders.jsx         # Order management
    │   │   │   ├── AdminProductForm.jsx    # Product form
    │   │   │   ├── AdminProducts.jsx       # Product management
    │   │   │   └── AdminUsers.jsx          # User management
    │   │   ├── Cartdropdown.jsx        # Cart preview dropdown
    │   │   ├── CartItem.jsx            # Cart item component
    │   │   ├── CategoryItem.jsx        # Category card
    │   │   ├── CouponsTab.jsx          # User coupons display
    │   │   ├── FeaturedProducts.jsx    # Featured products carousel
    │   │   ├── GiftCouponCard.jsx      # Gift coupon card
    │   │   ├── LoadingSpinner.jsx      # Loading indicator
    │   │   ├── Logoutmodal.jsx         # Logout confirmation
    │   │   ├── Navbar.jsx              # Navigation bar
    │   │   ├── OrderSummary.jsx        # Checkout summary
    │   │   ├── PeopleAlsoBought.jsx    # Product recommendations
    │   │   ├── ProductCard.jsx         # Product card
    │   │   ├── SimpleSearchOverlay.jsx # Search modal
    │   │   └── SizeSelectionModal.jsx  # Size picker modal
    │   ├── lib/
    │   │   └── axios.js                # Axios instance with interceptors
    │   ├── pages/
    │   │   ├── CartPage.jsx            # Shopping cart page
    │   │   ├── CategoryPage.jsx        # Category listing
    │   │   ├── CheckoutPage.jsx        # Checkout & payment
    │   │   ├── HomePage.jsx            # Landing page
    │   │   ├── LoginPage.jsx           # Login page
    │   │   ├── Myaccountpage.jsx       # User account settings
    │   │   ├── Mycouponspage.jsx       # User coupons page
    │   │   ├── MyOrdersPage.jsx        # Order history
    │   │   ├── Productdetails.jsx      # Product detail page
    │   │   ├── PurchaseCancelPage.jsx  # Payment cancelled
    │   │   ├── PurchaseSuccessPage.jsx # Payment success
    │   │   ├── SignUpPage.jsx          # Registration page
    │   │   └── Wishlistpage.jsx        # Wishlist page
    │   ├── stores/
    │   │   ├── useCartStore.js         # Cart state management
    │   │   ├── useProductStore.js      # Product state
    │   │   ├── useUserStore.js         # User auth state
    │   │   └── Usewishliststore.js     # Wishlist state
    │   ├── styles/
    │   │   └── [CSS modules]           # Component styles
    │   ├── App.jsx                     # Main app component
    │   ├── main.jsx                    # App entry point
    │   └── index.css                   # Global styles
    ├── .env                            # Frontend environment variables
    ├── package.json                    # Frontend dependencies
    ├── tailwind.config.js              # Tailwind configuration
    └── vite.config.js                  # Vite build config
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-red: #e53637        /* Main CTA buttons */
--primary-red-hover: #ca2829  /* Button hover state */
--brown-accent: #895129       /* Brand color, highlights */
--brown-dark: #6f3f1f         /* Dark brown variant */
--brown-light: #d4a574        /* Light brown accent */

/* Neutral Colors */
--text-primary: #111111       /* Headings */
--text-secondary: #6f6f6f     /* Body text */
--text-muted: #999999         /* Disabled, placeholder */

/* Backgrounds */
--bg-white: #ffffff           /* Card backgrounds */
--bg-gray: #f5f5f5            /* Page background */
--bg-light-gray: #fafafa      /* Subtle backgrounds */

/* Borders */
--border-light: #e5e5e5       /* Card borders */
--border-medium: #cccccc      /* Input borders */
```

### Typography

```css
/* Fonts */
--font-heading: 'Playfair Display', serif   /* Elegant headings */
--font-body: 'Montserrat', sans-serif       /* Clean body text */
--font-inter: 'Inter', sans-serif           /* Modern UI text */

/* Font Sizes */
--text-xs: 11px
--text-sm: 13px
--text-base: 14px
--text-lg: 16px
--text-xl: 18px
--text-2xl: 24px
--text-3xl: 32px
--text-4xl: 36px
```

### Component Patterns

- **Cards**: 16px border radius, subtle shadows
- **Buttons**: 8-12px border radius, gradient hover effects
- **Inputs**: 8px border radius, focus border colors
- **Modals**: Centered, backdrop blur, smooth animations
- **Toasts**: Top-right position, auto-dismiss

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ JWT access tokens (15 minutes expiry)
- ✅ JWT refresh tokens (7 days expiry)
- ✅ HTTP-only secure cookies
- ✅ Token rotation on refresh
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes

### Data Security
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Input validation & sanitization
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Environment variable protection

### Payment Security
- ✅ PCI-compliant Stripe integration
- ✅ No credit card data stored
- ✅ Secure payment intent flow
- ✅ Webhook signature verification
- ✅ HTTPS-only in production

### Best Practices
- ✅ Rate limiting on API endpoints
- ✅ Error message sanitization
- ✅ Secure headers (Helmet.js ready)
- ✅ Request size limits
- ✅ File upload restrictions

---

## 📊 Database Schema

### Collections

1. **users**
   - Basic info (name, email, password)
   - Role (customer/admin)
   - Cart items (embedded)
   - Addresses (array)
   - Password reset tokens (hashed, with expiry)

2. **products**
   - Product details
   - Variants (colors, sizes, stock)
   - Images (Cloudinary URLs)
   - Reviews (embedded)
   - Category & pricing

3. **orders**
   - Order items with variants
   - User information
   - Payment details
   - Shipping information
   - Status tracking
   - Timestamps

4. **coupons**
   - Coupon code & type
   - Discount rules
   - Usage restrictions
   - Expiration dates
   - User assignments

5. **wishlists**
   - User reference
   - Product references
   - Timestamps

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Add to cart and wishlist
- [ ] Apply coupon codes
- [ ] Complete checkout process
- [ ] Admin product management
- [ ] Admin order management
- [ ] PDF and Excel exports

### Future Improvements

- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Cypress
- Performance testing

---

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up Redis for production
4. Configure Cloudinary
5. Set up Stripe webhooks
6. Configure CORS for production domain

### Recommended Platforms

- **Backend**: Railway, Render, Heroku
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas
- **Redis**: Upstash Redis
- **Images**: Cloudinary

### Build Commands

```bash
# Frontend
cd frontend && npm run build

# Backend
npm start
```

---

## 🤝 Contributing

This is a personal portfolio project. However, feedback and suggestions are always welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

---

## 📝 License

This project is **proprietary and private**. All rights reserved.

**© 2025 Daisy and More. All Rights Reserved.**

Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without explicit permission from the author.

---

## 👩‍💻 Developer

**Emna Karray**

- 💼 LinkedIn: [linkedin.com/in/emna-karray](https://www.linkedin.com/in/emna-karray)
- 📧 Email: emnakarray61@gmail.com
- 🌐 Portfolio: [Coming Soon]

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and these technologies:

- **MongoDB** - Flexible document database
- **Express.js** - Minimal web framework
- **React** - Component-based UI library
- **Node.js** - JavaScript runtime
- **Stripe** - Payment infrastructure
- **Cloudinary** - Image management
- **Material-UI** - React component library
- **Tailwind CSS** - Utility-first CSS
- **Upstash** - Serverless Redis

And all the other incredible libraries that made this project possible! 🚀

---

## 📞 Support

For questions, issues, or suggestions:

- 📧 Email: emnakarray61@gmail.com
- 💬 GitHub Issues: [Create an issue](https://github.com/emnakarray31/E-COMMERCE-MERN/issues)

---

## 🗺️ Roadmap

### Recently Added Features ✨

- [x] **AI-Powered Chatbot** - Intelligent customer support
- [x] **Password Reset via Email** - Secure forgot password functionality
- [x] **Professional Email Templates** - Branded HTML emails with Nodemailer

### Upcoming Features

- [ ] Email notifications for orders and shipping
- [ ] Product search with Algolia
- [ ] Enhanced chatbot with NLP
- [ ] Product comparison
- [ ] Social media login (Google, Facebook)
- [ ] Multi-language support (i18n)
- [ ] Customer reviews moderation
- [ ] Advanced analytics dashboard
- [ ] Inventory alerts
- [ ] Abandoned cart recovery
- [ ] Gift cards
- [ ] Referral program

---

<p align="center">
  <strong>Made with ❤️ and lots of ☕ by Emna Karray</strong>
</p>

<p align="center">
  <sub>Built with the MERN stack • Deployed with love • Maintained with passion</sub>
</p>

<p align="center">
  <a href="#top">⬆ Back to top</a>
</p>
