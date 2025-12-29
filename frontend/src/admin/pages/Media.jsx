import React, { useEffect, useState } from 'react';
import { HiCamera, HiPhotograph } from 'react-icons/hi';
import { api } from '../../api/api';

const Media = () => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [view, setView] = useState('grid');
    const [deviceFrame, setDeviceFrame] = useState('mobile');
    const [showFramePreview, setShowFramePreview] = useState(false);

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

    return (
        <div style={{color: '#ffffff'}}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-3" style={{color: '#ffffff'}}>
                    <HiCamera className="text-[#d4a853]" />
                    Media Manager
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-2 rounded cursor-pointer flex items-center gap-1 ${view === 'grid' ? 'bg-[#d4a853]' : 'bg-[#2a2a2a]'}`}
                        style={{color: view === 'grid' ? '#000' : '#fff'}}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="hidden sm:inline text-sm">Grid</span>
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded cursor-pointer flex items-center gap-1 ${view === 'list' ? 'bg-[#d4a853]' : 'bg-[#2a2a2a]'}`}
                        style={{color: view === 'list' ? '#000' : '#fff'}}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="hidden sm:inline text-sm">List</span>
                    </button>
                </div>
            </div>

            {/* Add Media Section */}
            <div className="bg-[#2a2a2a] rounded-lg border border-gray-700 p-4 sm:p-6 mb-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4" style={{color: '#d4a853'}}>➕ Add Media URL</h2>
                <form onSubmit={handleAddUrl} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Paste image URL here..."
                        className="flex-1 p-3 bg-[#1a1a1a] border border-gray-600 rounded text-sm"
                        style={{color: '#ffffff'}}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button 
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-3 bg-[#d4a853] font-semibold rounded cursor-pointer hover:bg-[#c49743] disabled:opacity-50"
                        style={{color: '#000'}}
                    >
                        {uploading ? '⏳ Adding...' : '✅ Add URL'}
                    </button>
                </form>
            </div>

            {/* Media Grid/List */}
            {loading ? (
                <div className="text-center py-12" style={{color: '#9ca3af'}}>⏳ Loading media...</div>
            ) : mediaList.length === 0 ? (
                <div className="text-center py-12 bg-[#2a2a2a] rounded-lg border border-gray-700">
                    <div className="text-6xl mb-4">
                        <HiPhotograph className="text-[#d4a853] w-16 h-16 mx-auto" />
                    </div>
                    <p style={{color: '#9ca3af'}}>No media uploaded yet</p>
                    <p className="text-sm mt-2" style={{color: '#6b7280'}}>Add an image URL above to get started</p>
                </div>
            ) : view === 'grid' ? (
                /* MOBILE-FRIENDLY GRID - Always visible action buttons */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaList.map(media => (
                        <div 
                            key={media._id} 
                            className={`bg-[#2a2a2a] rounded-lg border overflow-hidden ${
                                selectedMedia?._id === media._id ? 'border-[#d4a853] border-2' : 'border-gray-700'
                            }`}
                        >
                            {/* Image Preview */}
                            <div 
                                className="aspect-square relative cursor-pointer"
                                onClick={() => setSelectedMedia(media)}
                            >
                                <img 
                                    src={media.url} 
                                    alt="Media" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=Error'; }}
                                />
                            </div>
                            
                            {/* ALWAYS VISIBLE Action Bar */}
                            <div className="p-3 border-t border-gray-700">
                                {/* URL Display */}
                                <p className="text-xs mb-3 truncate" style={{color: '#9ca3af'}}>{media.url}</p>
                                
                                {/* Action Buttons - Always Visible */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedMedia(media)}
                                        className="flex-1 py-2 px-3 bg-[#1a1a1a] rounded text-xs font-medium cursor-pointer hover:bg-[#3a3a3a] flex items-center justify-center gap-1"
                                        style={{color: '#d4a853'}}
                                    >
                                        👁️ View
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(media.url)}
                                        className="flex-1 py-2 px-3 bg-[#d4a853] rounded text-xs font-medium cursor-pointer hover:bg-[#c49743] flex items-center justify-center gap-1"
                                        style={{color: '#000'}}
                                    >
                                        📋 Copy
                                    </button>
                                    <button
                                        onClick={() => handleDelete(media._id)}
                                        className="py-2 px-3 bg-red-600 rounded text-xs font-medium cursor-pointer hover:bg-red-700 flex items-center justify-center"
                                        style={{color: '#fff'}}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Mobile-friendly List View */
                <div className="space-y-3">
                    {mediaList.map(media => (
                        <div key={media._id} className="bg-[#2a2a2a] rounded-lg border border-gray-700 p-3">
                            <div className="flex gap-3">
                                <img 
                                    src={media.url} 
                                    alt="Preview" 
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded shrink-0 cursor-pointer"
                                    onClick={() => setSelectedMedia(media)}
                                    onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Error'; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm break-all line-clamp-2 mb-2" style={{color: '#ffffff'}}>{media.url}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedMedia(media)}
                                            className="py-1.5 px-3 bg-[#1a1a1a] rounded text-xs cursor-pointer"
                                            style={{color: '#d4a853'}}
                                        >
                                            👁️ View
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(media.url)}
                                            className="py-1.5 px-3 bg-[#d4a853] rounded text-xs cursor-pointer"
                                            style={{color: '#000'}}
                                        >
                                            📋 Copy
                                        </button>
                                        <button
                                            onClick={() => handleDelete(media._id)}
                                            className="py-1.5 px-3 bg-red-600 rounded text-xs cursor-pointer"
                                            style={{color: '#fff'}}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Media Detail Modal */}
            {selectedMedia && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3" 
                    onClick={() => setSelectedMedia(null)}
                >
                    <div 
                        className="bg-[#2a2a2a] rounded-lg border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto" 
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{color: '#d4a853'}}>
                                <HiCamera />
                                Media Details
                            </h3>
                            <button 
                                onClick={() => setSelectedMedia(null)} 
                                className="p-2 hover:bg-[#3a3a3a] rounded cursor-pointer text-xl"
                                style={{color: '#9ca3af'}}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Image Preview */}
                        <div className="p-4">
                            <img 
                                src={selectedMedia.url} 
                                alt="Selected" 
                                className="w-full max-h-64 object-contain rounded-lg bg-[#1a1a1a]"
                            />
                        </div>

                        {/* Device Frame Preview Toggle */}
                        <div className="px-4 pb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={showFramePreview}
                                        onChange={(e) => setShowFramePreview(e.target.checked)}
                                        className="w-4 h-4 accent-[#d4a853]"
                                    />
                                    <span className="text-sm" style={{color: '#ffffff'}}>📱 Device Frame Preview</span>
                                </label>
                            </div>

                            {showFramePreview && (
                                <div className="mb-4">
                                    {/* Device Selector */}
                                    <div className="flex gap-2 mb-4">
                                        {['mobile', 'tablet', 'desktop'].map(device => (
                                            <button
                                                key={device}
                                                onClick={() => setDeviceFrame(device)}
                                                className={`flex-1 py-2 px-2 rounded text-xs font-medium cursor-pointer ${
                                                    deviceFrame === device ? 'bg-[#d4a853]' : 'bg-[#1a1a1a]'
                                                }`}
                                                style={{color: deviceFrame === device ? '#000' : '#fff'}}
                                            >
                                                {device === 'mobile' && '📱'}
                                                {device === 'tablet' && '📲'}
                                                {device === 'desktop' && '🖥️'}
                                                <span className="ml-1 capitalize">{device}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Frame Preview */}
                                    <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg p-4 flex justify-center">
                                        {deviceFrame === 'mobile' && (
                                            <div className="bg-gray-900 rounded-[20px] p-2 shadow-xl">
                                                <div className="w-3 h-3 bg-black rounded-full mx-auto mb-1"></div>
                                                <div className="bg-white rounded-2xl overflow-hidden" style={{width: '120px', height: '213px'}}>
                                                    <img src={selectedMedia.url} alt="Mobile" className="w-full h-full object-contain"/>
                                                </div>
                                                <div className="w-8 h-1 bg-gray-700 rounded-full mx-auto mt-1"></div>
                                            </div>
                                        )}
                                        {deviceFrame === 'tablet' && (
                                            <div className="bg-gray-900 rounded-2xl p-3 shadow-xl">
                                                <div className="w-2 h-2 bg-gray-700 rounded-full mx-auto mb-1"></div>
                                                <div className="bg-white rounded-xl overflow-hidden" style={{width: '160px', height: '213px'}}>
                                                    <img src={selectedMedia.url} alt="Tablet" className="w-full h-full object-contain"/>
                                                </div>
                                                <div className="w-6 h-6 border-2 border-gray-700 rounded-full mx-auto mt-1"></div>
                                            </div>
                                        )}
                                        {deviceFrame === 'desktop' && (
                                            <div>
                                                <div className="bg-gray-800 rounded-t-lg px-2 py-1 flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                </div>
                                                <div className="bg-white border-2 border-gray-800 rounded-b-lg overflow-hidden" style={{width: '220px', height: '124px'}}>
                                                    <img src={selectedMedia.url} alt="Desktop" className="w-full h-full object-contain"/>
                                                </div>
                                                <div className="w-16 h-3 bg-gray-700 mx-auto rounded-b-xl"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* URL with Copy */}
                            <div className="mb-4">
                                <label className="text-xs mb-2 block" style={{color: '#9ca3af'}}>Image URL:</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={selectedMedia.url} 
                                        readOnly 
                                        className="flex-1 p-2 bg-[#1a1a1a] border border-gray-600 rounded text-xs"
                                        style={{color: '#ffffff'}}
                                    />
                                    <button 
                                        onClick={() => copyToClipboard(selectedMedia.url)}
                                        className="px-4 py-2 bg-[#d4a853] rounded text-xs font-medium cursor-pointer"
                                        style={{color: '#000'}}
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                    <p className="text-xs" style={{color: '#9ca3af'}}>Type</p>
                                    <p className="text-sm font-medium" style={{color: '#ffffff'}}>{selectedMedia.type || 'Image'}</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-3 rounded border border-gray-700">
                                    <p className="text-xs" style={{color: '#9ca3af'}}>Added</p>
                                    <p className="text-sm font-medium" style={{color: '#ffffff'}}>
                                        {selectedMedia.createdAt ? new Date(selectedMedia.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="flex-1 py-3 bg-gray-600 rounded font-medium cursor-pointer hover:bg-gray-700"
                                    style={{color: '#ffffff'}}
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={() => handleDelete(selectedMedia._id)}
                                    className="flex-1 py-3 bg-red-600 rounded font-medium cursor-pointer hover:bg-red-700"
                                    style={{color: '#ffffff'}}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;
