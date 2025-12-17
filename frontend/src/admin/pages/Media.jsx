import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../api/api';

const Media = () => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [deviceFrame, setDeviceFrame] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
    const [showFramePreview, setShowFramePreview] = useState(false);
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

            {/* Selected Media Details with Device Frame Preview */}
            {selectedMedia && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMedia(null)}>
                    <div className="bg-[#2a2a2a] rounded border border-gray-700 p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-[#d4a853]">Media Details & Device Preview</h3>
                            <button onClick={() => setSelectedMedia(null)} className="text-gray-400 hover:text-white cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Device Frame Toggle */}
                        <div className="mb-6 flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input 
                                    type="checkbox" 
                                    checked={showFramePreview}
                                    onChange={(e) => setShowFramePreview(e.target.checked)}
                                    className="w-4 h-4 text-[#d4a853] bg-[#1a1a1a] border-gray-600 rounded focus:ring-[#d4a853]"
                                />
                                <span>Show Device Frame Preview</span>
                            </label>
                            
                            {showFramePreview && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDeviceFrame('desktop')}
                                        className={`px-3 py-1.5 text-sm rounded cursor-pointer flex items-center gap-1 ${
                                            deviceFrame === 'desktop' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white border border-gray-600'
                                        }`}
                                        title="Desktop (1920x1080)"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Desktop
                                    </button>
                                    <button
                                        onClick={() => setDeviceFrame('tablet')}
                                        className={`px-3 py-1.5 text-sm rounded cursor-pointer flex items-center gap-1 ${
                                            deviceFrame === 'tablet' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white border border-gray-600'
                                        }`}
                                        title="Tablet (768x1024)"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Tablet
                                    </button>
                                    <button
                                        onClick={() => setDeviceFrame('mobile')}
                                        className={`px-3 py-1.5 text-sm rounded cursor-pointer flex items-center gap-1 ${
                                            deviceFrame === 'mobile' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white border border-gray-600'
                                        }`}
                                        title="Mobile (375x667)"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Mobile
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Device Frame Preview or Standard Preview */}
                        {showFramePreview ? (
                            <div className="flex justify-center items-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 mb-4">
                                {/* Desktop Frame */}
                                {deviceFrame === 'desktop' && (
                                    <div className="relative">
                                        <div className="bg-gray-800 rounded-t-lg p-2 flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="flex-1 text-center text-xs text-gray-400">Desktop Preview (1920x1080)</div>
                                        </div>
                                        <div className="bg-white border-4 border-gray-800 rounded-b-lg overflow-hidden" style={{width: '960px', height: '540px'}}>
                                            <img 
                                                src={selectedMedia.url} 
                                                alt="Desktop Preview" 
                                                className="w-full h-full object-contain bg-gray-100"
                                            />
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-64 h-6 bg-gray-700 rounded-b-3xl"></div>
                                    </div>
                                )}

                                {/* Tablet Frame */}
                                {deviceFrame === 'tablet' && (
                                    <div className="relative">
                                        <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl">
                                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                                            <div className="bg-white rounded-2xl overflow-hidden" style={{width: '384px', height: '512px'}}>
                                                <img 
                                                    src={selectedMedia.url} 
                                                    alt="Tablet Preview" 
                                                    className="w-full h-full object-contain bg-gray-100"
                                                />
                                            </div>
                                            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 border-gray-700"></div>
                                        </div>
                                        <div className="text-center text-xs text-gray-400 mt-2">Tablet Preview (768x1024)</div>
                                    </div>
                                )}

                                {/* Mobile Frame */}
                                {deviceFrame === 'mobile' && (
                                    <div className="relative">
                                        <div className="bg-gray-900 rounded-[40px] p-4 shadow-2xl">
                                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full"></div>
                                            <div className="bg-white rounded-[32px] overflow-hidden" style={{width: '187px', height: '333px'}}>
                                                <img 
                                                    src={selectedMedia.url} 
                                                    alt="Mobile Preview" 
                                                    className="w-full h-full object-contain bg-gray-100"
                                                />
                                            </div>
                                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-700 rounded-full"></div>
                                        </div>
                                        <div className="text-center text-xs text-gray-400 mt-2">Mobile Preview (375x667)</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4 flex justify-center">
                                <img 
                                    src={selectedMedia.url} 
                                    alt="Selected" 
                                    className="max-w-full max-h-96 object-contain rounded"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">URL:</p>
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

                            {/* Image Dimensions Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                    <p className="text-gray-400 mb-1">Type:</p>
                                    <p className="text-white font-medium">{selectedMedia.type || 'Image'}</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                    <p className="text-gray-400 mb-1">Date Added:</p>
                                    <p className="text-white font-medium">
                                        {selectedMedia.createdAt ? new Date(selectedMedia.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Responsive Guidelines */}
                            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-400 mb-2">📱 Responsive Image Guidelines</h4>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    <li>• <strong>Desktop (≥1920px):</strong> Full resolution recommended</li>
                                    <li>• <strong>Tablet (768-1024px):</strong> Medium resolution, consider 2x retina</li>
                                    <li>• <strong>Mobile (≤375px):</strong> Optimized size, consider mobile-first approach</li>
                                    <li>• <strong>Tip:</strong> Use device preview to check image scaling and cropping</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <ActionButton onClick={() => setSelectedMedia(null)} variant="secondary">
                                Close
                            </ActionButton>
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
