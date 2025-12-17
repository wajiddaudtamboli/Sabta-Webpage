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
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => setSelectedMedia(null)}>
                    <div className="bg-[#2a2a2a] rounded border border-gray-700 p-3 sm:p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-base sm:text-xl font-semibold text-[#d4a853]">Media Details & Device Preview</h3>
                            <button onClick={() => setSelectedMedia(null)} className="text-gray-400 hover:text-white cursor-pointer p-1">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Device Frame Toggle - Mobile Responsive */}
                        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                                <input 
                                    type="checkbox" 
                                    checked={showFramePreview}
                                    onChange={(e) => setShowFramePreview(e.target.checked)}
                                    className="w-4 h-4 text-[#d4a853] bg-[#1a1a1a] border-gray-600 rounded focus:ring-[#d4a853]"
                                />
                                <span>Show Device Frame Preview</span>
                            </label>
                            
                            {showFramePreview && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setDeviceFrame('desktop')}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded cursor-pointer flex items-center gap-1 ${
                                            deviceFrame === 'desktop' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white border border-gray-600'
                                        }`}
                                        title="Desktop (1920x1080)"
                                    >
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hidden xs:inline">Desktop</span>
                                    </button>
                                    <button
                                        onClick={() => setDeviceFrame('tablet')}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded cursor-pointer flex items-center gap-1 ${
                                            deviceFrame === 'tablet' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white border border-gray-600'
                                        }`}
                                        title="Tablet (768x1024)"
                                    >
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hidden xs:inline">Tablet</span>
                                    </button>
                                    <button
                                        onClick={() => setDeviceFrame('mobile')}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded cursor-pointer flex items-center gap-1 ${
                                            deviceFrame === 'mobile' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white border border-gray-600'
                                        }`}
                                        title="Mobile (375x667)"
                                    >
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hidden xs:inline">Mobile</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Device Frame Preview or Standard Preview */}
                        {showFramePreview ? (
                            <div className="flex justify-center items-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 sm:p-8 mb-4 overflow-x-auto">
                                {/* Desktop Frame - Scaled for mobile */}
                                {deviceFrame === 'desktop' && (
                                    <div className="relative w-full max-w-full">
                                        <div className="bg-gray-800 rounded-t-lg p-1.5 sm:p-2 flex items-center gap-1 sm:gap-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="flex-1 text-center text-[10px] sm:text-xs text-gray-400">Desktop (16:9)</div>
                                        </div>
                                        <div className="bg-white border-2 sm:border-4 border-gray-800 rounded-b-lg overflow-hidden aspect-video w-full max-w-[100%] sm:max-w-[600px] md:max-w-[800px]">
                                            <img 
                                                src={selectedMedia.url} 
                                                alt="Desktop Preview" 
                                                className="w-full h-full object-contain bg-gray-100"
                                            />
                                        </div>
                                        <div className="hidden sm:block absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 sm:w-64 h-4 sm:h-6 bg-gray-700 rounded-b-3xl"></div>
                                    </div>
                                )}

                                {/* Tablet Frame - Scaled for mobile */}
                                {deviceFrame === 'tablet' && (
                                    <div className="relative">
                                        <div className="bg-gray-900 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl">
                                            <div className="absolute top-1.5 sm:top-3 left-1/2 transform -translate-x-1/2 w-10 sm:w-16 h-0.5 sm:h-1 bg-gray-700 rounded-full"></div>
                                            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden w-[200px] h-[267px] sm:w-[280px] sm:h-[373px] md:w-[384px] md:h-[512px]">
                                                <img 
                                                    src={selectedMedia.url} 
                                                    alt="Tablet Preview" 
                                                    className="w-full h-full object-contain bg-gray-100"
                                                />
                                            </div>
                                            <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 border-gray-700"></div>
                                        </div>
                                        <div className="text-center text-[10px] sm:text-xs text-gray-400 mt-2">Tablet (3:4)</div>
                                    </div>
                                )}

                                {/* Mobile Frame - Scaled for actual mobile */}
                                {deviceFrame === 'mobile' && (
                                    <div className="relative">
                                        <div className="bg-gray-900 rounded-[24px] sm:rounded-[40px] p-2 sm:p-4 shadow-2xl">
                                            <div className="absolute top-3 sm:top-6 left-1/2 transform -translate-x-1/2 w-12 sm:w-20 h-3 sm:h-5 bg-black rounded-full"></div>
                                            <div className="bg-white rounded-[20px] sm:rounded-[32px] overflow-hidden w-[140px] h-[250px] sm:w-[187px] sm:h-[333px]">
                                                <img 
                                                    src={selectedMedia.url} 
                                                    alt="Mobile Preview" 
                                                    className="w-full h-full object-contain bg-gray-100"
                                                />
                                            </div>
                                            <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 sm:h-1 bg-gray-700 rounded-full"></div>
                                        </div>
                                        <div className="text-center text-[10px] sm:text-xs text-gray-400 mt-2">Mobile (9:16)</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-[#1a1a1a] rounded-lg p-2 sm:p-4 mb-4 flex justify-center">
                                <img 
                                    src={selectedMedia.url} 
                                    alt="Selected" 
                                    className="max-w-full max-h-64 sm:max-h-96 object-contain rounded"
                                />
                            </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                            {/* Image Preview with URL Display */}
                            <div className="bg-[#1a1a1a] rounded-lg p-2 sm:p-3 border border-gray-700">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <img 
                                        src={selectedMedia.url} 
                                        alt="Preview" 
                                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Image URL:</p>
                                        <p className="text-[10px] sm:text-xs text-white break-all line-clamp-2">{selectedMedia.url}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full URL with Copy */}
                            <div>
                                <p className="text-xs sm:text-sm text-gray-400 mb-2">Full URL:</p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input 
                                        type="text" 
                                        value={selectedMedia.url} 
                                        readOnly 
                                        className="flex-1 p-2 bg-[#1a1a1a] border border-gray-600 rounded text-white text-xs sm:text-sm break-all"
                                    />
                                    <ActionButton onClick={() => copyToClipboard(selectedMedia.url)} variant="secondary" className="w-full sm:w-auto">
                                        📋 Copy URL
                                    </ActionButton>
                                </div>
                            </div>

                            {/* Image Dimensions Info - Mobile Grid */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                                <div className="bg-[#1a1a1a] p-2 sm:p-3 rounded border border-gray-700">
                                    <p className="text-gray-400 mb-1 text-[10px] sm:text-xs">Type:</p>
                                    <p className="text-white font-medium text-xs sm:text-sm">{selectedMedia.type || 'Image'}</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-2 sm:p-3 rounded border border-gray-700">
                                    <p className="text-gray-400 mb-1 text-[10px] sm:text-xs">Date Added:</p>
                                    <p className="text-white font-medium text-xs sm:text-sm">
                                        {selectedMedia.createdAt ? new Date(selectedMedia.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Responsive Guidelines - Collapsible on Mobile */}
                            <details className="bg-blue-900/20 border border-blue-700/50 rounded-lg">
                                <summary className="p-2 sm:p-4 text-xs sm:text-sm font-semibold text-blue-400 cursor-pointer">📱 Responsive Image Guidelines</summary>
                                <ul className="text-[10px] sm:text-xs text-gray-300 space-y-1 px-3 pb-3 sm:px-4 sm:pb-4">
                                    <li>• <strong>Desktop:</strong> Full resolution</li>
                                    <li>• <strong>Tablet:</strong> Medium resolution</li>
                                    <li>• <strong>Mobile:</strong> Optimized size</li>
                                </ul>
                            </details>
                        </div>

                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2">
                            <ActionButton onClick={() => setSelectedMedia(null)} variant="secondary" className="w-full sm:w-auto">
                                Close
                            </ActionButton>
                            <ActionButton onClick={() => handleDelete(selectedMedia._id)} variant="danger" className="w-full sm:w-auto">
                                🗑️ Delete
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;
