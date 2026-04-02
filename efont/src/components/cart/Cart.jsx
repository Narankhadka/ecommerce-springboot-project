import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { formatPrice, formatNPR } from "../../utils/formatPrice";
import { useState, useEffect } from "react";
import api from "../../api/api";
import ProductViewModal from "../shared/ProductViewModal";

const Cart = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.carts);
    const newCart = { ...cart };

    const [recommendations, setRecommendations] = useState([]);
    const [recsLoading, setRecsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    newCart.totalPrice = cart?.reduce(
        (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity), 0
    );

    useEffect(() => {
        if (!cart || cart.length === 0) {
            setRecommendations([]);
            return;
        }
        const firstProductId = cart[0]?.productId;
        if (!firstProductId) return;

        setRecsLoading(true);
        api.get(`/public/products/${firstProductId}/recommendations`)
            .then(res => setRecommendations((res.data || []).slice(0, 4)))
            .catch(() => setRecommendations([]))
            .finally(() => setRecsLoading(false));
    }, [cart]);

    const handleViewProduct = (rec) => {
        setSelectedProduct({
            id: rec.productId,
            productName: rec.productName,
            image: rec.image,
            description: rec.description,
            quantity: rec.quantity,
            price: rec.price,
            discount: rec.discount,
            specialPrice: rec.specialPrice,
        });
        setOpenModal(true);
    };

    if (!cart || cart.length === 0) return <CartEmpty />;

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-10">
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <MdShoppingCart size={36} className="text-gray-700" />
                    Your Cart
                </h1>
                <p className="text-lg text-gray-600 mt-2">All your selected items</p>
            </div>

            <div className="grid md:grid-cols-5 grid-cols-4 gap-4 pb-2 font-semibold items-center">
                <div className="md:col-span-2 justify-self-start text-lg text-slate-800 lg:ps-4">
                    Product
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Price
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Quantity
                </div>

                <div className="justify-self-center text-lg text-slate-800">
                    Total
                </div>
            </div>

            <div>
                {cart && cart.length > 0 &&
                    cart.map((item, i) => <ItemContent key={i} {...item}/>)}
            </div>

            <div className="border-t-[1.5px] border-slate-200 py-4 flex sm:flex-row sm:px-0 px-2 flex-col sm:justify-between gap-4">
                <div></div>
                <div className="flex text-sm gap-1 flex-col">
                    <div className="flex justify-between w-full md:text-lg text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>{formatPrice(newCart?.totalPrice)}</span>
                    </div>

                    <p className="text-slate-500">
                        Taxes and shipping calculated at checkout
                    </p>

                    <Link className="w-full flex justify-end" to="/checkout">
                    <button
                        onClick={() => {}}
                        className="font-semibold w-[300px] py-2 px-4 rounded-xs bg-custom-blue text-white flex items-center justify-center gap-2 hover:text-gray-300 transition duration-500">
                        <MdShoppingCart size={20} />
                        Checkout
                    </button>
                    </Link>

                    <Link className="flex gap-2 items-center mt-2 text-slate-500" to="/products">
                        <MdArrowBack />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>

            {/* You Might Also Like — hidden when no recommendations */}
            {(recsLoading || recommendations.length > 0) && (
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e5e7eb' }}>
                    <div className="flex flex-col items-center space-y-1 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
                        <p className="text-gray-500 text-sm">Customers who bought this also loved</p>
                    </div>

                    {recsLoading ? (
                        <div className="flex justify-center py-6">
                            <div className="w-6 h-6 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                            {recommendations.map(rec => (
                                <div
                                    key={rec.productId}
                                    style={{
                                        width: 180,
                                        flexShrink: 0,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 12,
                                        padding: 12,
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                                >
                                    <div style={{ width: '100%', height: 120, overflow: 'hidden', borderRadius: 8, marginBottom: 8, background: '#f9fafb' }}>
                                        <img
                                            src={rec.image?.startsWith('http')
                                                ? rec.image
                                                : `${import.meta.env.VITE_BACK_END_URL}/images/${rec.image}`}
                                            alt={rec.productName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    <p style={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: '#374151',
                                        lineHeight: '1.4',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        marginBottom: 6,
                                    }}>
                                        {rec.productName}
                                    </p>

                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                                        {rec.discount > 0 ? formatNPR(rec.specialPrice) : formatNPR(rec.price)}
                                    </p>

                                    <button
                                        onClick={() => handleViewProduct(rec)}
                                        style={{
                                            width: '100%',
                                            fontSize: 12,
                                            fontWeight: 600,
                                            padding: '6px 0',
                                            border: '1px solid #334155',
                                            borderRadius: 6,
                                            background: 'transparent',
                                            color: '#334155',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        View Product
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedProduct && (
                <ProductViewModal
                    open={openModal}
                    setOpen={setOpenModal}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

export default Cart;
