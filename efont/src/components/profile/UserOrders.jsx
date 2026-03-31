import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../../store/actions';
import { formatNPR } from '../../utils/formatPrice';

const statusColors = {
    Accepted: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
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
                <p className='text-gray-500'>Loading your orders…</p>
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
                                            src={item.product.image}
                                            alt={item.product.productName}
                                            className='w-16 h-16 object-cover rounded'
                                        />
                                    )}
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium truncate'>
                                            {item.product?.productName || 'Product'}
                                        </p>
                                        <p className='text-sm text-gray-500'>
                                            Qty: {item.quantity} &nbsp;·&nbsp; {formatNPR(item.orderedProductPrice)}
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;
