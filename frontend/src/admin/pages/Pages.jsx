import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Pages = () => {
    const [selectedPage, setSelectedPage] = useState('home');
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPageData(selectedPage);
    }, [selectedPage]);

    const fetchPageData = async (pageName) => {
        setLoading(true);
        try {
            const res = await api.get(`/pages/${pageName}`);
            setPageData(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                // Page doesn't exist yet, set empty defaults
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
        try {
            await api.put(`/pages/${selectedPage}`, pageData);
            alert('Page saved successfully');
        } catch (err) {
            console.error('Error saving page:', err);
            alert('Error saving page');
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Page Manager</h1>

            <div className="mb-6">
                <label className="mr-4 font-semibold">Select Page:</label>
                <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="home">Home</option>
                    <option value="about">About</option>
                </select>
            </div>

            {pageData && (
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-4 capitalize">{selectedPage} Page Content</h2>
                    <form onSubmit={handleSave}>
                        {selectedPage === 'home' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Hero Text</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={pageData.content.heroText || ''}
                                        onChange={(e) => handleContentChange('heroText', e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Sub Text</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={pageData.content.subText || ''}
                                        onChange={(e) => handleContentChange('subText', e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Banner Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={pageData.content.bannerImage || ''}
                                        onChange={(e) => handleContentChange('bannerImage', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {selectedPage === 'about' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Company Description</label>
                                    <textarea
                                        className="w-full p-2 border rounded h-32"
                                        value={pageData.content.description || ''}
                                        onChange={(e) => handleContentChange('description', e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Mission</label>
                                    <textarea
                                        className="w-full p-2 border rounded h-24"
                                        value={pageData.content.mission || ''}
                                        onChange={(e) => handleContentChange('mission', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Pages;
