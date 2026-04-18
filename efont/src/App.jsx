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

const PageWrapper = ({ children }) => (
  <div className="page-transition">{children}</div>
);

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

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
          <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
          <Route path='/products' element={<PageWrapper><Products /></PageWrapper>} />
          <Route path='/about' element={<PageWrapper><About /></PageWrapper>} />
          <Route path='/contact' element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path='/cart' element={<PageWrapper><Cart /></PageWrapper>} />
          <Route path='/forgot-password' element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
          <Route path='/reset-password' element={<PageWrapper><ResetPasswordPage /></PageWrapper>} />

          {/* Protected: logged-in users only */}
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={<PageWrapper><Checkout /></PageWrapper>} />
            <Route path='/order-confirm' element={<PageWrapper><PaymentConfirmation /></PageWrapper>} />
            <Route path='/order-confirm/esewa' element={<PageWrapper><EsewaConfirmation /></PageWrapper>} />
            <Route path='/profile/orders' element={<PageWrapper><UserOrders /></PageWrapper>} />
          </Route>

          {/* Protected: only for unauthenticated users */}
          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/login' element={<PageWrapper><LogIn /></PageWrapper>} />
            <Route path='/register' element={<PageWrapper><Register /></PageWrapper>} />
          </Route>

          {/* Protected: admin only */}
          <Route path='/' element={<PrivateRoute adminOnly />}>
            <Route path='/admin' element={<PageWrapper><AdminLayout /></PageWrapper>}>
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
