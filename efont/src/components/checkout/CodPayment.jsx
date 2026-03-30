import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeCodOrder } from '../../store/actions';
import toast from 'react-hot-toast';
import { FaTruck } from 'react-icons/fa';

/**
 * Cash on Delivery Component
 * Places the order directly without any online payment.
 * Payment status is set to "Pending" until delivery.
 */
const CodPayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, totalPrice } = useSelector((state) => state.carts);
    const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = () => {
        if (!cart || cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        if (!selectedUserCheckoutAddress?.addressId) {
            toast.error('Please select a delivery address');
            return;
        }

        dispatch(
            placeCodOrder(selectedUserCheckoutAddress.addressId, navigate, toast, setLoading)
        );
    };

    return (
        <div className='max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10 border text-center'>
            <div className='mb-4'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-3'>
                    <FaTruck className='text-amber-600 text-3xl' />
                </div>
                <h2 className='text-xl font-semibold text-gray-800'>Cash on Delivery</h2>
                <p className='text-gray-500 text-sm mt-1'>
                    Pay with cash when your order arrives at your doorstep.
                </p>
            </div>

            <div className='bg-amber-50 rounded-lg p-3 mb-5'>
                <p className='text-amber-800 font-semibold text-lg'>
                    Total: NPR {Number(totalPrice).toFixed(2)}
                </p>
                <p className='text-amber-600 text-xs mt-1'>No online payment required</p>
            </div>

            <div className='text-left bg-gray-50 rounded-lg p-3 mb-5 space-y-1'>
                <p className='text-sm font-semibold text-gray-700'>What happens next?</p>
                <ul className='text-sm text-gray-600 list-disc list-inside space-y-1'>
                    <li>Your order will be confirmed immediately</li>
                    <li>We'll notify you before delivery</li>
                    <li>Pay in cash when the item arrives</li>
                </ul>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className='w-full py-3 px-6 rounded-lg font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200'
            >
                {loading ? 'Placing Order...' : 'Confirm Order (Cash on Delivery)'}
            </button>
        </div>
    );
};

export default CodPayment;
