import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaStore } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-gray-300'>
            <div className='lg:px-14 sm:px-8 px-4 py-10'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>

                    {/* Brand */}
                    <div>
                        <div className='flex items-center text-white text-xl font-bold mb-3'>
                            <FaStore className='mr-2 text-2xl' />
                            <span>SabaikoPasal</span>
                        </div>
                        <p className='text-sm text-gray-400'>
                            Your one-stop destination for quality products.
                            Shop with confidence and convenience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-white font-semibold mb-3'>Quick Links</h3>
                        <ul className='space-y-2 text-sm'>
                            <li><Link to='/' className='hover:text-white transition-colors'>Home</Link></li>
                            <li><Link to='/products' className='hover:text-white transition-colors'>Products</Link></li>
                            <li><Link to='/about' className='hover:text-white transition-colors'>About Us</Link></li>
                            <li><Link to='/contact' className='hover:text-white transition-colors'>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className='text-white font-semibold mb-3'>Contact Us</h3>
                        <ul className='space-y-2 text-sm'>
                            <li className='flex items-center gap-2'>
                                <FaPhone className='text-blue-400 shrink-0' />
                                <span>+977-9860367832</span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <FaEnvelope className='text-blue-400 shrink-0' />
                                <span>khadkan855@gmail.com</span>
                            </li>
                            <li className='flex items-start gap-2'>
                                <FaMapMarkerAlt className='text-blue-400 shrink-0 mt-0.5' />
                                <span>Bhaktapur, Thimi, Nepal</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='border-t border-gray-800 py-4 text-center text-sm text-gray-500'>
                © {new Date().getFullYear()} SabaikoPasal. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
