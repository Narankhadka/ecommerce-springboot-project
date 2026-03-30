import React from 'react';
import { FaCheckCircle, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * Generic Order Confirmation Page (/order-confirm)
 * Used after Cash on Delivery orders.
 * Khalti and eSewa have their own confirmation pages.
 */
const PaymentConfirmation = () => {
    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='p-8 rounded-lg shadow-lg text-center max-w-md mx-auto border border-gray-200'>
                <div className='flex justify-center mb-4'>
                    <FaCheckCircle size={64} className='text-green-500' />
                </div>

                <h2 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed!</h2>

                <p className='text-gray-600 mb-2'>
                    Thank you for your order. Your order has been successfully placed.
                </p>

                <div className='flex items-center justify-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-3 mb-6'>
                    <FaTruck size={20} />
                    <p className='text-sm font-medium'>
                        Cash on Delivery — please have the amount ready when the delivery arrives.
                    </p>
                </div>

                <p className='text-gray-500 text-sm mb-6'>
                    We'll notify you once your order is out for delivery.
                </p>

                <Link
                    to='/products'
                    className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block'
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default PaymentConfirmation;
