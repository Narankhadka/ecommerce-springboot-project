import { useEffect, useState } from 'react';
import ProductCard from './shared/ProductCard';
import api from '../api/api';

const About = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/public/products/top-selling')
            .then((res) => setTopProducts(res.data))
            .catch(() => setTopProducts([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className='max-w-7xl mx-auto px-4 py-8'>
            <h1 className='text-slate-800 text-4xl font-bold text-center mb-12'>About Us</h1>

            <div className='flex flex-col lg:flex-row justify-between items-center mb-12 gap-8'>
                <div className='w-full lg:w-1/2 text-center lg:text-left'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-3'>SabaikoPasal</h2>
                    <p className='text-lg mb-4 text-gray-600'>
                        Welcome to our e-commerce store! We are dedicated to providing the best products
                        and services to our customers across Nepal. Our mission is to offer a seamless
                        shopping experience while ensuring the highest quality of our offerings.
                    </p>
                    <p className='text-gray-600'>
                        Based in Bhaktapur, Thimi, Nepal, we believe everyone deserves access to
                        quality products at fair prices — delivered right to your doorstep.
                    </p>
                </div>

                <div className='w-full lg:w-1/2'>
                    <img
                        src='https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'
                        alt='About SabaikoPasal Store'
                        className='w-full h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105'
                    />
                </div>
            </div>

            <div className='py-7 space-y-8'>
                <h1 className='text-slate-800 text-4xl font-bold text-center'>Our Products</h1>

                {loading ? (
                    <div className='text-center text-gray-500 py-8'>Loading...</div>
                ) : topProducts.length === 0 ? (
                    <div className='text-center text-gray-500 py-8'>No products available yet.</div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {topProducts.map((product) => (
                            <ProductCard
                                key={product.productId}
                                productId={product.productId}
                                image={product.image}
                                productName={product.productName}
                                description={product.description}
                                specialPrice={product.specialPrice}
                                price={product.price}
                                quantity={product.quantity}
                                discount={product.discount}
                                about
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default About;
