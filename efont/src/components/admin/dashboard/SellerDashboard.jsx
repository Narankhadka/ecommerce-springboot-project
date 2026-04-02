import React, { useEffect, useState } from 'react';
import { FaBoxOpen, FaShoppingCart } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import DashboardOverview from './DashboardOverview';
import Loader from '../../shared/Loader';
import ErrorPage from '../../shared/ErrorPage';
import api from '../../../api/api';

const SellerDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/seller/dashboard')
            .then(({ data }) => {
                setData(data);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || 'Failed to load dashboard');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <Loader />;
    if (error) return <ErrorPage message={error} />;

    return (
        <div>
            <div className='flex md:flex-row mt-8 flex-col lg:justify-between
                border border-slate-400 rounded-lg bg-linear-to-r
                from-blue-50 to-blue-100 shadow-lg'>
                <DashboardOverview
                    title="Total Products"
                    amount={data?.totalProducts ?? 0}
                    Icon={FaBoxOpen}
                />

                <DashboardOverview
                    title="Total Orders"
                    amount={data?.totalOrders ?? 0}
                    Icon={FaShoppingCart}
                />

                <DashboardOverview
                    title="Total Revenue"
                    amount={data?.totalRevenue ?? 0}
                    Icon={MdAttachMoney}
                    revenue
                />
            </div>
        </div>
    );
};

export default SellerDashboard;
