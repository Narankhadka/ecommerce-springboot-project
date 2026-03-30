import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiateEsewaPayment } from '../../store/actions';
import toast from 'react-hot-toast';

/**
 * eSewa Payment Component
 * Fetches form parameters (including HMAC signature) from the backend, then
 * programmatically submits a hidden POST form to the eSewa payment gateway.
 * eSewa redirects to /order-confirm/esewa after payment.
 */
const EsewaPayment = () => {
    const dispatch = useDispatch();
    const { totalPrice } = useSelector((state) => state.carts);
    const [loading, setLoading] = useState(false);
    const [formParams, setFormParams] = useState(null);
    const formRef = useRef(null);

    const esewaPaymentUrl = import.meta.env.VITE_ESEWA_PAYMENT_URL ||
        'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    const handleEsewaPay = async () => {
        if (!totalPrice || totalPrice <= 0) {
            toast.error('Invalid order amount');
            return;
        }

        const params = await dispatch(initiateEsewaPayment(totalPrice, setLoading, toast));
        if (!params) return; // Error already shown by action

        setFormParams(params);

        // Submit the form on the next render tick so the hidden form is mounted
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.submit();
            }
        }, 100);
    };

    return (
        <div className='max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10 border text-center'>
            <div className='mb-4'>
                <div
                    className='inline-flex items-center justify-center w-16 h-16 rounded-full mb-3'
                    style={{ backgroundColor: '#60BB46' }}
                >
                    <span className='text-white text-2xl font-bold'>e</span>
                </div>
                <h2 className='text-xl font-semibold text-gray-800'>Pay with eSewa</h2>
                <p className='text-gray-500 text-sm mt-1'>
                    You will be redirected to eSewa sandbox to complete your payment.
                </p>
            </div>

            <div className='bg-green-50 rounded-lg p-3 mb-5'>
                <p className='text-green-800 font-semibold text-lg'>
                    Amount: NPR {Number(totalPrice).toFixed(2)}
                </p>
            </div>

            <div className='text-xs text-gray-400 bg-yellow-50 border border-yellow-200 rounded p-2 mb-4'>
                <strong>Sandbox Mode:</strong> Use test credentials to complete payment.<br />
                eSewa ID: <strong>9806800001</strong> | Password: <strong>Nepal@123</strong> | OTP: <strong>123456</strong>
            </div>

            <button
                onClick={handleEsewaPay}
                disabled={loading}
                className='w-full py-3 px-6 rounded-lg font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-200'
                style={{ backgroundColor: '#60BB46' }}
            >
                {loading ? 'Redirecting to eSewa...' : `Pay NPR ${Number(totalPrice).toFixed(2)}`}
            </button>

            {/* Hidden form — submitted programmatically after backend returns params */}
            {formParams && (
                <form
                    ref={formRef}
                    action={esewaPaymentUrl}
                    method='POST'
                    style={{ display: 'none' }}
                >
                    {Object.entries(formParams).map(([key, value]) => (
                        <input key={key} type='hidden' name={key} value={value} />
                    ))}
                </form>
            )}
        </div>
    );
};

export default EsewaPayment;
