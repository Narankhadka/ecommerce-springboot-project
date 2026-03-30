import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/shared/Navbar';
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
import KhaltiConfirmation from './components/checkout/KhaltiConfirmation';
import EsewaConfirmation from './components/checkout/EsewaConfirmation';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/dashboard/Dashboard';
import AdminProducts from './components/admin/products/AdminProducts';
import Sellers from './components/admin/sellers/Sellers';
import Category from './components/admin/categories/Category';
import Orders from './components/admin/orders/Orders';

function App() {
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

          {/* Protected: logged-in users only */}
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={<Checkout />} />
            {/* COD / generic confirmation */}
            <Route path='/order-confirm' element={<PaymentConfirmation />} />
            {/* Khalti redirect callback */}
            <Route path='/order-confirm/khalti' element={<KhaltiConfirmation />} />
            {/* eSewa redirect callback */}
            <Route path='/order-confirm/esewa' element={<EsewaConfirmation />} />
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
              <Route path='products' element={<AdminProducts />} />
              <Route path='sellers' element={<Sellers />} />
              <Route path='orders' element={<Orders />} />
              <Route path='categories' element={<Category />} />
            </Route>
          </Route>
        </Routes>
        <Footer />
      </Router>
      <Toaster position='bottom-center' />
    </React.Fragment>
  );
}

export default App;
