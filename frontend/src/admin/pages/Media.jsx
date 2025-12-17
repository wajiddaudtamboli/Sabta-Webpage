import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../api/api';

const Media = () => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await api.get('/media');
            setMediaList(res.data);
        } catch (err) {
            console.error('Error fetching media:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUrl = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        setUploading(true);
        try {
            await api.post('/media', { url, type: 'image' });
            setUrl('');
            fetchMedia();
        } catch (err) {
            console.error('Error adding media:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this media?')) {
            try {
                await api.delete(`/media/${id}`);
                if (selectedMedia?._id === id) setSelectedMedia(null);
                fetchMedia();
            } catch (err) {
                console.error('Error deleting media:', err);
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('URL copied to clipboard!');
    };

    const ActionButton = ({ onClick, children, variant = 'primary', className = '' }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer ${
                variant === 'primary' ? 'bg-[#d4a853] text-black hover:bg-[#c49743]' :
                variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                'bg-gray-600 text-white hover:bg-gray-700'
            } ${className}`}
        >
            {children}
        </button>
    );

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Media Manager</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-2 rounded cursor-pointer ${view === 'grid' ? 'bg-[#d4a853] text-black' : 'bg-[#2a2a2a] text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded cursor-pointer ${view === 'list' ? 'bg-[#d4a853] text-black' : 'bg-[#2a2a2a] text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Add Media Section */}
            <div className="bg-[#2a2a2a] rounded border border-gray-700 p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4 text-[#d4a853]">Add Media</h2>
                <form onSubmit={handleAddUrl} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter image URL..."
                        className="flex-1 p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <ActionButton onClick={() => {}} variant="primary">
                        {uploading ? 'Adding...' : 'Add URL'}
                    </ActionButton>
                </form>
            </div>

            {/* Media Grid/List */}
            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading media...</div>
            ) : mediaList.length === 0 ? (
                <div className="text-center text-gray-400 py-12 bg-[#2a2a2a] rounded border border-gray-700">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No media uploaded yet</p>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {mediaList.map(media => (
                        <div 
                            key={media._id} 
                            className={`bg-[#2a2a2a] rounded border overflow-hidden group cursor-pointer ${
                                selectedMedia?._id === media._id ? 'border-[#d4a853]' : 'border-gray-700'
                            }`}
                            onClick={() => setSelectedMedia(media)}
                        >
                            <div className="aspect-square relative">
                                <img 
                                    src={media.url} 
                                    alt="Media" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=Error'; }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(media.url); }}
                                        className="p-2 bg-[#d4a853] rounded text-black hover:bg-[#c49743] cursor-pointer"
                                        title="Copy URL"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(media._id); }}
                                        className="p-2 bg-red-600 rounded text-white hover:bg-red-700 cursor-pointer"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="text-xs text-gray-400 truncate">{media.url}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#2a2a2a] rounded border border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a]">
                            <tr>
                                <th className="p-4 text-[#d4a853]">Preview</th>
                                <th className="p-4 text-[#d4a853]">URL</th>
                                <th className="p-4 text-[#d4a853]">Type</th>
                                <th className="p-4 text-[#d4a853]">Date Added</th>
                                <th className="p-4 text-[#d4a853]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mediaList.map(media => (
                                <tr key={media._id} className="border-t border-gray-700 hover:bg-[#3a3a3a]">
                                    <td className="p-4">
                                        <img 
                                            src={media.url} 
                                            alt="Preview" 
                                            className="w-16 h-16 object-cover rounded"
                                            onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=Error'; }}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <span className="text-gray-300 text-sm truncate block max-w-xs">{media.url}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs">
                                            {media.type || 'image'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">
                                        {media.createdAt ? new Date(media.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => copyToClipboard(media.url)}
                                                className="p-2 bg-gray-600 rounded text-white hover:bg-gray-700 cursor-pointer"
                                                title="Copy URL"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(media._id)}
                                                className="p-2 bg-red-600 rounded text-white hover:bg-red-700 cursor-pointer"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Selected Media Details */}
            {selectedMedia && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedMedia(null)}>
                    <div className="bg-[#2a2a2a] rounded border border-gray-700 p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-[#d4a853]">Media Details</h3>
                            <button onClick={() => setSelectedMedia(null)} className="text-gray-400 hover:text-white cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <img 
                            src={selectedMedia.url} 
                            alt="Selected" 
                            className="w-full max-h-96 object-contain rounded mb-4"
                        />
                        <div className="space-y-2">
                            <p className="text-sm text-gray-400">URL:</p>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={selectedMedia.url} 
                                    readOnly 
                                    className="flex-1 p-2 bg-[#1a1a1a] border border-gray-600 rounded text-white text-sm"
                                />
                                <ActionButton onClick={() => copyToClipboard(selectedMedia.url)} variant="secondary">
                                    Copy
                                </ActionButton>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <ActionButton onClick={() => handleDelete(selectedMedia._id)} variant="danger">
                                Delete
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;
