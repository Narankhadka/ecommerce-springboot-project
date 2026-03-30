import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentMethod, createUserCart } from '../../store/actions';

const PAYMENT_OPTIONS = [
    {
        value: 'Khalti',
        label: 'Khalti',
        description: 'Pay via Khalti digital wallet (sandbox)',
        color: '#5C2D91',
    },
    {
        value: 'eSewa',
        label: 'eSewa',
        description: 'Pay via eSewa mobile wallet (sandbox)',
        color: '#60BB46',
    },
    {
        value: 'COD',
        label: 'Cash on Delivery',
        description: 'Pay with cash when your order arrives',
        color: '#F59E0B',
    },
];

const PaymentMethod = () => {
    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);
    const { cart, cartId } = useSelector((state) => state.carts);
    const { errorMessage } = useSelector((state) => state.errors);

    // Sync local cart to server when the user first reaches this step
    useEffect(() => {
        if (cart.length > 0 && !cartId && !errorMessage) {
            const sendCartItems = cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));
            dispatch(createUserCart(sendCartItems));
        }
    }, [dispatch, cartId]);

    return (
        <div className='max-w-md mx-auto p-5 bg-white shadow-md rounded-lg mt-16 border'>
            <h1 className='text-2xl font-semibold mb-2'>Select Payment Method</h1>
            <p className='text-sm text-gray-500 mb-4'>
                Choose how you would like to pay for your order
            </p>

            <FormControl className='w-full'>
                <RadioGroup
                    aria-label='payment method'
                    name='paymentMethod'
                    value={paymentMethod}
                    onChange={(e) => dispatch(addPaymentMethod(e.target.value))}
                >
                    {PAYMENT_OPTIONS.map((option) => (
                        <div
                            key={option.value}
                            className={`mb-3 p-3 border rounded-lg cursor-pointer transition-all duration-150 ${
                                paymentMethod === option.value
                                    ? 'border-2 border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-400'
                            }`}
                            onClick={() => dispatch(addPaymentMethod(option.value))}
                        >
                            <FormControlLabel
                                value={option.value}
                                control={<Radio sx={{ color: option.color, '&.Mui-checked': { color: option.color } }} />}
                                label={
                                    <div>
                                        <span className='font-semibold text-gray-800'>{option.label}</span>
                                        <p className='text-xs text-gray-500 mt-0.5'>{option.description}</p>
                                    </div>
                                }
                                className='w-full m-0'
                            />
                        </div>
                    ))}
                </RadioGroup>
            </FormControl>
        </div>
    );
};

export default PaymentMethod;
