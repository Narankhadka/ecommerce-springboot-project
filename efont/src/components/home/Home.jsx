import HeroBanner from "./HeroBanner";
import { useEffect, useState } from "react";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import { FaExclamationTriangle } from "react-icons/fa";
import api from "../../api/api";

const Home = () => {
    const [randomProducts, setRandomProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setErrorMessage(null);
        api.get("/public/products/random?count=8")
            .then(res => setRandomProducts(res.data || []))
            .catch(() => setErrorMessage("Failed to load products. Please try again."))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="lg:px-14 sm:px-8 px-4">
            <div className="py-6">
                <HeroBanner />
            </div>

            <div className="py-5">
                <div className="flex flex-col justify-center items-center space-y-2">
                    <h1 className="text-slate-800 text-4xl font-bold">Products</h1>
                    <span className="text-slate-700">
                        Discover our handpicked selection of top-rated items just for you!
                    </span>
                </div>

                {isLoading ? (
                    <Loader />
                ) : errorMessage ? (
                    <div className="flex justify-center items-center h-[200px]">
                        <FaExclamationTriangle className="text-slate-800 text-3xl mr-2" />
                        <span className="text-slate-800 text-lg font-medium">
                            {errorMessage}
                        </span>
                    </div>
                ) : (
                    <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                        {randomProducts.map((item, i) => (
                            <ProductCard key={i} {...item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;