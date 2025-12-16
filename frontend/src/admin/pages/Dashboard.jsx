import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        blogs: 0,
        enquiries: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app, you might have a specific stats endpoint
                // For now, we'll just fetch lists and count (not efficient for large data but okay for start)
                const productsRes = await api.get('/products/admin');
                const blogsRes = await api.get('/blogs/admin');
                const enquiriesRes = await api.get('/enquiries');

                setStats({
                    products: productsRes.data.length,
                    blogs: blogsRes.data.length,
                    enquiries: enquiriesRes.data.length
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Products</h2>
                    <p className="text-4xl font-bold text-blue-600">{stats.products}</p>
                </div>
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Blogs</h2>
                    <p className="text-4xl font-bold text-green-600">{stats.blogs}</p>
                </div>
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Enquiries</h2>
                    <p className="text-4xl font-bold text-purple-600">{stats.enquiries}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
