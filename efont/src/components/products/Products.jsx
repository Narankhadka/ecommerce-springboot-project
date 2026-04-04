import { FaExclamationTriangle } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../store/actions";
import Filter from "./Filter";
import useProductFilter from "../../hooks/useProductFilter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";
import ProductViewModal from "../shared/ProductViewModal";

const Products = () => {
    const { isLoading, errorMessage } = useSelector(
        (state) => state.errors
    );
    const {products, categories, pagination} = useSelector(
        (state) => state.products
    )
    const dispatch = useDispatch();
    useProductFilter();

    const [autoOpenProduct, setAutoOpenProduct] = useState(null);
    const [autoOpenModal, setAutoOpenModal] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (!products || products.length === 0) return;
        const openId = localStorage.getItem('openProductId');
        if (!openId) return;
        localStorage.removeItem('openProductId');
        const found = products.find((p) => String(p.productId) === String(openId));
        if (found) {
            setAutoOpenProduct({
                id: found.productId,
                productName: found.productName,
                image: found.image,
                description: found.description,
                quantity: found.quantity,
                price: found.price,
                discount: found.discount,
                specialPrice: found.specialPrice,
            });
            setAutoOpenModal(true);
        }
    }, [products]);

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
            <Filter categories={categories ? categories : []}/>
            {isLoading ? (
                <Loader />
            ) : errorMessage ? (
                <div className="flex justify-center items-center h-[200px]">
                    <FaExclamationTriangle className="text-slate-800 text-3xl mr-2"/>
                    <span className="text-slate-800 text-lg font-medium">
                        {errorMessage}
                    </span>
                </div>
            ) : (
                <div className="min-h-[700px]">
                    <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                        {products &&
                            products
                                .filter(item => item && item.productId)
                                .map(item => <ProductCard key={item.productId} {...item} />)
                        }
                    </div>
                    <div className="flex justify-center pt-10">
                        <Paginations
                            numberOfPage = {pagination?.totalPages}
                            totalProducts = {pagination?.totalElements}/>
                    </div>
                </div>
            )}

            <ProductViewModal
                open={autoOpenModal}
                setOpen={setAutoOpenModal}
                product={autoOpenProduct}
            />
        </div>
    )
}

export default Products;