import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { FaToggleOn, FaToggleOff, FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../../api/api';
import Loader from '../../shared/Loader';
import DeleteModal from '../../shared/DeleteModal';

const buildImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${import.meta.env.VITE_BACK_END_URL}/images/${imageUrl}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-NP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatNPR = (amount) =>
    new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

// ── Create Promotion Form ─────────────────────────────────────────────────────

const CreatePromotionForm = ({ onCreated, onCancel }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Seller / product
    const [sellers, setSellers] = useState([]);
    const [selectedSellerId, setSelectedSellerId] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        api.get('/auth/sellers')
            .then((res) => setSellers(res.data?.content || res.data || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!selectedSellerId) {
            setProducts([]);
            setSelectedProductId('');
            setSelectedProduct(null);
            return;
        }
        api.get(`/admin/sellers/${selectedSellerId}/products`)
            .then((res) => setProducts(res.data || []))
            .catch(() => setProducts([]));
    }, [selectedSellerId]);

    useEffect(() => {
        if (!selectedProductId) { setSelectedProduct(null); return; }
        const p = products.find((x) => String(x.productId) === String(selectedProductId));
        setSelectedProduct(p || null);
    }, [selectedProductId, products]);

    const discountedPrice =
        selectedProduct && discountPercentage
            ? selectedProduct.price * (1 - Number(discountPercentage) / 100)
            : null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error('Please select a promotion image');
            return;
        }
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', title);
        formData.append('message', message);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        if (selectedSellerId) formData.append('sellerId', selectedSellerId);
        if (selectedProductId) formData.append('featuredProductId', selectedProductId);
        if (discountPercentage) formData.append('discountPercentage', discountPercentage);

        try {
            setLoading(true);
            await api.post('/admin/promotions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Promotion created successfully');
            onCreated();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to create promotion');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 bg-transparent';
    const labelClass = 'text-sm font-semibold text-slate-800 mb-1 block';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className={labelClass}>Title *</label>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Summer Sale"
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>Message *</label>
                <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your promotion..."
                    rows={3}
                    className={inputClass + ' resize-none'}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Start Date *</label>
                    <input
                        required
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>End Date *</label>
                    <input
                        required
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Seller + Product section */}
            <div className="border border-slate-200 rounded-lg p-3 space-y-3 bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Featured Product (optional)</p>

                <div>
                    <label className={labelClass}>Seller</label>
                    <select
                        value={selectedSellerId}
                        onChange={(e) => setSelectedSellerId(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">— Select seller —</option>
                        {sellers.map((s) => (
                            <option key={s.sellerId || s.userId} value={s.sellerId || s.userId}>
                                {s.sellerName || s.userName || s.email}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedSellerId && (
                    <div>
                        <label className={labelClass}>Product</label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">— Select product —</option>
                            {products.map((p) => (
                                <option key={p.productId} value={p.productId}>
                                    {p.productName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedProductId && (
                    <div>
                        <label className={labelClass}>Discount Percentage</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                            placeholder="e.g. 20"
                            className={inputClass}
                        />
                        {selectedProduct && discountPercentage && (
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-600">
                                <span className="line-through text-slate-400">{formatNPR(selectedProduct.price)}</span>
                                <span className="font-bold text-green-600">{formatNPR(discountedPrice)}</span>
                                <span className="bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded">
                                    -{discountPercentage}%
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div>
                <label className={labelClass}>Promotion Image *</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-slate-700"
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 rounded-md object-cover border border-gray-200"
                        style={{ height: '140px', width: '100%', objectFit: 'cover' }}
                    />
                )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold rounded-md bg-custom-blue text-white hover:bg-blue-800 disabled:opacity-60"
                >
                    {loading ? 'Creating...' : 'Create Promotion'}
                </button>
            </div>
        </form>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const AdminPromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoader, setDeleteLoader] = useState(false);

    const fetchPromotions = () => {
        setLoading(true);
        api.get('/admin/promotions')
            .then((res) => setPromotions(res.data || []))
            .catch(() => toast.error('Failed to load promotions'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleToggle = async (id) => {
        try {
            await api.put(`/admin/promotions/${id}/toggle`);
            toast.success('Status updated');
            fetchPromotions();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            setDeleteLoader(true);
            await api.delete(`/admin/promotions/${deleteTarget.promotionId}`);
            toast.success('Promotion deleted');
            setDeleteTarget(null);
            fetchPromotions();
        } catch {
            toast.error('Failed to delete promotion');
        } finally {
            setDeleteLoader(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="pt-6 pb-10 flex justify-end">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors duration-300"
                >
                    <MdAdd className="text-xl" />
                    Create Promotion
                </button>
            </div>

            {loading ? (
                <Loader />
            ) : promotions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-16">
                    <h2 className="text-2xl font-semibold">No promotions yet</h2>
                    <p className="text-sm mt-1">Create your first promotional popup above.</p>
                </div>
            ) : (
                <>
                    <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
                        All Promotions
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {promotions.map((promo) => (
                            <div
                                key={promo.promotionId}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                            >
                                {/* Image thumbnail */}
                                {promo.imageUrl ? (
                                    <img
                                        src={buildImageUrl(promo.imageUrl)}
                                        alt={promo.title}
                                        className="w-full object-cover"
                                        style={{ height: '140px' }}
                                    />
                                ) : (
                                    <div
                                        className="w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
                                        style={{ height: '140px' }}
                                    >
                                        No image
                                    </div>
                                )}

                                <div className="p-4 space-y-2">
                                    {/* Title + active badge */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-slate-800 text-base leading-snug">
                                            {promo.title}
                                        </h3>
                                        <span
                                            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                promo.active
                                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                                    : 'bg-gray-100 text-gray-500 border border-gray-300'
                                            }`}
                                        >
                                            {promo.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 line-clamp-2">{promo.message}</p>

                                    {promo.discountCode && (
                                        <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
                                            Code: {promo.discountCode}
                                        </p>
                                    )}

                                    {promo.featuredProductName && (
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded p-2">
                                            {promo.featuredProductImage && (
                                                <img
                                                    src={buildImageUrl(promo.featuredProductImage)}
                                                    alt={promo.featuredProductName}
                                                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-700 truncate">{promo.featuredProductName}</p>
                                                {promo.discountPercentage && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="text-xs line-through text-slate-400">{formatNPR(promo.originalPrice)}</span>
                                                        <span className="text-xs font-bold text-green-600">{formatNPR(promo.discountedPrice)}</span>
                                                        <span className="text-xs bg-red-100 text-red-600 px-1 rounded">-{promo.discountPercentage}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-400 space-y-0.5">
                                        <p>Start: {formatDate(promo.startDate)}</p>
                                        <p>End: {formatDate(promo.endDate)}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <button
                                            onClick={() => handleToggle(promo.promotionId)}
                                            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${
                                                promo.active
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                                            }`}
                                        >
                                            {promo.active ? (
                                                <FaToggleOn className="text-base" />
                                            ) : (
                                                <FaToggleOff className="text-base" />
                                            )}
                                            {promo.active ? 'Deactivate' : 'Activate'}
                                        </button>

                                        <button
                                            onClick={() => setDeleteTarget(promo)}
                                            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                                        >
                                            <FaTrashAlt className="text-xs" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Create modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Create Promotion
                        </h2>
                        <CreatePromotionForm
                            onCreated={() => {
                                setShowCreateModal(false);
                                fetchPromotions();
                            }}
                            onCancel={() => setShowCreateModal(false)}
                        />
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            <DeleteModal
                open={!!deleteTarget}
                setOpen={() => setDeleteTarget(null)}
                title={`Delete promotion: ${deleteTarget?.title}`}
                onDeleteHandler={handleDeleteConfirm}
                loader={deleteLoader}
            />
        </div>
    );
};

export default AdminPromotions;
