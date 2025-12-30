import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/api';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Forgot Password States
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotError('');
        setForgotMessage('');
        
        try {
            const res = await api.post('/auth/forgot-password', { email: forgotEmail });
            setForgotMessage(res.data.message);
            if (res.data.resetToken) {
                setResetToken(res.data.resetToken);
                setShowResetForm(true);
            }
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Failed to process request');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setForgotError('Passwords do not match');
            return;
        }
        
        if (newPassword.length < 6) {
            setForgotError('Password must be at least 6 characters');
            return;
        }
        
        setForgotLoading(true);
        setForgotError('');
        
        try {
            const res = await api.post('/auth/reset-password', { 
                token: resetToken, 
                newPassword 
            });
            setForgotMessage(res.data.message);
            setShowResetForm(false);
            setResetToken('');
            // Close modal after 2 seconds
            setTimeout(() => {
                setShowForgotModal(false);
                setForgotMessage('');
                setForgotEmail('');
                setNewPassword('');
                setConfirmPassword('');
            }, 2000);
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setForgotLoading(false);
        }
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
        setForgotEmail('');
        setForgotError('');
        setForgotMessage('');
        setShowResetForm(false);
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="admin-panel min-h-screen flex flex-col md:flex-row relative">
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
                <h2 className="mt-8 text-2xl tracking-wide text-center">
                    <span className="text-[#d4a853]">SABTA</span>
                    <span style={{color: '#ffffff'}}> GRANITE & MARBLES TRADING</span>
                </h2>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 bg-[#2a2a2a] flex items-center justify-center p-6 md:p-8 min-h-screen md:min-h-0">
                <div className="w-full max-w-md pt-16 md:pt-0">
                    <h1 className="text-center mb-8">
                        <span className="text-[#d4a853]">SABTA GRANITE</span>
                        <span style={{color: '#ffffff'}}> Website Portal</span>
                    </h1>

                    <h2 style={{color: '#ffffff'}} className="text-2xl mb-6 font-serif">Sign In</h2>

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
                        <div className="mb-4 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full p-3 pr-12 bg-white text-gray-800 rounded border-none outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between mb-6 text-sm gap-2">
                            <label className="flex items-center cursor-pointer" style={{color: '#ffffff'}}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2 accent-[#d4a853]"
                                />
                                Remember Me
                            </label>
                            <button 
                                type="button"
                                onClick={() => setShowForgotModal(true)}
                                style={{color: '#ffffff'}} 
                                className="hover:text-[#d4a853] transition-colors cursor-pointer bg-transparent border-none"
                            >
                                Forgot Your Password?
                            </button>
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

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#2a2a2a] rounded-xl p-6 w-full max-w-md relative border border-gray-700">
                        <button 
                            onClick={closeForgotModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer bg-transparent border-none"
                        >
                            ✕
                        </button>
                        
                        <h2 style={{color: '#ffffff'}} className="text-xl font-semibold mb-4">
                            {showResetForm ? 'Reset Password' : 'Forgot Password'}
                        </h2>
                        
                        {forgotMessage && (
                            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded mb-4">
                                {forgotMessage}
                            </div>
                        )}
                        
                        {forgotError && (
                            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
                                {forgotError}
                            </div>
                        )}
                        
                        {!showResetForm ? (
                            <form onSubmit={handleForgotPassword}>
                                <p style={{color: '#cccccc'}} className="text-sm mb-4">
                                    Enter your admin email address and we'll help you reset your password.
                                </p>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full p-3 bg-white text-gray-800 rounded border-none outline-none mb-4"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="w-full py-3 bg-[#d4a853] text-black font-bold rounded hover:bg-[#c49743] transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {forgotLoading ? 'Processing...' : 'Send Reset Link'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <p style={{color: '#cccccc'}} className="text-sm mb-4">
                                    Enter your new password below.
                                </p>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full p-3 bg-white text-gray-800 rounded border-none outline-none mb-3"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full p-3 bg-white text-gray-800 rounded border-none outline-none mb-4"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="w-full py-3 bg-[#d4a853] text-black font-bold rounded hover:bg-[#c49743] transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}
                        
                        <button
                            type="button"
                            onClick={closeForgotModal}
                            className="w-full mt-3 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
