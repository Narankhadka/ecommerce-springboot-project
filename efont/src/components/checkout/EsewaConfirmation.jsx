import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { verifyEsewaAndPlaceOrder } from '../../store/actions';

/**
 * eSewa Confirmation Page (/order-confirm/esewa)
 * eSewa redirects here with ?data=<base64_encoded_response>
 * We decode the response, verify with the backend, and place the order.
 */
const EsewaConfirmation = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const params = new URLSearchParams(location.search);
    const encodedData = params.get('data');
    const failStatus = params.get('status'); // present if failure_url was hit

    const checkoutAddress = localStorage.getItem('CHECKOUT_ADDRESS')
        ? JSON.parse(localStorage.getItem('CHECKOUT_ADDRESS'))
        : null;

    useEffect(() => {
        const verify = async () => {
            // If failure_url was triggered
            if (failStatus === 'failure' || !encodedData) {
                setError('eSewa payment failed or was cancelled. Please try again.');
                setLoading(false);
                return;
            }

            if (!checkoutAddress?.addressId) {
                setError('Delivery address not found. Please start the checkout again.');
                setLoading(false);
                return;
            }

            const order = await dispatch(
                verifyEsewaAndPlaceOrder(encodedData, checkoutAddress.addressId, setLoading, setError)
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
                    <div className='w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600'>Verifying your eSewa payment...</p>
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
                    Your eSewa payment was successful and your order has been placed.
                </p>
                <p className='text-gray-500 text-sm mb-6'>
                    You will receive a confirmation notification shortly.
                </p>
                <Link
                    to='/products'
                    className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors'
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default EsewaConfirmation;
