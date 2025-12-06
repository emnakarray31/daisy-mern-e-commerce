import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import MyCouponsPage from "./pages/Mycouponspage";
import Productdetails from "./pages/Productdetails";
import Wishlistpage from "./pages/Wishlistpage";
import MyAccountPage from "./pages/Myaccountpage";
import MyOrdersPage from './pages/MyOrdersPage';
import PaymentMethods from './pages/PaymentMethods';
import Delivery from './pages/Delivery';
import ReturnExchange from './pages/ReturnExchange';
import Chatbot from './components/Chatbot';
 
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminCoupons from "./components/admin/AdminCoupons";
import AdminUsers from "./components/admin/AdminUsers";
import AdminAnalytics from "./components/admin/AdminAnalytics";

import AdminProductForm from "./components/admin/AdminProductForm";
import AdminSales from "./components/admin/AdminSales";
import SalesPage from "./pages/SalesPage";

import ContactUs from "./pages/ContactUs";
import AdminMessages from "./components/admin/AdminMessages";

import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Elements stripe={stripePromise}>
      <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute inset-0'>
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
          </div>
        </div>

          <Chatbot />
        <div className='relative z-50'>
          <Routes>
            <Route path='/' element={<><Navbar /><HomePage /></>} />
            <Route path='/signup' element={!user ? <><Navbar /><SignUpPage /></> : <Navigate to='/' />} />
            <Route path='/login' element={!user ? <><Navbar /><LoginPage /></> : <Navigate to='/' />} />
            <Route path='/reset-password/:token' element={<><Navbar /><ResetPasswordPage /></>} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path='/category/:category' element={<><Navbar /><CategoryPage /></>} />
            <Route path='/product/:id' element={<><Navbar /><Productdetails /></>} />
            <Route path='/wishlist' element={<><Navbar /><Wishlistpage /></>} />
            <Route path='/sales' element={<><Navbar /><SalesPage /></>} />
            <Route path='/cart' element={user ? <><Navbar /><CartPage /></> : <Navigate to='/login' />} />
            <Route path='/checkout' element={user ? <><Navbar /><CheckoutPage /></> : <Navigate to='/login' />} />
            <Route path='/purchase-success' element={user ? <><Navbar /><PurchaseSuccessPage /></> : <Navigate to='/login' />} />
            <Route path='/purchase-cancel' element={user ? <><Navbar /><PurchaseCancelPage /></> : <Navigate to='/login' />} />
            <Route path='/my-coupons' element={user ? <><Navbar /><MyCouponsPage /></> : <Navigate to='/login' />} />
            <Route path='/account' element={<><Navbar /><MyAccountPage /></>} />

            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/returns" element={<ReturnExchange />} />

            <Route path="/my-orders" element={<MyOrdersPage />} />

            <Route path='/secret-dashboard' element={<Navigate to='/admin/dashboard' replace />} />
            
            <Route
              path='/admin/*'
              element={isAdmin ? <AdminDashboardLayout /> : <Navigate to='/login' />}
            >
              <Route index element={<Navigate to='/admin/dashboard' replace />} />
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path='orders' element={<AdminOrders />} />
              <Route path='products/create' element={<AdminProductForm />} />    
              <Route path='products/edit/:id' element={<AdminProductForm />} />  
              <Route path='orders' element={<AdminOrders />} />
              <Route path='coupons' element={<AdminCoupons />} />             
              <Route path='users' element={<AdminUsers />} />                      
              <Route path='customers' element={<AdminUsers />} />      
              <Route path='sales' element={<AdminSales />} />   
              <Route path='analytics'element={ <AdminAnalytics/>  } />
              <Route path="messages" element={<AdminMessages />} />


            </Route>
          </Routes>
        </div>

        <Toaster
	position="top-center"
	reverseOrder={false}
	gutter={8}
	containerStyle={{ top: 20 }}
	toastOptions={{
		style: {
			background: '#fff',
			color: '#111',
			padding: '16px 24px',
			borderRadius: '4px',
			fontSize: '14px',
			fontWeight: '600',
			boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
			border: '2px solid #e5e5e5',
			maxWidth: '500px',
			fontFamily: 'inherit',
		},
		success: {
			style: {
				background: '#fff',
				color: '#111',
				border: '2px solid #10b981',
				borderLeft: '6px solid #10b981',
			},
			iconTheme: {
				primary: '#10b981',
				secondary: '#fff',
			},
			duration: 3000,
		},
		error: {
			style: {
				background: '#fff',
				color: '#111',
				border: '2px solid #e53637',
				borderLeft: '6px solid #e53637',
			},
			iconTheme: {
				primary: '#e53637',
				secondary: '#fff',
			},
			duration: 4000,
		},
		loading: {
			style: {
				background: '#fff',
				color: '#111',
				border: '2px solid #895129',
				borderLeft: '6px solid #895129',
			},
			iconTheme: {
				primary: '#895129',
				secondary: '#fff',
			},
		},
	}}


        />
      </div>
    </Elements>
  );
}

export default App;