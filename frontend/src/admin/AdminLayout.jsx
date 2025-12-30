import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';


const DashboardIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const ProductsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const ProjectsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
);

const BlogsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const PagesIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const EnquiriesIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const MediaIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const CataloguesIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="12" y1="6" x2="16" y2="6" />
        <line x1="12" y1="10" x2="16" y2="10" />
    </svg>
);

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;

    const closeSidebar = () => setSidebarOpen(false);

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { path: '/admin/products', label: 'Products', icon: <ProductsIcon /> },
        { path: '/admin/projects', label: 'Projects', icon: <ProjectsIcon /> },
        { path: '/admin/catalogues', label: 'Catalogues', icon: <CataloguesIcon /> },
        { path: '/admin/blogs', label: 'Blogs', icon: <BlogsIcon /> },
        { path: '/admin/pages', label: 'Pages', icon: <PagesIcon /> },
        { path: '/admin/enquiries', label: 'Enquiries', icon: <EnquiriesIcon /> },
        { path: '/admin/media', label: 'Media', icon: <MediaIcon /> },
        { path: '/admin/settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
        <div className="admin-panel flex min-h-screen bg-[#1a1a1a] relative">
            {}
            {sidebarOpen && (
                <div 
                    className="admin-overlay show md:hidden" 
                    onClick={closeSidebar}
                />
            )}
            
            {}
            <div className="md:hidden bg-[#2a2a2a] text-white p-4 flex justify-between items-center">
                <span className="text-lg font-bold">
                    <span className="text-[#d4a853]">SABTA</span>
                    <span className="text-white"> GRANITE</span>
                </span>
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="text-white text-2xl"
                >
                    ☰
                </button>
            </div>

            {}
            <div className={`admin-sidebar w-64 bg-[#2a2a2a] text-white shrink-0 flex flex-col md:relative md:translate-x-0 ${sidebarOpen ? 'open' : ''}`}>
                {}
                <div className="p-4 border-b border-gray-700">
                    <div className="text-center">
                        <span className="text-2xl font-bold">
                            <span className="text-[#d4a853]">SABTA</span>
                            <span className="text-white"> GRANITE</span>
                        </span>
                        <p className="text-xs text-gray-400 mt-1">Admin Portal</p>
                    </div>
                </div>

                {}
                <nav className="flex-1 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                                isActive(item.path)
                                    ? 'bg-[#d4a853] text-black'
                                    : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {}
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-[#3a3a3a] rounded transition-colors cursor-pointer"
                    >
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {}
            <div className="admin-content flex-1 overflow-auto md:ml-0">
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
