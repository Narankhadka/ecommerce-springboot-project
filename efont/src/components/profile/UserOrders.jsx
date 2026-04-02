import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../../store/actions';
import { formatNPR } from '../../utils/formatPrice';

const statusColors = {
    Placed: 'bg-blue-100 text-blue-700',
    Accepted: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-purple-100 text-purple-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const TIMELINE_STEPS = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const getStepIndex = (status) => {
    if (status === 'Accepted') return 0;
    return TIMELINE_STEPS.indexOf(status);
};

const OrderTimeline = ({ status }) => {
    if (status === 'Cancelled') {
        return (
            <div className='mt-4 pt-3 border-t'>
                <p className='text-red-500 font-semibold text-sm text-center'>Order Cancelled</p>
            </div>
        );
    }

    const currentIndex = getStepIndex(status);

    return (
        <div className='mt-4 pt-3 border-t'>
            <div className='flex items-start'>
                {TIMELINE_STEPS.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className='flex flex-col items-center'>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                                index < currentIndex
                                    ? 'bg-green-500 border-green-500'
                                    : index === currentIndex
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-white border-gray-300'
                            }`}>
                                {index <= currentIndex ? (
                                    <svg
                                        className='w-4 h-4 text-white'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={3}
                                            d='M5 13l4 4L19 7'
                                        />
                                    </svg>
                                ) : (
                                    <span className='text-gray-400 text-xs font-semibold'>{index + 1}</span>
                                )}
                            </div>
                            <span className={`text-xs mt-1 text-center w-16 leading-tight ${
                                index <= currentIndex ? 'text-green-600 font-semibold' : 'text-gray-400'
                            }`}>
                                {step}
                            </span>
                        </div>

                        {index < TIMELINE_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mt-3.5 mx-1 ${
                                index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const UserOrders = () => {
    const dispatch = useDispatch();
    const { userOrders, userOrdersLoading, userOrdersError } = useSelector((s) => s.order);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    if (userOrdersLoading) {
        return (
            <div className='min-h-[60vh] flex items-center justify-center'>
                <p className='text-gray-500'>Loading your orders...</p>
            </div>
        );
    }

    if (userOrdersError) {
        return (
            <div className='min-h-[60vh] flex items-center justify-center'>
                <p className='text-red-500'>{userOrdersError}</p>
            </div>
        );
    }

    if (!userOrders || userOrders.length === 0) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center gap-3'>
                <p className='text-gray-500 text-lg'>You have no orders yet.</p>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto px-4 py-10'>
            <h1 className='text-2xl font-bold mb-6'>My Orders</h1>
            <div className='flex flex-col gap-5'>
                {userOrders.map((order) => (
                    <div key={order.orderId} className='border rounded-lg shadow-sm bg-white p-5'>
                        <div className='flex flex-wrap justify-between items-center mb-3 gap-2'>
                            <div>
                                <span className='text-sm text-gray-500'>Order #</span>
                                <span className='font-semibold ml-1'>{order.orderId}</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <span className='text-sm text-gray-500'>{order.orderDate}</span>
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                        statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>

                        <div className='divide-y'>
                            {order.orderItems?.map((item) => (
                                <div key={item.orderItemId} className='flex items-center gap-4 py-3'>
                                    {item.product?.image && (
                                        <img
                                            src={
                                                item.product.image?.startsWith('http')
                                                    ? item.product.image
                                                    : `${import.meta.env.VITE_BACK_END_URL}/images/${item.product.image}`
                                            }
                                            alt={item.product.productName}
                                            className='w-16 h-16 object-cover rounded'
                                        />
                                    )}
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium truncate'>
                                            {item.product?.productName || 'Product'}
                                        </p>
                                        <p className='text-sm text-gray-500'>
                                            Qty: {item.quantity} &nbsp;&middot;&nbsp; {formatNPR(item.orderedProductPrice)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-between items-center mt-3 pt-3 border-t'>
                            <span className='text-sm text-gray-500'>
                                Payment: {order.payment?.paymentMethod}
                            </span>
                            <span className='font-semibold'>
                                Total: {formatNPR(order.totalAmount)}
                            </span>
                        </div>

                        <OrderTimeline status={order.orderStatus} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;
