import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { formatNPR } from "../../utils/formatPrice";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";

const StarMini = ({ rating }) => (
    <span className='flex gap-0.5 items-center'>
        {[1,2,3,4,5].map((s) => (
            <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill='currentColor' viewBox='0 0 20 20'>
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/>
            </svg>
        ))}
    </span>
);

const ProductCard = ({
        productId,
        productName,
        image,
        description,
        quantity,
        price,
        discount,
        specialPrice,
        averageRating,
        reviewCount,
        about = false,
}) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();

    const handleProductView = (product) => {
        if (!about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const addToCartHandler = (cartItems) => {
        dispatch(addToCart(cartItems, 1, toast));
    };

    return (
        <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
            <div onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                })
            }}
                    className="relative w-full overflow-hidden aspect-3/2">
                <img
                className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                src={image?.startsWith("http") ? image : `${import.meta.env.VITE_BACK_END_URL}/images/${image}`}
                alt={productName}>
                </img>
                {quantity === 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Out of Stock
                    </span>
                )}
                {quantity > 0 && quantity <= 5 && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Low Stock
                    </span>
                )}
            </div>
            <div className="p-4">
                <h2 onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                })
            }}
                    className="text-lg font-semibold mb-2 cursor-pointer">
                    {truncateText(productName, 50)}
                </h2>
                
                <div className="min-h-20 max-h-20">
                    <p className="text-gray-600 text-sm">
                        {truncateText(description, 80)}
                    </p>
                </div>

                {averageRating != null && (
                    <div className='flex items-center gap-1 mb-2'>
                        <StarMini rating={averageRating} />
                        <span className='text-xs text-gray-500'>{averageRating} ({reviewCount})</span>
                    </div>
                )}

            { !about && (
                <div className="flex items-center justify-between">
                {discount > 0 ? (
                    <div className="flex flex-col">
                        <span className="text-gray-400 line-through">
                            {formatNPR(price)}
                        </span>
                        <span className="text-xl font-bold text-slate-700">
                            {formatNPR(specialPrice)}
                        </span>
                    </div>
                ) : (
                    <span className="text-xl font-bold text-slate-700">
                        {formatNPR(price)}
                    </span>
                )}

                <button
                    disabled={!isAvailable || btnLoader}
                    onClick={() => {
                        if (isAvailable) addToCartHandler({
                            image,
                            productName,
                            description,
                            specialPrice,
                            price,
                            productId,
                            quantity,
                        });
                    }}
                    className={`${isAvailable
                        ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white py-2 px-3 rounded-lg items-center transition-colors duration-300 w-36 flex justify-center`}>
                    <FaShoppingCart className="mr-2"/>
                    {isAvailable ? "Add to Cart" : "Out of Stock"}
                </button>
                </div>
            )}
                
            </div>
            <ProductViewModal 
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </div>
    )
}

export default ProductCard;