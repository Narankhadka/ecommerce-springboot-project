import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLockReset } from 'react-icons/md';
import api from '../../api/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: email.trim(), role: 'user' });
            setSubmitted(true);
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className='min-h-[calc(100vh-64px)] flex justify-center items-center'>
                <div className='sm:w-[450px] w-[360px] shadow-custom py-10 sm:px-8 px-4 rounded-md text-center'>
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                    </div>
                    <h2 className='text-xl font-bold text-slate-800 mb-2'>Check your inbox</h2>
                    <p className='text-sm text-gray-500 mb-6'>
                        If <span className='font-medium text-slate-700'>{email}</span> is registered,
                        a password reset link has been sent. The link expires in 15 minutes.
                    </p>
                    <Link
                        to='/login'
                        className='text-sm font-semibold underline text-slate-700 hover:text-black'
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-[calc(100vh-64px)] flex justify-center items-center'>
            <form
                onSubmit={handleSubmit}
                className='sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md'
            >
                <div className='flex flex-col items-center justify-center space-y-4 mb-5'>
                    <MdLockReset className='text-slate-800 text-5xl' />
                    <h1 className='text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold'>
                        Forgot Password
                    </h1>
                    <p className='text-sm text-gray-500 text-center'>
                        Enter your email address and we'll send you a reset link.
                    </p>
                </div>

                <hr className='mb-5 text-black' />

                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-semibold text-slate-700' htmlFor='fp-email'>
                            Email Address <span className='text-red-500'>*</span>
                        </label>
                        <input
                            id='fp-email'
                            type='email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                        />
                    </div>

                    {error && (
                        <p className='text-red-500 text-sm'>{error}</p>
                    )}
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='bg-button-gradient font-semibold text-white w-full py-2 rounded-xs my-5 hover:text-slate-300 transition-colors duration-100 disabled:opacity-60'
                >
                    {loading ? 'Sending…' : 'Send Reset Link'}
                </button>

                <p className='text-center text-sm text-slate-700'>
                    Remember your password?{' '}
                    <Link className='font-semibold underline hover:text-black' to='/login'>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
