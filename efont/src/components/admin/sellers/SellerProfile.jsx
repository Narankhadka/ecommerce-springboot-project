import { useEffect, useState } from 'react';
import api from '../../../api/api';
import Loader from '../../shared/Loader';
import toast from 'react-hot-toast';

const SellerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [shopName, setShopName] = useState('');
    const [shopLocation, setShopLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        api.get('/seller/profile')
            .then(({ data }) => {
                setProfile(data);
                setShopName(data.shopName || '');
                setShopLocation(data.shopLocation || '');
                setPhoneNumber(data.phoneNumber || '');
            })
            .catch(() => toast.error('Failed to load profile'))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);
        api.put('/seller/profile', { shopName, shopLocation, phoneNumber })
            .then(({ data }) => {
                setProfile(data);
                toast.success('Profile updated successfully');
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || 'Failed to update profile');
            })
            .finally(() => setSaving(false));
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Seller Profile</h1>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">

                {/* Read-only fields */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            Username
                        </label>
                        <p className="text-slate-800 font-medium">{profile?.userName}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            Email
                        </label>
                        <p className="text-slate-800 font-medium">{profile?.email}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            Assigned Category
                        </label>
                        {profile?.assignedCategoryName ? (
                            <span className="inline-block w-fit bg-blue-100 text-blue-700 border border-blue-300 text-sm font-semibold px-3 py-1 rounded-full">
                                {profile.assignedCategoryName}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-400 italic">
                                No category assigned. Contact admin.
                            </span>
                        )}
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Editable fields */}
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-800">
                            Shop Name
                        </label>
                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="Enter your shop name"
                            className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 bg-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-800">
                            Shop Location
                        </label>
                        <input
                            type="text"
                            value={shopLocation}
                            onChange={(e) => setShopLocation(e.target.value)}
                            placeholder="Enter your shop location"
                            className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 bg-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-800">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 bg-transparent"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-md text-sm transition-colors disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerProfile;
