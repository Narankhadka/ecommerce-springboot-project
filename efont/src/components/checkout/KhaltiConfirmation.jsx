import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { verifyKhaltiAndPlaceOrder } from '../../store/actions';

/**
 * Khalti Confirmation Page (/order-confirm/khalti)
 * Khalti redirects here with ?pidx=...&status=...&transaction_id=...
 * We verify the payment with the backend and place the order.
 */
const KhaltiConfirmation = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const params = new URLSearchParams(location.search);
    const pidx = params.get('pidx');
    const status = params.get('status');

    const checkoutAddress = localStorage.getItem('CHECKOUT_ADDRESS')
        ? JSON.parse(localStorage.getItem('CHECKOUT_ADDRESS'))
        : null;

    useEffect(() => {
        const verify = async () => {
            // Khalti sends status=Completed for successful payments
            if (!pidx || status !== 'Completed') {
                setError(status === 'User canceled'
                    ? 'Payment was cancelled. Please try again.'
                    : `Payment failed. Status: ${status || 'Unknown'}`);
                setLoading(false);
                return;
            }

            if (!checkoutAddress?.addressId) {
                setError('Delivery address not found. Please start the checkout again.');
                setLoading(false);
                return;
            }

            const order = await dispatch(
                verifyKhaltiAndPlaceOrder(pidx, checkoutAddress.addressId, setLoading, setError)
            );

            if (order) {
                setSuccess(true);
            }
        };

        verify();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600'>Verifying your Khalti payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='p-8 rounded-lg shadow-lg text-center max-w-md mx-auto border border-red-200'>
                    <FaTimesCircle size={64} className='text-red-500 mx-auto mb-4' />
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Payment Failed</h2>
                    <p className='text-gray-600 mb-6'>{error}</p>
                    <Link
                        to='/checkout'
                        className='bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors'
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='p-8 rounded-lg shadow-lg text-center max-w-md mx-auto border border-gray-200'>
                <FaCheckCircle size={64} className='text-green-500 mx-auto mb-4' />
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>Order Confirmed!</h2>
                <p className='text-gray-600 mb-2'>
                    Your Khalti payment was successful and your order has been placed.
                </p>
                <p className='text-gray-500 text-sm mb-6'>
                    You will receive a confirmation notification shortly.
                </p>
                <Link
                    to='/products'
                    className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default KhaltiConfirmation;
