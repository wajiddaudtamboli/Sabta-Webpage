import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Pages = () => {
    const [selectedPage, setSelectedPage] = useState('home');
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const pages = [
        { id: 'home', name: 'Home Page', icon: '🏠' },
        { id: 'about', name: 'About Page', icon: '📄' },
        { id: 'contact', name: 'Contact Page', icon: '📞' },
    ];

    useEffect(() => {
        fetchPageData(selectedPage);
    }, [selectedPage]);

    const fetchPageData = async (pageName) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.get(`/pages/${pageName}`);
            setPageData(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setPageData({ name: pageName, content: {} });
            } else {
                console.error('Error fetching page:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/pages/${selectedPage}`, pageData);
            setMessage({ type: 'success', text: 'Page saved successfully!' });
        } catch (err) {
            console.error('Error saving page:', err);
            setMessage({ type: 'error', text: 'Error saving page' });
        } finally {
            setSaving(false);
        }
    };

    const handleContentChange = (key, value) => {
        setPageData({
            ...pageData,
            content: {
                ...pageData.content,
                [key]: value
            }
        });
    };

    const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
        <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">{label}</label>
            <input
                type={type}
                className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );

    const TextAreaField = ({ label, value, onChange, rows = 4, placeholder = '' }) => (
        <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">{label}</label>
            <textarea
                className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none resize-none"
                rows={rows}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-8">Page Manager</h1>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Page Selector */}
                <div className="bg-[#2a2a2a] rounded border border-gray-700 p-4">
                    <h2 className="text-lg font-semibold mb-4 text-[#d4a853]">Select Page</h2>
                    <div className="space-y-2">
                        {pages.map(page => (
                            <button
                                key={page.id}
                                onClick={() => setSelectedPage(page.id)}
                                className={`w-full text-left p-3 rounded transition-colors cursor-pointer ${
                                    selectedPage === page.id 
                                        ? 'bg-[#d4a853] text-black' 
                                        : 'bg-[#1a1a1a] hover:bg-[#3a3a3a] text-white'
                                }`}
                            >
                                <span className="mr-2">{page.icon}</span>
                                {page.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Page Editor */}
                <div className="lg:col-span-3 bg-[#2a2a2a] rounded border border-gray-700 p-6">
                    {loading ? (
                        <div className="text-center text-gray-400 py-8">Loading...</div>
                    ) : pageData && (
                        <>
                            <h2 className="text-xl font-semibold mb-6 text-[#d4a853] capitalize">
                                Edit {selectedPage} Page
                            </h2>
                            <form onSubmit={handleSave}>
                                {selectedPage === 'home' && (
                                    <>
                                        <InputField
                                            label="Hero Title"
                                            value={pageData.content.heroText}
                                            onChange={(e) => handleContentChange('heroText', e.target.value)}
                                            placeholder="Enter hero title..."
                                        />
                                        <InputField
                                            label="Hero Subtitle"
                                            value={pageData.content.subText}
                                            onChange={(e) => handleContentChange('subText', e.target.value)}
                                            placeholder="Enter subtitle..."
                                        />
                                        <InputField
                                            label="Banner Image URL"
                                            value={pageData.content.bannerImage}
                                            onChange={(e) => handleContentChange('bannerImage', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <TextAreaField
                                            label="Welcome Section Text"
                                            value={pageData.content.welcomeText}
                                            onChange={(e) => handleContentChange('welcomeText', e.target.value)}
                                            rows={4}
                                            placeholder="Enter welcome text..."
                                        />
                                    </>
                                )}

                                {selectedPage === 'about' && (
                                    <>
                                        <InputField
                                            label="Page Title"
                                            value={pageData.content.title}
                                            onChange={(e) => handleContentChange('title', e.target.value)}
                                            placeholder="About Us"
                                        />
                                        <TextAreaField
                                            label="Company Description"
                                            value={pageData.content.description}
                                            onChange={(e) => handleContentChange('description', e.target.value)}
                                            rows={6}
                                            placeholder="Enter company description..."
                                        />
                                        <TextAreaField
                                            label="Our Mission"
                                            value={pageData.content.mission}
                                            onChange={(e) => handleContentChange('mission', e.target.value)}
                                            rows={4}
                                            placeholder="Enter mission statement..."
                                        />
                                        <TextAreaField
                                            label="Our Vision"
                                            value={pageData.content.vision}
                                            onChange={(e) => handleContentChange('vision', e.target.value)}
                                            rows={4}
                                            placeholder="Enter vision statement..."
                                        />
                                    </>
                                )}

                                {selectedPage === 'contact' && (
                                    <>
                                        <InputField
                                            label="Page Title"
                                            value={pageData.content.title}
                                            onChange={(e) => handleContentChange('title', e.target.value)}
                                            placeholder="Contact Us"
                                        />
                                        <InputField
                                            label="Address"
                                            value={pageData.content.address}
                                            onChange={(e) => handleContentChange('address', e.target.value)}
                                            placeholder="Enter address..."
                                        />
                                        <InputField
                                            label="Phone Number"
                                            value={pageData.content.phone}
                                            onChange={(e) => handleContentChange('phone', e.target.value)}
                                            placeholder="+91 xxxxxxxxxx"
                                        />
                                        <InputField
                                            label="Email"
                                            value={pageData.content.email}
                                            onChange={(e) => handleContentChange('email', e.target.value)}
                                            placeholder="info@example.com"
                                        />
                                        <InputField
                                            label="Google Maps Embed URL"
                                            value={pageData.content.mapUrl}
                                            onChange={(e) => handleContentChange('mapUrl', e.target.value)}
                                            placeholder="https://www.google.com/maps/embed?..."
                                        />
                                    </>
                                )}

                                <div className="mt-6">
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="px-6 py-3 bg-[#d4a853] text-black font-semibold rounded hover:bg-[#c49743] transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pages;
