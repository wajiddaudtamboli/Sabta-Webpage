import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex-shrink-0">
                <div className="p-4 text-xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>
                <nav className="mt-4">
                    <Link to="/admin/dashboard" className="block p-4 hover:bg-gray-700">Dashboard</Link>
                    <Link to="/admin/products" className="block p-4 hover:bg-gray-700">Products</Link>
                    <Link to="/admin/blogs" className="block p-4 hover:bg-gray-700">Blogs</Link>
                    <Link to="/admin/pages" className="block p-4 hover:bg-gray-700">Pages</Link>
                    <Link to="/admin/enquiries" className="block p-4 hover:bg-gray-700">Enquiries</Link>
                    <Link to="/admin/media" className="block p-4 hover:bg-gray-700">Media</Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full text-left hover:text-red-400">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
