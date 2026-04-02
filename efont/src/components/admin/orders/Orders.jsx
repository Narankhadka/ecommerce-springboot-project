import React from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import OrderTable from './OrderTable';
import { useDispatch, useSelector } from 'react-redux';
import useOrderFilter from '../../../hooks/useOrderFilter';
import { checkIsAdmin } from '../../../utils/authUtils';
import { getOrdersForDashboard } from '../../../store/actions';
import api from '../../../api/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const { adminOrder, pagination } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = checkIsAdmin(user);
  const dispatch = useDispatch();

  useOrderFilter();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/seller/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      dispatch(getOrdersForDashboard("", false));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order status");
    }
  };

  const emptyOrder = !adminOrder || adminOrder?.length === 0;
  return (
    <div className='pb-6 pt-20'>
      {emptyOrder ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaShoppingCart size={50} className='mb-3' />
          <h2 className='text-2xl font-semibold'>No Orders Placed Yet</h2>
        </div>
      ) : (
        <OrderTable
          adminOrder={adminOrder}
          pagination={pagination}
          isAdmin={isAdmin}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

export default Orders
