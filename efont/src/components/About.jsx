import ProductCard from './shared/ProductCard';

const products = [
    {
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        productName: 'iPhone 13 Pro Max',
        description:
            'The iPhone 13 Pro Max offers exceptional performance with its A15 Bionic chip, stunning Super Retina XDR display, and advanced camera features for breathtaking photos.',
        specialPrice: 720,
        price: 780,
    },
    {
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
        productName: 'Samsung Galaxy S21',
        description:
            'Experience the brilliance of the Samsung Galaxy S21 with its vibrant AMOLED display, powerful camera, and sleek design that fits perfectly in your hand.',
        specialPrice: 699,
        price: 799,
    },
    {
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
        productName: 'Google Pixel 6',
        description:
            'The Google Pixel 6 boasts cutting-edge AI features, exceptional photo quality, and a stunning display — a perfect choice for Android enthusiasts.',
        price: 599,
        specialPrice: 400,
    },
];

const About = () => {
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
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {products.map((product, index) => (
                        <ProductCard
                            key={index}
                            image={product.image}
                            productName={product.productName}
                            description={product.description}
                            specialPrice={product.specialPrice}
                            price={product.price}
                            about
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
