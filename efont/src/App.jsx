import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCart } from './store/actions';

import Navbar from './components/shared/Navbar';
import LoginPromptModal from './components/shared/LoginPromptModal';
import Footer from './components/shared/Footer';
import Home from './components/home/Home';
import Products from './components/products/Products';
import About from './components/About';
import Contact from './components/Contact';
import Cart from './components/cart/Cart';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import Checkout from './components/checkout/Checkout';
import PaymentConfirmation from './components/checkout/PaymentConfirmation';
import EsewaConfirmation from './components/checkout/EsewaConfirmation';
import UserOrders from './components/profile/UserOrders';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/dashboard/Dashboard';
import SellerDashboard from './components/admin/dashboard/SellerDashboard';
import AdminProducts from './components/admin/products/AdminProducts';
import Sellers from './components/admin/sellers/Sellers';
import Category from './components/admin/categories/Category';
import Orders from './components/admin/orders/Orders';
import SellerEarnings from './components/admin/earnings/SellerEarnings';
import AdminUsers from './components/admin/users/AdminUsers';
import SellerProfile from './components/admin/sellers/SellerProfile';
import AdminPromotions from './components/admin/promotions/AdminPromotions';
import PromoPopup from './components/shared/PromoPopup';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // On page refresh: if a valid JWT session exists, reload the cart from the
  // backend so the user always sees their own up-to-date cart.
  // On login/logout: user changes, so this also runs after authenticateSignInUser
  // sets the new user, replacing any stale state with the fresh backend cart.
  useEffect(() => {
    if (user) {
      dispatch(getUserCart());
    }
  }, [user, dispatch]);

  return (
    <React.Fragment>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />

          {/* Protected: logged-in users only */}
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/order-confirm' element={<PaymentConfirmation />} />
            <Route path='/order-confirm/esewa' element={<EsewaConfirmation />} />
            <Route path='/profile/orders' element={<UserOrders />} />
          </Route>

          {/* Protected: only for unauthenticated users */}
          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/login' element={<LogIn />} />
            <Route path='/register' element={<Register />} />
          </Route>

          {/* Protected: admin only */}
          <Route path='/' element={<PrivateRoute adminOnly />}>
            <Route path='/admin' element={<AdminLayout />}>
              <Route path='' element={<Dashboard />} />
              <Route path='seller-dashboard' element={<SellerDashboard />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path='sellers' element={<Sellers />} />
              <Route path='orders' element={<Orders />} />
              <Route path='categories' element={<Category />} />
              <Route path='seller-earnings' element={<SellerEarnings />} />
              <Route path='users' element={<AdminUsers />} />
              <Route path='seller-profile' element={<SellerProfile />} />
              <Route path='promotions' element={<AdminPromotions />} />
            </Route>
          </Route>
        </Routes>
        <PromoPopup />
        <Footer />
        <LoginPromptModal />
      </Router>
      <Toaster position='bottom-center' />
    </React.Fragment>
  );
}

export default App;
