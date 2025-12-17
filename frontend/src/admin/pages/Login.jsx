import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('adminToken', res.data.token);
            if (rememberMe) {
                localStorage.setItem('rememberEmail', email);
            }
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-panel min-h-screen flex relative">
            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-[#1a1a1a]/80 hover:bg-[#d4a853] text-white hover:text-black rounded-lg transition-all duration-300 backdrop-blur-sm border border-gray-700 hover:border-[#d4a853]"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Home</span>
            </Link>

            {/* Left Side - Branding */}
            <div className="hidden md:flex md:w-1/2 bg-[#1a1a1a] items-center justify-center flex-col p-8">
                <div className="relative">
                    <img 
                        src="https://res.cloudinary.com/duhhsnbwh/image/upload/v1765988869/Sabta_logo_gkgjla.jpg" 
                        alt="SABTA Logo" 
                        className="w-64 h-64 object-contain rounded-full"
                    />
                </div>
                <h2 className="mt-8 text-2xl tracking-wide">
                    <span className="text-[#d4a853]">SABTA</span>
                    <span className="text-white"> GRANITE & MARBLES TRADING</span>
                </h2>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 bg-[#2a2a2a] flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-center mb-8">
                        <span className="text-[#d4a853]">SABTA GRANITE</span>
                        <span className="text-white"> Website Portal</span>
                    </h1>

                    <h2 className="text-white text-2xl mb-6 font-serif">Sign In</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 bg-white text-gray-800 rounded border-none outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 bg-white text-gray-800 rounded border-none outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between mb-6 text-sm">
                            <label className="flex items-center text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2 accent-[#d4a853]"
                                />
                                Remember Me
                            </label>
                            <a href="#" className="text-white hover:text-[#d4a853] transition-colors">
                                Forgot Your Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#d4a853] text-black font-bold text-lg rounded hover:bg-[#c49743] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
