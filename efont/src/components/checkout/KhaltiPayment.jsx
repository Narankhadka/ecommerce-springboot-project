import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiateKhaltiPayment } from '../../store/actions';
import toast from 'react-hot-toast';

/**
 * Khalti Payment Component
 * Calls the backend to initiate a Khalti session, then redirects the user
 * to the Khalti payment page. After payment, Khalti redirects back to
 * /order-confirm/khalti where verification happens.
 */
const KhaltiPayment = () => {
    const dispatch = useDispatch();
    const { totalPrice } = useSelector((state) => state.carts);
    const [loading, setLoading] = useState(false);

    const handleKhaltiPay = () => {
        if (!totalPrice || totalPrice <= 0) {
            toast.error('Invalid order amount');
            return;
        }
        dispatch(initiateKhaltiPayment(totalPrice, setLoading, toast));
    };

    return (
        <div className='max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10 border text-center'>
            <div className='mb-4'>
                <div
                    className='inline-flex items-center justify-center w-16 h-16 rounded-full mb-3'
                    style={{ backgroundColor: '#5C2D91' }}
                >
                    <span className='text-white text-2xl font-bold'>K</span>
                </div>
                <h2 className='text-xl font-semibold text-gray-800'>Pay with Khalti</h2>
                <p className='text-gray-500 text-sm mt-1'>
                    You will be redirected to the Khalti sandbox to complete your payment.
                </p>
            </div>

            <div className='bg-purple-50 rounded-lg p-3 mb-5'>
                <p className='text-purple-800 font-semibold text-lg'>
                    Amount: NPR {Number(totalPrice).toFixed(2)}
                </p>
            </div>

            <div className='text-xs text-gray-400 bg-yellow-50 border border-yellow-200 rounded p-2 mb-4'>
                <strong>Sandbox Mode:</strong> Use test credentials to complete payment.<br />
                Test number: <strong>9800000001</strong> | MPIN: <strong>1111</strong> | OTP: <strong>987654</strong>
            </div>

            <button
                onClick={handleKhaltiPay}
                disabled={loading}
                className='w-full py-3 px-6 rounded-lg font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-200'
                style={{ backgroundColor: '#5C2D91' }}
            >
                {loading ? 'Redirecting to Khalti...' : `Pay NPR ${Number(totalPrice).toFixed(2)}`}
            </button>
        </div>
    );
};

export default KhaltiPayment;
