import { useState, useEffect, useRef } from 'react';
import api from '../../api/api';
import { HiEye, HiPencil, HiTrash, HiDotsVertical, HiPlay, HiPause, HiUpload, HiPlus, HiX, HiDocumentText, HiPhotograph, HiExternalLink } from 'react-icons/hi';

const Catalogues = () => {
    const [catalogues, setCatalogues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCatalogue, setEditingCatalogue] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('all');
    
    const fileInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);
    const [uploadTarget, setUploadTarget] = useState(null); // 'file' or 'thumbnail'
    
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fileUrl: '',
        fileType: 'url',
        thumbnailUrl: '',
        displayOrder: 0,
        status: 'active'
    });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Fetch catalogues
    const fetchCatalogues = async () => {
        setLoading(true);
        try {
            const res = await api.get('/catalogues/admin');
            setCatalogues(res.data);
        } catch (err) {
            console.error('Error fetching catalogues:', err);
            showToast('Failed to fetch catalogues', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCatalogues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.menu-container')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            fileUrl: '',
            fileType: 'url',
            thumbnailUrl: '',
            displayOrder: catalogues.length + 1,
            status: 'active'
        });
        setEditingCatalogue(null);
    };

    // Open modal for new catalogue
    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    // Open modal for editing
    const openEditModal = (catalogue) => {
        setFormData({
            title: catalogue.title || '',
            description: catalogue.description || '',
            fileUrl: catalogue.fileUrl || '',
            fileType: catalogue.fileType || 'pdf',
            thumbnailUrl: catalogue.thumbnailUrl || '',
            displayOrder: catalogue.displayOrder || 0,
            status: catalogue.status || 'active'
        });
        setEditingCatalogue(catalogue);
        setShowModal(true);
        setOpenMenuId(null);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle file upload to Cloudinary
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Invalid file type. Please upload PDF or image files.', 'error');
            return;
        }

        // Validate file size (max 20MB for PDFs, 10MB for images)
        const maxSize = file.type === 'application/pdf' ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast(`File too large. Max size is ${file.type === 'application/pdf' ? '20MB' : '10MB'}.`, 'error');
            return;
        }

        setUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);

            // Use regular upload endpoint for all files
            const res = await api.post('/media/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = res.data.url || res.data.secure_url;
            
            if (uploadTarget === 'file') {
                const isPdf = file.type === 'application/pdf';
                setFormData(prev => ({ 
                    ...prev, 
                    fileUrl: uploadedUrl,
                    fileType: isPdf ? 'pdf' : 'image'
                }));
                showToast('Catalogue file uploaded successfully');
            } else if (uploadTarget === 'thumbnail') {
                setFormData(prev => ({ ...prev, thumbnailUrl: uploadedUrl }));
                showToast('Thumbnail uploaded successfully');
            }
        } catch (err) {
            console.error('Upload error:', err);
            showToast(err.response?.data?.message || 'Failed to upload file', 'error');
        } finally {
            setUploading(false);
            setUploadTarget(null);
            e.target.value = '';
        }
    };

    // Trigger file input
    const triggerUpload = (target) => {
        setUploadTarget(target);
        if (target === 'file') {
            fileInputRef.current?.click();
        } else {
            thumbnailInputRef.current?.click();
        }
    };

    // Save catalogue (create or update)
    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            showToast('Title is required', 'error');
            return;
        }
        if (!formData.fileUrl.trim()) {
            showToast('Catalogue file URL is required', 'error');
            return;
        }

        setLoading(true);
        try {
            if (editingCatalogue) {
                await api.put(`/catalogues/${editingCatalogue._id}`, formData);
                showToast('Catalogue updated successfully');
            } else {
                await api.post('/catalogues', formData);
                showToast('Catalogue created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchCatalogues();
        } catch (err) {
            console.error('Save error:', err);
            showToast(err.response?.data?.message || 'Failed to save catalogue', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Toggle status
    const handleToggleStatus = async (catalogue) => {
        try {
            await api.patch(`/catalogues/${catalogue._id}/toggle-status`);
            showToast(`Catalogue ${catalogue.status === 'active' ? 'deactivated' : 'activated'}`);
            fetchCatalogues();
        } catch (err) {
            console.error('Toggle error:', err);
            showToast('Failed to update status', 'error');
        }
        setOpenMenuId(null);
    };

    // Delete catalogue
    const handleDelete = async (catalogue) => {
        if (!window.confirm(`Are you sure you want to delete "${catalogue.title}"?`)) return;
        
        try {
            await api.delete(`/catalogues/${catalogue._id}`);
            showToast('Catalogue deleted successfully');
            fetchCatalogues();
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete catalogue', 'error');
        }
        setOpenMenuId(null);
    };

    // Seed default catalogues
    const handleSeedDefaults = async () => {
        try {
            const res = await api.post('/catalogues/seed');
            showToast(res.data.message);
            fetchCatalogues();
        } catch (err) {
            console.error('Seed error:', err);
            showToast('Failed to seed catalogues', 'error');
        }
    };

    // Filter catalogues
    const filteredCatalogues = catalogues.filter(cat => {
        if (filter === 'all') return true;
        return cat.status === filter;
    });

    return (
        <div className="p-2 md:p-6 text-white min-h-screen">
            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg">
                        <div className="animate-spin w-8 h-8 border-4 border-[#d4a853] border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-[#d4a853]">Loading...</p>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#d4a853]">Catalogues</h1>
                    <p className="text-gray-400 text-sm">Manage catalogue PDFs and images for the public catalog page</p>
                </div>
                <div className="flex gap-2">
                    {catalogues.length === 0 && (
                        <button
                            onClick={handleSeedDefaults}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer text-sm"
                        >
                            Seed Defaults
                        </button>
                    )}
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-[#d4a853] text-black rounded hover:bg-[#c49743] cursor-pointer flex items-center gap-2"
                    >
                        <HiPlus className="w-5 h-5" /> Add Catalogue
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {['all', 'active', 'inactive'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded cursor-pointer capitalize ${
                            filter === f 
                                ? 'bg-[#d4a853] text-black' 
                                : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]'
                        }`}
                    >
                        {f} ({catalogues.filter(c => f === 'all' ? true : c.status === f).length})
                    </button>
                ))}
            </div>

            {/* Catalogue List */}
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-700 bg-[#2a2a2a]">
                            <th className="p-3 text-left">Order</th>
                            <th className="p-3 text-left">Thumbnail</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left hidden md:table-cell">Type</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCatalogues.length > 0 ? (
                            filteredCatalogues.map((catalogue) => (
                                <tr key={catalogue._id} className="border-b border-gray-700 hover:bg-[#2a2a2a]">
                                    <td className="p-3 text-center">{catalogue.displayOrder}</td>
                                    <td className="p-3">
                                        {catalogue.thumbnailUrl ? (
                                            <img 
                                                src={catalogue.thumbnailUrl} 
                                                alt={catalogue.title}
                                                className="w-16 h-12 object-cover rounded"
                                                onError={(e) => { e.target.src = 'https://placehold.co/64x48?text=No+Image'; }}
                                            />
                                        ) : (
                                            <div className="w-16 h-12 bg-[#2a2a2a] rounded flex items-center justify-center">
                                                {catalogue.fileType === 'pdf' ? (
                                                    <HiDocumentText className="w-6 h-6 text-red-400" />
                                                ) : catalogue.fileType === 'url' ? (
                                                    <HiExternalLink className="w-6 h-6 text-blue-400" />
                                                ) : (
                                                    <HiPhotograph className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <p className="font-medium">{catalogue.title}</p>
                                        {catalogue.description && (
                                            <p className="text-gray-500 text-xs truncate max-w-[200px]">{catalogue.description}</p>
                                        )}
                                    </td>
                                    <td className="p-3 hidden md:table-cell">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            catalogue.fileType === 'pdf' ? 'bg-red-900/50 text-red-300' : 
                                            catalogue.fileType === 'url' ? 'bg-blue-900/50 text-blue-300' : 
                                            'bg-green-900/50 text-green-300'
                                        }`}>
                                            {catalogue.fileType?.toUpperCase() || 'URL'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            catalogue.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                                        }`}>
                                            {catalogue.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="relative menu-container">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === catalogue._id ? null : catalogue._id);
                                                }}
                                                className="text-gray-400 hover:text-white p-1 cursor-pointer"
                                            >
                                                <HiDotsVertical className="w-5 h-5" />
                                            </button>
                                            
                                            {openMenuId === catalogue._id && (
                                                <div className="absolute right-0 bottom-full mb-2 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-xl z-20 min-w-[150px]">
                                                    <a
                                                        href={catalogue.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#3a3a3a] text-sm cursor-pointer rounded-t-lg"
                                                        onClick={() => setOpenMenuId(null)}
                                                    >
                                                        <HiEye className="w-4 h-4 text-[#d4a853]" /> View File
                                                    </a>
                                                    <button
                                                        onClick={() => openEditModal(catalogue)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#3a3a3a] text-sm cursor-pointer"
                                                    >
                                                        <HiPencil className="w-4 h-4 text-[#d4a853]" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(catalogue)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#3a3a3a] text-sm cursor-pointer"
                                                    >
                                                        {catalogue.status === 'active' ? (
                                                            <><HiPause className="w-4 h-4 text-orange-400" /> Deactivate</>
                                                        ) : (
                                                            <><HiPlay className="w-4 h-4 text-green-400" /> Activate</>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(catalogue)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-600/30 text-red-400 text-sm cursor-pointer rounded-b-lg"
                                                    >
                                                        <HiTrash className="w-4 h-4" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    {loading ? 'Loading catalogues...' : 'No catalogues found. Click "Add Catalogue" to create one.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#1a1a1a] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-[#d4a853]">
                                {editingCatalogue ? 'Edit Catalogue' : 'Add New Catalogue'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-4 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Natural Stone Collection"
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Description (optional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of the catalogue..."
                                    rows={2}
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white resize-none"
                                />
                            </div>

                            {/* File URL */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Catalogue URL *</label>
                                <input
                                    type="text"
                                    name="fileUrl"
                                    value={formData.fileUrl}
                                    onChange={handleInputChange}
                                    placeholder="Enter catalogue URL..."
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>

                            {/* Thumbnail URL + Upload */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Thumbnail Image URL (optional)</label>
                                <input
                                    type="text"
                                    name="thumbnailUrl"
                                    value={formData.thumbnailUrl}
                                    onChange={handleInputChange}
                                    placeholder="Paste thumbnail image URL..."
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                />
                                {formData.thumbnailUrl && (
                                    <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="mt-2 w-24 h-16 object-cover rounded" />
                                )}
                            </div>

                            {/* Display Order & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        name="displayOrder"
                                        value={formData.displayOrder}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 bg-[#d4a853] text-black rounded hover:bg-[#c49743] cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (editingCatalogue ? 'Update Catalogue' : 'Add Catalogue')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalogues;
