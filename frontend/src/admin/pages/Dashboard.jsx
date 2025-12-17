import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        blogs: 0,
        enquiries: 0,
        newEnquiries: 0,
        media: 0
    });
    const [recentEnquiries, setRecentEnquiries] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [productsRes, blogsRes, enquiriesRes, mediaRes] = await Promise.all([
                    api.get('/products/admin'),
                    api.get('/blogs/admin'),
                    api.get('/enquiries'),
                    api.get('/media')
                ]);

                const enquiries = enquiriesRes.data;
                const newEnquiries = enquiries.filter(e => e.status === 'new').length;

                setStats({
                    products: productsRes.data.length,
                    blogs: blogsRes.data.length,
                    enquiries: enquiries.length,
                    newEnquiries,
                    media: mediaRes.data.length
                });

                setRecentEnquiries(enquiries.slice(0, 5));
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, onClick, highlight = false }) => (
        <div 
            onClick={onClick}
            className={`bg-[#2a2a2a] p-6 rounded border border-gray-700 cursor-pointer hover:border-[#d4a853] transition-colors ${highlight ? 'ring-2 ring-[#d4a853]' : ''}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h2>
                    <p className="text-4xl font-bold text-[#d4a853] mt-2">{loading ? '...' : value}</p>
                </div>
                <div className="text-gray-600">{icon}</div>
            </div>
        </div>
    );

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-8">
                <span className="text-[#d4a853]">SABTA GRANITE</span> Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Products" 
                    value={stats.products}
                    onClick={() => navigate('/admin/products')}
                    icon={
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatCard 
                    title="Total Blogs" 
                    value={stats.blogs}
                    onClick={() => navigate('/admin/blogs')}
                    icon={
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    }
                />
                <StatCard 
                    title="Enquiries" 
                    value={stats.enquiries}
                    onClick={() => navigate('/admin/enquiries')}
                    highlight={stats.newEnquiries > 0}
                    icon={
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    }
                />
                <StatCard 
                    title="Media Files" 
                    value={stats.media}
                    onClick={() => navigate('/admin/media')}
                    icon={
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                />
            </div>

            {/* New Enquiries Alert */}
            {stats.newEnquiries > 0 && (
                <div className="bg-blue-900 border border-blue-700 rounded p-4 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="text-blue-300">You have <strong className="text-white">{stats.newEnquiries}</strong> new enquir{stats.newEnquiries === 1 ? 'y' : 'ies'} to review</span>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/enquiries')}
                        className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 cursor-pointer"
                    >
                        View All
                    </button>
                </div>
            )}

            {/* Recent Enquiries */}
            <div className="bg-[#2a2a2a] rounded border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#d4a853]">Recent Enquiries</h2>
                    <button 
                        onClick={() => navigate('/admin/enquiries')}
                        className="text-sm text-gray-400 hover:text-white cursor-pointer"
                    >
                        View All →
                    </button>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : recentEnquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No enquiries yet</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#1a1a1a]">
                            <tr>
                                <th className="p-3 text-left text-sm text-gray-400">Name</th>
                                <th className="p-3 text-left text-sm text-gray-400">Email</th>
                                <th className="p-3 text-left text-sm text-gray-400">Status</th>
                                <th className="p-3 text-left text-sm text-gray-400">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEnquiries.map(enquiry => (
                                <tr key={enquiry._id} className="border-t border-gray-700 hover:bg-[#3a3a3a]">
                                    <td className="p-3">{enquiry.name}</td>
                                    <td className="p-3 text-gray-400">{enquiry.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            enquiry.status === 'new' ? 'bg-blue-900 text-blue-300' :
                                            enquiry.status === 'read' ? 'bg-yellow-900 text-yellow-300' :
                                            'bg-green-900 text-green-300'
                                        }`}>
                                            {enquiry.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-400 text-sm">
                                        {new Date(enquiry.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
