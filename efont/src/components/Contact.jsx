import { useState } from 'react';
import { FaEnvelope, FaMapMarkedAlt, FaPhone } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: "12f77b9c-1b1c-4ae4-9e88-e1835a9a723f",
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            }
        );

        const result = await response.json();
        setLoading(false);

        if (result.success) {
            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
        } else {
            setStatus("error");
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-12'>
            <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-lg'>
                <h1 className='text-4xl font-bold text-center mb-6'>Contact Us</h1>
                <p className='text-gray-600 text-center mb-4'>
                    We would love to hear from you! Fill out the form or reach us directly.
                </p>

                {status === "success" && (
                    <div className='bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-center'>
                        Message sent successfully! We will get back to you soon.
                    </div>
                )}

                {status === "error" && (
                    <div className='bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-center'>
                        Something went wrong. Please try again.
                    </div>
                )}

                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Name</label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Email</label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Message</label>
                        <textarea
                            name='message'
                            value={formData.message}
                            onChange={handleChange}
                            rows='4'
                            required
                            className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50'
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>

                <div className='mt-8 text-center'>
                    <h2 className='text-lg font-semibold'>Contact Information</h2>
                    <div className='flex flex-col items-center space-y-2 mt-4'>
                        <div className='flex items-center'>
                            <FaPhone className='text-blue-500 mr-2' />
                            <span className='text-gray-600'>+977-9860367832</span>
                        </div>
                        <div className='flex items-center'>
                            <FaEnvelope className='text-blue-500 mr-2' />
                            <span className='text-gray-600'>khadkan855@gmail.com</span>
                        </div>
                        <div className='flex items-center'>
                            <FaMapMarkedAlt className='text-blue-500 mr-2' />
                            <span className='text-gray-600'>Bhaktapur, Thimi, Nepal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;