import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { checkIsAdmin, checkIsSeller } from '../utils/authUtils';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = checkIsAdmin(user);
    const isSeller = checkIsSeller(user);
    const location = useLocation();

    // Public-only pages (login / register) — redirect logged-in users to home
    if (publicPage) {
        return user ? <Navigate to="/" /> : <Outlet />;
    }

    // All protected pages require a logged-in user
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Admin / seller-only section
    if (adminOnly) {
        // Sellers get limited access to orders and products pages only
        if (isSeller && !isAdmin) {
            const sellerAllowedPaths = ["/admin/orders", "/admin/products", "/admin/seller-dashboard", "/admin/seller-earnings", "/admin/seller-profile"];
            const sellerAllowed = sellerAllowedPaths.some(path =>
                location.pathname.startsWith(path)
            );
            if (!sellerAllowed) {
                return <Navigate to="/" replace />;
            }
        }
        // Non-admin, non-seller users have no access to admin section
        if (!isAdmin && !isSeller) {
            return <Navigate to="/" />;
        }
    }

    // Logged-in user — allow through
    return <Outlet />;
};

export default PrivateRoute;
