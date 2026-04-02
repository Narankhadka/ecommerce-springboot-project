import { useDispatch, useSelector } from "react-redux";
import HeroBanner from "./HeroBanner";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../store/actions";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import { FaExclamationTriangle } from "react-icons/fa";
import api from "../../api/api";

const Home = () => {
    const dispatch = useDispatch();
    const {products} = useSelector((state) => state.products);
    const { isLoading, errorMessage } = useSelector(
        (state) => state.errors
    );
    const [homepageRecs, setHomepageRecs] = useState([]);
    const [recsLoading, setRecsLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setRecsLoading(true);
        api.get("/public/products/top-selling")
            .then(res => {
                const topProducts = res.data;
                if (!topProducts || topProducts.length === 0) {
                    setHomepageRecs([]);
                    return;
                }
                const firstId = topProducts[0].productId;
                return api.get(`/public/products/${firstId}/recommendations`);
            })
            .then(res => {
                if (res) setHomepageRecs((res.data || []).slice(0, 8));
            })
            .catch(() => setHomepageRecs([]))
            .finally(() => setRecsLoading(false));
    }, []);
    return (
        <div className="lg:px-14 sm:px-8 px-4">
            <div className="py-6">
                <HeroBanner />
            </div>
            
            <div className="py-5">
                <div className="flex flex-col justify-center items-center space-y-2">
                    <h1 className="text-slate-800 text-4xl font-bold"> Products</h1>
                        <span className="text-slate-700">
                            Discover our handpicked selection of top-rated items just for you!
                        </span>
                    
                </div>

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
            <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                       {products && 
                       products?.slice(0,4)
                                .map((item, i) => <ProductCard key={i} {...item} />
                        )}
                    </div>
                    )}
            </div>

            {(recsLoading || homepageRecs.length > 0) && (
                <div className="py-5">
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <h1 className="text-slate-800 text-4xl font-bold">Recommended For You</h1>
                        <span className="text-slate-700">Based on popular purchases</span>
                    </div>

                    {recsLoading ? (
                        <div className="flex justify-center items-center h-[200px]">
                            <div className="w-8 h-8 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                            {homepageRecs.map((item, i) => (
                                <ProductCard key={i} {...item} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Home;