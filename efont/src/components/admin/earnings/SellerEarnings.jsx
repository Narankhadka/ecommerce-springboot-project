import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../../api/api';
import { formatNPR } from '../../../utils/formatPrice';
import Loader from '../../shared/Loader';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const statusColors = {
    Placed: 'bg-blue-100 text-blue-700',
    Accepted: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-purple-100 text-purple-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const SummaryCard = ({ title, value, isCurrency, colorClass }) => (
    <div className={`rounded-xl p-5 flex flex-col gap-2 shadow-sm border ${colorClass}`}>
        <p className='text-sm font-medium opacity-80'>{title}</p>
        <p className='text-2xl font-bold'>
            {isCurrency ? formatNPR(value ?? 0) : (value ?? 0)}
        </p>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm'>
                <p className='font-semibold text-gray-700 mb-1'>{label}</p>
                <p className='text-blue-600'>{formatNPR(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

const buildFilterSummary = (year, month, day) => {
    if (!year) return null;
    const monthName = month ? MONTH_NAMES[month - 1] : null;
    if (day && monthName) return `${day} ${monthName} ${year}`;
    if (monthName) return `${monthName} ${year}`;
    return `${year}`;
};

const currentYear = new Date().getFullYear();
const yearOptions = [];
for (let y = currentYear; y >= 2023; y--) {
    yearOptions.push(y);
}

const SellerEarnings = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [appliedYear, setAppliedYear] = useState('');
    const [appliedMonth, setAppliedMonth] = useState('');
    const [appliedDay, setAppliedDay] = useState('');

    const fetchEarnings = (year, month, day) => {
        setLoading(true);
        setError(null);
        const params = {};
        if (year) params.year = year;
        if (month) params.month = month;
        if (day) params.day = day;
        api.get('/seller/earnings', { params })
            .then(res => setData(res.data))
            .catch(err => setError(err?.response?.data?.message || 'Failed to load earnings'))
            .finally(() => setLoading(false));
    };

    // Initial fetch on mount — no filters
    useState(() => {
        fetchEarnings('', '', '');
    });

    const handleApplyFilter = () => {
        setAppliedYear(selectedYear);
        setAppliedMonth(selectedMonth);
        setAppliedDay(selectedDay);
        fetchEarnings(selectedYear, selectedMonth, selectedDay);
    };

    const handleClearFilter = () => {
        setSelectedYear('');
        setSelectedMonth('');
        setSelectedDay('');
        setAppliedYear('');
        setAppliedMonth('');
        setAppliedDay('');
        fetchEarnings('', '', '');
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setSelectedMonth('');
        setSelectedDay('');
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setSelectedDay('');
    };

    const filterSummary = buildFilterSummary(appliedYear, appliedMonth, appliedDay);

    const dropdownStyle = {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        minWidth: '140px',
        backgroundColor: '#fff',
        color: '#1e293b',
        outline: 'none',
    };

    const disabledDropdownStyle = {
        ...dropdownStyle,
        backgroundColor: '#f9fafb',
        color: '#9ca3af',
        cursor: 'not-allowed',
    };

    if (loading) return <Loader />;
    if (error) return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <p className='text-red-500'>{error}</p>
        </div>
    );

    const sortedProducts = [...(data.productEarnings || [])].sort(
        (a, b) => b.totalEarned - a.totalEarned
    );

    return (
        <div className='max-w-6xl mx-auto py-8 space-y-8'>
            <h1 className='text-2xl font-bold text-slate-800'>Earnings Overview</h1>

            {/* Date Filter */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
                <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={dropdownStyle}
                >
                    <option value=''>All Years</option>
                    {yearOptions.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    disabled={!selectedYear}
                    style={selectedYear ? dropdownStyle : disabledDropdownStyle}
                >
                    <option value=''>All Months</option>
                    {MONTH_NAMES.map((name, i) => (
                        <option key={i + 1} value={i + 1}>{name}</option>
                    ))}
                </select>

                <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    disabled={!selectedMonth}
                    style={selectedMonth ? dropdownStyle : disabledDropdownStyle}
                >
                    <option value=''>All Days</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <button
                    onClick={handleApplyFilter}
                    className='bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors'
                >
                    Apply Filter
                </button>

                {(appliedYear || appliedMonth || appliedDay) && (
                    <button
                        onClick={handleClearFilter}
                        className='border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold py-2 px-4 rounded-lg text-sm transition-colors'
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {/* Filter Summary */}
            {filterSummary && (
                <div className='text-sm text-slate-600 font-medium -mt-4'>
                    Showing earnings for: <span className='text-blue-600 font-semibold'>{filterSummary}</span>
                </div>
            )}

            {/* SECTION 1 — Summary Cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                <SummaryCard
                    title='Total Earnings'
                    value={data.totalEarnings}
                    isCurrency
                    colorClass='bg-slate-50 border-slate-200 text-slate-800'
                />
                <SummaryCard
                    title='Received'
                    value={data.receivedEarnings}
                    isCurrency
                    colorClass='bg-green-50 border-green-200 text-green-800'
                />
                <SummaryCard
                    title='Pending'
                    value={data.pendingEarnings}
                    isCurrency
                    colorClass='bg-orange-50 border-orange-200 text-orange-800'
                />
                <SummaryCard
                    title='Total Order Items'
                    value={data.totalOrderCount}
                    isCurrency={false}
                    colorClass='bg-purple-50 border-purple-200 text-purple-800'
                />
            </div>

            {/* SECTION 2 — Monthly Earnings Bar Chart */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='text-lg font-semibold text-slate-700 mb-4'>Monthly Earnings</h2>
                {data.monthlyEarnings && data.monthlyEarnings.length > 0 ? (
                    <ResponsiveContainer width='100%' height={280}>
                        <BarChart
                            data={data.monthlyEarnings}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                            <XAxis
                                dataKey='month'
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `Rs. ${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey='amount' fill='#3b82f6' radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className='text-gray-400 text-sm text-center py-10'>No monthly data yet.</p>
                )}
            </div>

            {/* SECTION 3 — Per Product Earnings */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='text-lg font-semibold text-slate-700 mb-4'>Earnings by Product</h2>
                {sortedProducts.length > 0 ? (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b text-left text-gray-500'>
                                    <th className='pb-3 pr-4 font-medium'>Product Name</th>
                                    <th className='pb-3 pr-4 font-medium text-center'>Units Sold</th>
                                    <th className='pb-3 font-medium text-right'>Total Earned</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {sortedProducts.map((p) => (
                                    <tr key={p.productId} className='hover:bg-gray-50'>
                                        <td className='py-3 pr-4 font-medium text-slate-700'>{p.productName}</td>
                                        <td className='py-3 pr-4 text-center text-gray-600'>{p.totalQuantitySold}</td>
                                        <td className='py-3 text-right font-semibold text-slate-800'>
                                            {formatNPR(p.totalEarned)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className='text-gray-400 text-sm text-center py-6'>No product earnings data yet.</p>
                )}
            </div>

            {/* SECTION 4 — Recent Order Details */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='text-lg font-semibold text-slate-700 mb-4'>Recent Order Details</h2>
                {data.orderDetails && data.orderDetails.length > 0 ? (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='border-b text-left text-gray-500'>
                                    <th className='pb-3 pr-4 font-medium'>Order ID</th>
                                    <th className='pb-3 pr-4 font-medium'>Date</th>
                                    <th className='pb-3 pr-4 font-medium'>Product</th>
                                    <th className='pb-3 pr-4 font-medium text-center'>Qty</th>
                                    <th className='pb-3 pr-4 font-medium text-right'>Amount</th>
                                    <th className='pb-3 font-medium'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {data.orderDetails.map((od, i) => (
                                    <tr key={`${od.orderId}-${i}`} className='hover:bg-gray-50'>
                                        <td className='py-3 pr-4 text-gray-500'>#{od.orderId}</td>
                                        <td className='py-3 pr-4 text-gray-600 whitespace-nowrap'>{od.orderDate}</td>
                                        <td className='py-3 pr-4 font-medium text-slate-700 max-w-[180px] truncate'>{od.productName}</td>
                                        <td className='py-3 pr-4 text-center text-gray-600'>{od.quantity}</td>
                                        <td className='py-3 pr-4 text-right font-semibold text-slate-800'>
                                            {formatNPR(od.amount)}
                                        </td>
                                        <td className='py-3'>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[od.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                                {od.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className='text-gray-400 text-sm text-center py-6'>No order details yet.</p>
                )}
            </div>
        </div>
    );
};

export default SellerEarnings;
