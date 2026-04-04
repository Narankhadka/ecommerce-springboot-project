import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const COUNTDOWN_SECONDS = 10;
const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatNPR = (amount) =>
    new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

const buildImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${import.meta.env.VITE_BACK_END_URL}/images/${imageUrl}`;
};

const PromoPopup = () => {
    const [promo, setPromo] = useState(null);
    const [visible, setVisible] = useState(false);
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const dismissed = sessionStorage.getItem('promoDismissed');
        if (dismissed) return;

        api.get('/public/promotions/active')
            .then((res) => {
                if (res.data && res.data.promotionId) {
                    setPromo(res.data);
                    setTimeout(() => setVisible(true), 800);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!visible) return;
        setCountdown(COUNTDOWN_SECONDS);
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [visible]);

    const handleClose = () => {
        clearInterval(timerRef.current);
        setVisible(false);
        sessionStorage.setItem('promoDismissed', 'true');
    };

    const handleShopNow = () => {
        clearInterval(timerRef.current);
        if (promo.featuredProductId) {
            localStorage.setItem('openProductId', String(promo.featuredProductId));
        }
        handleClose();
        navigate(promo.shopNowLink || '/products');
    };

    if (!visible || !promo) return null;

    const progress = countdown / COUNTDOWN_SECONDS;
    const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    return (
        <div
            onClick={handleClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: 'rgba(0,0,0,0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    maxWidth: '460px',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
                    animation: 'promoSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                <style>{`
                    @keyframes promoSlideIn {
                        from { opacity: 0; transform: scale(0.85) translateY(20px); }
                        to   { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>

                {/* Close button with countdown ring */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1,
                        background: 'rgba(0,0,0,0.55)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                    }}
                >
                    <svg width="48" height="48" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="24" cy="24" r={RADIUS}
                            fill="none"
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="3"
                        />
                        <circle
                            cx="24" cy="24" r={RADIUS}
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                        />
                    </svg>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', zIndex: 1, lineHeight: 1 }}>
                        {countdown}
                    </span>
                </button>

                {/* LIMITED OFFER badge */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    letterSpacing: '0.1em',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                }}>
                    Limited Offer
                </div>

                {/* Promo image */}
                {promo.imageUrl && (
                    <img
                        src={buildImageUrl(promo.imageUrl)}
                        alt={promo.title}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    />
                )}

                {/* Content */}
                <div style={{ padding: '20px 24px 24px' }}>
                    <h2 style={{
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        color: '#111827',
                        margin: '0 0 6px 0',
                        lineHeight: 1.2,
                    }}>
                        {promo.title}
                    </h2>

                    <p style={{ color: '#6b7280', margin: '0 0 14px 0', lineHeight: '1.5', fontSize: '0.9rem' }}>
                        {promo.message}
                    </p>

                    {/* Featured product */}
                    {promo.featuredProductId && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            backgroundColor: '#f8fafc',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '12px',
                            marginBottom: '14px',
                        }}>
                            {promo.featuredProductImage && (
                                <img
                                    src={buildImageUrl(promo.featuredProductImage)}
                                    alt={promo.featuredProductName}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                        border: '2px solid #e2e8f0',
                                    }}
                                />
                            )}
                            <div>
                                <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', fontSize: '0.9rem' }}>
                                    {promo.featuredProductName}
                                </p>
                                {promo.discountPercentage && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.85rem' }}>
                                            {formatNPR(promo.originalPrice)}
                                        </span>
                                        <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '1rem' }}>
                                            {formatNPR(promo.discountedPrice)}
                                        </span>
                                        <span style={{
                                            backgroundColor: '#fee2e2',
                                            color: '#dc2626',
                                            fontWeight: '700',
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                        }}>
                                            Save {promo.discountPercentage}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Shop Now */}
                    <button
                        onClick={handleShopNow}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            color: 'white',
                            padding: '13px',
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            marginBottom: '8px',
                            letterSpacing: '0.02em',
                            boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
                        }}
                    >
                        Shop Now
                    </button>

                    <button
                        onClick={handleClose}
                        style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                            color: '#9ca3af',
                            padding: '8px',
                            border: 'none',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                        }}
                    >
                        No thanks, continue browsing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoPopup;
