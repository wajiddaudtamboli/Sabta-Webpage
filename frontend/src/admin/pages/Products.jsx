import { useState, useEffect, useRef } from 'react';
import api from '../../api/api';
import { HiEye, HiPencil, HiTrash, HiDotsVertical, HiPlay, HiPause, HiFolder, HiUpload, HiPlus, HiX, HiCheck, HiPhotograph, HiLink, HiDownload } from 'react-icons/hi';

const Products = () => {
    // Collections state - now from database
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    
    // Collection modal state
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [collectionForm, setCollectionForm] = useState({
        name: '',
        description: '',
        tagline1: '',
        tagline2: '',
        tagline3: '',
        displayOrder: 1,
        status: 'active',
        image: ''
    });
    const [collectionMenuId, setCollectionMenuId] = useState(null);
    
    // Products state
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Product images state for carousel
    const [productImages, setProductImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [newImageUrl, setNewImageUrl] = useState('');
    
    // Image upload ref
    const imageInputRef = useRef(null);
    const collectionImageRef = useRef(null);
    
    // Excel import refs and state
    const excelInputRef = useRef(null);
    const [importPreview, setImportPreview] = useState([]);
    const [showImportPreview, setShowImportPreview] = useState(false);
    
    // URL Import Modal State
    const [showUrlImportModal, setShowUrlImportModal] = useState(false);
    const [importFileUrl, setImportFileUrl] = useState('');
    const [urlImportPreview, setUrlImportPreview] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    
    // Dropdown menu state
    const [openMenuId, setOpenMenuId] = useState(null);
    
    // Toast notification
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };
    
    // Form data
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: '',
        collectionName: 'Natural Stone Collections by SABTA GRANITE',
        description: '',
        color: '',
        origin: '',
        isBookmatch: false,
        isTranslucent: false,
        isNatural: true,
        isNewArrival: false,
        grade: '',
        compressionStrength: '',
        impactTest: '',
        bulkDensity: '',
        waterAbsorption: '',
        thermalExpansion: '',
        flexuralStrength: '',
        images: [],
        status: 'active'
    });

    // Fetch collections from database
    const fetchCollections = async () => {
        try {
            const response = await api.get('/collections/admin');
            console.log('Collections loaded:', response.data);
            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching collections:', error);
            // Try public endpoint as fallback
            try {
                const fallbackResponse = await api.get('/collections');
                setCollections(fallbackResponse.data);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
    };

    // Fetch products (optionally by collection)
    const fetchProducts = async (collectionId = null, collectionName = null) => {
        setLoading(true);
        try {
            let url = '/products/admin';
            const params = new URLSearchParams();
            
            if (collectionId && collectionName) {
                params.append('collectionId', collectionId);
                params.append('collectionName', collectionName);
            } else {
                // Show all products when no collection selected
                params.append('showAll', 'true');
            }
            
            url += '?' + params.toString();
            
            console.log('Fetching products from:', url);
            const response = await api.get(url);
            console.log('Products loaded:', response.data.length, response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Try public endpoint as fallback
            try {
                const fallbackResponse = await api.get('/products');
                setProducts(fallbackResponse.data);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchCollections();
        fetchProducts();
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.menu-container')) {
                setCollectionMenuId(null);
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Collection CRUD handlers
    const resetCollectionForm = () => {
        setCollectionForm({
            name: '',
            description: '',
            tagline1: '',
            tagline2: '',
            tagline3: '',
            displayOrder: collections.length + 1,
            status: 'active',
            image: ''
        });
        setEditingCollection(null);
    };

    const openAddCollectionModal = () => {
        resetCollectionForm();
        setShowCollectionModal(true);
    };

    const openEditCollectionModal = (collection) => {
        setEditingCollection(collection);
        setCollectionForm({
            name: collection.name || '',
            description: collection.description || '',
            tagline1: collection.tagline1 || '',
            tagline2: collection.tagline2 || '',
            tagline3: collection.tagline3 || '',
            displayOrder: collection.displayOrder || 1,
            status: collection.status || 'active',
            image: collection.image || ''
        });
        setShowCollectionModal(true);
        setCollectionMenuId(null);
    };

    const handleCollectionSave = async () => {
        if (!collectionForm.name.trim()) {
            showToast('Collection name is required!', 'error');
            return;
        }
        
        setLoading(true);
        try {
            if (editingCollection) {
                await api.put(`/collections/${editingCollection._id}`, collectionForm);
                showToast('Collection updated successfully!');
            } else {
                await api.post('/collections', collectionForm);
                showToast('Collection created successfully!');
            }
            
            await fetchCollections();
            setShowCollectionModal(false);
            resetCollectionForm();
        } catch (error) {
            console.error('Error saving collection:', error);
            showToast(error.response?.data?.message || 'Error saving collection', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCollectionDelete = async (collection) => {
        if (collection.productCount > 0) {
            showToast(`Cannot delete "${collection.name}" - it has ${collection.productCount} products. Move or delete products first.`, 'error');
            return;
        }
        
        if (!window.confirm(`Are you sure you want to delete "${collection.name}"?`)) return;
        
        setLoading(true);
        try {
            await api.delete(`/collections/${collection._id}`);
            showToast('Collection deleted successfully!');
            await fetchCollections();
            
            if (selectedCollection?._id === collection._id) {
                setSelectedCollection(null);
                fetchProducts();
            }
        } catch (error) {
            console.error('Error deleting collection:', error);
            showToast(error.response?.data?.message || 'Error deleting collection', 'error');
        } finally {
            setLoading(false);
        }
        setCollectionMenuId(null);
    };

    const handleCollectionStatusToggle = async (collection) => {
        setLoading(true);
        try {
            const newStatus = collection.status === 'active' ? 'inactive' : 'active';
            await api.put(`/collections/${collection._id}`, { status: newStatus });
            showToast(`Collection ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
            await fetchCollections();
        } catch (error) {
            console.error('Error toggling status:', error);
            showToast('Error updating status', 'error');
        } finally {
            setLoading(false);
        }
        setCollectionMenuId(null);
    };

    // Handle collection select
    const handleCollectionSelect = (collection) => {
        setSelectedCollection(collection);
        fetchProducts(collection._id, collection.name);
    };

    // Handle product select for editing
    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
        setFormData({
            code: product.code || '',
            name: product.name || '',
            category: product.category || '',
            collectionName: product.collectionName || 'Natural Stone Collections by SABTA GRANITE',
            description: product.description || '',
            color: product.color || '',
            origin: product.origin || '',
            isBookmatch: product.isBookmatch || false,
            isTranslucent: product.isTranslucent || false,
            isNatural: product.isNatural !== false,
            isNewArrival: product.isNewArrival || false,
            grade: product.grade || '',
            compressionStrength: product.compressionStrength || '',
            impactTest: product.impactTest || '',
            bulkDensity: product.bulkDensity || '',
            waterAbsorption: product.waterAbsorption || '',
            thermalExpansion: product.thermalExpansion || '',
            flexuralStrength: product.flexuralStrength || '',
            images: product.images || [],
            status: product.status || 'active'
        });
        setProductImages(product.images || []);
        setCurrentImageIndex(0);
    };

    // Handle save product
    const handleSave = async () => {
        // Validate required fields
        if (!formData.name || formData.name.trim() === '') {
            alert('Product name is required!');
            return;
        }
        
        setLoading(true);
        try {
            const productData = {
                ...formData,
                collectionId: selectedCollection?._id,
                collectionName: selectedCollection?.name || formData.collectionName,
                images: productImages,
                category: selectedCollection?.name || formData.category || 'General'
            };
            
            console.log('Saving product data:', productData);
            
            let response;
            if (selectedProduct) {
                // Update existing product
                response = await api.put(`/products/${selectedProduct._id}`, productData);
                alert('Product updated successfully!');
            } else {
                // Create new product
                response = await api.post('/products', productData);
                alert('Product created successfully!');
            }
            
            console.log('Save response:', response.data);
            
            // Refresh products list
            if (selectedCollection) {
                fetchProducts(selectedCollection._id, selectedCollection.name);
            } else {
                fetchProducts(); // Load all products
            }
            
            // Reset form
            setIsEditing(false);
            setSelectedProduct(null);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            console.error('Error details:', error.response?.data);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert('Error saving product: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete product
    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        setLoading(true);
        try {
            await api.delete(`/products/${productId}`);
            alert('Product deleted successfully!');
            if (selectedCollection) {
                fetchProducts(selectedCollection._id, selectedCollection.name);
            } else {
                fetchProducts();
            }
            setIsEditing(false);
            setSelectedProduct(null);
            resetForm();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            category: selectedCollection?.name || '',
            collectionName: selectedCollection?.name || 'Natural Stone Collections by SABTA GRANITE',
            description: '',
            color: '',
            origin: '',
            isBookmatch: false,
            isTranslucent: false,
            isNatural: true,
            isNewArrival: false,
            grade: '',
            compressionStrength: '',
            impactTest: '',
            bulkDensity: '',
            waterAbsorption: '',
            thermalExpansion: '',
            flexuralStrength: '',
            images: [],
            status: 'active'
        });
        setProductImages([]);
        setCurrentImageIndex(0);
    };

    // Handle image upload from device
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setLoading(true);
        console.log('Starting image upload...', files.length, 'files');
        
        try {
            const uploadedImages = [];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log('Uploading file:', file.name, 'Size:', file.size);
                
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                
                const response = await api.post('/media/upload', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                console.log('Upload response:', response.data);
                
                if (response.data.url) {
                    uploadedImages.push(response.data.url);
                    setProductImages(prev => [...prev, response.data.url]);
                }
            }
            
            alert(`Successfully uploaded ${uploadedImages.length} image(s)!`);
            console.log('All images uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            console.error('Error response:', error.response?.data);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Failed to upload image: ${errorMsg}\n\nPlease check your internet connection and try again.`);
        } finally {
            setLoading(false);
            // Reset file input
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        }
    };

    // Handle adding image by URL
    const handleAddImageUrl = () => {
        if (!newImageUrl.trim()) {
            alert('Please enter a valid image URL');
            return;
        }
        // Basic URL validation
        if (!newImageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)/i) && !newImageUrl.startsWith('http')) {
            if (!window.confirm('This URL may not be a valid image. Add anyway?')) {
                return;
            }
        }
        setProductImages(prev => [...prev, newImageUrl.trim()]);
        setNewImageUrl('');
        showToast('Image URL added successfully');
    };

    // Handle image delete from list
    const handleDeleteImage = (index) => {
        if (!window.confirm('Delete this image?')) return;
        setProductImages(prev => prev.filter((_, i) => i !== index));
    };

    // Handle Excel/CSV file import
    const handleExcelImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target.result;
                const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
                
                // First row is header
                const headers = rows[0].map(h => h.toLowerCase());
                const dataRows = rows.slice(1).filter(row => row.some(cell => cell));
                
                // Map columns to product fields
                const columnMap = {
                    'code': ['code', 'product code', 'sku'],
                    'name': ['name', 'product name', 'title'],
                    'color': ['color', 'colour'],
                    'origin': ['origin', 'country'],
                    'isBookmatch': ['is bookmatch', 'bookmatch', 'isbookmatch'],
                    'isTranslucent': ['is translucent', 'translucent', 'istranslucent'],
                    'isNatural': ['is natural', 'natural', 'isnatural'],
                    'description': ['description', 'desc'],
                    'grade': ['grade'],
                };
                
                const findColumnIndex = (field) => {
                    const possibleNames = columnMap[field] || [field.toLowerCase()];
                    return headers.findIndex(h => possibleNames.some(n => h.includes(n)));
                };
                
                const preview = dataRows.map((row, idx) => ({
                    rowNum: idx + 1,
                    code: row[findColumnIndex('code')] || '',
                    name: row[findColumnIndex('name')] || '',
                    color: row[findColumnIndex('color')] || '',
                    origin: row[findColumnIndex('origin')] || '',
                    isBookmatch: ['yes', 'true', '1'].includes((row[findColumnIndex('isBookmatch')] || '').toLowerCase()),
                    isTranslucent: ['yes', 'true', '1'].includes((row[findColumnIndex('isTranslucent')] || '').toLowerCase()),
                    isNatural: ['yes', 'true', '1', ''].includes((row[findColumnIndex('isNatural')] || 'yes').toLowerCase()),
                    description: row[findColumnIndex('description')] || '',
                    grade: row[findColumnIndex('grade')] || '',
                })).filter(p => p.name); // Only include rows with a name
                
                setImportPreview(preview);
                setShowImportPreview(true);
                setLoading(false);
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file: ' + error.message);
            setLoading(false);
        }
        
        // Reset file input
        if (excelInputRef.current) {
            excelInputRef.current.value = '';
        }
    };
    
    // Confirm and save imported products
    const confirmImport = async () => {
        if (!selectedCollection) {
            alert('Please select a collection first before importing products.');
            return;
        }
        
        setLoading(true);
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of importPreview) {
            try {
                await api.post('/products', {
                    ...product,
                    collectionId: selectedCollection._id,
                    collectionName: selectedCollection.name,
                    category: selectedCollection.name,
                    status: 'active',
                    images: []
                });
                successCount++;
            } catch (error) {
                console.error('Error importing product:', product.name, error);
                errorCount++;
            }
        }
        
        setLoading(false);
        setShowImportPreview(false);
        setImportPreview([]);
        
        alert(`Import complete!\nSuccessful: ${successCount}\nFailed: ${errorCount}`);
        fetchProducts(selectedCollection._id, selectedCollection.name);
    };

    // Handle URL-based import preview
    const handleUrlImportPreview = async () => {
        if (!importFileUrl.trim()) {
            showToast('Please enter a valid file URL', 'error');
            return;
        }
        
        setImportLoading(true);
        try {
            const response = await api.post('/products/import-preview', { fileUrl: importFileUrl });
            setUrlImportPreview(response.data);
            showToast(`Found ${response.data.totalRows} rows to import`);
        } catch (error) {
            console.error('Error previewing import:', error);
            showToast(error.response?.data?.message || 'Error loading file from URL', 'error');
        } finally {
            setImportLoading(false);
        }
    };

    // Confirm URL-based import
    const confirmUrlImport = async () => {
        if (!selectedCollection) {
            showToast('Please select a collection first before importing products', 'error');
            return;
        }
        
        setImportLoading(true);
        try {
            const response = await api.post('/products/import-from-url', {
                fileUrl: importFileUrl,
                collectionId: selectedCollection._id,
                collectionName: selectedCollection.name
            });
            
            showToast(`Import complete! Success: ${response.data.success}, Failed: ${response.data.failed}`);
            
            // Reset and close modal
            setShowUrlImportModal(false);
            setImportFileUrl('');
            setUrlImportPreview(null);
            
            // Refresh products and collections
            fetchProducts(selectedCollection._id, selectedCollection.name);
            fetchCollections();
            
        } catch (error) {
            console.error('Error importing:', error);
            showToast(error.response?.data?.message || 'Error importing products', 'error');
        } finally {
            setImportLoading(false);
        }
    };

    // Image carousel navigation
    const prevImage = () => {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : productImages.length - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev < productImages.length - 1 ? prev + 1 : 0));
    };

    // Action Button Component (same as original)
    const ActionButton = ({ children, onClick, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className="bg-[#d4a853] text-black px-3 py-1 text-xs rounded hover:bg-[#c49743] disabled:opacity-50 cursor-pointer"
        >
            {children}
        </button>
    );

    // Menu Button Component with dropdown
    const MenuButton = ({ product, onEdit, onDelete, onView }) => {
        const isOpen = openMenuId === product?._id;
        
        const toggleMenu = (e) => {
            e.stopPropagation();
            setOpenMenuId(isOpen ? null : product?._id);
        };
        
        const handleAction = (action, e) => {
            e.stopPropagation();
            setOpenMenuId(null);
            action();
        };
        
        return (
            <div className="relative">
                <button onClick={toggleMenu} className="text-[#d4a853] hover:text-[#c49743] cursor-pointer p-1">
                    <HiDotsVertical className="w-5 h-5" />
                </button>
                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-[#2a2a2a] border border-gray-600 rounded shadow-lg z-50 min-w-[120px]">
                        {onView && (
                            <button
                                onClick={(e) => handleAction(onView, e)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-[#3a3a3a] cursor-pointer"
                            >
                                <HiEye className="w-4 h-4 text-[#d4a853]" /> View
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={(e) => handleAction(onEdit, e)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-[#3a3a3a] cursor-pointer"
                            >
                                <HiPencil className="w-4 h-4 text-[#d4a853]" /> Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => handleAction(onDelete, e)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[#3a3a3a] cursor-pointer"
                            >
                                <HiTrash className="w-4 h-4" /> Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-2 md:p-6 text-white min-h-screen w-full max-w-full overflow-x-hidden">
            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg">
                        <div className="animate-spin w-8 h-8 border-4 border-[#d4a853] border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-[#d4a853]">Loading...</p>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                    {toast.message}
                </div>
            )}

            {/* Collection Modal */}
            {showCollectionModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowCollectionModal(false)}>
                    <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-semibold mb-4 text-[#d4a853]">
                            {editingCollection ? 'Edit Collection' : 'Add New Collection'}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Collection Name *</label>
                                <input
                                    type="text"
                                    value={collectionForm.name}
                                    onChange={(e) => setCollectionForm({...collectionForm, name: e.target.value})}
                                    placeholder="e.g., Italian Marble"
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Description</label>
                                <textarea
                                    value={collectionForm.description}
                                    onChange={(e) => setCollectionForm({...collectionForm, description: e.target.value})}
                                    placeholder="Brief description of this collection"
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white h-20 resize-none"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-300">Display Order</label>
                                    <input
                                        type="number"
                                        value={collectionForm.displayOrder}
                                        onChange={(e) => setCollectionForm({...collectionForm, displayOrder: parseInt(e.target.value) || 1})}
                                        className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm mb-1 text-gray-300">Status</label>
                                    <select
                                        value={collectionForm.status}
                                        onChange={(e) => setCollectionForm({...collectionForm, status: e.target.value})}
                                        className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Tagline 1</label>
                                <input
                                    type="text"
                                    value={collectionForm.tagline1}
                                    onChange={(e) => setCollectionForm({...collectionForm, tagline1: e.target.value})}
                                    placeholder="Primary tagline"
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Image URL</label>
                                <input
                                    type="text"
                                    value={collectionForm.image}
                                    onChange={(e) => setCollectionForm({...collectionForm, image: e.target.value})}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                />
                                {collectionForm.image && (
                                    <div className="mt-2">
                                        <img 
                                            src={collectionForm.image} 
                                            alt="Preview" 
                                            className="w-20 h-20 object-cover rounded border border-gray-600"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCollectionSave}
                                className="flex-1 bg-[#d4a853] text-black py-2 rounded font-medium hover:bg-[#c49743] cursor-pointer"
                            >
                                {editingCollection ? 'Update' : 'Create'}
                            </button>
                            <button
                                onClick={() => { setShowCollectionModal(false); resetCollectionForm(); }}
                                className="flex-1 bg-gray-700 text-white py-2 rounded font-medium hover:bg-gray-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* URL Import Modal */}
            {showUrlImportModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowUrlImportModal(false)}>
                    <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-[#d4a853]">
                                <HiLink className="inline w-6 h-6 mr-2" />
                                Import Products from URL
                            </h3>
                            <button onClick={() => { setShowUrlImportModal(false); setUrlImportPreview(null); setImportFileUrl(''); }} className="text-gray-400 hover:text-white">
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Target Collection Display */}
                        {selectedCollection ? (
                            <div className="mb-4 p-3 bg-[#2a2a2a] rounded border border-[#d4a853]/30">
                                <span className="text-gray-400 text-sm">Importing to: </span>
                                <span className="text-[#d4a853] font-medium">{selectedCollection.name}</span>
                            </div>
                        ) : (
                            <div className="mb-4 p-3 bg-red-900/20 rounded border border-red-500/30">
                                <span className="text-red-400 text-sm">⚠️ Please select a collection first before importing</span>
                            </div>
                        )}
                        
                        {/* URL Input */}
                        <div className="mb-4">
                            <label className="block text-sm mb-2 text-gray-300">CSV / Excel File URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={importFileUrl}
                                    onChange={(e) => setImportFileUrl(e.target.value)}
                                    placeholder="https://example.com/products.csv"
                                    className="flex-1 bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white"
                                    disabled={importLoading}
                                />
                                <button
                                    onClick={handleUrlImportPreview}
                                    disabled={importLoading || !importFileUrl.trim()}
                                    className="bg-[#d4a853] text-black px-4 py-2 rounded font-medium hover:bg-[#c49743] disabled:opacity-50 cursor-pointer flex items-center gap-2"
                                >
                                    {importLoading ? (
                                        <span className="animate-spin">⏳</span>
                                    ) : (
                                        <HiDownload className="w-5 h-5" />
                                    )}
                                    Preview
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Supported formats: CSV, XLSX, XLS</p>
                        </div>
                        
                        {/* Expected Columns Info */}
                        <div className="mb-4 p-3 bg-[#2a2a2a] rounded border border-gray-600">
                            <h4 className="text-sm font-medium text-[#d4a853] mb-2">Expected Columns:</h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-gray-700 px-2 py-1 rounded">Code</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">Product Name *</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">Color</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">Origin</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">Is Bookmatch</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">Is Translucent</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">Is Natural</span>
                            </div>
                        </div>
                        
                        {/* Preview Table */}
                        {urlImportPreview && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">
                                    Preview ({urlImportPreview.totalRows} rows found)
                                </h4>
                                <div className="overflow-x-auto max-h-64 border border-gray-600 rounded">
                                    <table className="w-full text-xs">
                                        <thead className="bg-[#2a2a2a] sticky top-0">
                                            <tr>
                                                <th className="p-2 text-left">#</th>
                                                <th className="p-2 text-left">Code</th>
                                                <th className="p-2 text-left">Name</th>
                                                <th className="p-2 text-left">Color</th>
                                                <th className="p-2 text-left">Origin</th>
                                                <th className="p-2 text-left">Bookmatch</th>
                                                <th className="p-2 text-left">Translucent</th>
                                                <th className="p-2 text-left">Natural</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {urlImportPreview.preview.map((row, idx) => (
                                                <tr key={idx} className="border-t border-gray-700">
                                                    <td className="p-2">{row.rowNum}</td>
                                                    <td className="p-2 text-[#d4a853]">{row.code || 'Auto'}</td>
                                                    <td className="p-2">{row.name || <span className="text-red-400">Missing</span>}</td>
                                                    <td className="p-2">{row.color || '-'}</td>
                                                    <td className="p-2">{row.origin || '-'}</td>
                                                    <td className="p-2">{row.isBookmatch}</td>
                                                    <td className="p-2">{row.isTranslucent}</td>
                                                    <td className="p-2">{row.isNatural}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {urlImportPreview.totalRows > 20 && (
                                    <p className="text-xs text-gray-500 mt-1">Showing first 20 of {urlImportPreview.totalRows} rows</p>
                                )}
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={confirmUrlImport}
                                disabled={importLoading || !urlImportPreview || !selectedCollection}
                                className="flex-1 bg-[#d4a853] text-black py-2 rounded font-medium hover:bg-[#c49743] disabled:opacity-50 cursor-pointer"
                            >
                                {importLoading ? 'Importing...' : `Import ${urlImportPreview?.totalRows || 0} Products`}
                            </button>
                            <button
                                onClick={() => { setShowUrlImportModal(false); setUrlImportPreview(null); setImportFileUrl(''); }}
                                className="flex-1 bg-gray-700 text-white py-2 rounded font-medium hover:bg-gray-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header with Add Product Button */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Products Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (!selectedCollection) {
                                showToast('Please select a collection first to add a product', 'error');
                                return;
                            }
                            resetForm();
                            setIsEditing(true);
                        }}
                        className="bg-[#d4a853] text-black px-4 py-2 rounded font-medium hover:bg-[#c49743] cursor-pointer flex items-center gap-2"
                    >
                        <HiPlus className="w-5 h-5" /> Add Product
                    </button>
                    <button
                        onClick={() => setShowUrlImportModal(true)}
                        className="bg-gray-700 text-white px-4 py-2 rounded font-medium hover:bg-gray-600 cursor-pointer flex items-center gap-2"
                    >
                        <HiLink className="w-5 h-5" /> Import from URL
                    </button>
                </div>
            </div>

            {/* Collections Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold">Collections</span>
                    <span className="text-[#d4a853] text-sm italic ml-2">- Listed Collections will be visible on website, select a collection to view products.</span>
                    <button
                        onClick={openAddCollectionModal}
                        className="ml-auto bg-[#d4a853] text-black px-4 py-1 text-sm rounded hover:bg-[#c49743] cursor-pointer"
                    >
                        + Add Collection
                    </button>
                </div>

                <div className="bg-[#1a1a1a] rounded border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-left">Sr No</th>
                                <th className="p-3 text-left">Collection Name</th>
                                <th className="p-3 text-left">Display Order</th>
                                <th className="p-3 text-left">Product Count</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collections.length > 0 ? collections.map((collection, index) => (
                                <tr 
                                    key={collection._id} 
                                    className={`border-b border-gray-700 hover:bg-[#2a2a2a] cursor-pointer ${selectedCollection?._id === collection._id ? 'bg-[#2a2a2a] border-l-2 border-l-[#d4a853]' : ''}`}
                                    onClick={() => handleCollectionSelect(collection)}
                                >
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3 font-medium">{collection.name}</td>
                                    <td className="p-3">{collection.displayOrder || index + 1}</td>
                                    <td className="p-3">
                                        <span className="bg-[#d4a853]/20 text-[#d4a853] px-2 py-1 rounded text-xs font-medium">
                                            {collection.productCount || 0}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${collection.status === 'active' || !collection.status ? 'bg-green-600' : 'bg-gray-600'}`}>
                                            {collection.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="relative menu-container">
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    setCollectionMenuId(collectionMenuId === collection._id ? null : collection._id);
                                                }}
                                                className="text-gray-400 hover:text-white p-1 cursor-pointer"
                                            >
                                                <HiDotsVertical className="w-5 h-5" />
                                            </button>
                                            
                                            {collectionMenuId === collection._id && (
                                                <div className="absolute right-0 top-8 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-xl z-20 min-w-[150px]">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditCollectionModal(collection); }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#3a3a3a] text-sm cursor-pointer"
                                                    >
                                                        <HiPencil className="w-4 h-4 text-[#d4a853]" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCollectionStatusToggle(collection); }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#3a3a3a] text-sm cursor-pointer"
                                                    >
                                                        {collection.status === 'active' ? <><HiPause className="w-4 h-4 text-orange-400" /> Deactivate</> : <><HiPlay className="w-4 h-4 text-green-400" /> Activate</>}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCollectionDelete(collection); }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-600/30 text-red-400 text-sm cursor-pointer"
                                                    >
                                                        <HiTrash className="w-4 h-4" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr className="border-b border-gray-700">
                                    <td colSpan="6" className="p-6 text-center text-gray-500">
                                        {loading ? 'Loading collections from database...' : 'No collections found. Click "+ Add Collection" to create one.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Add Product Button - Always visible when collection is selected */}
                {selectedCollection && (
                    <div className="mt-4 flex items-center gap-4">
                        <button
                            onClick={() => {
                                resetForm();
                                setIsEditing(true);
                            }}
                            className="bg-[#d4a853] text-black px-6 py-2 rounded font-medium hover:bg-[#c49743] cursor-pointer flex items-center gap-2"
                        >
                            <HiPlus className="w-5 h-5" /> Add Product to "{selectedCollection.name}"
                        </button>
                        <span className="text-gray-400 text-sm">
                            {products.length} product(s) in this collection
                        </span>
                    </div>
                )}

                {/* Products List Table - Visible when collection selected */}
                {selectedCollection && products.length > 0 && !isEditing && (
                    <div className="mt-6 bg-[#1a1a1a] rounded border border-gray-700 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700 bg-[#2a2a2a]">
                                    <th className="p-3 text-left">Sr No</th>
                                    <th className="p-3 text-left">Image</th>
                                    <th className="p-3 text-left">Code</th>
                                    <th className="p-3 text-left">Product Name</th>
                                    <th className="p-3 text-left">Color</th>
                                    <th className="p-3 text-left">Origin</th>
                                    <th className="p-3 text-left">Is Bookmatch</th>
                                    <th className="p-3 text-left">Is Translucent</th>
                                    <th className="p-3 text-left">Is Natural</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr 
                                        key={product._id} 
                                        className="border-b border-gray-700 hover:bg-[#2a2a2a] cursor-pointer"
                                        onClick={() => handleProductSelect(product)}
                                    >
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center">
                                                    <HiPhotograph className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-mono text-[#d4a853]">{product.code || '-'}</td>
                                        <td className="p-3 font-medium">{product.name}</td>
                                        <td className="p-3">{product.color || '-'}</td>
                                        <td className="p-3">{product.origin || '-'}</td>
                                        <td className="p-3">
                                            <span className={product.isBookmatch ? 'text-green-400' : 'text-gray-500'}>
                                                {product.isBookmatch ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={product.isTranslucent ? 'text-green-400' : 'text-gray-500'}>
                                                {product.isTranslucent ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={product.isNatural ? 'text-green-400' : 'text-gray-500'}>
                                                {product.isNatural ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs ${product.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}`}>
                                                {product.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <MenuButton 
                                                product={product}
                                                onView={() => handleProductSelect(product)}
                                                onEdit={() => handleProductSelect(product)}
                                                onDelete={() => handleDelete(product._id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* No Products Message */}
                {selectedCollection && products.length === 0 && !isEditing && (
                    <div className="mt-6 bg-[#1a1a1a] rounded border border-gray-700 p-8 text-center">
                        <HiPhotograph className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No products found in "{selectedCollection.name}"</p>
                        <button
                            onClick={() => {
                                resetForm();
                                setIsEditing(true);
                            }}
                            className="bg-[#d4a853] text-black px-6 py-2 rounded font-medium hover:bg-[#c49743] cursor-pointer"
                        >
                            <HiPlus className="w-5 h-5 inline mr-2" /> Add First Product
                        </button>
                    </div>
                )}
            </div>

            {/* Product Edit Screen */}
            {isEditing && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            {selectedProduct ? `Edit Product: ${selectedProduct.name}` : 'Add New Product'}
                        </h3>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedProduct(null);
                                resetForm();
                            }}
                            className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer"
                        >
                            <HiX className="w-5 h-5" /> Back to List
                        </button>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded border border-gray-700 p-6">
                        {/* Top Section */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[#d4a853]">Auto</span>
                                <span className="text-gray-500">-------</span>
                                <span className="text-[#d4a853]">Auto</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                    placeholder="SG01099"
                                    className="bg-transparent border-b border-gray-600 px-2 py-1 text-white w-24"
                                />
                                <span className="text-gray-500">-------</span>
                                <span>{formData.collectionName}</span>
                            </div>
                        </div>

                        {/* Product Name */}
                        <div className="mb-6">
                            <span className="text-[#d4a853]">Auto</span>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Product Name"
                                className="block bg-transparent border-b border-gray-600 px-2 py-1 text-white w-full max-w-md mt-2"
                            />
                        </div>

                        {/* Description and Image */}
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <h4 className="text-center mb-4">Description</h4>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Enter product description..."
                                    className="w-full h-48 bg-[#2a2a2a] border border-gray-600 rounded p-4 text-white resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-80 h-48 bg-gray-700 rounded overflow-hidden relative">
                                    {productImages.length > 0 ? (
                                        <img src={productImages[currentImageIndex]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                            Product Image
                                        </div>
                                    )}
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❮
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❯
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-2 mb-8">
                            <ActionButton onClick={() => { setSelectedProduct(null); resetForm(); }}>Add</ActionButton>
                            <ActionButton onClick={() => imageInputRef.current?.click()}>Upload Image</ActionButton>
                            <ActionButton onClick={handleSave}>Save</ActionButton>
                        </div>

                        {/* Basic Product Properties */}
                        <h4 className="text-center mb-4">Basic Product Properties</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-[#2a2a2a] rounded">
                            <div>
                                <label className="block text-[#d4a853] text-sm mb-1">Color</label>
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                                    placeholder="Beige, Brown, etc."
                                    className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isBookmatch"
                                    checked={formData.isBookmatch}
                                    onChange={(e) => setFormData({...formData, isBookmatch: e.target.checked})}
                                    className="accent-[#d4a853] w-5 h-5"
                                />
                                <label htmlFor="isBookmatch" className="text-[#d4a853]">Is Bookmatch</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isTranslucent"
                                    checked={formData.isTranslucent}
                                    onChange={(e) => setFormData({...formData, isTranslucent: e.target.checked})}
                                    className="accent-[#d4a853] w-5 h-5"
                                />
                                <label htmlFor="isTranslucent" className="text-[#d4a853]">Is Translucent</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isNatural"
                                    checked={formData.isNatural}
                                    onChange={(e) => setFormData({...formData, isNatural: e.target.checked})}
                                    className="accent-[#d4a853] w-5 h-5"
                                />
                                <label htmlFor="isNatural" className="text-[#d4a853]">Is Natural</label>
                            </div>
                        </div>

                        {/* Stone Properties */}
                        <h4 className="text-center mb-4">Overview of Natural Stone Properties</h4>
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div className="border border-gray-600 rounded">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Origin</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.origin}
                                                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                                                    placeholder="Brazil"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Grade</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.grade}
                                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                                    placeholder="Premium / Export Grade"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Compression Strength</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.compressionStrength}
                                                    onChange={(e) => setFormData({...formData, compressionStrength: e.target.value})}
                                                    placeholder="153 MPa"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Impact Test</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.impactTest}
                                                    onChange={(e) => setFormData({...formData, impactTest: e.target.value})}
                                                    placeholder="Not Published"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Bulk Density</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.bulkDensity}
                                                    onChange={(e) => setFormData({...formData, bulkDensity: e.target.value})}
                                                    placeholder="2,635 kg/m³"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Water Absorption</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.waterAbsorption}
                                                    onChange={(e) => setFormData({...formData, waterAbsorption: e.target.value})}
                                                    placeholder="0.2-0.25%"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Thermal Expansion</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.thermalExpansion}
                                                    onChange={(e) => setFormData({...formData, thermalExpansion: e.target.value})}
                                                    placeholder="Very Low / High Stability"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-[#d4a853]">Flexural Strength</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.flexuralStrength}
                                                    onChange={(e) => setFormData({...formData, flexuralStrength: e.target.value})}
                                                    placeholder="11.40 MPa"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-80 h-64 bg-gray-700 rounded overflow-hidden relative">
                                    {productImages.length > 0 ? (
                                        <img src={productImages[currentImageIndex]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                            Stone Image
                                        </div>
                                    )}
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❮
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❯
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-start gap-2 mb-8">
                            <ActionButton onClick={() => { setSelectedProduct(null); resetForm(); }}>Add</ActionButton>
                            <ActionButton onClick={() => imageInputRef.current?.click()}>Edit</ActionButton>
                            <ActionButton onClick={handleSave}>Save</ActionButton>
                        </div>

                        {/* Quality Section */}
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div className="flex items-center justify-center">
                                <div className="w-80 h-64 bg-gray-700 rounded overflow-hidden relative">
                                    {productImages.length > 0 ? (
                                        <img src={productImages[currentImageIndex]} alt="" className="w-full h-full object-cover" />
                                    ) : null}
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❮
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❯
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <h3 className="text-3xl italic text-[#d4a853]/50">Exceptional Quality You Can Trust</h3>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-2 mb-8">
                            <ActionButton onClick={() => { setSelectedProduct(null); resetForm(); }}>Add</ActionButton>
                            <ActionButton onClick={() => imageInputRef.current?.click()}>Edit</ActionButton>
                            <ActionButton onClick={handleSave}>Save</ActionButton>
                        </div>

                        {/* List of Images */}
                        <div className="mb-6">
                            <h4 className="text-center mb-4 border-b border-gray-600 pb-2">List of Images</h4>
                            <table className="w-full max-w-md mx-auto">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="p-2 text-left">Image Description</th>
                                        <th className="p-2 text-left">New Arrival</th>
                                        <th className="p-2 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productImages.length > 0 ? productImages.map((imgUrl, index) => (
                                        <tr key={index} className="border-b border-gray-600">
                                            <td className="p-2 flex items-center gap-2">
                                                <img src={imgUrl} alt={`Image ${index + 1}`} className="w-10 h-10 object-cover rounded" onError={(e) => e.target.style.display='none'} />
                                                Image {index + 1}
                                            </td>
                                            <td className="p-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="accent-[#d4a853]"
                                                    checked={formData.isNewArrival}
                                                    onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <ActionButton onClick={() => window.open(imgUrl, '_blank')}>View</ActionButton>
                                                    <ActionButton onClick={() => setCurrentImageIndex(index)}>Select</ActionButton>
                                                    <ActionButton onClick={() => handleDeleteImage(index)}>Delete</ActionButton>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr className="border-b border-gray-600">
                                            <td className="p-2 text-gray-500" colSpan="3">No images added. Add images using URL below.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Add Image by URL */}
                            <div className="mt-4 p-4 bg-[#2a2a2a] rounded">
                                <h5 className="text-sm text-[#d4a853] mb-2">Add Image by URL</h5>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1 bg-[#1a1a1a] border border-gray-600 rounded px-3 py-2 text-white"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddImageUrl()}
                                    />
                                    <button
                                        onClick={handleAddImageUrl}
                                        className="bg-[#d4a853] text-black px-4 py-2 rounded font-medium hover:bg-[#c49743] cursor-pointer"
                                    >
                                        + Add Image
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Delete Product Button */}
                        {selectedProduct && (
                            <div className="flex justify-center mt-4">
                                <button 
                                    onClick={() => handleDelete(selectedProduct._id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                                >
                                    Delete Product
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hidden file inputs */}
            <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                multiple
            />
            <input
                type="file"
                ref={excelInputRef}
                onChange={handleExcelImport}
                accept=".csv,.xlsx,.xls"
                className="hidden"
            />
        </div>
    );
};

export default Products;
